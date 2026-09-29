import "server-only";
import { lookup } from "node:dns/promises";
import { request } from "node:https";
import { isIP } from "node:net";
import { safeSourceLink } from "../source-link-policy";
import { isPublicAddress } from "./public-ip";

export type ResolvedSourceAddress = { address: string; family: 4 | 6 };
export type SourceHttpResponse = { statusCode: number; location?: string };

export async function resolveSourceAddresses(
  hostname: string,
  signal: AbortSignal,
): Promise<ResolvedSourceAddress[]> {
  signal.throwIfAborted();
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  signal.throwIfAborted();
  return addresses.map(({ address, family }) => {
    if (family !== 4 && family !== 6) throw new Error("INVALID_ADDRESS_FAMILY");
    return { address, family };
  });
}

export function requestSourceHeaders(
  url: URL,
  address: ResolvedSourceAddress,
  signal: AbortSignal,
): Promise<SourceHttpResponse> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    if (
      !safeSourceLink(url.href, url.hostname) ||
      !isPublicAddress(address.address) ||
      isIP(address.address) !== address.family
    ) {
      reject(new Error("UNSAFE_SOURCE_DESTINATION"));
      return;
    }
    const req = request(
      url,
      {
        method: "HEAD",
        agent: false,
        maxHeaderSize: 16 * 1024,
        signal,
        servername: url.hostname,
        rejectUnauthorized: true,
        // An explicit family disables Node's automatic family selection.
        family: address.family,
        // Keep the URL hostname for Host/certificate verification; connect only
        // to this vetted address, never perform a second DNS lookup.
        lookup: (_hostname, options, callback) =>
          options.all
            ? callback(null, [address])
            : callback(null, address.address, address.family),
        headers: {
          "User-Agent": "MeuVistoFacil-SourceVerifier/1.0",
          Connection: "close",
        },
      },
      (response) => {
        const result = {
          statusCode: response.statusCode ?? 0,
          location: response.headers.location,
        };
        response.destroy();
        req.destroy();
        resolve(result);
      },
    );
    req.once("error", reject);
    req.end();
  });
}
