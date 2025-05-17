import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import categoryReducer from '../admin/store/slices/categorySlice';
import userProfileReducer from './slices/userProfileSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from '../admin/store/slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    userProfile: userProfileReducer,
    address: addressReducer,
    orders: orderReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;