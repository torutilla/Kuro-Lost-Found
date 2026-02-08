import TokenService from "../services/tokenService.ts";
import PasswordService from "./passwordService.ts";
import UserModel from "../models/userModel.ts";
import { AppError } from "../utils/errors.ts";
import type { RegisterInput } from "../types/registerInput.ts";
import type { PublicUser } from "../types/userType.ts";
export default class AuthService {

    static async login(email: string, password: string) {
        const user = await UserModel.findEmail(email);
        if (!user) {
            throw new AppError("Invalid Credentials.", 401);
        }
        if (!user.hash) {
            throw new AppError("Please login using Google.", 400);
        }

        const isPasswordValid = await PasswordService.verify(user.hash, password);
        if (!isPasswordValid) {
            throw new AppError("Invalid Credentials.", 401);
        }

        const accessToken = TokenService.generateAccessToken({ userId: user.id });
        const refreshToken = TokenService.generateRefreshToken({ userId: user.id });
        const publicUser: PublicUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            provider: user.provider,
            avatar: user.avatar,
        }
        return { accessToken, refreshToken, user: publicUser }
    }

    static async register(input: RegisterInput) {
        const existingUser = await UserModel.findEmail(input.email);
        if (existingUser) throw new AppError("User already registered.", 409);

        if (input.provider == "local") {
            const hash = await PasswordService.hash(input.password);
            const createdUser = await UserModel.createLocalUser(input)
            return { createdUser };
        }

        const createdUser = await UserModel.createOAuthUser(input);

        return { createdUser };
    }

    static async handleGoogleCallback(code: string) {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
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

        if (!tokenRes.ok) throw new Error("Failed to get Google tokens");
        const tokens = await tokenRes.json();

        const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const profile = await profileRes.json();

        const createdUser = await UserModel.createOAuthUser({
            email: profile.email,
            name: profile.name,
            provider: "google",
            providerId: profile.sub,
        });

        const access_token = TokenService.generateAccessToken({ userId: createdUser.id });
        const refresh_token = TokenService.generateRefreshToken({ userId: createdUser.id });

        return { user: createdUser, access_token, refresh_token };
    }
}
