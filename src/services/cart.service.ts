import api from './api';
import { CartResponse, CartItemRequest } from '@/types/cart.types';
import { StorageService } from './storage.service';

const CART_URL = '/api/v1/cart';

// Generate a random guest ID if it doesn't exist
const getGuestId = (): string => {
  let guestId = StorageService.getItem<string>('guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
    StorageService.setItem('guest_id', guestId);
  }
  return guestId;
};

export const CartService = {
  /**
   * Get current cart (for authenticated user or guest)
   */
  getCart: async (): Promise<CartResponse> => {
    const isLoggedIn = !!StorageService.getItem<string>('access_token');
    const params = isLoggedIn ? {} : { guestId: getGuestId() };
    
    try {
      const response = await api.get<CartResponse>(CART_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  },
  
  /**
   * Add item to cart
   */
  addItemToCart: async (request: CartItemRequest): Promise<CartResponse> => {
    const isLoggedIn = !!StorageService.getItem<string>('access_token');
    const params = isLoggedIn ? {} : { guestId: getGuestId() };
    
    try {
      const response = await api.post<CartResponse>(`${CART_URL}/items`, request, { params });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },
  
  /**
   * Update cart item quantity
   */
  updateCartItemQuantity: async (itemId: string, quantity: number): Promise<CartResponse> => {
    const isLoggedIn = !!StorageService.getItem<string>('access_token');
    const params = isLoggedIn ? { quantity } : { guestId: getGuestId(), quantity };
    
    try {
      const response = await api.put<CartResponse>(`${CART_URL}/items/${itemId}`, null, { params });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  },
  
  /**
   * Remove item from cart
   */
  removeCartItem: async (itemId: string): Promise<CartResponse> => {
    const isLoggedIn = !!StorageService.getItem<string>('access_token');
    const params = isLoggedIn ? {} : { guestId: getGuestId() };
    
    try {
      const response = await api.delete<CartResponse>(`${CART_URL}/items/${itemId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },
  
  /**
   * Clear cart (remove all items)
   */
  clearCart: async (): Promise<void> => {
    const isLoggedIn = !!StorageService.getItem<string>('access_token');
    const params = isLoggedIn ? {} : { guestId: getGuestId() };
    
    try {
      await api.delete(CART_URL, { params });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
  
  /**
   * Merge guest cart with user cart after login
   */
  mergeGuestCart: async (): Promise<CartResponse> => {
    const guestId = StorageService.getItem<string>('guest_id');
    
    if (!guestId) {
      // If no guest ID, just get the current cart
      return CartService.getCart();
    }
    
    try {
      const response = await api.post<CartResponse>(`${CART_URL}/merge`, null, { 
        params: { guestId } 
      });
      
      // Clear guest ID after successful merge
      StorageService.removeItem('guest_id');
      
      return response.data;
    } catch (error) {
      console.error('Error merging guest cart:', error);
      // If merge fails, still try to get the current cart
      return CartService.getCart();
    }
  }
};