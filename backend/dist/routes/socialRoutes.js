"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const socialController_1 = require("../controllers/socialController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.get("/users", socialController_1.getSocialUsers);
router.get("/chat/messages", socialController_1.getChatMessages);
router.post("/chat/messages", socialController_1.createChatMessage);
router.get("/notifications", socialController_1.getSocialNotifications);
exports.default = router;
//# sourceMappingURL=socialRoutes.js.map