import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useCredentialsStore } from "../stores/credentials-store";
import { API_ROUTES } from "../constants/api-routes";
import { AuthRefreshResponse } from "../models/auth/auth-refresh-response";
import { AuthRefreshRequest } from "../models/auth/auth-refresh-request";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_BACKEND_API_URL as string,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor for request (adds JWT)
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useCredentialsStore.getState().credentials?.accessToken;

    if (accessToken !== undefined) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false; // Tracks if a token refresh is in progress
let refreshSubscribers: ((token: string) => void)[] = []; // Queue for pending requests

// Function to notify all subscribers with the new token
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => {
    callback(token);
  });
  refreshSubscribers = [];
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Interceptor for response (attempts to refresh JWT if possible when geting unauthorized error)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (originalError: AxiosError) => {
    const originalConfig: CustomAxiosRequestConfig | undefined =
      originalError.config;

    if (
      originalError.response?.status === 401 &&
      originalConfig !== undefined &&
      !originalConfig._retry
    ) {
      if (isRefreshing) {
        // If a refresh is already in progress, wait for it to complete
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalConfig.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalConfig));
          });
        });
      }

      const storedCredentials = useCredentialsStore.getState().credentials;

      if (storedCredentials === null) {
        return Promise.reject(originalError);
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const request: AuthRefreshRequest = {
          tenantId: storedCredentials.tenantId,
          userId: storedCredentials.userId,
          refreshToken: storedCredentials.refreshToken,
        };

        const config: CustomAxiosRequestConfig = {
          ...originalConfig,
          params: undefined,
          _retry: true,
        };

        const response = await axiosInstance.post<AuthRefreshResponse>(
          API_ROUTES.AuthRefresh,
          request,
          config,
        );

        useCredentialsStore.setState({
          credentials: {
            ...storedCredentials,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
        });

        isRefreshing = false;
        onRefreshed(response.data.refreshToken);

        originalConfig.headers.Authorization = `Bearer ${response.data.accessToken}`;

        console.debug("Authentication (JWT) successfully refreshed");

        return await axiosInstance(originalConfig);
      } catch (newError) {
        console.debug("Authentication (JWT) failed to refresh");

        if (newError instanceof AxiosError) {
          if (useCredentialsStore.getState().credentials !== null) {
            console.debug(
              "Removing credentials in axios-setup retry due to refresh failure",
            );
            useCredentialsStore.getState().removeCredentials();
          }
        }

        isRefreshing = false;
        refreshSubscribers = [];

        // Must return the original error, because other error codes might leak through react query
        return Promise.reject(originalError);
      }
    }

    return Promise.reject(originalError);
  },
);

export default axiosInstance;
