import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  
  // Redirect based on user role
  if (session?.user?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", process.env.AUTH_URL || "http://localhost:3000"));
  }
  
  // Default redirect to home page for all other roles
  return NextResponse.redirect(new URL("/", process.env.AUTH_URL || "http://localhost:3000"));
} 