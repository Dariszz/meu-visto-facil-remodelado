// Destino depois do login: só caminhos internos do próprio site. Bloqueia
// URLs absolutas, "//host" e barras invertidas (redirecionamento aberto).
const fallback = "/dashboard";

export function safeRedirectPath(value: unknown): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 300)
    return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\"))
    return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;
  try {
    const url = new URL(value, "http://local.invalid");
    if (url.origin !== "http://local.invalid") return fallback;
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}

export function loginHref(next: string): string {
  return `/login?next=${encodeURIComponent(safeRedirectPath(next))}`;
}
