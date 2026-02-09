import TokenService from "./token.service.ts";
import PasswordService from "./password.service.ts";
import UserModel from "../models/user.model.ts";
import { AppError } from "../utils/errors.ts";
import type { LocalUserInput } from "../types/registerInput.type.ts";
import type { PublicUser } from "../types/user.type.ts";
import { normalizeEmail, normalizeName } from "../utils/normalize.ts";
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

    static async register(input: LocalUserInput) {
        const normalizedEmail = normalizeEmail(input.email);
        const normalizedInputName = normalizeName(input.name);

        const hash = await PasswordService.hash(input.password);
        try {
            const createdUser = await UserModel.createLocalUser({
                email: normalizedEmail,
                password: hash,
                name: normalizedInputName,
            });
            const access_token = TokenService.generateAccessToken({ userId: createdUser.id });
            const refresh_token = TokenService.generateRefreshToken({ userId: createdUser.id });
            return { createdUser, access_token, refresh_token };
        } catch (error) {
            if (UserModel.isUniqueEmailError(error)) {
                throw new AppError("Email already in use.", 409);
            }
            throw error;
        }
    }

    static async handleGoogleCallback(code: string) {
        const tokenRes = await GoogleAuthService.exchangeCodeForTokens(code);
        if (!tokenRes.ok) throw new Error("Failed to get Google tokens");
        const tokens = await tokenRes.json();

        const profileRes = await GoogleAuthService.getGoogleUserProfile(tokens.access_token);
        if (!profileRes.ok) throw new Error("Failed to get Google user profile");
        const profile = await profileRes.json();

        const normalizedEmail = normalizeEmail(profile.email);
        const normalizedInputName = normalizeName(profile.name);

        const user = await UserModel.findByProviderId("google", profile.sub);

        if (user) {
            const access_token = TokenService.generateAccessToken({ userId: user.id });
            const refresh_token = TokenService.generateRefreshToken({ userId: user.id });
            return { user, access_token, refresh_token };
        }

        const createdUser = await UserModel.createOAuthUser({
            email: normalizedEmail,
            name: normalizedInputName,
            providerId: profile.sub,
        });

        const access_token = TokenService.generateAccessToken({ userId: createdUser.id });
        const refresh_token = TokenService.generateRefreshToken({ userId: createdUser.id });

        return { user: createdUser, access_token, refresh_token };
    }
}
