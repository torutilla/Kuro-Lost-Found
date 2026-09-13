import { server } from "./app.js";
import { env } from "@/config/env.js";
import RefreshTokenRepository from "@/features/auth/repository/refreshToken.repository.js";
const PORT = env.PORT;

await RefreshTokenRepository.ensureTable();

server.listen(PORT, () => {
    console.log(`listening to ${PORT}`);
})
