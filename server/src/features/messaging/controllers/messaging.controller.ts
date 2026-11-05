import type { Request, Response, NextFunction } from "express";
import { createHandler } from "@shared/utils/request.util.js";
import { sendSuccess } from "@shared/index.js";
import MessagingService from "../services/messaging.service.js";
import { SendMessageSchema } from "../schema/messaging.schema.js";
import type { SendMessageInput } from "../schema/messaging.schema.js";
import { validateMiddleware } from "@middleware/index.js";

export const createConversation = createHandler<{}, { pet_id: string }>(
    async (req, res) => {
        if (!req.user?.userId) throw new Error("Unauthorized");
        const { pet_id } = req.body;
        const visitorId = req.user.userId;

        // Get pet owner
        const { pool } = await import("@config/db.js");
        const petResult = await pool.query(
            `SELECT user_id FROM pets WHERE id = $1`,
            [pet_id]
        );
        if (petResult.rows.length === 0) throw new Error("Pet not found");
        const ownerId = petResult.rows[0].user_id;

        const conversationId = await MessagingService.createOrGetConversation(
            pet_id, ownerId, visitorId
        );

        sendSuccess(res, {
            message: "Conversation ready",
            data: { conversationId },
        });
    }
);

export const listConversations = createHandler(async (req, res) => {
    if (!req.user?.userId) throw new Error("Unauthorized");
    const conversations = await MessagingService.getConversationsForUser(req.user.userId);
    sendSuccess(res, {
        message: "Conversations fetched",
        data: { conversations },
    });
});

export const getMessages = createHandler<{ conversationId: string }>(
    async (req, res) => {
        if (!req.user?.userId) throw new Error("Unauthorized");
        const { conversationId } = req.params;
        const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
        const beforeCreatedAt = req.query.beforeCreatedAt
            ? new Date(req.query.beforeCreatedAt as string)
            : undefined;
        const beforeId = req.query.beforeId as string | undefined;

        const result = await MessagingService.getMessages(
            conversationId, req.user.userId, limit, beforeCreatedAt, beforeId
        );
        sendSuccess(res, {
            message: "Messages fetched",
            data: result,
        });
    }
);

export const sendMessage = createHandler<{ conversationId: string }, SendMessageInput>(
    async (req, res) => {
        if (!req.user?.userId) throw new Error("Unauthorized");
        const { conversationId } = req.params;
        const senderId = req.user.userId;
        const { body } = req.body;

        const message = await MessagingService.sendMessage(
            conversationId, senderId, body
        );

        sendSuccess(res, {
            message: "Message sent",
            data: message,
        });
    }
);

export const markMessagesRead = createHandler<{ conversationId: string }, {}, {}>(
    async (req, res) => {
        if (!req.user?.userId) throw new Error("Unauthorized");
        const { conversationId } = req.params;
        await MessagingService.markMessagesRead(conversationId, req.user.userId);
        sendSuccess(res, {
            message: "Messages marked as read",
            data: { conversationId },
        });
    }
);

export const getConversation = createHandler<{ conversationId: string }, {}, {}>(
    async (req, res) => {
        if (!req.user?.userId) throw new Error("Unauthorized");
        const { conversationId } = req.params;
        const conversation = await MessagingService.getConversationById(
            conversationId, req.user.userId
        );
        sendSuccess(res, {
            message: "Conversation fetched",
            data: conversation,
        });
    }
);