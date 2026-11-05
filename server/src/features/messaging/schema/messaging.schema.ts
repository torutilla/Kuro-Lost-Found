import z from "zod/v3";

export const conversationStatusSchema = z.enum(["active", "closed"]);

export const ConversationSchema = z.object({
    id: z.string().uuid(),
    pet_id: z.string().uuid(),
    pet_name: z.string().min(1),
    pet_status: z.string(),
    participants: z.array(z.object({
        user_id: z.string().uuid(),
        name: z.string().min(1),
    })),
    latest_message: z.object({
        id: z.string().uuid(),
        body: z.string(),
        sender_id: z.string().uuid(),
        sender_name: z.string().min(1),
        created_at: z.coerce.date(),
        read_at: z.coerce.date().optional().nullable(),
    }).optional().nullable(),
    unread_count: z.number().int().nonnegative(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const MessageSchema = z.object({
    id: z.string().uuid(),
    conversation_id: z.string().uuid(),
    sender_id: z.string().uuid(),
    sender_name: z.string().min(1),
    body: z.string(),
    read_at: z.coerce.date().optional().nullable(),
    created_at: z.coerce.date(),
});

export const SendMessageSchema = z.object({
    body: z.string().min(1).max(2000).trim(),
});

export const ConversationListSchema = z.object({
    conversations: z.array(ConversationSchema),
});

export const MessageListSchema = z.object({
    messages: z.array(MessageSchema),
    nextCursor: z.object({
        lastId: z.string().uuid(),
        lastCreatedAt: z.coerce.date(),
    }).nullable(),
});

export type Conversation = z.infer<typeof ConversationSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type ConversationListResponse = z.infer<typeof ConversationListSchema>;
export type MessageListResponse = z.infer<typeof MessageListSchema>;