import { Router } from "express";
import { googleLogin, passwordLogin } from "../controllers/authController";

const router = Router();

router.post("/google", googleLogin);
router.post("/login", passwordLogin);

export default router;
