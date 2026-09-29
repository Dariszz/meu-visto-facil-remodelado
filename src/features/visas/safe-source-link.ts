// Link rendering only. HTTP/DNS/redirect verification belongs to a later phase.
export function safeSourceLink(value: string, hostname: string): string | null {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !["enterprise.gov.ie", "www.irishimmigration.ie"].includes(
        url.hostname,
      ) ||
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
