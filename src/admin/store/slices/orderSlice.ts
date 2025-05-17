import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminOrderService } from '@/admin/services/adminOrderService';
import { 
  OrderResponse, 
  OrderDetailResponse,
  OrderQueryParams, 
  OrderStatusUpdateRequest,
  OrderFilterState,
  OrderStatus,
  PaymentValidationRequest,
  UpdateOrderItemsRequest,
  OrderItemRequest
} from '@/admin/types/order.types';
import { PageResponse } from '@/admin/types';
import { RootState } from '@/store';
import { UUID } from 'crypto';

interface OrderState {
  orders: OrderResponse[];
  currentOrder: OrderResponse | null;
  orderDetail: OrderDetailResponse | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  loading: boolean;
  orderDetailLoading: boolean;
  updating: boolean;
  exporting: boolean;
  error: string | null;
  filters: OrderFilterState;
  analytics: {
    countByStatus: Record<string, number> | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revenueData: any[] | null;
    loading: boolean;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  orderDetail: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  orderDetailLoading: false,
  updating: false,
  exporting: false,
  error: null,
  filters: {
    statuses: [],
    dateRange: null,
    keyword: '',
  },
  analytics: {
    countByStatus: null,
    revenueData: null,
    loading: false,
  },
};

// Convert order filter state to query params
const createQueryParams = (
  state: RootState
): OrderQueryParams => {
  const { pagination, filters } = state.orders;
  
  const params: OrderQueryParams = {
    page: pagination.current - 1, // API uses 0-based index
    size: pagination.pageSize,
    sort: 'createdAt,desc',
  };
  
  if (filters.keyword) {
    params.keyword = filters.keyword;
  }
  
  if (filters.statuses.length === 1) {
    params.status = filters.statuses[0];
  }
  
  if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
    params.startDate = filters.dateRange[0];
    params.endDate = filters.dateRange[1];
  }
  
  return params;
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const params = createQueryParams(state);
      
      return await AdminOrderService.getAllOrders(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders');
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (id: UUID, { rejectWithValue }) => {
    try {
      return await AdminOrderService.getOrderDetails(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch order details');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, request }: { id: UUID; request: OrderStatusUpdateRequest }, { rejectWithValue }) => {
    try {
      return await AdminOrderService.updateOrderStatus(id, request);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update order status');
    }
  }
);

export const updateOrderItems = createAsyncThunk(
  'orders/updateOrderItems',
  async ({ id, request }: { id: UUID; request: UpdateOrderItemsRequest }, { rejectWithValue }) => {
    try {
      return await AdminOrderService.updateOrderItems(id, request);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update order items');
    }
  }
);

export const addOrderItem = createAsyncThunk(
  'orders/addOrderItem',
  async ({ id, request }: { id: UUID; request: OrderItemRequest }, { rejectWithValue }) => {
    try {
      return await AdminOrderService.addOrderItem(id, request);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add order item');
    }
  }
);

export const removeOrderItem = createAsyncThunk(
  'orders/removeOrderItem',
  async ({ id, itemId }: { id: UUID; itemId: UUID }, { rejectWithValue }) => {
    try {
      return await AdminOrderService.removeOrderItem(id, itemId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove order item');
    }
  }
);

export const validatePayment = createAsyncThunk(
  'orders/validatePayment',
  async (
    { id, request }: { id: UUID; request: PaymentValidationRequest }, 
    { rejectWithValue }
  ) => {
    try {
      await AdminOrderService.validatePayment(id, request);
      return { id, isValid: request.isValid };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to validate payment');
    }
  }
);

export const markPaymentAsFailed = createAsyncThunk(
  'orders/markPaymentAsFailed',
  async ({ id, reason }: { id: UUID; reason: string }, { rejectWithValue }) => {
    try {
      await AdminOrderService.markPaymentAsFailed(id, reason);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark payment as failed');
    }
  }
);

export const refundPayment = createAsyncThunk(
  'orders/refundPayment',
  async ({ id, reason }: { id: UUID; reason: string }, { rejectWithValue }) => {
    try {
      await AdminOrderService.refundPayment(id, reason);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to refund payment');
    }
  }
);

export const exportOrders = createAsyncThunk(
  'orders/exportOrders',
  async ({ format, status, startDate, endDate }: 
    { format: string; status?: string; startDate?: string; endDate?: string },
    { rejectWithValue }) => {
    try {
      return await AdminOrderService.exportOrders(format, status, startDate, endDate);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to export orders');
    }
  }
);

export const fetchOrderAnalytics = createAsyncThunk(
  'orders/fetchOrderAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await AdminOrderService.getOrderAnalytics();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch order analytics');
    }
  }
);

export const fetchRevenueAnalytics = createAsyncThunk(
  'orders/fetchRevenueAnalytics',
  async (period: 'day' | 'week' | 'month', { rejectWithValue }) => {
    try {
      return await AdminOrderService.getRevenueAnalytics(period);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch revenue analytics');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.current = 1; // Reset to first page
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.current = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.orderDetail = null;
    },
    setKeywordFilter: (state, action: PayloadAction<string>) => {
      state.filters.keyword = action.payload;
      state.pagination.current = 1; // Reset to first page
    },
    setStatusFilter: (state, action: PayloadAction<OrderStatus[]>) => {
      state.filters.statuses = action.payload;
      state.pagination.current = 1; // Reset to first page
    },
    setDateRangeFilter: (state, action: PayloadAction<[string, string] | null>) => {
      state.filters.dateRange = action.payload;
      state.pagination.current = 1; // Reset to first page
    },
    resetFilters: (state) => {
      state.filters = {
        statuses: [],
        dateRange: null,
        keyword: '',
      };
      state.pagination.current = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled, 
        (state, action: PayloadAction<PageResponse<OrderResponse>>) => {
          state.loading = false;
          state.orders = action.payload.content;
          state.pagination.total = action.payload.totalElements;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.orderDetailLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action: PayloadAction<OrderDetailResponse>) => {
        state.orderDetailLoading = false;
        state.orderDetail = action.payload;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.orderDetailLoading = false;
        state.error = action.payload as string;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.updating = false;
        state.currentOrder = action.payload;
        
        // Update order in list if it exists
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })
      
      // Update order items
      .addCase(updateOrderItems.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateOrderItems.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.updating = false;
        state.currentOrder = action.payload;
        
        // Update order in list if it exists
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderItems.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })
      
      // Add order item
      .addCase(addOrderItem.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(addOrderItem.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.updating = false;
        state.currentOrder = action.payload;
        
        // Update order in list if it exists
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(addOrderItem.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })
      
      // Remove order item
      .addCase(removeOrderItem.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(removeOrderItem.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.updating = false;
        state.currentOrder = action.payload;
        
        // Update order in list if it exists
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(removeOrderItem.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })
      
      // Export orders
      .addCase(exportOrders.pending, (state) => {
        state.exporting = true;
        state.error = null;
      })
      .addCase(exportOrders.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportOrders.rejected, (state, action) => {
        state.exporting = false;
        state.error = action.payload as string;
      })
      
      // Fetch order analytics
      .addCase(fetchOrderAnalytics.pending, (state) => {
        state.analytics.loading = true;
      })
      .addCase(fetchOrderAnalytics.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
        state.analytics.loading = false;
        state.analytics.countByStatus = action.payload;
      })
      .addCase(fetchOrderAnalytics.rejected, (state) => {
        state.analytics.loading = false;
      })
      
      // Fetch revenue analytics
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.analytics.loading = true;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.analytics.loading = false;
        state.analytics.revenueData = action.payload;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state) => {
        state.analytics.loading = false;
      });
  },
});

export const { 
  setPageSize, 
  setCurrentPage, 
  clearCurrentOrder,
  setKeywordFilter,
  setStatusFilter,
  setDateRangeFilter,
  resetFilters
} = orderSlice.actions;

export default orderSlice.reducer;