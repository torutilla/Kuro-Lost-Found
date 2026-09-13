import { pool } from "@config/db.js";

export default class RefreshTokenRepository {
    static async create(userId: string, tokenHash: string, expiresAt: Date) {
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, tokenHash, expiresAt]
        );
    }

    static async findActive(tokenHash: string): Promise<{ userId: string } | null> {
        const res = await pool.query(
            `SELECT user_id
             FROM refresh_tokens
             WHERE token_hash = $1
               AND revoked_at IS NULL
               AND expires_at > now()`,
            [tokenHash]
        );
        const row = res.rows[0];
        return row ? { userId: row.user_id } : null;
    }

    static async revoke(tokenHash: string) {
        await pool.query(
            `UPDATE refresh_tokens
             SET revoked_at = now()
             WHERE token_hash = $1 AND revoked_at IS NULL`,
            [tokenHash]
        );
    }

    static async revokeAllForUser(userId: string) {
        await pool.query(
            `UPDATE refresh_tokens
             SET revoked_at = now()
             WHERE user_id = $1 AND revoked_at IS NULL`,
            [userId]
        );
    }
}
