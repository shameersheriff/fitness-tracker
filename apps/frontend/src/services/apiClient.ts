import axios from 'axios';

import type { ApiSuccess, PaginatedApiSuccess } from '@fitness-tracker/shared-types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'The request could not be completed.';
    return Promise.reject(new Error(message));
  },
);

export async function getData<TData>(url: string, fallback: TData): Promise<TData> {
  try {
    const response = await apiClient.get<ApiSuccess<TData> | PaginatedApiSuccess<TData>>(url);
    return response.data.data as TData;
  } catch {
    return fallback;
  }
}

export async function sendData<TInput, TOutput>(
  url: string,
  input: TInput,
  fallback: TOutput,
  method: 'post' | 'put' | 'patch' = 'post',
): Promise<TOutput> {
  try {
    const response = await apiClient[method]<ApiSuccess<TOutput>>(url, input);
    return response.data.data;
  } catch {
    return fallback;
  }
}
