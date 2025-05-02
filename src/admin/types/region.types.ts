export interface RegionRequest {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    active?: boolean;
    file?: File;
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

  export interface Region {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface RegionCardProps {
    region: Region;
    onEdit: (region: Region) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (region: Region) => void;
  }