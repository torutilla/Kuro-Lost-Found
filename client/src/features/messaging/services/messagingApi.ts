import { fetchHandler } from "@shared/utils/fetchHandler.ts";

export type Conversation = {
    id: string;
    pet_id: string;
    pet_name: string;
    pet_status: string;
    participants: Array<{ user_id: string; name: string }>;
    latest_message: {
        id: string;
        body: string;
        sender_id: string;
        sender_name: string;
        created_at: string;
        read_at: string | null;
    } | null;
    unread_count: number;
    created_at: string;
    updated_at: string;
};

export type Message = {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_name: string;
    body: string;
    read_at: string | null;
    created_at: string;
};

export type SendMessageInput = {
    body: string;
};

export type ConversationListResponse = {
    conversations: Conversation[];
};

export type MessageListResponse = {
    messages: Message[];
    nextCursor: {
        lastId: string;
        lastCreatedAt: string;
    } | null;
};

export const messagingApi = {
    async createConversation(petId: string): Promise<{ conversationId: string }> {
        return fetchHandler<{ conversationId: string }>(
            `api/v1/messaging/conversations`,
            {
                method: "POST",
                body: JSON.stringify({ pet_id: petId }),
            }
        );
    },

    async listConversations(): Promise<Conversation[]> {
        const res = await fetchHandler<{ conversations: Conversation[] }>(
            `api/v1/messaging/conversations`
        );
        return res.conversations;
    },

    async getConversation(conversationId: string): Promise<Conversation> {
        return fetchHandler<Conversation>(
            `api/v1/messaging/conversations/${conversationId}`
        );
    },

    async getMessages(
        conversationId: string,
        limit = 50,
        beforeCreatedAt?: string,
        beforeId?: string
    ): Promise<MessageListResponse> {
        const params = new URLSearchParams({ limit: String(limit) });
        if (beforeCreatedAt) params.set("beforeCreatedAt", beforeCreatedAt);
        if (beforeId) params.set("beforeId", beforeId);
        return fetchHandler<MessageListResponse>(
            `api/v1/messaging/conversations/${conversationId}/messages?${params}`
        );
    },

    async sendMessage(
        conversationId: string,
        body: string
    ): Promise<{ id: string; conversation_id: string; sender_id: string; body: string; created_at: string }> {
        return fetchHandler(
            `api/v1/messaging/conversations/${conversationId}/messages`,
            {
                method: "POST",
                body: JSON.stringify({ body }),
            }
        );
    },

    async markMessagesRead(conversationId: string): Promise<void> {
        await fetchHandler(
            `api/v1/messaging/conversations/${conversationId}/messages/read`,
            { method: "POST" }
        );
    },
};
