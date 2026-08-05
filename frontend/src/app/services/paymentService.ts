import { API_URL } from "./api";
import { authorizedJsonRequest, getStoredAuthToken } from "./authSession";

export async function createCheckoutPro(orderId: string) {
  const token = getStoredAuthToken();

  return authorizedJsonRequest(
    `${API_URL}/payments/checkout-pro`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    },
    token
  );
}

export async function syncMercadoPagoOrderStatus(params: {
  paymentId?: string | null;
  externalReference?: string | null;
}) {
  const token = getStoredAuthToken();
  const query = new URLSearchParams();

  if (params.paymentId) {
    query.set("payment_id", params.paymentId);
  }

  if (params.externalReference) {
    query.set("external_reference", params.externalReference);
  }

  return authorizedJsonRequest(
    `${API_URL}/payments/mercadopago/status?${query.toString()}`,
    {},
    token
  );
}
