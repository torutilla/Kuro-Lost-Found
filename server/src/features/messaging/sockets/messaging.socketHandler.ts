import { Server, Socket } from "socket.io";
import MessagingService from "../services/messaging.service.js";

type SendMessageAck = {
    success?: boolean;
    id?: string;
    message?: string;
};

type MarkReadAck = {
    success?: boolean;
    message?: string;
};

/**
 * Send a message over the socket.
 * - Identity comes from the authenticated socket handshake.
 * - Payload validated with SendMessageSchema.
 * - Clear acknowledgement returned.
 */
export async function handleMessageSend(
    io: Server,
    socket: Socket,
    data: unknown,
    ack?: (res: SendMessageAck) => void
) {
    const userId = socket.user?.userId;
    if (!userId) {
        return ack?.({ message: "Authentication required" });
    }

    const { SendMessageSchema } = await import("../schema/messaging.schema.js");
    const res = SendMessageSchema.safeParse(data);
    if (!res.success) {
        return ack?.({ message: "Invalid message data" });
    }

    const { conversationId, body } = res.data as { conversationId: string; body: string };

    try {
        const message = await MessagingService.sendMessage(
            conversationId, userId, body
        );
        return ack?.({ success: true, id: message.id });
    } catch (error: any) {
        return ack?.({ message: error.message ?? "Failed to send message" });
    }
}

/**
 * Mark messages as read in a conversation.
 */
export async function handleMarkRead(
    io: Server,
    socket: Socket,
    data: unknown,
    ack?: (res: MarkReadAck) => void
) {
    const userId = socket.user?.userId;
    if (!userId) {
        return ack?.({ message: "Authentication required" });
    }

    const { conversationId } = (data as { conversationId?: string }) || {};

    if (!conversationId) {
        return ack?.({ message: "conversationId is required" });
    }

    try {
        await MessagingService.markMessagesRead(conversationId, userId);
        return ack?.({ success: true });
    } catch (error: any) {
        return ack?.({ message: error.message ?? "Failed to mark messages as read" });
    }
}

/**
 * Join a conversation room for live message delivery.
 */
export async function handleJoinConversation(
    io: Server,
    socket: Socket,
    data: unknown,
    ack?: (res: { success?: boolean; message?: string }) => void
) {
    const userId = socket.user?.userId;
    if (!userId) {
        return ack?.({ message: "Authentication required" });
    }

    const { conversationId } = (data as { conversationId?: string }) || {};

    if (!conversationId) {
        return ack?.({ message: "conversationId is required" });
    }

    try {
        socket.join(conversationId);
        return ack?.({ success: true });
    } catch (error: any) {
        return ack?.({ message: error.message ?? "Failed to join conversation" });
    }
}

/**
 * Leave a conversation room.
 */
export async function handleLeaveConversation(
    io: Server,
    socket: Socket,
    data: unknown,
    ack?: (res: { success?: boolean; message?: string }) => void
) {
    const { conversationId } = (data as { conversationId?: string }) || {};

    if (!conversationId) {
        return ack?.({ message: "conversationId is required" });
    }

    socket.leave(conversationId);
    return ack?.({ success: true });
}