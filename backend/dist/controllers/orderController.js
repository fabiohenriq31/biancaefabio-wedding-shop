"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getOrdersByUser = getOrdersByUser;
exports.getAllOrders = getAllOrders;
const Order_1 = require("../model/Order");
async function createOrder(req, res) {
    try {
        const { userId, customerName, customerEmail, customerPhone, giftMessage, items, paymentMethod, } = req.body;
        if (!userId || !customerName || !customerEmail || !items || !items.length) {
            return res.status(400).json({ message: "Dados do pedido incompletos." });
        }
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = await Order_1.Order.create({
            userId,
            customerName,
            customerEmail,
            customerPhone: customerPhone || "",
            giftMessage: giftMessage || "",
            items,
            totalAmount,
            paymentMethod: paymentMethod || "payment_link",
            status: "pending",
            paymentStatus: "awaiting_payment",
        });
        return res.status(201).json({
            message: "Pedido criado com sucesso.",
            order,
        });
    }
    catch (error) {
        console.error("Erro ao criar pedido:", error);
        return res.status(500).json({ message: "Erro ao criar pedido." });
    }
}
async function getOrdersByUser(req, res) {
    try {
        const userId = req.params.userId;
        if (!req.user?.sub) {
            return res.status(401).json({ message: "Não autorizado." });
        }
        if (req.user.sub !== userId) {
            return res.status(403).json({ message: "Acesso negado." });
        }
        const orders = await Order_1.Order.find({ userId }).sort({ createdAt: -1 });
        return res.json(orders);
    }
    catch (error) {
        console.error("Erro ao buscar pedidos do usuário:", error);
        return res.status(500).json({ message: "Erro ao buscar pedidos." });
    }
}
async function getAllOrders(_req, res) {
    try {
        const orders = await Order_1.Order.find().sort({ createdAt: -1 });
        return res.json(orders);
    }
    catch (error) {
        console.error("Erro ao buscar todos os pedidos:", error);
        return res.status(500).json({ message: "Erro ao buscar pedidos." });
    }
}
//# sourceMappingURL=orderController.js.map