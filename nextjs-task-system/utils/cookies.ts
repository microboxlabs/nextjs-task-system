// utils/cookies.ts
import { parse, serialize } from "cookie";

export const getCookieValue = <T>(name: string): T | null => {
  const cookies = parse(document.cookie || "");
  const rawValue = cookies[name];
  return rawValue ? JSON.parse(rawValue) : null;
};

export const setCookieValue = (name: string, value: unknown): void => {
  document.cookie = serialize(name, JSON.stringify(value), {
    path: "/",
    httpOnly: false,
    secure: true,
    sameSite: "strict",
  });
};

export const removeCookieValue = (name: string): void => {
  document.cookie = serialize(name, "", {
    path: "/",
    maxAge: 0,
  });
};
