// src/types/order.types.ts
import { UUID } from 'crypto';

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID', 
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  id: UUID;
  productId: UUID;
  productName: string;
  productImage: string;
  productSlug: string;
  variantId?: UUID;
  variantInfo?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderAddress {
  recipientName: string;
  phone: string;
  streetAddress: string;
  ward: string;
  district: string;
  province: string;
  fullAddress: string;
}

export interface PaymentProof {
  id: UUID;
  imageUrl: string;
  paymentMethod: 'MOMO' | 'BANK_TRANSFER';
  uploadedAt: string;
  verified: boolean;
}

export interface Order {
  id: UUID;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  totalAmount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  paymentMethod: 'MOMO' | 'BANK_TRANSFER' | 'COD';
  paymentProofs: PaymentProof[];
  notes?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  notes?: string;
  updatedBy?: string;
}

export interface CreateOrderRequest {
  items: {
    productId: UUID;
    variantId?: UUID;
    quantity: number;
  }[];
  shippingAddressId: UUID;
  paymentMethod: 'MOMO' | 'BANK_TRANSFER' | 'COD';
  notes?: string;
}