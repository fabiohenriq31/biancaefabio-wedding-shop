"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const socialPostsController_1 = require("../controllers/socialPostsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.get("/", socialPostsController_1.getPublicSocialPosts);
router.post("/", uploadMiddleware_1.guestPhotoUpload.single("image"), socialPostsController_1.createSocialPost);
router.patch("/:id", socialPostsController_1.updateSocialPost);
router.patch("/:id/like", socialPostsController_1.likeSocialPost);
router.delete("/:id", socialPostsController_1.deleteOwnSocialPost);
exports.default = router;
//# sourceMappingURL=socialPostsRoutes.js.map