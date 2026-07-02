export type Category = 'Lua de Mel' | 'Gastronomia' | 'Diversao' | 'Viagem' | 'Momentos a Dois' | 'Extras';
export type PaymentMethod = 'pix' | 'credit_card' | 'payment_link' | 'mercado_pago' | 'manual_redirect';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'awaiting_payment' | 'paid' | 'failed' | 'refunded';

export type Product = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

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

export type GuestPhotoStatus = 'approved' | 'hidden';
export type SocialPostStatus = 'approved' | 'hidden';
export type GuestStatus = 'confirmed' | 'not_confirmed';
export type GuestType = 'guest' | 'groomsman';
export type WeddingDayKey = 'friday' | 'saturday' | 'sunday';

export interface GuestPhoto {
  _id: string;
  imageUrl: string;
  thumbnailUrl: string;
  publicId: string;
  guestName: string;
  isApproved: boolean;
  status: GuestPhotoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SocialPost {
  _id: string;
  authorId?: string | null;
  authorName: string;
  authorAvatarUrl?: string | null;
  message: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  publicId?: string | null;
  likeCount: number;
  likedBy?: string[];
  repostCount?: number;
  repostedBy?: string[];
  comments?: SocialPostComment[];
  isApproved: boolean;
  status: SocialPostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SocialPostComment {
  _id?: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  message: string;
  createdAt: string;
}

export interface Guest {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  companions?: string;
  message?: string;
  guestType: GuestType;
  isChild: boolean;
  isAttending: boolean;
  status: GuestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GuestLookupResult {
  _id: string;
  name: string;
  guestType: GuestType;
  isChild: boolean;
  status: GuestStatus;
}

export interface AdminSummary {
  activeProducts: number;
  totalOrders: number;
  totalPhotos: number;
  hiddenPhotos: number;
  totalSocialPosts: number;
  hiddenSocialPosts: number;
  totalGuests: number;
  confirmedGuests: number;
  notConfirmedGuests: number;
  groomsmenGuests: number;
  regularGuests: number;
  childGuests: number;
  payingGuests: number;
  confirmedPayingGuests: number;
  financialReserveTotal: number;
  remainingToSave: number;
  totalSuppliers: number;
  supplierTotalStaff: number;
  supplierStaffMealCost: number;
  supplierTotalCost: number;
  supplierTotalPaid: number;
  supplierTotalPending: number;
  latestFinancialEntries: FinancialEntry[];
  latestSocialPosts: SocialPost[];
  latestSuppliers: Supplier[];
  latestPhotos: GuestPhoto[];
  latestOrders: Order[];
  latestGuests: Guest[];
}

export interface SupplierPayment {
  _id: string;
  amount: number;
  paidAt: string;
  note?: string;
}

export interface Supplier {
  _id: string;
  name: string;
  category?: string;
  contact?: string;
  notes?: string;
  staffCount: number;
  totalCost: number;
  payments: SupplierPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface FinancialEntry {
  _id: string;
  amount: number;
  note?: string;
  savedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DayScheduleItem {
  _id: string;
  dayKey: WeddingDayKey;
  startTime: string;
  endTime?: string;
  title: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
