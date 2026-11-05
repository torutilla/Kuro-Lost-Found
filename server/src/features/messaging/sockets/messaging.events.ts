import { handleMessageSend, handleMarkRead, handleJoinConversation, handleLeaveConversation } from "./messaging.socketHandler.js";

export const messageEvents = {
    "message:send": handleMessageSend,
    "message:read": handleMarkRead,
    "join_conversation": handleJoinConversation,
    "leave_conversation": handleLeaveConversation,
};