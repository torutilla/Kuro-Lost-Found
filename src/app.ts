import express from "express";
import cors from "cors";
import errorMiddleware from "@shared/middleware/error.middleware.ts";
import cookieParser from "cookie-parser";
import loginRouter from "@features/auth/routes/login.ts";
import signupRouter from "@features/auth/routes/signup.ts"
import userRouter from "@features/users/routes/users.ts";
import oauthRouter from "@features/auth/routes/oauth.ts";
import homeRouter from "@features/pets/routes/home.route.ts";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
}))

app.use('/auth', oauthRouter);
app.use('/auth/login', loginRouter);
app.use('/auth/signup', signupRouter);
app.use("/auth/refresh", oauthRouter);

app.use('/users', userRouter);

app.use("/", homeRouter);
app.use(errorMiddleware);
export default app; 