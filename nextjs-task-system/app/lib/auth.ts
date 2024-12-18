import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";
import { NextResponse } from "next/server";
import { config } from "./utils";
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Github({
      authorization: {
        params: {
          redirect_uri: config.redirectURI,
        },
      },
    }),
  ],
  adapter: DrizzleAdapter(db),

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});

export function unauthorized() {
  return NextResponse.json(
    {
      error: "Authentication required",
      message: "You must be logged in to access this resource",
    },
    { status: 401 },
  );
}
