import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware.ts";
import cookieParser from "cookie-parser";
import loginRouter from "./routes/login.ts";
import signupRouter from "./routes/signup.ts"
import userRouter from "./routes/users.ts";
import oauthRouter from "./routes/oauth.ts";
import homeRouter from "./routes/home.route.ts";
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