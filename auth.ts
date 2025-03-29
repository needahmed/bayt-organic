import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import { comparePassword } from "./lib/server/auth-utils";
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

          // Compare the provided password with the stored hash using the server-only utility
          const passwordMatch = await comparePassword(
            credentials.password as string, 
            user.password
          );

          if (!passwordMatch) {
            return null;
          }
          
          // Check if email is verified (only for credential-based logins)
          if (!user.emailVerified) {
            throw new Error("Email not verified. Please check your inbox to verify your email address.");
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
          throw error; // Forward the error to the client
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      console.log("Session callback - Token:", token);
      console.log("Session callback - User:", user);
      
      // If using JWT strategy
      if (token) {
        console.log("Session callback - Token role:", token.role);
        session.user.id = token.sub as string;
        session.user.role = token.role;
        console.log("Session callback - Updated session with JWT data:", session);
      } 
      // If using database strategy
      else if (user) {
        console.log("Session callback - User role:", (user as unknown as User).role);
        session.user.id = user.id;
        session.user.role = (user as unknown as User).role;
        console.log("Session callback - Updated session with DB data:", session);
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user data to the token when they sign in
      if (user) {
        console.log("JWT callback - User data:", user);
        console.log("JWT callback - User role:", user.role);
        token.role = user.role;
        console.log("JWT callback - Updated token:", token);
      } else {
        console.log("JWT callback - Existing token:", token);
      }
      return token;
    },
    // Add a signIn callback to ensure Google users get a role
    async signIn({ user, account, profile }) {
      console.log("SignIn callback - Provider:", account?.provider);
      console.log("SignIn callback - User:", user);
      
      if (account?.provider === "google") {
        // Check if the user already exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        console.log("SignIn callback - Existing user:", existingUser);

        // If the user doesn't exist, create a new one with CUSTOMER role
        if (!existingUser && user.email) {
          try {
            const newUser = await prisma.user.create({
              data: {
                name: user.name as string,
                email: user.email,
                image: user.image,
                role: "CUSTOMER", // Default role for Google sign-ins
              },
            });
            console.log("SignIn callback - Created new user:", newUser);
          } catch (error) {
            console.error("Error creating user:", error);
            // Continue with sign in even if user creation fails
          }
        } else if (existingUser) {
          // If user exists, ensure the role is passed to the token
          user.role = existingUser.role;
          console.log("SignIn callback - Updated user role:", user.role);
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login", // Use your existing login page
  },
  session: {
    strategy: "jwt", // Using JWT for credentials provider
  },
}); 