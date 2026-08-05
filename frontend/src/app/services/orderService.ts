import { API_URL } from "./api";
import { authorizedJsonRequest, getStoredAuthToken } from "./authSession";
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

export async function createOrder(payload: CreateOrderPayload) {
  return authorizedJsonRequest(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getOrdersByUser(userId: string) {
  const token = getStoredAuthToken();
  return authorizedJsonRequest(`${API_URL}/orders/user/${userId}`, {}, token);
}

export async function getOrderById(orderId: string) {
  const token = getStoredAuthToken();
  return authorizedJsonRequest(`${API_URL}/orders/${orderId}`, {}, token);
}

export async function getAllOrders() {
  const token = getStoredAuthToken();
  return authorizedJsonRequest(`${API_URL}/orders`, {}, token);
}
