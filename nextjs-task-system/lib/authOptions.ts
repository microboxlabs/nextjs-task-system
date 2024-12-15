import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "./auth";

export const MY_NEXT_SECRET = "my-jwt-secret";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await authenticateUser(
            credentials?.email || "",
            credentials?.password || "",
          );
          if (user) {
            return user as any;
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom login page
  },
  session: {
    strategy: "jwt", // to manage session
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || MY_NEXT_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        //@ts-ignore
        session.user.role = token.role; // add role to session
        //@ts-ignore
        session.user.id = parseInt(token.sub); // add id
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        //@ts-ignore
        token.role = user.role; // add role to token
      }
      return token;
    },
  },
};
