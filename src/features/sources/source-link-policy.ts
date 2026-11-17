import { findOfficialDomain } from "./official-domains";

// Link rendering only. HTTP/DNS/redirect verification belongs to a later phase.
export function safeSourceLink(value: string, hostname: string): string | null {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !findOfficialDomain(url.hostname) ||
      url.hostname !== hostname ||
      url.username ||
      url.password ||
      url.port
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}
