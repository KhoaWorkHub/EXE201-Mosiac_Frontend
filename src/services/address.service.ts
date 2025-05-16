import api from './api';
import {
  AddressResponse,
  AddressRequest,
  ProvinceResponse,
  DistrictResponse,
  WardResponse
} from '@/types/address.types';

const ADDRESS_URL = '/api/v1/user/addresses';
const LOCATION_URL = '/api/v1';

export const AddressService = {
  /**
   * Get all provinces
   */
  getAllProvinces: async (): Promise<ProvinceResponse[]> => {
    try {
      const response = await api.get(`${LOCATION_URL}/provinces`);
      return response.data;
    } catch (error) {
      console.error('Error getting provinces:', error);
      throw error;
    }
  },

  /**
   * Get districts by province code
   */
  getDistrictsByProvince: async (provinceCode: string): Promise<DistrictResponse[]> => {
    try {
      const response = await api.get(
        `${LOCATION_URL}/provinces/${provinceCode}/districts`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting districts:', error);
      throw error;
    }
  },

  /**
   * Get wards by district code
   */
  getWardsByDistrict: async (districtCode: string): Promise<WardResponse[]> => {
    try {
      const response = await api.get(
        `${LOCATION_URL}/districts/${districtCode}/wards`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting wards:', error);
      throw error;
    }
  },

  /**
   * Get user addresses
   */
  getUserAddresses: async (): Promise<AddressResponse[]> => {
    try {
      const response = await api.get(ADDRESS_URL);
      return response.data;
    } catch (error) {
      console.error('Error getting user addresses:', error);
      throw error;
    }
  },

  /**
   * Get address by ID
   */
  getAddressById: async (id: string): Promise<AddressResponse> => {
    try {
      const response = await api.get(`${ADDRESS_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting address:', error);
      throw error;
    }
  },

  /**
   * Create a new address
   */
  createAddress: async (request: AddressRequest): Promise<AddressResponse> => {
    try {
      const response = await api.post(ADDRESS_URL, request);
      return response.data;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  /**
   * Update an address
   */
  updateAddress: async (id: string, request: AddressRequest): Promise<AddressResponse> => {
    try {
      const response = await api.put(`${ADDRESS_URL}/${id}`, request);
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  /**
   * Delete an address
   */
  deleteAddress: async (id: string): Promise<void> => {
    try {
      await api.delete(`${ADDRESS_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  /**
   * Set an address as default
   */
  setDefaultAddress: async (id: string): Promise<AddressResponse> => {
    try {
      const response = await api.put(`${ADDRESS_URL}/${id}/default`);
      return response.data;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }
};