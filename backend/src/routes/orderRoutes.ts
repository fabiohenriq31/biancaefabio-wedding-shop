import { Router } from "express";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
} from "../controllers/orderController";
import { requireAuth } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

router.post("/", createOrder);
router.get("/user/:userId", requireAuth, getOrdersByUser);
router.get("/", requireAuth, requireAdmin, getAllOrders);

export default router;