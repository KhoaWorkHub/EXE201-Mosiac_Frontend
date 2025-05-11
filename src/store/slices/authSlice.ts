import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/services/auth.service';
import { AuthenticationRequest, AuthenticationResponse, UserDto } from '@/types/auth.types';
import { CartService } from '@/services/cart.service';
import { StorageService } from '@/services/storage.service';

interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: AuthService.getCurrentUser(),
  isAuthenticated: !!AuthService.getCurrentUser(),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: AuthenticationRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      AuthService.saveTokens(response);
      
      // After successful login, check if there's a guest cart to merge
      const guestId = StorageService.getItem<string>('guest_id');
      if (guestId) {
        try {
          // Attempt to merge the guest cart
          await CartService.mergeGuestCart();
        } catch (mergeError) {
          console.error('Error merging carts:', mergeError);
          // Continue even if merge fails - the user is still logged in
        }
      }
      
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    AuthService.logout();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthenticationResponse>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, clearCredentials, setError, clearError } = authSlice.actions;

export default authSlice.reducer;