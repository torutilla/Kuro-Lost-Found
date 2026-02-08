import { pool } from "../db.ts";
import type { GoogleUserInput, LocalUserInput } from "../types/registerInput.ts";
import type { PublicUser, UserRow } from "../types/userType.ts";

export default class UserModel {

    static async findEmail(email: string): Promise<UserRow | null> {
        const result = await pool.query(
            `SELECT id, email, hash, provider, name, avatar
            FROM users 
            WHERE email=$1`,
            [email]);
        return result.rows[0] ?? null;
    }

    static async createLocalUser({ email, password, name }: LocalUserInput): Promise<PublicUser> {
        const res = await pool.query(
            `INSERT INTO users (email, password_hash, name, provider)
            VALUES ($1, $2, $3, 'local')
            RETURNING id, email, provider, avatar, name`,
            [email, password, name]
        );
        return res.rows[0];
    }

    static async createOAuthUser(
        { email, provider, providerId, name }: GoogleUserInput
    ): Promise<PublicUser> {
        const res = await pool.query(
            `INSERT INTO users (email, provider, provider_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, provider, avatar, name`,
            [email, provider, providerId, name]
        );
        return res.rows[0];
    }
}