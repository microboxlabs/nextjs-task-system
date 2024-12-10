export interface ApiRequestParams {
  url: string;
  method: string;
  body?: any;
  headers?: HeadersInit;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string;
}
