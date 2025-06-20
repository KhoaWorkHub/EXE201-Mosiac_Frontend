// src/services/order.service.ts
import api from './api';
import { Order, CreateOrderRequest, OrderStatus, PaymentProof } from '@/types/order.types';
import type { PageResponse } from '@/types/product.types';

interface OrderQueryParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

const ORDER_URL = '/api/v1/orders';

export const OrderService = {
  /**
   * Get paginated orders with filtering
   */
  getOrders: async (params: OrderQueryParams = {}): Promise<PageResponse<Order>> => {
    try {
      const response = await api.get<PageResponse<Order>>(ORDER_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await api.get<Order>(`${ORDER_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  },

  /**
   * Create new order
   */
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    try {
      const response = await api.post<Order>(ORDER_URL, request);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Cancel order
   */
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    try {
      const response = await api.put<Order>(`${ORDER_URL}/${id}/cancel`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  /**
   * Upload payment proof
   */
  uploadPaymentProof: async (
    orderId: string, 
    file: File, 
    paymentMethod: 'MOMO' | 'BANK_TRANSFER'
  ): Promise<PaymentProof> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('paymentMethod', paymentMethod);

      const response = await api.post<PaymentProof>(
        `${ORDER_URL}/${orderId}/payment-proof`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      throw error;
    }
  },

  /**
   * Get order tracking info
   */
  getOrderTracking: async (orderId: string): Promise<{
    trackingNumber: string;
    currentLocation: string;
    estimatedDelivery: string;
    events: Array<{
      timestamp: string;
      location: string;
      status: string;
      description: string;
    }>;
  }> => {
    try {
      const response = await api.get(`${ORDER_URL}/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Error getting tracking info:', error);
      throw error;
    }
  },

  /**
   * Submit order review
   */
  submitOrderReview: async (
    orderId: string,
    reviews: Array<{
      productId: string;
      rating: number;
      comment: string;
      images?: File[];
    }>
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('reviews', JSON.stringify(reviews.map(r => ({
        productId: r.productId,
        rating: r.rating,
        comment: r.comment
      }))));

      // Add images if any
      reviews.forEach((review, reviewIndex) => {
        if (review.images) {
          review.images.forEach((image, imageIndex) => {
            formData.append(`review_${reviewIndex}_image_${imageIndex}`, image);
          });
        }
      });

      await api.post(`${ORDER_URL}/${orderId}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  /**
   * Request order return/refund
   */
  requestReturn: async (
    orderId: string,
    items: Array<{
      productId: string;
      quantity: number;
      reason: string;
    }>,
    reason: string,
    images?: File[]
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('items', JSON.stringify(items));
      formData.append('reason', reason);

      if (images) {
        images.forEach((image, index) => {
          formData.append(`image_${index}`, image);
        });
      }

      await api.post(`${ORDER_URL}/${orderId}/return`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error requesting return:', error);
      throw error;
    }
  },

  /**
   * Download order invoice
   */
  downloadInvoice: async (orderId: string): Promise<Blob> => {
    try {
      const response = await api.get(`${ORDER_URL}/${orderId}/invoice`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  },

  /**
   * Download order receipt
   */
  downloadReceipt: async (orderId: string): Promise<Blob> => {
    try {
      const response = await api.get(`${ORDER_URL}/${orderId}/receipt`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading receipt:', error);
      throw error;
    }
  },

  /**
   * Get order statistics
   */
  getOrderStatistics: async (): Promise<{
    totalOrders: number;
    totalValue: number;
    pendingPayment: number;
    processing: number;
    shipping: number;
    delivered: number;
    cancelled: number;
    averageOrderValue: number;
    monthlyOrders: Array<{
      month: string;
      count: number;
      value: number;
    }>;
  }> => {
    try {
      const response = await api.get(`${ORDER_URL}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error getting order statistics:', error);
      throw error;
    }
  },

  /**
   * Reorder (add items from existing order to cart)
   */
  reorder: async (orderId: string): Promise<void> => {
    try {
      await api.post(`${ORDER_URL}/${orderId}/reorder`);
    } catch (error) {
      console.error('Error reordering:', error);
      throw error;
    }
  },

  /**
   * Get delivery status updates
   */
  getDeliveryUpdates: async (orderId: string): Promise<Array<{
    timestamp: string;
    status: string;
    location: string;
    description: string;
    driverName?: string;
    driverPhone?: string;
    estimatedArrival?: string;
  }>> => {
    try {
      const response = await api.get(`${ORDER_URL}/${orderId}/delivery-updates`);
      return response.data;
    } catch (error) {
      console.error('Error getting delivery updates:', error);
      throw error;
    }
  },

  /**
   * Contact customer service about order
   */
  contactSupport: async (
    orderId: string,
    subject: string,
    message: string,
    attachments?: File[]
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);

      if (attachments) {
        attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      await api.post(`${ORDER_URL}/${orderId}/support`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error contacting support:', error);
      throw error;
    }
  }
};