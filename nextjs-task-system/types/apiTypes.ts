export interface ApiRequestParams {
  url: string;
  method: string;
  body?: any;
  headers?: HeadersInit;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
