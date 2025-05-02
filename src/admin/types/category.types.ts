export interface CategoryResponse {
    children: [];
    id: string;
    name: string;
    slug: string;
    description?: string;
    parent?: CategoryResponse;
    imageUrl?: string;
    displayOrder?: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CategoryRequest {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    imageUrl?: string;
    displayOrder?: number;
    active: boolean;
    file?: File; 
  }