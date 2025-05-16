export interface AddressResponse {
    id: string;
    recipientName: string;
    phone: string;
    province: ProvinceResponse;
    district: DistrictResponse;
    ward: WardResponse;
    streetAddress: string;
    isDefault: boolean;
  }
  
  export interface AddressRequest {
    recipientName: string;
    phone: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    streetAddress: string;
    isDefault?: boolean;
  }
  
  export interface ProvinceResponse {
    code: string;
    name: string;
    nameEn: string;
    fullName: string;
    fullNameEn: string;
  }
  
  export interface DistrictResponse {
    code: string;
    name: string;
    nameEn: string;
    fullName: string;
    fullNameEn: string;
    provinceCode: string;
  }
  
  export interface WardResponse {
    code: string;
    name: string;
    nameEn: string;
    fullName: string;
    fullNameEn: string;
    districtCode: string;
  }