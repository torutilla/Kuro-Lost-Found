import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import apiRoutes from "@routes/index.js";
import { errorMiddleware } from "@/middleware/index.js";
import { env } from "@/config/env.js";
import http from "http";
import initSocket from "./sockets/socketServer.js";
import notFound from "./middleware/notFound.js";

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: `${env.CLIENT_URL}`,
    credentials: true,
}))

app.use('api/v1', apiRoutes)

app.use(notFound);

app.use(errorMiddleware);

const server = http.createServer(app);
initSocket(server);

export { server };
export default app; 