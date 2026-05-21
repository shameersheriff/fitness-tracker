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

export async function getDataStrict<TData>(url: string): Promise<TData> {
  const response = await apiClient.get<ApiSuccess<TData> | PaginatedApiSuccess<TData>>(url);
  return response.data.data as TData;
}

export async function sendDataStrict<TInput, TOutput>(
  url: string,
  input: TInput,
  method: 'post' | 'put' | 'patch' = 'post',
): Promise<TOutput> {
  const response = await apiClient[method]<ApiSuccess<TOutput>>(url, input);
  return response.data.data;
}

export async function deleteData(url: string): Promise<boolean> {
  await apiClient.delete(url);
  return true;
}

export async function deleteDataStrict<TData>(url: string): Promise<TData> {
  const response = await apiClient.delete<ApiSuccess<TData>>(url);
  return response.data.data;
}
