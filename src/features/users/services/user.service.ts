import { AppError } from "@shared/index.js";
import UserModel from "../models/user.model.js";
import { PublicUser, UserRow } from "../index.js";
export default class UserService {
    static async getUserFromId(id: string) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new AppError("User not found.", 404);
        }

        return user;
    }

    static convertToPublic(user: UserRow): PublicUser {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            provider: user.provider,
            avatar: user.avatar,
        }
    }
}