export interface QRCodeRequest {
    redirectUrl: string;
    active: boolean;
  }
  
  export interface QRCodeResponse {
    id: string;
    qrImageUrl: string;
    qrData: string;
    redirectUrl: string;
    active?: boolean;
    scanCount?: number;
  }
  
  export interface QRScanRequest {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  }
  
  export interface QRScanResponse {
    id: string;
    qrCodeId: string;
    scanDate: string;
    ipAddress?: string;
    userAgent?: string;
    geoLocation?: string;
  }
  
  export interface QRCodeStatistics {
    totalScans: number;
    uniqueVisitors: number;
    conversionRate: number;
    scansByDevice: Record<string, number>;
    scansByLocation: Record<string, number>;
    scansByTime: Record<string, number>;
  }