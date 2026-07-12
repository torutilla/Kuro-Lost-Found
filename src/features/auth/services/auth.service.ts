import TokenService from "./token.service.js";
import PasswordService from "./password.service.js";
import UserRepository from "@features/users/repository/user.model.js";
import GoogleAuthService from "./google.auth.service.js";
import { AppError } from "@shared/index.js";
import type { LocalUserInput } from "../types/registerInput.type.js";
import type { PublicUser } from "@features/users/types/user.type.js";
import UserService from "@features/users/services/user.service.js";
export default class AuthService {

    static async login(email: string, password: string) {
        const user = await UserRepository.findEmail(email);
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
        const publicUser: PublicUser = UserService.convertToPublic(user)
        return { accessToken, refreshToken, user: publicUser }
    }

    static async logout(refreshToken: string) {
        await TokenService.revokeRefreshToken(refreshToken);
    }

    static async register(input: LocalUserInput) {
        const email = input.email;
        const name = input.name;

        const hash = await PasswordService.hash(input.password);
        try {
            const createdUser = await UserRepository.createLocalUser({
                email: email,
                password: hash,
                name: name,
            });
            const access_token = TokenService.generateAccessToken({ userId: createdUser.id });
            const refresh_token = TokenService.generateRefreshToken({ userId: createdUser.id });
            return { createdUser, access_token, refresh_token };
        } catch (error) {
            if (UserRepository.isUniqueEmailError(error)) {
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

        const email = profile.email;
        const name = profile.name;

        const user = await UserRepository.findByProviderId("google", profile.sub);

        if (user) {
            const access_token = TokenService.generateAccessToken({ userId: user.id });
            const refresh_token = TokenService.generateRefreshToken({ userId: user.id });
            return { user, access_token, refresh_token };
        }

        const createdUser = await UserRepository.createOAuthUser({
            email: email,
            name: name,
            providerId: profile.sub,
        });

        const access_token = TokenService.generateAccessToken({ userId: createdUser.id });
        const refresh_token = TokenService.generateRefreshToken({ userId: createdUser.id });

        return { user: createdUser, access_token, refresh_token };
    }
}
