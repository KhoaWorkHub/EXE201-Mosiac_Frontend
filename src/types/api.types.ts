export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  }