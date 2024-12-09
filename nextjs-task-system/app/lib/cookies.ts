import { cookies } from "next/headers";

export function setAuthCookie(token: string) {
  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export function getAuthCookie() {
  return cookies().get("auth_token");
}

export function removeAuthCookie() {
  cookies().delete("auth_token");
}
