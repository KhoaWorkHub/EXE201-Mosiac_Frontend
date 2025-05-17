import api from "@/services/api";
import {
  OrderQueryParams,
  OrderResponse,
  OrderStatusUpdateRequest,
  PaymentValidationRequest,
  OrderDetailResponse,
  OrderItemRequest,
  UpdateOrderItemsRequest
} from "@/admin/types/order.types";
import { PageResponse, ApiResponse } from "@/admin/types";
import { UUID } from "crypto";

const ADMIN_ORDER_URL = "/api/v1/admin/orders";
const ADMIN_PAYMENT_URL = "/api/v1/admin/payments";

export const AdminOrderService = {
  /**
   * Get all orders with filtering and pagination (ADMIN)
   */
  getAllOrders: async (
    params: OrderQueryParams = {}
  ): Promise<PageResponse<OrderResponse>> => {
    try {
      const queryParams = new URLSearchParams();

      // Add each parameter to query string
      if (params.keyword) queryParams.append("keyword", params.keyword);
      if (params.status) queryParams.append("status", params.status);
      if (params.userId) queryParams.append("userId", params.userId.toString());
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params.size !== undefined)
        queryParams.append("size", params.size.toString());
      if (params.sort) queryParams.append("sort", params.sort);

      const response = await api.get<PageResponse<OrderResponse>>(
        `${ADMIN_ORDER_URL}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  /**
   * Get detailed order information (ADMIN)
   */
  getOrderDetails: async (id: UUID): Promise<OrderDetailResponse> => {
    try {
      const response = await api.get<OrderDetailResponse>(`${ADMIN_ORDER_URL}/${id}/details`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },

  /**
   * Update order status (ADMIN)
   */
  updateOrderStatus: async (
    id: UUID,
    request: OrderStatusUpdateRequest
  ): Promise<OrderResponse> => {
    try {
      const params = new URLSearchParams();
      params.append("status", request.status);
      if (request.adminNote) params.append("adminNote", request.adminNote);

      const response = await api.put<OrderResponse>(
        `${ADMIN_ORDER_URL}/${id}/status?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  /**
   * Update order items (ADMIN)
   */
  updateOrderItems: async (
    id: UUID,
    request: UpdateOrderItemsRequest
  ): Promise<OrderResponse> => {
    try {
      const response = await api.put<OrderResponse>(
        `${ADMIN_ORDER_URL}/${id}/items`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order items:", error);
      throw error;
    }
  },

  /**
   * Add item to order (ADMIN)
   */
  addOrderItem: async (
    id: UUID,
    request: OrderItemRequest
  ): Promise<OrderResponse> => {
    try {
      const response = await api.post<OrderResponse>(
        `${ADMIN_ORDER_URL}/${id}/items`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error adding order item:", error);
      throw error;
    }
  },

  /**
   * Remove item from order (ADMIN)
   */
  removeOrderItem: async (
    id: UUID,
    itemId: UUID
  ): Promise<OrderResponse> => {
    try {
      const response = await api.delete<OrderResponse>(
        `${ADMIN_ORDER_URL}/${id}/items/${itemId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing order item:", error);
      throw error;
    }
  },

  /**
   * Validate payment (ADMIN)
   */
  validatePayment: async (
    id: UUID,
    request: PaymentValidationRequest
  ): Promise<ApiResponse> => {
    try {
      const params = new URLSearchParams();
      params.append("isValid", request.isValid.toString());
      if (request.adminNote) params.append("adminNote", request.adminNote);

      const response = await api.put<ApiResponse>(
        `${ADMIN_PAYMENT_URL}/${id}/validate?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error validating payment:", error);
      throw error;
    }
  },

  /**
   * Mark payment as failed (ADMIN)
   */
  markPaymentAsFailed: async (
    id: UUID,
    reason: string
  ): Promise<ApiResponse> => {
    try {
      const params = new URLSearchParams();
      params.append("reason", reason);

      const response = await api.put<ApiResponse>(
        `${ADMIN_PAYMENT_URL}/${id}/fail?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error marking payment as failed:", error);
      throw error;
    }
  },

  /**
   * Refund payment (ADMIN)
   */
  refundPayment: async (id: UUID, reason: string): Promise<ApiResponse> => {
    try {
      const params = new URLSearchParams();
      params.append("reason", reason);

      const response = await api.put<ApiResponse>(
        `${ADMIN_PAYMENT_URL}/${id}/refund?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error refunding payment:", error);
      throw error;
    }
  },

  /**
   * Export orders to CSV/Excel (ADMIN)
   */
  exportOrders: async (
    format: string = "csv",
    status?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      params.append("format", format);
      if (status) params.append("status", status);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await api.get(
        `${ADMIN_ORDER_URL}/export?${params.toString()}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error("Error exporting orders:", error);
      throw error;
    }
  },

  /**
   * Get order analytics (counts by status)
   */
  getOrderAnalytics: async (): Promise<Record<string, number>> => {
    try {
      const response = await api.get<Record<string, number>>(
        `${ADMIN_ORDER_URL}/analytics`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order analytics:", error);
      throw error;
    }
  },

  /**
   * Get order revenue analytics (by time period)
   */
  getRevenueAnalytics: async (
    period: "day" | "week" | "month" = "day"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<any>(
        `${ADMIN_ORDER_URL}/revenue?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      throw error;
    }
  },
};