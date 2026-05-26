import { API_URL } from "./api";

function getAuthToken() {
  try {
    const saved = localStorage.getItem("wedding_auth");
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

async function readJson(response: Response) {
  return response.json().catch(() => null);
}

export async function createCheckoutPro(orderId: string) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/payments/checkout-pro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao iniciar pagamento.");
  }

  return data;
}

export async function syncMercadoPagoOrderStatus(params: {
  paymentId?: string | null;
  externalReference?: string | null;
}) {
  const token = getAuthToken();
  const query = new URLSearchParams();

  if (params.paymentId) {
    query.set("payment_id", params.paymentId);
  }

  if (params.externalReference) {
    query.set("external_reference", params.externalReference);
  }

  const response = await fetch(`${API_URL}/payments/mercadopago/status?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao sincronizar pagamento.");
  }

  return data;
}
