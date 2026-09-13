import { pool } from "@config/db.js";
import type { GoogleUserInput, LocalUserInput } from "@features/auth/types/registerInput.type.js";
import type { PublicUser, UserRow } from "../types/user.type.js";

export default class UserRepository {

    static async findById(id: string): Promise<PublicUser | null> {
        const result = await pool.query(
            `SELECT id, email, provider, name, avatar
            FROM users 
            WHERE id=$1`,
            [id]);
        return result.rows[0] ?? null;
    }

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
            `INSERT INTO users (email, hash, name, provider)
            VALUES ($1, $2, $3, 'local')
            RETURNING id, email, provider, avatar, name`,
            [email, password, name]
        );
        return res.rows[0];
    }

    static async createOAuthUser(
        { email, providerId, name }: GoogleUserInput
    ): Promise<PublicUser> {
        const res = await pool.query(
            `INSERT INTO users (email, provider, provider_id, name)
            VALUES ($1, 'google', $2, $3)
            RETURNING id, email, provider, avatar, name`,
            [email, providerId, name]
        );
        return res.rows[0];
    }

    static async findByProviderId(provider: string, providerId: string): Promise<PublicUser | null> {
        const res = await pool.query(
            `SELECT id, email, provider, name, avatar
            FROM users 
            WHERE provider=$1 AND provider_id=$2`,
            [provider, providerId]
        );
        return res.rows[0] ?? null;
    }

    static isUniqueEmailError(error: any) {
        return error?.code === "23505"
            && error?.constraint === "users_email_unique";
    }
}