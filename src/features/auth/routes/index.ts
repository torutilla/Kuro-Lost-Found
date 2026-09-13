import { Router } from "express";
import oauthRouter from "./oauth.route.js";
import loginRouter from "./login.route.js";
import signupRouter from "./signup.route.js";
import refreshRouter from "./refresh.route.js";
import logoutRouter from "./logout.route.js";

const authRouter = Router();

// oauth defines /google and /google/callback itself
authRouter.use(oauthRouter);
authRouter.use("/login", loginRouter);
authRouter.use("/signup", signupRouter);
authRouter.use("/refresh", refreshRouter);
authRouter.use("/logout", logoutRouter);

export default authRouter;