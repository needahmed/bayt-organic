import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { headers } from 'next/headers'

// This tells Next.js this is a dynamic route that should be rendered at request time
export const dynamic = 'force-dynamic'

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const session = await auth()
    
    // If not authenticated, redirect to login
    if (!session || !session.user) {
      redirect('/auth/login')
    }
    
    return (
      <div>
        {children}
      </div>
    )
  } catch (error) {
    console.error("Error in profile layout:", error)
    // If there's an error with authentication, redirect to login
    redirect('/auth/login')
  }
} 