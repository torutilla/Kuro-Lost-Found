class GoogleAuthService {
    static async exchangeCodeForTokens(code: string) {
        return await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.SERVER_URL}/auth/google/callback`,
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