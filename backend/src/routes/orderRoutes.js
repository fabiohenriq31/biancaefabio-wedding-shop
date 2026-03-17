"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = (0, express_1.Router)();
router.post("/", orderController_1.createOrder);
router.get("/user/:userId", authMiddleware_1.requireAuth, orderController_1.getOrdersByUser);
router.get("/", authMiddleware_1.requireAuth, adminMiddleware_1.requireAdmin, orderController_1.getAllOrders);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map