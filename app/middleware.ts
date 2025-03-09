import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/login' || 
                      path === '/auth/signup' || 
                      path === '/auth/error' ||
                      path === '/' ||
                      path.startsWith('/api/auth') ||
                      path.startsWith('/_next') ||
                      path.startsWith('/images') ||
                      path.includes('.')
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and trying to access login/signup page, redirect to dashboard
    if (path === '/auth/login' || path === '/auth/signup') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // For other public paths, allow access
    return NextResponse.next()
  }
  
  // If user is not logged in and trying to access a protected route
  if (!isPublicPath && !token) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(url)
  }
  
  // Admin route protection
  if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 