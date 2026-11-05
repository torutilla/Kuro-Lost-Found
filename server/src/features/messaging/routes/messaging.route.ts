import { Router } from "express";
import { z } from "zod/v3";
import {
    createConversation,
    listConversations,
    getMessages,
    sendMessage,
    markMessagesRead,
    getConversation,
} from "../controllers/messaging.controller.js";
import { authMiddleware, validateMiddleware } from "@middleware/index.js";
import { SendMessageSchema } from "../schema/messaging.schema.js";

const router: Router = Router();

router.use(authMiddleware);

router.post(
    "/conversations",
    validateMiddleware(z.object({ pet_id: z.string().uuid() }), "body"),
    createConversation
);
router.get("/conversations", listConversations);
router.get("/conversations/:conversationId", getConversation);
router.get(
    "/conversations/:conversationId/messages",
    getMessages
);
router.post(
    "/conversations/:conversationId/messages",
    validateMiddleware(SendMessageSchema, "body"),
    sendMessage
);
router.post(
    "/conversations/:conversationId/messages/read",
    markMessagesRead
);

export default router;