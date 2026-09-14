import { server } from "./app.js";
import { env } from "@/config/env.js";
const PORT = env.PORT;

server.listen(PORT, () => {
    console.log(`listening to ${PORT}`);
})
