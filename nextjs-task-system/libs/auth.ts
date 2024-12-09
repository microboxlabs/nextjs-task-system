import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/libs/prisma"
import bcrypt from 'bcrypt';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/sign-in"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmithQ" },
                password: { label: "Password", type: "password", placeholder: "******" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })

                if (!userFound) throw new Error('No user found');

                const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

                if (!matchPassword) throw new Error('Wrong password');


                return {
                    id: `${userFound.id}`,
                    name: userFound.name,
                    email: userFound.email,
                    isAdmin: userFound.isAdmin
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    email: user.email,
                    isAdmin: user.isAdmin,
                }
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    email: token.email,
                    isAdmin: token.isAdmin,
                }
                
            }
            
        },
    },
}