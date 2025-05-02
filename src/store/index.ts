import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from '../admin/store/slices/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;