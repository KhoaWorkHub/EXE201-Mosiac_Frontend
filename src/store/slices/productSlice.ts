import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductService } from '@/services/product.service';
import type { PageResponse, ProductQueryParams, ProductResponse } from '@/types/product.types';

interface ProductState {
  products: ProductResponse[];
  featuredProducts: ProductResponse[];
  latestProducts: ProductResponse[];
  currentProduct: ProductResponse | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
  filters: ProductQueryParams;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  latestProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
  filters: {
    page: 0,
    size: 10,
    sort: 'createdAt,desc',
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductQueryParams, { rejectWithValue }) => {
    try {
      return await ProductService.getProducts(params);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ProductService.getProductById(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await ProductService.getProductBySlug(slug);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async ({ page = 0, size = 6 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      return await ProductService.getFeaturedProducts(page, size);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchLatestProducts = createAsyncThunk(
  'products/fetchLatestProducts',
  async ({ size = 6 }: { size?: number } = {}, { rejectWithValue }) => {
    try {
      return await ProductService.getLatestProducts(size);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch latest products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductQueryParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
      };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<PageResponse<ProductResponse>>) => {
        state.loading = false;
        state.products = action.payload.content;
        state.pagination = {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action: PayloadAction<PageResponse<ProductResponse>>) => {
        state.loading = false;
        state.featuredProducts = action.payload.content;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch latest products
      .addCase(fetchLatestProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action: PayloadAction<PageResponse<ProductResponse>>) => {
        state.loading = false;
        state.latestProducts = action.payload.content;
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters, clearCurrentProduct } = productSlice.actions;

export default productSlice.reducer;