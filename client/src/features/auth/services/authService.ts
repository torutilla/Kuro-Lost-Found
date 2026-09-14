import { fetchHandler, } from "@shared/index.ts";
import type { User, RegistrationInput } from "@shared/index.ts"

const AuthService = {
    login(email: string, password: string): Promise<User> {
        return fetchHandler("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
    },

    signup(input: RegistrationInput): Promise<User> {
        return fetchHandler("/api/v1/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: input.name,
                email: input.email,
                password: input.password,
            })
        })
    },


}

export default AuthService;