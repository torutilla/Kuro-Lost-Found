import UserService from "../services/user.service.js";
import { createHandler } from "@shared/utils/request.util.js";
import { AppError, sendSuccess } from "@shared/index.js";

const getCurrentUserController = createHandler(async (req, res) => {
    const payload = req.user;
    if (!payload) {
        throw new AppError("User payload missing in request", 401);
    }
    const user = await UserService.getUserFromId(payload.userId);
    sendSuccess(res, {
        message: "Current user fetched successfully",
        data: user,
    });
});


export default getCurrentUserController;