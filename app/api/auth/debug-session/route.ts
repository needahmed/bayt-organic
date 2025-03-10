import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()
    
    return NextResponse.json({
      authenticated: !!session,
      session: session || null,
      user: session?.user || null,
    })
  } catch (error) {
    console.error('Error in debug-session API:', error)
    return NextResponse.json({
      error: 'Failed to get session',
      errorMessage: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
} 