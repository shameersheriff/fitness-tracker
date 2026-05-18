export interface ApiSuccess<TData> {
  success: true;
  message: string;
  data: TData;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors: ApiErrorDetail[];
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedApiSuccess<TData> extends ApiSuccess<TData[]> {
  meta: PaginationMeta;
}

export type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure;

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
