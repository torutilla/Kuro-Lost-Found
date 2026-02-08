import express from "express";
import loginRouter from "./routes/login.ts";
import signupRouter from "./routes/signup.ts"
import userRouter from "./routes/users.ts";
import oauthRouter from "./routes/oauth.ts";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware.ts";
const app = express();

app.use(express.json());
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
}))

app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/users', userRouter);
app.use('/auth', oauthRouter);
app.use(errorMiddleware);
export default app; 