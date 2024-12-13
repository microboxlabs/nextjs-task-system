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

  console.log(
    `API Response: ${response.status} ${response.statusText}`,
    result,
  );

  return result.data as T;
};

export const apiRequest = async <T>({
  url,
  method,
  body,
  headers = { "Content-Type": "application/json" },
  cache = "no-store",
}: ApiRequestParams): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const fullUrl = `${baseUrl}${url}`;

  console.log(`API Request: ${method} ${fullUrl}`, body);

  const response = await fetch(fullUrl, {
    method,
    headers,
    body:
      method === "GET" || method === "DELETE"
        ? undefined
        : JSON.stringify(body),
    cache,
  });

  return handleResponse<T>(response);
};
