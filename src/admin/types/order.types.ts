import { UUID } from 'crypto';

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  COD = 'COD',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface OrderItemResponse {
  id: UUID;
  productId: UUID;
  productNameSnapshot: string;
  variantInfoSnapshot?: string;
  priceSnapshot: number;
  quantity: number;
  subtotal: number;
}

export interface PaymentResponse {
  id: UUID;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionReference?: string;
  paymentDate?: string;
  bankName?: string;
  bankAccountNumber?: string;
  paymentNote?: string;
}

export interface OrderResponse {
  id: UUID;
  orderNumber: string;
  status: OrderStatus;
  totalProductAmount: number;
  shippingFee: number;
  totalAmount: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddressSnapshot: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemResponse[];
  payment?: PaymentResponse;
  user?: {
    id: UUID;
    email: string;
    fullName: string;
  };
  cancelledReason?: string;
  adminNote?: string;
}

export interface OrderQueryParams {
  keyword?: string;
  status?: string;
  userId?: UUID;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaymentConfirmationRequest {
  orderId: UUID;
  transactionReference?: string;
  bankName?: string;
  accountNumber?: string;
  paymentNote?: string;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  adminNote?: string;
}

export interface OrderFilterState {
  statuses: OrderStatus[];
  dateRange: [string, string] | null;
  keyword: string;
}

export const OrderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]: 'orange',
  [OrderStatus.PAID]: 'geekblue',
  [OrderStatus.PROCESSING]: 'cyan',
  [OrderStatus.SHIPPING]: 'blue',
  [OrderStatus.DELIVERED]: 'green',
  [OrderStatus.CANCELLED]: 'red'
};

export const PaymentStatusColors: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'orange',
  [PaymentStatus.COMPLETED]: 'green',
  [PaymentStatus.FAILED]: 'red',
  [PaymentStatus.REFUNDED]: 'purple'
};