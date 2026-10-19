export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Join the API base URL with a request path. Tolerates a trailing slash on
 * `VITE_API_BASE_URL` and a leading slash on the path, so callers can pass
 * API-style paths (`/api/v1/...`) safely.
 */
export function apiUrl(path: string): string {
  const base = String(API_BASE_URL ?? "").replace(/\/+$/, "");
  return `${base}/${path.replace(/^\/+/, "")}`;
}