export type CreateConversationInput = {
    pet_id: string;
};

export type ConversationInsert = {
    pet_id: string;
    user_id: string;
    other_user_id: string;
};

export type MessageInsert = {
    conversation_id: string;
    sender_id: string;
    body: string;
};

export type ConversationWithLatest = {
    id: string;
    pet_id: string;
    pet_name: string;
    pet_status: string;
    latest_message_id: string | null;
    latest_message_body: string | null;
    latest_message_sender_id: string | null;
    latest_message_sender_name: string | null;
    latest_message_created_at: Date | null;
    latest_message_read_at: Date | null;
    unread_count: number;
    created_at: Date;
    updated_at: Date;
};

export type ConversationParticipant = {
    user_id: string;
    name: string;
};

export type MessageRow = {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_name: string;
    body: string;
    read_at: Date | null;
    created_at: Date;
};

export type ConversationWithParticipants = {
    id: string;
    pet_id: string;
    pet_name: string;
    pet_status: string;
    participants: ConversationParticipant[];
    latest_message: {
        id: string;
        body: string;
        sender_id: string;
        sender_name: string;
        created_at: Date;
        read_at: Date | null;
    } | null;
    unread_count: number;
    created_at: Date;
    updated_at: Date;
};