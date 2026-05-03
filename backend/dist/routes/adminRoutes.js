"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const guestPhotosController_1 = require("../controllers/guestPhotosController");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth, adminMiddleware_1.requireAdmin);
router.get("/summary", adminController_1.getAdminSummary);
router.get("/guest-photos", guestPhotosController_1.getAdminGuestPhotos);
router.patch("/guest-photos/:id/hide", guestPhotosController_1.hideGuestPhoto);
router.patch("/guest-photos/:id/show", guestPhotosController_1.showGuestPhoto);
router.delete("/guest-photos/:id", guestPhotosController_1.removeGuestPhoto);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map