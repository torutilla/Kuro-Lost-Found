import { pool } from "@config/db.js";

export default class MessagingRepository {

    static async createOrGetConversation(petId: string, ownerId: string, visitorId: string) {
        if (ownerId === visitorId) {
            throw new Error("Cannot start a conversation with yourself");
        }

        const petResult = await pool.query(
            `SELECT user_id FROM pets WHERE id = $1`,
            [petId]
        );
        if (petResult.rows.length === 0) {
            throw new Error("Pet not found");
        }

        const petOwnerId = petResult.rows[0].user_id;

        if (visitorId === petOwnerId) {
            throw new Error("Cannot start a conversation with yourself");
        }

        const existing = await pool.query(`
            SELECT c.id
            FROM conversations c
            JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = $1
            JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = $2
            WHERE c.pet_id = $3
            LIMIT 1
        `, [ownerId, visitorId, petId]);

        if (existing.rows.length > 0) {
            return existing.rows[0].id;
        }

        const result = await pool.query(`
            INSERT INTO conversations (pet_id)
            VALUES ($1)
            RETURNING id
        `, [petId]);

        const conversationId = result.rows[0].id;

        await pool.query(`
            INSERT INTO conversation_participants (conversation_id, user_id)
            VALUES ($1, $2), ($1, $3)
        `, [conversationId, ownerId, visitorId]);

        return conversationId;
    }

    static async getConversationsForUser(userId: string) {
        const result = await pool.query(`
            WITH latest_msg AS (
                SELECT DISTINCT ON (m.conversation_id)
                    m.conversation_id,
                    m.id AS latest_message_id,
                    m.body AS latest_message_body,
                    m.sender_id AS latest_message_sender_id,
                    u.name AS latest_message_sender_name,
                    m.created_at AS latest_message_created_at,
                    m.read_at AS latest_message_read_at
                FROM messages m
                JOIN users u ON u.id = m.sender_id
                WHERE m.conversation_id IN (
                    SELECT conversation_id FROM conversation_participants WHERE user_id = $1
                )
                ORDER BY m.conversation_id, m.created_at DESC
            ),
            unread AS (
                SELECT conversation_id, COUNT(*) AS unread_count
                FROM messages m
                WHERE m.conversation_id IN (
                    SELECT conversation_id FROM conversation_participants WHERE user_id = $1
                )
                AND m.sender_id <> $1
                AND m.read_at IS NULL
                GROUP BY conversation_id
            )
            SELECT
                c.id,
                c.pet_id,
                p.name AS pet_name,
                p.status AS pet_status,
                COALESCE(lm.latest_message_id, NULL) AS latest_message_id,
                COALESCE(lm.latest_message_body, NULL) AS latest_message_body,
                COALESCE(lm.latest_message_sender_id, NULL) AS latest_message_sender_id,
                COALESCE(lm.latest_message_sender_name, NULL) AS latest_message_sender_name,
                COALESCE(lm.latest_message_created_at, NULL) AS latest_message_created_at,
                COALESCE(lm.latest_message_read_at, NULL) AS latest_message_read_at,
                COALESCE(u.unread_count, 0) AS unread_count,
                c.created_at,
                c.updated_at
            FROM conversations c
            JOIN pets p ON p.id = c.pet_id
            JOIN conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = $1
            LEFT JOIN latest_msg lm ON lm.conversation_id = c.id
            LEFT JOIN unread u ON u.conversation_id = c.id
            ORDER BY COALESCE(lm.latest_message_created_at, c.created_at) DESC
        `, [userId]);

        const conversationIds = result.rows.map(r => r.id);
        let participantsMap: Map<string, { user_id: string; name: string }[]> = new Map();

        if (conversationIds.length > 0) {
            const participantsResult = await pool.query(`
                SELECT cp.conversation_id, cp.user_id, u.name
                FROM conversation_participants cp
                JOIN users u ON u.id = cp.user_id
                WHERE cp.conversation_id = ANY($1)
            `, [conversationIds]);

            for (const row of participantsResult.rows) {
                if (!participantsMap.has(row.conversation_id)) {
                    participantsMap.set(row.conversation_id, []);
                }
                participantsMap.get(row.conversation_id)!.push({
                    user_id: row.user_id,
                    name: row.name,
                });
            }
        }

        return result.rows.map((row: any) => ({
            id: row.id,
            pet_id: row.pet_id,
            pet_name: row.pet_name,
            pet_status: row.pet_status,
            participants: participantsMap.get(row.id) || [],
            latest_message: row.latest_message_id ? {
                id: row.latest_message_id,
                body: row.latest_message_body,
                sender_id: row.latest_message_sender_id,
                sender_name: row.latest_message_sender_name,
                created_at: row.latest_message_created_at,
                read_at: row.latest_message_read_at,
            } : null,
            unread_count: row.unread_count,
            created_at: row.created_at,
            updated_at: row.updated_at,
        }));
    }

    static async getMessages(
        conversationId: string,
        viewerId: string,
        limit: number,
        beforeCreatedAt?: Date,
        beforeId?: string
    ) {
        const participantCheck = await pool.query(
            `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
            [conversationId, viewerId]
        );
        if (participantCheck.rows.length === 0) {
            throw new Error("Not a participant in this conversation");
        }

        let params: unknown[] = [conversationId, limit];
        let paramIdx = 2;
        let conditions = `m.conversation_id = $1`;

        if (beforeCreatedAt && beforeId) {
            paramIdx++;
            conditions += ` AND (m.created_at, m.id) < ($${paramIdx}, $${paramIdx + 1})`;
            params.push(beforeCreatedAt, beforeId);
        }

        const result = await pool.query(`
            SELECT
                m.id,
                m.conversation_id,
                m.sender_id,
                u.name AS sender_name,
                m.body,
                m.read_at,
                m.created_at
            FROM messages m
            JOIN users u ON u.id = m.sender_id
            WHERE ${conditions}
            ORDER BY m.created_at DESC, m.id DESC
            LIMIT $${paramIdx}
        `, params);

        const messages = result.rows.map((row: any) => ({
            id: row.id,
            conversation_id: row.conversation_id,
            sender_id: row.sender_id,
            sender_name: row.sender_name,
            body: row.body,
            read_at: row.read_at,
            created_at: row.created_at,
        }));

        let nextCursor: { lastId: string; lastCreatedAt: Date } | null = null;
        if (messages.length === limit) {
            const last = messages[messages.length - 1];
            if (last) {
                nextCursor = {
                    lastId: last.id,
                    lastCreatedAt: last.created_at,
                };
            }
        }

        return { messages, nextCursor };
    }

    static async sendMessage(conversationId: string, senderId: string, body: string) {
        const participantCheck = await pool.query(
            `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
            [conversationId, senderId]
        );
        if (participantCheck.rows.length === 0) {
            throw new Error("Not a participant in this conversation");
        }

        const result = await pool.query(`
            INSERT INTO messages (conversation_id, sender_id, body)
            VALUES ($1, $2, $3)
            RETURNING id, conversation_id, sender_id, body, read_at, created_at, updated_at
        `, [conversationId, senderId, body]);

        const row = result.rows[0];
        return {
            id: row.id,
            conversation_id: row.conversation_id,
            sender_id: row.sender_id,
            sender_name: "",
            body: row.body,
            read_at: row.read_at,
            created_at: row.created_at,
        };
    }

    static async markMessagesRead(conversationId: string, readerId: string) {
        await pool.query(`
            UPDATE messages
            SET read_at = now(), updated_at = now()
            WHERE conversation_id = $1
            AND sender_id <> $2
            AND read_at IS NULL
        `, [conversationId, readerId]);
    }

    static async getConversationById(conversationId: string, userId: string) {
        const result = await pool.query(`
            SELECT c.id, c.pet_id, p.name AS pet_name, p.status AS pet_status, c.created_at, c.updated_at
            FROM conversations c
            JOIN pets p ON p.id = c.pet_id
            JOIN conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = $2
            WHERE c.id = $1
        `, [conversationId, userId]);
        return result.rows[0] || null;
    }
}