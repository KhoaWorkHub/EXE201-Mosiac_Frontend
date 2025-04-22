export interface RegionRequest {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    active?: boolean;
  }
  
  export interface RegionResponse {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }