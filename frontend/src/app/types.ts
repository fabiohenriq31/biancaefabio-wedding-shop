// Type definitions for the wedding shopping application

export type Category = 'Lua de Mel' | 'Gastronomia' | 'Diversão' | 'Viagem' | 'Momentos a Dois' | 'Extras';

export type PaymentMethod = 'pix' | 'credit_card' | 'payment_link' | 'mercado_pago' | 'manual_redirect';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export type PaymentStatus = 'awaiting_payment' | 'paid' | 'failed' | 'refunded';

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  stockType: 'symbolic';
  displayOrder: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  lineTotal: number;
  productImage: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: 'email' | 'google';
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface GiftMessage {
  id: string;
  userId: string;
  orderId: string;
  message: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  externalPaymentUrl?: string;
  createdAt: Date;
  items: OrderItem[];
  giftMessage?: GiftMessage;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}
