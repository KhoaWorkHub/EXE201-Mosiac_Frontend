import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AddressService } from '@/services/address.service';
import { 
  AddressResponse, 
  AddressRequest, 
  ProvinceResponse, 
  DistrictResponse, 
  WardResponse 
} from '@/types/address.types';

interface AddressState {
  addresses: AddressResponse[];
  currentAddress: AddressResponse | null;
  provinces: ProvinceResponse[];
  districts: DistrictResponse[];
  wards: WardResponse[];
  loading: {
    addresses: boolean;
    provinces: boolean;
    districts: boolean;
    wards: boolean;
    createUpdate: boolean;
    delete: boolean;
  };
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  currentAddress: null,
  provinces: [],
  districts: [],
  wards: [],
  loading: {
    addresses: false,
    provinces: false,
    districts: false,
    wards: false,
    createUpdate: false,
    delete: false,
  },
  error: null,
};

// Async thunks for addresses
export const fetchUserAddresses = createAsyncThunk(
  'address/fetchUserAddresses',
  async (_, { rejectWithValue }) => {
    try {
      return await AddressService.getUserAddresses();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

export const fetchAddressById = createAsyncThunk(
  'address/fetchAddressById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await AddressService.getAddressById(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch address');
    }
  }
);

export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (request: AddressRequest, { rejectWithValue }) => {
    try {
      return await AddressService.createAddress(request);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ id, request }: { id: string; request: AddressRequest }, { rejectWithValue }) => {
    try {
      return await AddressService.updateAddress(id, request);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      await AddressService.deleteAddress(id);
      return id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      return await AddressService.setDefaultAddress(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default address');
    }
  }
);

// Async thunks for locations
export const fetchProvinces = createAsyncThunk(
  'address/fetchProvinces',
  async (_, { rejectWithValue }) => {
    try {
      return await AddressService.getAllProvinces();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch provinces');
    }
  }
);

export const fetchDistricts = createAsyncThunk(
  'address/fetchDistricts',
  async (provinceCode: string, { rejectWithValue }) => {
    try {
      return await AddressService.getDistrictsByProvince(provinceCode);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch districts');
    }
  }
);

export const fetchWards = createAsyncThunk(
  'address/fetchWards',
  async (districtCode: string, { rejectWithValue }) => {
    try {
      return await AddressService.getWardsByDistrict(districtCode);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wards');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearCurrentAddress: (state) => {
      state.currentAddress = null;
    },
    clearLocationData: (state) => {
      state.districts = [];
      state.wards = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading.addresses = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action: PayloadAction<AddressResponse[]>) => {
        state.loading.addresses = false;
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading.addresses = false;
        state.error = action.payload as string;
      })

      // Fetch address by ID
      .addCase(fetchAddressById.pending, (state) => {
        state.loading.addresses = true;
        state.error = null;
      })
      .addCase(fetchAddressById.fulfilled, (state, action: PayloadAction<AddressResponse>) => {
        state.loading.addresses = false;
        state.currentAddress = action.payload;
      })
      .addCase(fetchAddressById.rejected, (state, action) => {
        state.loading.addresses = false;
        state.error = action.payload as string;
      })

      // Create address
      .addCase(createAddress.pending, (state) => {
        state.loading.createUpdate = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action: PayloadAction<AddressResponse>) => {
        state.loading.createUpdate = false;
        state.addresses.push(action.payload);
        if (action.payload.isDefault) {
          // If the new address is default, update other addresses
          state.addresses.forEach(address => {
            if (address.id !== action.payload.id) {
              address.isDefault = false;
            }
          });
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading.createUpdate = false;
        state.error = action.payload as string;
      })

      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.loading.createUpdate = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<AddressResponse>) => {
        state.loading.createUpdate = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        if (action.payload.isDefault) {
          // If this address is set as default, update other addresses
          state.addresses.forEach(address => {
            if (address.id !== action.payload.id) {
              address.isDefault = false;
            }
          });
        }
        state.currentAddress = action.payload;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading.createUpdate = false;
        state.error = action.payload as string;
      })

      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading.delete = false;
        state.addresses = state.addresses.filter(address => address.id !== action.payload);
        if (state.currentAddress?.id === action.payload) {
          state.currentAddress = null;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload as string;
      })

      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading.createUpdate = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action: PayloadAction<AddressResponse>) => {
        state.loading.createUpdate = false;
        // Update all addresses - only one can be default
        state.addresses = state.addresses.map(address => ({
          ...address,
          isDefault: address.id === action.payload.id
        }));
        if (state.currentAddress?.id === action.payload.id) {
          state.currentAddress = action.payload;
        }
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading.createUpdate = false;
        state.error = action.payload as string;
      })

      // Fetch provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading.provinces = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action: PayloadAction<ProvinceResponse[]>) => {
        state.loading.provinces = false;
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading.provinces = false;
        state.error = action.payload as string;
      })

      // Fetch districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading.districts = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action: PayloadAction<DistrictResponse[]>) => {
        state.loading.districts = false;
        state.districts = action.payload;
        state.wards = []; // Clear wards when district changes
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading.districts = false;
        state.error = action.payload as string;
      })

      // Fetch wards
      .addCase(fetchWards.pending, (state) => {
        state.loading.wards = true;
        state.error = null;
      })
      .addCase(fetchWards.fulfilled, (state, action: PayloadAction<WardResponse[]>) => {
        state.loading.wards = false;
        state.wards = action.payload;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading.wards = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentAddress, clearLocationData } = addressSlice.actions;

export default addressSlice.reducer;