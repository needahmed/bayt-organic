import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// This is a simplified config for middleware only - edge compatible
export const middlewareConfig: NextAuthConfig = {
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
      async authorize() {
        return null; // The actual authorization happens in the main auth.ts
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // We need these minimal callbacks to ensure the role is available in middleware
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (token && token.role) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET
}; 