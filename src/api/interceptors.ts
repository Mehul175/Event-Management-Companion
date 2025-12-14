/**
 * Purpose: Request/response interceptors for authentication and error handling.
 * Author: EventCompanion Team
 * Responsibility: Attach auth token and normalize API errors.
 */

import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

type TokenProvider = () => string | null;
type UnauthorizedHandler = () => void;

let tokenProvider: TokenProvider = () => null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setTokenProvider = (provider: TokenProvider) => {
  tokenProvider = provider;
};

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler;
};

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = tokenProvider?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const normalizeError = (error: AxiosError): ApiError => {
  const status = error.response?.status ?? 500;
  const message =
    (error.response?.data as any)?.message ||
    error.message ||
    'Something went wrong. Please try again.';

  return {
    status,
    message,
    details: error.response?.data,
  };
};

const onResponseError = (error: AxiosError) => {
  const apiError = normalizeError(error);
  if (apiError.status === 401 && unauthorizedHandler) {
    unauthorizedHandler();
  }
  return Promise.reject(apiError);
};

export const applyInterceptors = (axiosInstance: AxiosInstance) => {
  console.log('applyInterceptors', axiosInstance);
  
  axiosInstance.interceptors.request.use(onRequest, (error) => Promise.reject(error));
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => onResponseError(error),
  );
};
