import api from '@/services/api';
import { 
  CategoryRequest, 
  CategoryResponse,
  PageResponse,
  ApiResponse
} from '@/admin/types';

export const AdminCategoryService = {
  getCategories: async (
    page = 0, 
    size = 10, 
    sort = 'displayOrder,asc'
  ): Promise<PageResponse<CategoryResponse>> => {
    const response = await api.get<PageResponse<CategoryResponse>>(
      `/api/v1/categories?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  },
  
  getAllCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get<CategoryResponse[]>('/api/v1/categories/all');
    return response.data;
  },
  
  getCategoryById: async (id: string): Promise<CategoryResponse> => {
    const response = await api.get<CategoryResponse>(`/api/v1/categories/${id}`);
    return response.data;
  },
  
  createCategory: async (categoryData: CategoryRequest): Promise<CategoryResponse> => {
    const response = await api.post<CategoryResponse>('/api/v1/admin/categories', categoryData);
    return response.data;
  },
  
  updateCategory: async (id: string, categoryData: CategoryRequest): Promise<CategoryResponse> => {
    const response = await api.put<CategoryResponse>(`/api/v1/admin/categories/${id}`, categoryData);
    return response.data;
  },
  
  deleteCategory: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/v1/admin/categories/${id}`);
    return response.data;
  }
};