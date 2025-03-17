import { redirect } from 'next/navigation'
import { auth } from '@/auth'

// This tells Next.js this is a dynamic route that should be rendered at request time
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
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
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    )
  } catch (error) {
    console.error("Error in dashboard layout:", error)
    // If there's an error with authentication, redirect to login
    redirect('/auth/login')
  }
} 