export interface UserDto {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
  }
  
  export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    STAFF = 'STAFF'
  }
  
  export interface AuthenticationRequest {
    email: string;
    password: string;
  }
  
  export interface AuthenticationResponse {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
  }