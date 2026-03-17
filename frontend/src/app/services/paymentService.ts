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

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao iniciar pagamento.");
  }

  return data;
}