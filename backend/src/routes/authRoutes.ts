import { Router } from "express";
import { googleLogin, passwordLogin, registerUser, updateProfile } from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";
import { guestPhotoUpload } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/google", googleLogin);
router.post("/login", passwordLogin);
router.post("/register", registerUser);
router.patch("/me", requireAuth, guestPhotoUpload.single("avatar"), updateProfile);

export default router;
