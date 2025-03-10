"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AdminAccess({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    // Check if user has admin role
    const userRole = session?.user?.role
    if (userRole !== 'ADMIN') {
      router.push('/')
      return
    }

    setIsAuthorized(true)
  }, [session, status, router])

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Checking authorization...</h1>
          <p className="mt-2 text-gray-600">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 