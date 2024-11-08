import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useUserCredentialsStore } from "../stores/user-credentials-store";
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
    const accessToken =
      useUserCredentialsStore.getState().userCredentials?.accessToken;

    if (accessToken !== undefined) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  },
);

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
      const storedUserCredentials =
        useUserCredentialsStore.getState().userCredentials;

      if (storedUserCredentials === null) {
        return Promise.reject(originalError);
      }

      originalConfig._retry = true;

      try {
        const request: AuthRefreshRequest = {
          tenantId: storedUserCredentials.tenantId,
          userId: storedUserCredentials.userId,
          refreshToken: storedUserCredentials.refreshToken,
        };

        const config: CustomAxiosRequestConfig = {
          ...originalConfig,
          _retry: true,
        };

        const response = await axiosInstance.post<AuthRefreshResponse>(
          API_ROUTES.AuthRefresh,
          request,
          config,
        );

        useUserCredentialsStore.setState({
          userCredentials: {
            ...storedUserCredentials,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
        });

        originalConfig.headers.Authorization = `Bearer ${response.data.accessToken}`;

        console.debug("Authentication (JWT) successfully refreshed");

        return await axiosInstance(originalConfig);
      } catch (newError) {
        if (newError instanceof AxiosError) {
          useUserCredentialsStore.getState().removeCredentials();
        }

        console.debug("Authentication (JWT) failed to refresh");

        // Must return the original error, because other error codes might leak through react query
        // TODO: attempt redirection to login?
        return Promise.reject(originalError);
      }
    }

    return Promise.reject(originalError);
  },
);

export default axiosInstance;
