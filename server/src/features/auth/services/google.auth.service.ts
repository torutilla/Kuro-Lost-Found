import { env } from "@config/env.js";

/**
 * The single Google OAuth redirect URI. It must be registered EXACTLY as an
 * "Authorized redirect URI" in Google Cloud Console for each environment,
 * e.g. `http://localhost:8080/api/v1/auth/google/callback`.
 */
export const googleRedirectUri = `${env.SERVER_URL.replace(/\/+$/, "")}/api/v1/auth/google/callback`;

class GoogleAuthService {
    static async exchangeCodeForTokens(code: string) {
        return await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: env.GOOGLE_CLIENT_ID,
                client_secret: env.GOOGLE_CLIENT_SECRET,
                redirect_uri: googleRedirectUri,
                grant_type: "authorization_code",
            }),
        });
    }

    static async getGoogleUserProfile(accessToken: string) {
        const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return profileRes;
    }
}

export default GoogleAuthService;