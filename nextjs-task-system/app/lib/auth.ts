import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Github],
  adapter: DrizzleAdapter(db),
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log(url, baseUrl);
      return `${baseUrl}/dashboard`;
    },
  },
});
