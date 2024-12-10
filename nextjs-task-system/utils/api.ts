import { ApiRequestParams, ApiResponse } from "@/types/apiTypes";

export const handleResponse = async <T>(response: Response): Promise<T> => {
  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    const errorMessage = result.error
      ? JSON.stringify(result.error)
      : `Error ${response.status}: ${response.statusText}`;

    throw new Error(errorMessage);
  }

  return result.data as T;
};

export const apiRequest = async <T>({
  url,
  method,
  body,
  headers = { "Content-Type": "application/json" },
}: ApiRequestParams): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
};
