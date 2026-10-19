import { apiUrl } from "@shared/config/api.ts";

/**
 * Starts the Google OAuth flow. This MUST be a full browser navigation
 * (`window.location.assign`), not `fetch` — only a real navigation carries the
 * browser through Google's cross-origin consent redirect and back to our
 * API callback (`/api/v1/auth/google/callback`), which then sets the session
 * cookies and forwards the browser to the app.
 */
function useGoogleOAuth() {
  function login() {
    window.location.assign(apiUrl("/api/v1/auth/google"));
  }
  return { login };
}

export default useGoogleOAuth;
