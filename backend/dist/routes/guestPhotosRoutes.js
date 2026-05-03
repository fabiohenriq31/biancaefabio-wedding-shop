"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guestPhotosController_1 = require("../controllers/guestPhotosController");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.get("/", guestPhotosController_1.getPublicGuestPhotos);
router.post("/", uploadMiddleware_1.guestPhotoUpload.single("photo"), guestPhotosController_1.createGuestPhoto);
exports.default = router;
//# sourceMappingURL=guestPhotosRoutes.js.map