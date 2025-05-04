export interface ProductRequest {
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    price: number;
    originalPrice?: number;
    stockQuantity?: number;
    sku?: string;
    categoryId: string; // UUID
    regionId?: string; // UUID
    active?: boolean;
    featured?: boolean;
  }
  
  export interface ProductVariantRequest {
    size: string;
    color?: string;
    priceAdjustment?: number;
    stockQuantity?: number;
    skuVariant?: string;
    active?: boolean;
  }
  
  export interface ProductResponse {
    id: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    price: number;
    originalPrice?: number;
    stockQuantity?: number;
    sku?: string;
    active: boolean;
    featured: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    region?: {
      id: string;
      name: string;
      slug: string;
    };
    variants: ProductVariantResponse[];
    images: ProductImageResponse[];
    qrCode?: {
      id: string;
      qrImageUrl: string;
      qrData: string;
      redirectUrl: string;
    };
  }
  
  export interface ProductVariantResponse {
    id: string;
    size: string;
    color?: string;
    priceAdjustment: number;
    stockQuantity?: number;
    skuVariant?: string;
    active: boolean;
  }
  
  export interface ProductImageResponse {
    id: string;
    imageUrl: string;
    altText?: string;
    displayOrder?: number;
    isPrimary: boolean;
  }