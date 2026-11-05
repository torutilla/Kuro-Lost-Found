export interface MessageServerToClientEvents {
    "message:received": (message: {
        id: string;
        conversation_id: string;
        sender_id: string;
        sender_name: string;
        body: string;
        created_at: string;
    }) => void;
    "messages:read": (data: { conversationId: string; readerId: string }) => void;
}

export interface MessageClientToServerEvents {
    "message:send": (data: { conversationId: string; body: string }, ack?: (res: { success?: boolean; id?: string; message?: string }) => void) => void;
    "message:read": (data: { conversationId: string }, ack?: (res: { success?: boolean; message?: string }) => void) => void;
}