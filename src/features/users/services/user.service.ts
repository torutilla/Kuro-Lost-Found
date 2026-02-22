import { AppError } from "@shared/index.js";
import UserModel from "../models/user.model.js";
import { PublicUser } from "../index.js";
export default class UserService {
    static async getUserFromId(id: string) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new AppError("User not found.", 404);
        }
        const publicUser: PublicUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            provider: user.provider,
            avatar: user.avatar,
        }
        return publicUser;
    }
}