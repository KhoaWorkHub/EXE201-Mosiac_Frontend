export interface ProductResponse {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    originalPrice: number;
    stockQuantity: number;
    sku: string;
    active: boolean;
    featured: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    region: {
      id: string;
      name: string;
      slug: string;
    };
    variants: ProductVariantResponse[];
    images: ProductImageResponse[];
    qrCode: {
      id: string;
      qrImageUrl: string;
      qrData: string;
      redirectUrl: string;
    } | null;
  }
  
  export interface ProductVariantResponse {
    id: string;
    name: string;
    size: string;
    color: string;
    priceAdjustment: number;
    stockQuantity: number;
    skuVariant: string;
    active: boolean;
  }
  
  export interface ProductImageResponse {
    id: string;
    imageUrl: string;
    altText: string;
    displayOrder: number;
    isPrimary: boolean;
  }
  
  export interface ProductQueryParams {
    keyword?: string;
    categoryId?: string;
    regionId?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    active?: boolean;
    page?: number;
    size?: number;
    sort?: string;
  }
  
  export type PageResponse<T> = {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };