import api from '@/services/api';
import { 
  RegionRequest, 
  RegionResponse,
  PageResponse,
  ApiResponse
} from '@/admin/types';

export const AdminRegionService = {
  getRegions: async (
    page = 0, 
    size = 10, 
    sort = 'name,asc'
  ): Promise<PageResponse<RegionResponse>> => {
    const response = await api.get<PageResponse<RegionResponse>>(
      `/api/v1/regions?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  },
  
  getAllRegions: async (): Promise<RegionResponse[]> => {
    const response = await api.get<RegionResponse[]>('/api/v1/regions/all');
    return response.data;
  },
  
  getRegionById: async (id: string): Promise<RegionResponse> => {
    const response = await api.get<RegionResponse>(`/api/v1/regions/${id}`);
    return response.data;
  },
  
  createRegion: async (regionData: RegionRequest): Promise<RegionResponse> => {
    // Luôn sử dụng FormData, cho dù có file hay không
    const formData = new FormData();
    formData.append('name', regionData.name);
    formData.append('slug', regionData.slug);
    
    if (regionData.description) {
      formData.append('description', regionData.description);
    }
    
    if (regionData.active !== undefined) {
      formData.append('active', regionData.active.toString());
    }
    
    // Thêm file nếu có
    if (regionData.file) {
      formData.append('file', regionData.file);
    }
    
    const response = await api.post<RegionResponse>(
      '/api/v1/admin/regions', 
      formData
    );
    return response.data;
  },
  
  updateRegion: async (id: string, regionData: RegionRequest): Promise<RegionResponse> => {
    // Lấy thông tin region hiện tại để đảm bảo giữ nguyên imageUrl
    const currentRegion = await AdminRegionService.getRegionById(id);
    
    // Luôn sử dụng FormData, cho dù có file hay không
    const formData = new FormData();
    formData.append('name', regionData.name);
    formData.append('slug', regionData.slug);
    
    if (regionData.description) {
      formData.append('description', regionData.description);
    }
    
    if (regionData.active !== undefined) {
      formData.append('active', regionData.active.toString());
    }
    
    // Quan trọng: Gửi lại imageUrl hiện tại nếu không có file mới
    if (regionData.file) {
      formData.append('file', regionData.file);
    } else if (currentRegion.imageUrl) {
      // Gửi lại URL ảnh hiện tại
      formData.append('imageUrl', currentRegion.imageUrl);
    }
    
    const response = await api.put<RegionResponse>(
      `/api/v1/admin/regions/${id}`, 
      formData
    );
    return response.data;
  },
  
  deleteRegion: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/v1/admin/regions/${id}`);
    return response.data;
  }
};