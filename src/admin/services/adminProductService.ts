import api from '@/services/api';
import { 
  ProductRequest, 
  ProductResponse, 
  ProductVariantRequest, 
  ProductVariantResponse,
  ProductImageResponse,
  PageResponse,
  ApiResponse
} from '@/admin/types';
import type { QRCodeRequest, QRScanResponse } from '../types/qrcode.types';

export const AdminProductService = {
  getAllProducts: async (
    page = 0, 
    size = 10, 
    sort = 'createdAt,desc',
    keyword?: string,
    categoryId?: string,
    regionId?: string,
    minPrice?: number,
    maxPrice?: number,
    featured?: boolean,
    active?: boolean
  ): Promise<PageResponse<ProductResponse>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort);
    
    if (keyword) params.append('keyword', keyword);
    if (categoryId) params.append('categoryId', categoryId);
    if (regionId) params.append('regionId', regionId);
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    if (featured !== undefined) params.append('featured', featured.toString());
    if (active !== undefined) params.append('active', active.toString());
    
    const response = await api.get<PageResponse<ProductResponse>>(`/api/v1/products?${params.toString()}`);
    return response.data;
  },
  
  getProductById: async (id: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`/api/v1/products/${id}`);
    return response.data;
  },
  
  createProduct: async (productData: ProductRequest): Promise<ProductResponse> => {
    const response = await api.post<ProductResponse>('/api/v1/admin/products', productData);
    return response.data;
  },
  
  updateProduct: async (id: string, productData: ProductRequest): Promise<ProductResponse> => {
    const response = await api.put<ProductResponse>(`/api/v1/admin/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/v1/admin/products/${id}`);
    return response.data;
  },
  
  uploadProductImages: async (
    id: string, 
    files: File[], 
    altText?: string, 
    isPrimary = false
  ): Promise<ProductImageResponse[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (altText) formData.append('altText', altText);
    formData.append('isPrimary', isPrimary.toString());
    
    const response = await api.post<ProductImageResponse[]>(
      `/api/v1/admin/products/${id}/images`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
  
  deleteProductImage: async (imageId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/v1/admin/products/images/${imageId}`);
    return response.data;
  },
  
  setProductFeatured: async (id: string, featured: boolean): Promise<ProductResponse> => {
    const response = await api.put<ProductResponse>(
      `/api/v1/admin/products/${id}/featured?featured=${featured}`
    );
    return response.data;
  },
  
  addProductVariant: async (
    productId: string, 
    variantData: ProductVariantRequest
  ): Promise<ProductVariantResponse> => {
    const response = await api.post<ProductVariantResponse>(
      `/api/v1/admin/products/${productId}/variants`, 
      variantData
    );
    return response.data;
  },
  
  updateProductVariant: async (
    variantId: string, 
    variantData: ProductVariantRequest
  ): Promise<ProductVariantResponse> => {
    const response = await api.put<ProductVariantResponse>(
      `/api/v1/admin/products/variants/${variantId}`, 
      variantData
    );
    return response.data;
  },
  
  deleteProductVariant: async (variantId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/v1/admin/products/variants/${variantId}`);
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`/api/v1/products/slug/${slug}`);
    return response.data;
  },
  
  getFeaturedProducts: async (
    page = 0, 
    size = 10
  ): Promise<PageResponse<ProductResponse>> => {
    const response = await api.get<PageResponse<ProductResponse>>(
      `/api/v1/products/featured?page=${page}&size=${size}`
    );
    return response.data;
  },
  
  updateProductStatus: async (id: string, active: boolean): Promise<ProductResponse> => {
    const response = await api.patch<ProductResponse>(
      `/api/v1/admin/products/${id}/status?active=${active}`
    );
    return response.data;
  },
  
  setPrimaryImage: async (productId: string, imageId: string): Promise<ApiResponse> => {
    const response = await api.put<ApiResponse>(
      `/api/v1/admin/products/${productId}/images/${imageId}/primary`
    );
    return response.data;
  },

  generateQRCode: async (productId: string, request: QRCodeRequest): Promise<ProductResponse> => {
    const response = await api.post<ProductResponse>(`/api/v1/admin/products/${productId}/qrcode`, request);
    return response.data;
  },
  
  updateQRCode: async (productId: string, request: QRCodeRequest): Promise<ProductResponse> => {
    const response = await api.put<ProductResponse>(`/api/v1/admin/products/${productId}/qrcode`, request);
    return response.data;
  },
  
  deleteQRCode: async (productId: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/v1/admin/products/${productId}/qrcode`);
    return response.data;
  },
  
  getQRCodeScans: async (qrCodeId: string): Promise<QRScanResponse[]> => {
    const response = await api.get<QRScanResponse[]>(`/api/v1/admin/qrcodes/${qrCodeId}/scans`);
    return response.data;
  }
};