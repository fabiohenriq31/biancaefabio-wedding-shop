"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const webhookController_1 = require("../controllers/webhookController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/checkout-pro", authMiddleware_1.requireAuth, paymentController_1.createCheckoutPreference);
router.post("/webhook/mercadopago", webhookController_1.mercadoPagoWebhook);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map