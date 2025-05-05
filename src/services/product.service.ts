import type { PageResponse, ProductQueryParams, ProductResponse } from '@/types/product.types';
import api from './api';

const PRODUCTS_URL = '/api/v1/products';

export const ProductService = {
  /**
   * Get paginated products with filtering
   */
  getProducts: async (params: ProductQueryParams = {}): Promise<PageResponse<ProductResponse>> => {
    const response = await api.get<PageResponse<ProductResponse>>(PRODUCTS_URL, { params });
    return response.data;
  },

  /**
   * Get product by ID
   */
  getProductById: async (id: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`${PRODUCTS_URL}/${id}`);
    return response.data;
  },

  /**
   * Get product by slug
   */
  getProductBySlug: async (slug: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`${PRODUCTS_URL}/slug/${slug}`);
    return response.data;
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (page = 0, size = 6): Promise<PageResponse<ProductResponse>> => {
    const response = await api.get<PageResponse<ProductResponse>>(`${PRODUCTS_URL}/featured`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Get latest products
   */
  getLatestProducts: async (size = 6): Promise<PageResponse<ProductResponse>> => {
    const response = await api.get<PageResponse<ProductResponse>>(PRODUCTS_URL, {
      params: { page: 0, size, sort: 'createdAt,desc' }
    });
    return response.data;
  }
};