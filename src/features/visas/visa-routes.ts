// Vistos com página própria, preparada antes da página genérica existir.
const dedicatedVisaRoutes: Readonly<Record<string, string>> = {
  "ireland/critical-skills-employment-permit":
    "/ireland/visas/critical-skills-employment-permit",
};

export function dedicatedVisaRoute(
  countrySlug: string,
  visaSlug: string,
): string | null {
  return dedicatedVisaRoutes[`${countrySlug}/${visaSlug}`] ?? null;
}

export function visaPageHref(countrySlug: string, visaSlug: string): string {
  return (
    dedicatedVisaRoute(countrySlug, visaSlug) ??
    `/destinos/${countrySlug}/${visaSlug}`
  );
}
