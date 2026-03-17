import { Router } from "express";
import { createCheckoutPreference } from "../controllers/paymentController";
import { mercadoPagoWebhook } from "../controllers/webhookController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/checkout-pro", requireAuth, createCheckoutPreference);
router.post("/webhook/mercadopago", mercadoPagoWebhook);

export default router;