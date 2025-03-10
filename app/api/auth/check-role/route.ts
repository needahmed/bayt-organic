import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  return NextResponse.json({
    isAuthenticated: !!session,
    user: session?.user || null,
    isAdmin: session?.user?.role === 'ADMIN',
    sessionDetails: session || null,
  });
} 