import { NextRequest } from 'next/server';

/**
 * Mocks a NextRequest object for testing Next.js API routes.
 * @param body - The JSON body of the request.
 * @param options - Additional options to customize the mock request.
 * @returns A mocked NextRequest object.
 */
export const mockNextRequest = (
  body: any,
  options: {
    method?: string;
    headers?: Record<string, string>;
    url?: string;
  } = {}
): NextRequest => {
  const { method = 'POST', headers = {}, url = 'http://localhost:3000/api' } = options;

  const mockHeaders = new Headers(headers);

  return {
    json: async () => body,
    method,
    headers: mockHeaders,
    url,
  } as unknown as NextRequest;
};
