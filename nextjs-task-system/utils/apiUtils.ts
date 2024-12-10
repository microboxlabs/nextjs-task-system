import { ApiRequestParams, ApiResponse } from "@/types/apiTypes";

export const handleResponse = async <T>(response: Response): Promise<T> => {
  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    const errorMessage = result.message
      ? JSON.stringify(result.message)
      : `Error ${response.status}: ${response.statusText}`;

    if (result.errors) {
      console.log("errors from api: ", result.errors);
    }

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
  console.log(`API Request: ${method} ${url}`, body); // Log the request

  const response = await fetch(url, {
    method,
    headers,
    body:
      method === "GET" || method === "DELETE"
        ? undefined
        : JSON.stringify(body),
  });

  return handleResponse<T>(response);
};
