'use client'

import { useEffect, useState } from 'react'

export default function AzureInitializer() {
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on the client side
    const initializeAzureStorage = async () => {
      try {
        const response = await fetch('/api/azure-init', { 
          cache: 'no-store',
          method: 'GET'
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Azure Storage initialization:', data.message)
          setInitialized(true)
        } else {
          console.error('Failed to initialize Azure Storage:', response.statusText)
          setError(`Failed to initialize Azure Storage: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Failed to initialize Azure Storage:', error)
        setError(`Failed to initialize Azure Storage: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    // Call the initialization function
    initializeAzureStorage()
  }, [])

  // This component doesn't render anything visible
  return null
} 