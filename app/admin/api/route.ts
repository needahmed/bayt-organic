import { NextResponse } from 'next/server';

// This file is needed to ensure Next.js recognizes this as a route group
export const dynamic = 'force-dynamic';

// Add HTTP methods to make this a valid route handler
export async function GET() {
  return NextResponse.json({ message: 'Admin API route' });
}

export async function POST() {
  return NextResponse.json({ message: 'POST method not implemented' }, { status: 405 });
} 