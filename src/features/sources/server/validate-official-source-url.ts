import "server-only";
import { isIP } from "node:net";
import { z } from "zod";
import { safeSourceLink } from "../source-link-policy";
import {
  requestSourceHeaders,
  resolveSourceAddresses,
  type ResolvedSourceAddress,
  type SourceHttpResponse,
} from "./official-source-http";
import { isPublicAddress } from "./public-ip";

export type SourceVerificationReason =
  | "HTTP_OK"
  | "HTTP_NOT_FOUND"
  | "HTTP_UNAVAILABLE"
  | "HEAD_UNSUPPORTED"
  | "URL_BLOCKED"
  | "ADDRESS_BLOCKED"
  | "DNS_FAILURE"
  | "NETWORK_FAILURE"
  | "TIMEOUT"
  | "REDIRECT_BLOCKED"
  | "REDIRECT_LIMIT"
  | "REDIRECT_INVALID";
export type SourceVerificationResult = {
  status: "ACTIVE" | "BROKEN" | "TEMPORARILY_UNAVAILABLE";
  reason: SourceVerificationReason;
  httpStatus: number | null;
  resolvedUrl: string | null;
  checkedAt: Date;
  durationMs: number;
};
export type SourceVerificationDependencies = {
  resolve: (
    hostname: string,
    signal: AbortSignal,
  ) => Promise<ResolvedSourceAddress[]>;
  request: (
    url: URL,
    address: ResolvedSourceAddress,
    signal: AbortSignal,
  ) => Promise<SourceHttpResponse>;
  now: () => Date;
};
const inputSchema = z.object({
  url: z.string().min(1).max(4096),
  hostname: z.string().min(1).max(253),
});
const optionsSchema = z.object({
  timeoutMs: z.number().int().min(1).max(30_000).default(10_000),
  maxRedirects: z.number().int().min(0).max(3).default(3),
});
const redirects = new Set([301, 302, 303, 307, 308]);

export async function validateOfficialSourceUrl(
  input: { url: string; hostname: string },
  dependencies: Partial<SourceVerificationDependencies> = {},
  options: { timeoutMs?: number; maxRedirects?: number } = {},
): Promise<SourceVerificationResult> {
  const { timeoutMs, maxRedirects } = optionsSchema.parse(options);
  const { resolve, request, now } = {
    resolve: resolveSourceAddresses,
    request: requestSourceHeaders,
    now: () => new Date(),
    ...dependencies,
  };
  const started = performance.now();
  const controller = new AbortController();
  let safeUrl: string | null = null;
  let httpStatus: number | null = null;
  const result = (
    status: SourceVerificationResult["status"],
    reason: SourceVerificationReason,
  ): SourceVerificationResult => ({
    status,
    reason,
    httpStatus,
    resolvedUrl: safeUrl,
    checkedAt: now(),
    durationMs: Math.max(0, Math.round(performance.now() - started)),
  });
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return result("BROKEN", "URL_BLOCKED");
  const initial = safeSourceLink(parsed.data.url, parsed.data.hostname);
  if (!initial) return result("BROKEN", "URL_BLOCKED");
  const visited = new Set<string>();
  const verify = async (): Promise<SourceVerificationResult> => {
    let current = new URL(initial);
    for (let hop = 0; ; hop++) {
      controller.signal.throwIfAborted();
      current.hash = "";
      if (visited.has(current.href))
        return result("TEMPORARILY_UNAVAILABLE", "REDIRECT_LIMIT");
      visited.add(current.href);
      let addresses: ResolvedSourceAddress[];
      try {
        addresses = await resolve(current.hostname, controller.signal);
      } catch {
        return result(
          "TEMPORARILY_UNAVAILABLE",
          controller.signal.aborted ? "TIMEOUT" : "DNS_FAILURE",
        );
      }
      controller.signal.throwIfAborted();
      if (!addresses.length)
        return result("TEMPORARILY_UNAVAILABLE", "DNS_FAILURE");
      if (
        addresses.some(
          (address) =>
            !isPublicAddress(address.address) ||
            isIP(address.address) !== address.family,
        )
      )
        return result("BROKEN", "ADDRESS_BLOCKED");
      safeUrl = current.href;
      let response: SourceHttpResponse;
      try {
        response = await request(current, addresses[0], controller.signal);
      } catch {
        return result(
          "TEMPORARILY_UNAVAILABLE",
          controller.signal.aborted ? "TIMEOUT" : "NETWORK_FAILURE",
        );
      }
      controller.signal.throwIfAborted();
      httpStatus =
        Number.isInteger(response.statusCode) &&
        response.statusCode >= 100 &&
        response.statusCode <= 599
          ? response.statusCode
          : null;
      if (httpStatus !== null && httpStatus >= 200 && httpStatus < 300)
        return result("ACTIVE", "HTTP_OK");
      if (httpStatus === 404 || httpStatus === 410)
        return result("BROKEN", "HTTP_NOT_FOUND");
      if (httpStatus === 405 || httpStatus === 501)
        return result("TEMPORARILY_UNAVAILABLE", "HEAD_UNSUPPORTED");
      if (!redirects.has(httpStatus ?? 0))
        return result("TEMPORARILY_UNAVAILABLE", "HTTP_UNAVAILABLE");
      if (!response.location || response.location.length > 4096)
        return result("TEMPORARILY_UNAVAILABLE", "REDIRECT_INVALID");
      let next: URL;
      try {
        next = new URL(response.location, current);
      } catch {
        return result("TEMPORARILY_UNAVAILABLE", "REDIRECT_INVALID");
      }
      if (next.href.length > 4096 || !safeSourceLink(next.href, next.hostname))
        return result("BROKEN", "REDIRECT_BLOCKED");
      if (hop >= maxRedirects)
        return result("TEMPORARILY_UNAVAILABLE", "REDIRECT_LIMIT");
      current = next;
    }
  };
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<SourceVerificationResult>((resolveDeadline) => {
    timer = setTimeout(() => {
      controller.abort();
      resolveDeadline(result("TEMPORARILY_UNAVAILABLE", "TIMEOUT"));
    }, timeoutMs);
  });
  try {
    return await Promise.race([verify(), deadline]);
  } catch {
    return result(
      "TEMPORARILY_UNAVAILABLE",
      controller.signal.aborted ? "TIMEOUT" : "NETWORK_FAILURE",
    );
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}
