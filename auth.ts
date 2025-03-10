import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

// Extend the default session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }

  interface User {
    role?: string;
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find the user in the database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });

          // If user doesn't exist or password doesn't match
          if (!user || !user.password) {
            return null;
          }

          // Compare the provided password with the stored hash
          const passwordMatch = await bcrypt.compare(
            credentials.password as string, 
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          // Return the user object (without the password)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // If using JWT strategy
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
      } 
      // If using database strategy
      else if (user) {
        session.user.id = user.id;
        session.user.role = (user as unknown as User).role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user data to the token when they sign in
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: "/auth/login", // Use your existing login page
  },
  session: {
    strategy: "jwt", // Using JWT for credentials provider
  },
}); 