import { afterEach, expect, test, vi } from "vitest";
vi.mock("server-only", () => ({}));
import {
  validateOfficialSourceUrl,
  type SourceVerificationDependencies,
} from "./validate-official-source-url";

const input = {
  url: "https://enterprise.gov.ie/start",
  hostname: "enterprise.gov.ie",
};
const checkedAt = new Date("2026-09-29T12:00:00Z");
function dependencies() {
  return {
    resolve: vi
      .fn<SourceVerificationDependencies["resolve"]>()
      .mockResolvedValue([{ address: "8.8.8.8", family: 4 }]),
    request: vi
      .fn<SourceVerificationDependencies["request"]>()
      .mockResolvedValue({ statusCode: 200 }),
    now: () => checkedAt,
  };
}
afterEach(() => vi.useRealTimers());

test("returns bounded structured success from a pinned public destination", async () => {
  const deps = dependencies();
  const result = await validateOfficialSourceUrl(input, deps);
  expect(result).toMatchObject({
    status: "ACTIVE",
    reason: "HTTP_OK",
    httpStatus: 200,
    resolvedUrl: input.url,
    checkedAt,
  });
  expect(result.durationMs).toBeGreaterThanOrEqual(0);
  expect(deps.request).toHaveBeenCalledWith(
    new URL(input.url),
    { address: "8.8.8.8", family: 4 },
    expect.any(AbortSignal),
  );
});

test.each([
  "http://enterprise.gov.ie/",
  "https://enterprise.gov.ie.attacker.com/",
  "https://evil.enterprise.gov.ie/",
  "https://localhost/",
  "https://127.0.0.1/",
  "https://[::1]/",
  "file:///etc/passwd",
  "javascript:alert(1)",
  "https://user:pass@enterprise.gov.ie/",
  "https://enterprise.gov.ie:8443/",
  "bad url",
  `https://enterprise.gov.ie/${"x".repeat(4096)}`,
])("blocks unsafe input before DNS: %s", async (url) => {
  const deps = dependencies();
  expect(
    await validateOfficialSourceUrl({ ...input, url }, deps),
  ).toMatchObject({
    status: "BROKEN",
    reason: "URL_BLOCKED",
    resolvedUrl: null,
    httpStatus: null,
  });
  expect(deps.resolve).not.toHaveBeenCalled();
  expect(deps.request).not.toHaveBeenCalled();
});
test("validates runtime shape and stored hostname before DNS", async () => {
  const deps = dependencies();
  for (const value of [
    null,
    {},
    { url: 4, hostname: input.hostname },
    { ...input, hostname: "www.irishimmigration.ie" },
  ]) {
    expect(
      await validateOfficialSourceUrl(value as typeof input, deps),
    ).toMatchObject({ reason: "URL_BLOCKED" });
  }
  expect(deps.resolve).not.toHaveBeenCalled();
});
test.each([0, -1, 30_001, 1.5, NaN])(
  "rejects invalid timeout configuration %s",
  async (timeoutMs) => {
    await expect(
      validateOfficialSourceUrl(input, dependencies(), { timeoutMs }),
    ).rejects.toThrow();
  },
);
test.each([-1, 4, 0.5])(
  "rejects invalid redirect configuration %s",
  async (maxRedirects) => {
    await expect(
      validateOfficialSourceUrl(input, dependencies(), { maxRedirects }),
    ).rejects.toThrow();
  },
);
test.each([
  "127.0.0.1",
  "10.0.0.1",
  "169.254.169.254",
  "::1",
  "::ffff:127.0.0.1",
  "2001:db8::1",
])("rejects any unsafe member of the DNS answer: %s", async (address) => {
  const deps = dependencies();
  deps.resolve.mockResolvedValue([
    { address: "8.8.8.8", family: 4 },
    { address, family: address.includes(":") ? 6 : 4 },
  ]);
  expect(await validateOfficialSourceUrl(input, deps)).toMatchObject({
    status: "BROKEN",
    reason: "ADDRESS_BLOCKED",
    resolvedUrl: null,
  });
  expect(deps.request).not.toHaveBeenCalled();
});
test("rejects mismatched DNS family and supports public IPv6", async () => {
  const deps = dependencies();
  deps.resolve.mockResolvedValue([{ address: "2606:4700::1111", family: 6 }]);
  expect((await validateOfficialSourceUrl(input, deps)).status).toBe("ACTIVE");
  deps.resolve.mockResolvedValue([{ address: "127.0.0.1", family: 6 }]);
  expect((await validateOfficialSourceUrl(input, deps)).reason).toBe(
    "ADDRESS_BLOCKED",
  );
});
test("empty DNS and DNS errors stay temporary without leaking exception messages", async () => {
  const deps = dependencies();
  deps.resolve
    .mockResolvedValueOnce([])
    .mockRejectedValueOnce(new Error("secret infrastructure detail"));
  for (let i = 0; i < 2; i++)
    expect(await validateOfficialSourceUrl(input, deps)).toMatchObject({
      status: "TEMPORARILY_UNAVAILABLE",
      reason: "DNS_FAILURE",
    });
  expect(deps.request).not.toHaveBeenCalled();
});
test.each([
  [204, "ACTIVE", "HTTP_OK"],
  [404, "BROKEN", "HTTP_NOT_FOUND"],
  [410, "BROKEN", "HTTP_NOT_FOUND"],
  [403, "TEMPORARILY_UNAVAILABLE", "HTTP_UNAVAILABLE"],
  [429, "TEMPORARILY_UNAVAILABLE", "HTTP_UNAVAILABLE"],
  [500, "TEMPORARILY_UNAVAILABLE", "HTTP_UNAVAILABLE"],
  [405, "TEMPORARILY_UNAVAILABLE", "HEAD_UNSUPPORTED"],
  [501, "TEMPORARILY_UNAVAILABLE", "HEAD_UNSUPPORTED"],
])(
  "classifies HTTP %s without a GET fallback",
  async (statusCode, status, reason) => {
    const deps = dependencies();
    deps.request.mockResolvedValue({ statusCode: statusCode as number });
    expect(await validateOfficialSourceUrl(input, deps)).toMatchObject({
      status,
      reason,
      httpStatus: statusCode,
    });
    expect(deps.request).toHaveBeenCalledTimes(1);
  },
);
test("follows relative and approved cross-host redirects with DNS checked at every hop", async () => {
  const deps = dependencies();
  deps.request
    .mockResolvedValueOnce({ statusCode: 302, location: "/next#section" })
    .mockResolvedValueOnce({
      statusCode: 301,
      location: "https://www.irishimmigration.ie/final",
    })
    .mockResolvedValueOnce({ statusCode: 200 });
  const result = await validateOfficialSourceUrl(input, deps);
  expect(result).toMatchObject({
    status: "ACTIVE",
    resolvedUrl: "https://www.irishimmigration.ie/final",
  });
  expect(deps.resolve.mock.calls.map(([hostname]) => hostname)).toEqual([
    input.hostname,
    input.hostname,
    "www.irishimmigration.ie",
  ]);
});
test.each([
  "http://enterprise.gov.ie/",
  "https://attacker.com/",
  "https://127.0.0.1/",
  "https://user:password@enterprise.gov.ie/",
  "https://enterprise.gov.ie:9443/",
  "file:///etc/passwd",
])(
  "blocks unsafe redirect without returning or requesting destination %s",
  async (location) => {
    const deps = dependencies();
    deps.request.mockResolvedValue({ statusCode: 302, location });
    expect(await validateOfficialSourceUrl(input, deps)).toMatchObject({
      status: "BROKEN",
      reason: "REDIRECT_BLOCKED",
      resolvedUrl: input.url,
    });
    expect(deps.request).toHaveBeenCalledTimes(1);
  },
);
test("rechecks DNS against rebinding even on same-host redirect", async () => {
  const deps = dependencies();
  deps.resolve
    .mockResolvedValueOnce([{ address: "8.8.8.8", family: 4 }])
    .mockResolvedValueOnce([{ address: "10.0.0.1", family: 4 }]);
  deps.request.mockResolvedValue({ statusCode: 302, location: "/private" });
  expect(await validateOfficialSourceUrl(input, deps)).toMatchObject({
    reason: "ADDRESS_BLOCKED",
    resolvedUrl: input.url,
  });
  expect(deps.request).toHaveBeenCalledTimes(1);
});
test.each([undefined, "", "https://[invalid", "x".repeat(4097)])(
  "handles missing, malformed or oversized redirect",
  async (location) => {
    const deps = dependencies();
    deps.request.mockResolvedValue({ statusCode: 302, location });
    expect(await validateOfficialSourceUrl(input, deps)).toMatchObject({
      reason: "REDIRECT_INVALID",
      resolvedUrl: input.url,
    });
  },
);
test("limits redirects to three and detects fragment-only loops", async () => {
  const deps = dependencies();
  deps.request.mockImplementation(async () => ({
    statusCode: 302,
    location: `/hop-${deps.request.mock.calls.length}`,
  }));
  expect((await validateOfficialSourceUrl(input, deps)).reason).toBe(
    "REDIRECT_LIMIT",
  );
  expect(deps.request).toHaveBeenCalledTimes(4);
  deps.request
    .mockClear()
    .mockResolvedValue({ statusCode: 302, location: "#different" });
  expect((await validateOfficialSourceUrl(input, deps)).reason).toBe(
    "REDIRECT_LIMIT",
  );
  expect(deps.request).toHaveBeenCalledTimes(1);
});
test("network/TLS errors produce a stable temporary result", async () => {
  const deps = dependencies();
  deps.request.mockRejectedValue(new Error("TLS internal data"));
  const result = await validateOfficialSourceUrl(input, deps);
  expect(result).toMatchObject({
    status: "TEMPORARILY_UNAVAILABLE",
    reason: "NETWORK_FAILURE",
    httpStatus: null,
  });
  expect(JSON.stringify(result)).not.toContain("TLS internal data");
});
test("deadline includes pending DNS and a late DNS answer cannot start HTTP", async () => {
  vi.useFakeTimers();
  const deps = dependencies();
  let completeDns!: (
    value: Awaited<ReturnType<SourceVerificationDependencies["resolve"]>>,
  ) => void;
  deps.resolve.mockImplementation(
    () =>
      new Promise((resolve) => {
        completeDns = resolve;
      }),
  );
  const pending = validateOfficialSourceUrl(input, deps, { timeoutMs: 100 });
  await vi.advanceTimersByTimeAsync(100);
  expect(await pending).toMatchObject({
    reason: "TIMEOUT",
    status: "TEMPORARILY_UNAVAILABLE",
  });
  expect(deps.resolve.mock.calls[0][1].aborted).toBe(true);
  completeDns([{ address: "8.8.8.8", family: 4 }]);
  await Promise.resolve();
  expect(deps.request).not.toHaveBeenCalled();
});
test("one deadline bounds the entire redirect chain and aborts in-flight HTTP", async () => {
  vi.useFakeTimers();
  const deps = dependencies();
  deps.request.mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ statusCode: 302, location: "/next" }), 70),
      ),
  );
  const pending = validateOfficialSourceUrl(input, deps, { timeoutMs: 100 });
  await vi.advanceTimersByTimeAsync(100);
  expect((await pending).reason).toBe("TIMEOUT");
  expect(deps.request).toHaveBeenCalledTimes(2);
  expect(deps.request.mock.calls[1][2].aborted).toBe(true);
  await vi.advanceTimersByTimeAsync(100);
  expect(deps.request).toHaveBeenCalledTimes(2);
});
