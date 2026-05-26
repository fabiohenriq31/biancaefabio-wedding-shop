import { MercadoPagoConfig, Payment } from "mercadopago";
import { Order } from "../model/Order";

type SyncedOrderStatus = "pending" | "confirmed" | "cancelled";
type SyncedPaymentStatus = "awaiting_payment" | "paid" | "failed" | "refunded";

function mapMercadoPagoStatus(status: string | undefined): {
  orderStatus: SyncedOrderStatus;
  paymentStatus: SyncedPaymentStatus;
} {
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

export async function syncMercadoPagoPaymentById(paymentId: string) {
  const mpAccessToken = process.env.MP_ACCESS_TOKEN;

  if (!mpAccessToken) {
    throw new Error("MP_ACCESS_TOKEN não configurado.");
  }

  const mpClient = new MercadoPagoConfig({
    accessToken: mpAccessToken,
  });

  const payment = new Payment(mpClient);
  const paymentData = await payment.get({ id: String(paymentId) });
  const externalReference = String(paymentData.external_reference || "");

  if (!externalReference) {
    return { order: null, paymentData };
  }

  const order = await Order.findById(externalReference);

  if (!order) {
    return { order: null, paymentData };
  }

  const { orderStatus, paymentStatus } = mapMercadoPagoStatus(paymentData.status);

  order.status = orderStatus;
  order.paymentStatus = paymentStatus;
  await order.save();

  return { order, paymentData };
}
