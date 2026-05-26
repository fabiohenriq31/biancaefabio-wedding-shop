"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMercadoPagoPaymentById = syncMercadoPagoPaymentById;
const mercadopago_1 = require("mercadopago");
const Order_1 = require("../model/Order");
function mapMercadoPagoStatus(status) {
    if (status === "approved") {
        return { orderStatus: "confirmed", paymentStatus: "paid" };
    }
    if (status === "refunded" || status === "charged_back") {
        return { orderStatus: "cancelled", paymentStatus: "refunded" };
    }
    if (status === "rejected" || status === "cancelled") {
        return { orderStatus: "pending", paymentStatus: "failed" };
    }
    return { orderStatus: "pending", paymentStatus: "awaiting_payment" };
}
async function syncMercadoPagoPaymentById(paymentId) {
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;
    if (!mpAccessToken) {
        throw new Error("MP_ACCESS_TOKEN não configurado.");
    }
    const mpClient = new mercadopago_1.MercadoPagoConfig({
        accessToken: mpAccessToken,
    });
    const payment = new mercadopago_1.Payment(mpClient);
    const paymentData = await payment.get({ id: String(paymentId) });
    const externalReference = String(paymentData.external_reference || "");
    if (!externalReference) {
        return { order: null, paymentData };
    }
    const order = await Order_1.Order.findById(externalReference);
    if (!order) {
        return { order: null, paymentData };
    }
    const { orderStatus, paymentStatus } = mapMercadoPagoStatus(paymentData.status);
    order.status = orderStatus;
    order.paymentStatus = paymentStatus;
    await order.save();
    return { order, paymentData };
}
//# sourceMappingURL=mercadoPagoOrderSync.js.map