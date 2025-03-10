import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/admin/dashboard';
  
  // Check if user is authenticated and has admin role
  if (!session || !session.user) {
    // Not logged in, redirect to login
    return NextResponse.json({ 
      redirect: '/auth/login',
      authenticated: false,
      isAdmin: false
    });
  }
  
  if (session.user.role !== 'ADMIN') {
    // Logged in but not admin
    return NextResponse.json({ 
      redirect: '/',
      authenticated: true,
      isAdmin: false,
      role: session.user.role
    });
  }
  
  // User is admin, allow access
  return NextResponse.json({ 
    redirect: redirectTo,
    authenticated: true,
    isAdmin: true,
    role: session.user.role
  });
} 