import { Router } from "express";
import {
  createChatMessage,
  getChatMessages,
  getSocialNotifications,
  getSocialUsers,
} from "../controllers/socialController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);
router.get("/users", getSocialUsers);
router.get("/chat/messages", getChatMessages);
router.post("/chat/messages", createChatMessage);
router.get("/notifications", getSocialNotifications);

export default router;
