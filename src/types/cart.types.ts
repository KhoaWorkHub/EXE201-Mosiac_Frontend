import { UUID } from 'crypto';

export interface CartItemRequest {
  productId: UUID;
  variantId?: UUID;
  quantity: number;
}

export interface CartItemResponse {
  id: UUID;
  productId: UUID;
  productSlug: string;
  productName: string;
  productImage: string;
  variantId?: UUID;
  variantInfo?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  id: UUID;
  guestId?: string;
  totalAmount: number;
  totalItems: number;
  expiredAt: string;
  updatedAt: string;
  items: CartItemResponse[];
}