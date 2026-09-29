import { EventEmitter } from "node:events";
import type { ClientRequest, IncomingMessage } from "node:http";
import type { RequestOptions } from "node:https";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ request: vi.fn(), lookup: vi.fn() }));
vi.mock("node:https", () => ({ request: mocks.request }));
vi.mock("node:dns/promises", () => ({ lookup: mocks.lookup }));
import {
  requestSourceHeaders,
  resolveSourceAddresses,
} from "./official-source-http";

const url = new URL("https://enterprise.gov.ie/example");
const address = { address: "8.8.8.8", family: 4 as const };
let capturedOptions: RequestOptions;
let respond: (response: IncomingMessage) => void;
let req: EventEmitter & {
  end: () => void;
  destroy: () => void;
};

beforeEach(() => {
  vi.clearAllMocks();
  req = Object.assign(new EventEmitter(), { end: vi.fn(), destroy: vi.fn() });
  mocks.request.mockImplementation(
    (_url: URL, options: RequestOptions, onResponse: typeof respond) => {
      capturedOptions = options;
      respond = onResponse;
      // Model Node's signal contract without opening a real socket.
      options.signal?.addEventListener(
        "abort",
        () => {
          req.destroy();
          req.emit("error", new Error("ABORT_ERR"));
        },
        { once: true },
      );
      return req as unknown as ClientRequest;
    },
  );
});

test("resolves all DNS answers verbatim and honours abortion before/after lookup", async () => {
  mocks.lookup.mockResolvedValue([
    { address: "8.8.8.8", family: 4 },
    { address: "2606:4700::1111", family: 6 },
  ]);
  const controller = new AbortController();
  expect(
    await resolveSourceAddresses(url.hostname, controller.signal),
  ).toHaveLength(2);
  expect(mocks.lookup).toHaveBeenCalledWith(url.hostname, {
    all: true,
    verbatim: true,
  });
  controller.abort();
  await expect(
    resolveSourceAddresses(url.hostname, controller.signal),
  ).rejects.toThrow();
  expect(mocks.lookup).toHaveBeenCalledTimes(1);
});

test("pins socket lookup while preserving hostname, SNI and certificate validation", async () => {
  const controller = new AbortController();
  const pending = requestSourceHeaders(url, address, controller.signal);
  expect(mocks.request).toHaveBeenCalledWith(
    url,
    expect.objectContaining({
      method: "HEAD",
      agent: false,
      maxHeaderSize: 16384,
      rejectUnauthorized: true,
      servername: url.hostname,
      family: 4,
      signal: controller.signal,
    }),
    expect.any(Function),
  );
  const callback = vi.fn();
  capturedOptions.lookup!(url.hostname, {}, callback);
  expect(callback).toHaveBeenCalledWith(null, "8.8.8.8", 4);
  capturedOptions.lookup!(url.hostname, { all: true }, callback);
  expect(callback).toHaveBeenLastCalledWith(null, [address]);
  expect(mocks.lookup).not.toHaveBeenCalled();
  const destroy = vi.fn();
  respond({
    statusCode: 302,
    headers: { location: "/next" },
    destroy,
  } as unknown as IncomingMessage);
  expect(await pending).toEqual({ statusCode: 302, location: "/next" });
  expect(destroy).toHaveBeenCalledOnce();
  expect(req.destroy).toHaveBeenCalledOnce();
  expect(req.end).toHaveBeenCalledOnce();
  expect(mocks.request).toHaveBeenCalledOnce();
});

test("pins public IPv6 with its correct socket family", async () => {
  const pending = requestSourceHeaders(
    url,
    { address: "2606:4700::1111", family: 6 },
    new AbortController().signal,
  );
  const callback = vi.fn();
  capturedOptions.lookup!(url.hostname, {}, callback);
  expect(callback).toHaveBeenCalledWith(null, "2606:4700::1111", 6);
  expect(capturedOptions.family).toBe(6);
  respond({
    statusCode: 200,
    headers: {},
    destroy: vi.fn(),
  } as unknown as IncomingMessage);
  await pending;
});

test("passes abort to Node and propagates cancellation of a pending request", async () => {
  const controller = new AbortController();
  const pending = requestSourceHeaders(url, address, controller.signal);
  const rejected = expect(pending).rejects.toThrow("ABORT_ERR");
  controller.abort();
  await rejected;
  expect(req.destroy).toHaveBeenCalledOnce();
});

test("rejects an already aborted operation before allocating a socket", async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(
    requestSourceHeaders(url, address, controller.signal),
  ).rejects.toThrow();
  expect(mocks.request).not.toHaveBeenCalled();
});

test("header overflow and TLS errors are propagated without reading a body", async () => {
  for (const code of ["HPE_HEADER_OVERFLOW", "CERT_HAS_EXPIRED"]) {
    const pending = requestSourceHeaders(
      url,
      address,
      new AbortController().signal,
    );
    const rejected = expect(pending).rejects.toThrow(code);
    req.emit("error", new Error(code));
    await rejected;
  }
});

test("transport also refuses unsafe or mismatched destinations", async () => {
  await expect(
    requestSourceHeaders(
      url,
      { address: "127.0.0.1", family: 4 },
      new AbortController().signal,
    ),
  ).rejects.toThrow("UNSAFE_SOURCE_DESTINATION");
  await expect(
    requestSourceHeaders(
      url,
      { address: "8.8.8.8", family: 6 },
      new AbortController().signal,
    ),
  ).rejects.toThrow("UNSAFE_SOURCE_DESTINATION");
  await expect(
    requestSourceHeaders(
      new URL("https://attacker.com/"),
      address,
      new AbortController().signal,
    ),
  ).rejects.toThrow("UNSAFE_SOURCE_DESTINATION");
  expect(mocks.request).not.toHaveBeenCalled();
});
