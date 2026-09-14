import type { User } from "@shared/types/user.ts";
import { fetchHandler } from "@shared/index.ts";

export const UserService = {

    getUser(): Promise<User | null> {
        return fetchHandler("/api/v1/users/me", { method: "GET" });
    },
}