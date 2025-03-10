import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { middlewareConfig } from "./middleware.config";

// Initialize auth with the edge-compatible config
const { auth } = NextAuth(middlewareConfig);

export default auth(async function middleware(req: NextRequest) {
  const session = await auth();
  
  console.log("Middleware - Request path:", req.nextUrl.pathname);
  
  // If trying to access admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // If not logged in
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    // If logged in but not an admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

// Specify which routes the middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
}; 