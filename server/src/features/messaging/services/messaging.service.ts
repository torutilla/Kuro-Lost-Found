import MessagingRepository from "../repository/messaging.repository.js";
import { getIO } from "@sockets/socketStore.js";
import { AppError } from "@shared/index.js";

export default class MessagingService {

    static async createOrGetConversation(petId: string, ownerId: string, visitorId: string) {
        return MessagingRepository.createOrGetConversation(petId, ownerId, visitorId);
    }

    static async getConversationsForUser(userId: string) {
        return MessagingRepository.getConversationsForUser(userId);
    }

    static async getMessages(
        conversationId: string,
        viewerId: string,
        limit: number,
        beforeCreatedAt?: Date,
        beforeId?: string
    ) {
        return MessagingRepository.getMessages(conversationId, viewerId, limit, beforeCreatedAt, beforeId);
    }

    static async sendMessage(conversationId: string, senderId: string, body: string) {
        const message = await MessagingRepository.sendMessage(conversationId, senderId, body);

        // Fetch sender name for the broadcast
        const { pool } = await import("@config/db.js");
        const senderResult = await pool.query(
            `SELECT name FROM users WHERE id = $1`,
            [senderId]
        );
        const senderName = senderResult.rows[0]?.name || "Unknown";

        // Broadcast the new message to the conversation room
        const io = getIO();
        io.to(conversationId).emit("message:received", {
            ...message,
            sender_name: senderName,
        });

        return message;
    }

    static async markMessagesRead(conversationId: string, readerId: string) {
        await MessagingRepository.markMessagesRead(conversationId, readerId);

        const io = getIO();
        io.to(conversationId).emit("messages:read", {
            conversationId,
            readerId,
        });
    }

    static async getConversationById(conversationId: string, userId: string) {
        const conversation = await MessagingRepository.getConversationById(conversationId, userId);
        if (!conversation) {
            throw new AppError("Conversation not found or access denied", 404);
        }
        return conversation;
    }
}