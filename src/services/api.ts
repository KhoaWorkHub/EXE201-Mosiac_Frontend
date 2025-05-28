import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { StorageService } from "./storage.service";

const API_URL = import.meta.env.VITE_API_URL || "/";
const TIMEOUT = 30000;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
});

api.interceptors.request.use(
  (config) => {
    const token = StorageService.getItem<string>("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Chỉ đặt Content-Type khi không phải FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
      config.headers.Accept = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        if (res.status === 200) {
          localStorage.setItem("access_token", res.data.accessToken);
          localStorage.setItem("refresh_token", res.data.refreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
