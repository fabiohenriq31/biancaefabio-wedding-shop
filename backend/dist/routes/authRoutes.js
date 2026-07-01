"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.post("/google", authController_1.googleLogin);
router.post("/login", authController_1.passwordLogin);
router.post("/register", authController_1.registerUser);
router.patch("/me", authMiddleware_1.requireAuth, uploadMiddleware_1.guestPhotoUpload.single("avatar"), authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map