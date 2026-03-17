"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutPreference = createCheckoutPreference;
const mercadopago_1 = require("mercadopago");
const Order_1 = require("../model/Order");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const frontendUrl = process.env.FRONTEND_URL;
console.log(`Frontend URL configurada: ${frontendUrl}`);
const mpAccessToken = process.env.MP_ACCESS_TOKEN;
if (!mpAccessToken) {
    throw new Error("MP_ACCESS_TOKEN não configurado no .env");
}
const mpClient = new mercadopago_1.MercadoPagoConfig({
    accessToken: mpAccessToken,
});
async function createCheckoutPreference(req, res) {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "orderId é obrigatório." });
        }
        const order = await Order_1.Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado." });
        }
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Este pedido já foi pago.",
            });
        }
        if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
            return res.status(400).json({ message: "Pedido sem itens." });
        }
        const items = order.items.map((item, index) => ({
            id: String(item.productId || `item-${index + 1}`),
            title: String(item.productName || "Presente de casamento"),
            quantity: Number(item.quantity) || 1,
            unit_price: Number(item.price),
            currency_id: "BRL",
        }));
        const hasInvalidItem = items.some((item) => !item.title ||
            item.quantity <= 0 ||
            Number.isNaN(item.unit_price) ||
            item.unit_price <= 0);
        if (hasInvalidItem) {
            return res.status(400).json({
                message: "Há itens inválidos no pedido.",
                items,
            });
        }
        const preference = new mercadopago_1.Preference(mpClient);
        const body = {
            items,
            external_reference: String(order._id),
            back_urls: {
                success: `${process.env.FRONTEND_URL}/shopping/success`,
                failure: `${process.env.FRONTEND_URL}/shopping/checkout`,
                pending: `${process.env.FRONTEND_URL}/shopping/success`,
            },
            auto_return: "approved",
        };
        if (process.env.MP_WEBHOOK_URL) {
            body.notification_url = process.env.MP_WEBHOOK_URL;
        }
        console.log("Criando preferência Mercado Pago...");
        console.log("Token prefix:", process.env.MP_ACCESS_TOKEN?.slice(0, 10));
        console.log("Order ID:", orderId);
        console.log("Items enviados:", items);
        console.log("Back URLs:", body.back_urls);
        console.log("Webhook configurado?", Boolean(process.env.MP_WEBHOOK_URL));
        const result = await preference.create({ body });
        return res.json({
            preferenceId: result.id,
            initPoint: result.init_point,
            sandboxInitPoint: result.sandbox_init_point,
        });
    }
    catch (error) {
        console.error("Erro ao criar preference Mercado Pago:", {
            message: error?.message,
            status: error?.status,
            cause: error?.cause,
            response: error?.response?.data,
            fullError: error,
        });
        return res.status(500).json({
            message: "Erro ao criar pagamento.",
            error: error?.message || "Erro desconhecido",
            status: error?.status || 500,
            cause: error?.cause || null,
        });
    }
}
//# sourceMappingURL=paymentController.js.map