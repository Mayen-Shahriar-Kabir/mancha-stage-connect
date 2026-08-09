/**
 * Open-redirect protection.
 *
 * Any attacker-controllable "next page" value (e.g. `/login?redirect=...`)
 * must be reduced to a same-origin, absolute application path before it is
 * ever handed to the router. Everything else falls back to a safe default.
 */

const FALLBACK = "/";

export function sanitizeRedirect(value: unknown, fallback: string = FALLBACK): string {
  if (typeof value !== "string") return fallback;

  let candidate = value.trim();
  if (!candidate) return fallback;

  // Decode a couple of layers so `%2f%2fevil.com` style payloads are caught.
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(candidate);
      if (decoded === candidate) break;
      candidate = decoded;
    } catch {
      return fallback;
    }
  }

  // Control characters (incl. newlines/tabs used to smuggle schemes).
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(candidate)) return fallback;

  // Normalise backslashes — browsers treat `\\evil.com` like `//evil.com`.
  candidate = candidate.replace(/\\/g, "/");

  // Must be a rooted path, and must not be protocol-relative (`//host`).
  if (!candidate.startsWith("/")) return fallback;
  if (candidate.startsWith("//")) return fallback;

  // Defence in depth: reject anything that still parses as an absolute URL.
  if (/^[a-z][a-z0-9+.-]*:/i.test(candidate)) return fallback;

  return candidate;
}
