import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import loginRouter from "@features/auth/routes/login.js";
import signupRouter from "@features/auth/routes/signup.js"
import userRouter from "@features/users/routes/users.js";
import oauthRouter from "@features/auth/routes/oauth.js";
import refreshRouter from "@features/auth/routes/refresh.route.js";
import logoutRouter from "@features/auth/routes/logout.route.js"
import { errorMiddleware } from "@/middleware/index.js";
import petsRouter from "@features/pets/routes/pets.route.js";
import { env } from "@/config/env.js";
import http from "http";
import initSocket from "./sockets/socketServer.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: `${env.CLIENT_URL}`,
    credentials: true,
}))

app.use('/auth', oauthRouter);
app.use('/auth/login', loginRouter);
app.use('/auth/signup', signupRouter);
app.use("/auth/refresh", refreshRouter);
app.use('/auth/logout', logoutRouter);

app.use('/users', userRouter);

app.use('/pets', petsRouter);

app.use(errorMiddleware);

const server = http.createServer(app);
initSocket(server);

export { server };
export default app; 