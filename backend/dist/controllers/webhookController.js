"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercadoPagoWebhook = mercadoPagoWebhook;
const crypto_1 = __importDefault(require("crypto"));
const mercadoPagoOrderSync_1 = require("../services/mercadoPagoOrderSync");
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
        const { order, paymentData } = await (0, mercadoPagoOrderSync_1.syncMercadoPagoPaymentById)(String(paymentId));
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
        if (!order) {
            console.log("Pedido não encontrado para external_reference:", externalReference);
            return res.status(200).json({ ok: true });
        }
        console.log("Pedido atualizado com sucesso:", {
            orderId: order._id,
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
        });
        return res.status(200).json({ ok: true });
    }
    catch (error) {
        console.error("Erro no webhook Mercado Pago:", error);
        return res.status(200).json({ ok: true });
    }
}
//# sourceMappingURL=webhookController.js.map