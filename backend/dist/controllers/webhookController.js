"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercadoPagoWebhook = mercadoPagoWebhook;
const crypto_1 = __importDefault(require("crypto"));
const mercadopago_1 = require("mercadopago");
const Order_1 = require("../model/Order");
function isValidSignature(req) {
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (!secret)
        return true;
    const signatureHeader = req.headers["x-signature"];
    const requestId = req.headers["x-request-id"];
    const dataId = req.body?.data?.id ||
        req.query["data.id"] ||
        req.query.id;
    if (typeof signatureHeader !== "string" ||
        typeof requestId !== "string" ||
        !dataId) {
        return false;
    }
    const parts = Object.fromEntries(signatureHeader.split(",").map((part) => {
        const [key, value] = part.split("=");
        return [key?.trim(), value?.trim()];
    }));
    const ts = parts.ts;
    const v1 = parts.v1;
    if (!ts || !v1)
        return false;
    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const hmac = crypto_1.default
        .createHmac("sha256", secret)
        .update(manifest)
        .digest("hex");
    return hmac === v1;
}
async function mercadoPagoWebhook(req, res) {
    try {
        console.log("Webhook Mercado Pago recebido:", {
            body: req.body,
            query: req.query,
            headers: {
                "x-signature": req.headers["x-signature"],
                "x-request-id": req.headers["x-request-id"],
            },
        });
        if (!isValidSignature(req)) {
            console.error("Assinatura inválida no webhook.");
            return res.status(401).json({ message: "Assinatura inválida." });
        }
        const topic = req.body?.type || req.query.type;
        const paymentId = req.body?.data?.id ||
            req.query["data.id"] ||
            req.query.id;
        if (!paymentId) {
            console.log("Webhook sem paymentId. Ignorando.");
            return res.status(200).json({ ok: true });
        }
        if (topic && topic !== "payment") {
            console.log("Webhook não é de pagamento. Ignorando.", { topic });
            return res.status(200).json({ ok: true });
        }
        const mpAccessToken = process.env.MP_ACCESS_TOKEN;
        if (!mpAccessToken) {
            console.error("MP_ACCESS_TOKEN não configurado.");
            return res.status(500).json({ message: "MP_ACCESS_TOKEN não configurado." });
        }
        const mpClient = new mercadopago_1.MercadoPagoConfig({
            accessToken: mpAccessToken,
        });
        const payment = new mercadopago_1.Payment(mpClient);
        const paymentData = await payment.get({ id: String(paymentId) });
        const externalReference = paymentData.external_reference;
        const status = paymentData.status;
        console.log("Pagamento consultado:", {
            paymentId,
            status,
            externalReference,
        });
        if (!externalReference) {
            console.log("Pagamento sem external_reference. Nada para atualizar.");
            return res.status(200).json({ ok: true });
        }
        const order = await Order_1.Order.findById(externalReference);
        if (!order) {
            console.log("Pedido não encontrado para external_reference:", externalReference);
            return res.status(200).json({ ok: true });
        }
        if (order.paymentStatus === "paid" && order.status === "confirmed") {
            console.log("Pedido já confirmado. Ignorando atualização duplicada.");
            return res.status(200).json({ ok: true });
        }
        let paymentStatus = "awaiting_payment";
        let orderStatus = "pending";
        if (status === "approved") {
            paymentStatus = "paid";
            orderStatus = "confirmed";
        }
        else if (status === "rejected" || status === "cancelled") {
            paymentStatus = "failed";
            orderStatus = "pending";
        }
        else if (status === "in_process" || status === "pending") {
            paymentStatus = "awaiting_payment";
            orderStatus = "pending";
        }
        order.paymentStatus = paymentStatus;
        order.status = orderStatus;
        await order.save();
        console.log("Pedido atualizado com sucesso:", {
            orderId: order._id,
            paymentStatus,
            orderStatus,
        });
        return res.status(200).json({ ok: true });
    }
    catch (error) {
        console.error("Erro no webhook Mercado Pago:", error);
        return res.status(200).json({ ok: true });
    }
}
//# sourceMappingURL=webhookController.js.map