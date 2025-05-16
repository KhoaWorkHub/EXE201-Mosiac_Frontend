import api from './api';
import { UserDto } from '@/types/auth.types';
import { UserProfileRequest } from '@/types/profile.types';

const USER_URL = '/api/v1/user/profile';

export const UserService = {
  /**
   * Get current user profile
   */
  getUserProfile: async (): Promise<UserDto> => {
    try {
      const response = await api.get<UserDto>(USER_URL);
      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (request: UserProfileRequest): Promise<UserDto> => {
    try {
      const response = await api.put<UserDto>(USER_URL, request);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};