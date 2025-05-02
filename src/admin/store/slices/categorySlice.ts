import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminCategoryService } from '@/admin/services/adminCategoryService';
import { CategoryRequest, CategoryResponse, PageResponse } from '@/admin/types';
import { RootState } from '@/store';

interface CategoryState {
  categories: CategoryResponse[];
  currentCategory: CategoryResponse | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  loading: boolean;
  submitting: boolean;
  error: string | null;
  viewMode: 'table' | 'grid';
  filters: {
    search: string;
    parentId?: string;
    active?: boolean;
    sort: string;
  };
}

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  submitting: false,
  error: null,
  viewMode: 'grid',
  filters: {
    search: '',
    sort: 'displayOrder,asc',
  },
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { pagination, filters } = state.categories;
      
      const response = await AdminCategoryService.getCategories(
        pagination.current - 1,
        pagination.pageSize,
        filters.sort,
        filters.search
      );
      
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await AdminCategoryService.getAllCategories();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch all categories');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await AdminCategoryService.getCategoryById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch category');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (category: CategoryRequest, { rejectWithValue }) => {
    try {
      return await AdminCategoryService.createCategory(category);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, category }: { id: string; category: CategoryRequest }, { rejectWithValue }) => {
    try {
      return await AdminCategoryService.updateCategory(id, category);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await AdminCategoryService.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'table' | 'grid'>) => {
      state.viewMode = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.current = 1; // Reset to first page
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.filters.sort = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.current = 1; // Reset to first page
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.current = action.payload;
    },
    setParentFilter: (state, action: PayloadAction<string | undefined>) => {
      state.filters.parentId = action.payload;
      state.pagination.current = 1; // Reset to first page
    },
    setActiveFilter: (state, action: PayloadAction<boolean | undefined>) => {
      state.filters.active = action.payload;
      state.pagination.current = 1; // Reset to first page
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        sort: 'displayOrder,asc',
      };
      state.pagination.current = 1;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<PageResponse<CategoryResponse>>) => {
        state.loading = false;
        state.categories = action.payload.content;
        state.pagination.total = action.payload.totalElements;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchCategoryById
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle createCategory
      .addCase(createCategory.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      
      // Handle updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
        state.submitting = false;
        state.currentCategory = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      
      // Handle deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.submitting = false;
        state.categories = state.categories.filter((category) => category.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchAllCategories
      .addCase(fetchAllCategories.fulfilled, (_state, _action: PayloadAction<CategoryResponse[]>) => {
        // This doesn't affect the paginated list, just used for dropdowns, etc.
      });
  },
});

export const {
  setViewMode,
  setSearch,
  setSort,
  setPageSize,
  setCurrentPage,
  setParentFilter,
  setActiveFilter,
  resetFilters,
  clearCurrentCategory,
} = categorySlice.actions;

export default categorySlice.reducer;