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
    sort = 'displayOrder,asc',
    search?: string
  ): Promise<PageResponse<CategoryResponse>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort);
    
    if (search) params.append('search', search);
    
    const response = await api.get<PageResponse<CategoryResponse>>(
      `/api/v1/categories?${params.toString()}`
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
    const formData = new FormData();
    formData.append('name', categoryData.name);
    
    if (categoryData.slug) formData.append('slug', categoryData.slug);
    if (categoryData.description) formData.append('description', categoryData.description);
    if (categoryData.parentId) formData.append('parentId', categoryData.parentId.toString());
    if (categoryData.displayOrder !== undefined) 
      formData.append('displayOrder', categoryData.displayOrder.toString());
    if (categoryData.active !== undefined) 
      formData.append('active', categoryData.active.toString());
    
    // Handle file upload
    if (categoryData.file) {
      formData.append('file', categoryData.file);
    } else if (categoryData.imageUrl) {
      formData.append('imageUrl', categoryData.imageUrl);
    }
    
    const response = await api.post<CategoryResponse>(
      '/api/v1/admin/categories', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  },
  
  updateCategory: async (id: string, categoryData: CategoryRequest): Promise<CategoryResponse> => {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    
    if (categoryData.slug) formData.append('slug', categoryData.slug);
    if (categoryData.description) formData.append('description', categoryData.description);
    if (categoryData.parentId) formData.append('parentId', categoryData.parentId.toString());
    if (categoryData.displayOrder !== undefined) 
      formData.append('displayOrder', categoryData.displayOrder.toString());
    if (categoryData.active !== undefined) 
      formData.append('active', categoryData.active.toString());
    
    if (categoryData.file) {
      formData.append('file', categoryData.file);
    } else if (categoryData.imageUrl) {
      formData.append('imageUrl', categoryData.imageUrl);
    }
    
    const response = await api.put<CategoryResponse>(
      `/api/v1/admin/categories/${id}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  },
  
  deleteCategory: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/v1/admin/categories/${id}`);
    return response.data;
  },
  
  generateSlugFromName: (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, '-') 
      .replace(/^-+|-+$/g, '') 
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, ''); 
  }
};