import { User } from "@prisma/client/wasm";
import { JWTPayload } from "jose";

export function verifyToken(payload: JWTPayload) {
  const { exp } = payload;
  if (exp === undefined) {
    throw new Error();
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime > exp) {
    throw new Error("EXPIRED-TOKEN");
  }
}
