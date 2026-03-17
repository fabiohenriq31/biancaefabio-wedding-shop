import { API_URL } from "./api";
import type { PaymentMethod } from "../types";

type CreateOrderPayload = {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  giftMessage: string;
  paymentMethod: PaymentMethod;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
};

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

export async function createOrder(payload: CreateOrderPayload) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao criar pedido.");
  }

  return data;
}

export async function getOrdersByUser(userId: string) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/orders/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao buscar pedidos.");
  }

  return data;
}

export async function getAllOrders() {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao buscar pedidos.");
  }

  return data;
}