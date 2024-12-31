export interface ApiRequestParams {
  url: string;
  method: string;
  body?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string;
}
