import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminOrderService } from '@/admin/services/adminOrderService';
import { 
  OrderResponse, 
  OrderQueryParams, 
  OrderStatusUpdateRequest,
  OrderFilterState,
  OrderStatus
} from '@/admin/types/order.types';
import { PageResponse } from '@/admin/types';
import { RootState } from '@/store';
import { UUID } from 'crypto';

interface OrderState {
  orders: OrderResponse[];
  currentOrder: OrderResponse | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  loading: boolean;
  orderDetailLoading: boolean;
  updating: boolean;
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
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  orderDetailLoading: false,
  updating: false,
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

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: UUID, { rejectWithValue }) => {
    try {
      return await AdminOrderService.getOrderById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch order');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (orderNumber: string, { rejectWithValue }) => {
    try {
      return await AdminOrderService.getOrderByNumber(orderNumber);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch order');
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

export const validatePayment = createAsyncThunk(
  'orders/validatePayment',
  async (
    { id, isValid, adminNote }: { id: UUID; isValid: boolean; adminNote?: string }, 
    { rejectWithValue }
  ) => {
    try {
      await AdminOrderService.validatePayment(id, isValid, adminNote);
      return { id, isValid };
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
      
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.orderDetailLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.orderDetailLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.orderDetailLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch order by number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderDetailLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.orderDetailLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
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