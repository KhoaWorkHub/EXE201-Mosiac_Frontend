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
    const response = await api.post<RegionResponse>('/api/v1/admin/regions', regionData);
    return response.data;
  },
  
  updateRegion: async (id: string, regionData: RegionRequest): Promise<RegionResponse> => {
    const response = await api.put<RegionResponse>(`/api/v1/admin/regions/${id}`, regionData);
    return response.data;
  },
  
  deleteRegion: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/v1/admin/regions/${id}`);
    return response.data;
  }
};