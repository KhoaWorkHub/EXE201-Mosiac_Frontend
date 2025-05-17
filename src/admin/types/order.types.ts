import { UUID } from 'crypto';
import { UserDto } from '@/types/auth.types';

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
  adminNote?: string;
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
  cancelledReason?: string;
  adminNote?: string;
  paymentDue?: string;
}

export interface OrderDetailResponse extends OrderResponse {
  user: UserDto;
  invoice?: InvoiceResponse;
}

export interface InvoiceResponse {
  id: UUID;
  orderId: UUID;
  invoiceNumber: string;
  pdfUrl: string;
  issuedDate: string;
  sent: boolean;
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

export interface OrderItemRequest {
  productId: UUID;
  variantId?: UUID;
  quantity: number;
  priceOverride?: number;
}

export interface UpdateOrderItemsRequest {
  items: OrderItemRequest[];
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  adminNote?: string;
}

export interface PaymentValidationRequest {
  isValid: boolean;
  adminNote?: string;
}

export interface PaymentFailRequest {
  reason: string;
}

export interface PaymentRefundRequest {
  reason: string;
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