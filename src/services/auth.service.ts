import api from './api';
import { StorageService } from './storage.service';
import { AuthenticationRequest, AuthenticationResponse, UserDto, UserRole } from '@/types/auth.types';

const AUTH_URL = '/auth';

export const AuthService = {

  login: async (credentials: AuthenticationRequest): Promise<AuthenticationResponse> => {
    try {
      const response = await api.post<AuthenticationResponse>(`${AUTH_URL}/login`, credentials);
      AuthService.saveTokens(response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  googleLogin: (): void => {
    window.location.href = 'http://ec2-54-255-244-196.ap-southeast-1.compute.amazonaws.com/login/oauth2/code/google';
    //window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  },
  
  logout: (): void => {
    StorageService.removeItem('access_token');
    StorageService.removeItem('refresh_token');
    StorageService.removeItem('user');
  },
  
  getCurrentUser: (): UserDto | null => {
    try {
      return StorageService.getItem<UserDto>('user');
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  isLoggedIn: (): boolean => {
    return !!StorageService.getItem<string>('access_token');
  },
  
  saveTokens: (data: AuthenticationResponse): void => {
    StorageService.setItem('access_token', data.accessToken);
    StorageService.setItem('refresh_token', data.refreshToken);
    StorageService.setItem('user', data.user);
  },
  
  refreshToken: async (): Promise<AuthenticationResponse> => {
    try {
      const refreshToken = StorageService.getItem<string>('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post<AuthenticationResponse>(`${AUTH_URL}/refresh`, { refreshToken });
      AuthService.saveTokens(response.data);
      return response.data;
    } catch (error) {
      AuthService.logout();
      throw error;
    }
  },
  
  handleOAuth2Redirect: (urlParams: URLSearchParams): AuthenticationResponse | null => {
    try {
      const token = urlParams.get('token');
      const refreshToken = urlParams.get('refreshToken');
      
      if (!token || !refreshToken) {
        return null;
      }
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const authResponse: AuthenticationResponse = {
        accessToken: token,
        refreshToken: refreshToken,
        user: {
          id: payload.id || payload.sub,
          email: payload.email,
          fullName: payload.fullName || payload.name || 'User',
          role: (payload.role || payload.authorities || payload.roles || payload.authority) as UserRole,
        }
      };
      
      AuthService.saveTokens(authResponse);
      return authResponse;
    } catch (error) {
      console.error('Error handling OAuth redirect:', error);
      return null;
    }
  },
  

  getToken: (): string | null => {
    return StorageService.getItem<string>('access_token');
  },
  

  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  },
  

  hasRole: (requiredRole: UserRole): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === requiredRole;
  }
};