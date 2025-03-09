import { cookies } from 'next/headers'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// Set a cookie
export function setCookie(name: string, value: string, options?: Partial<ResponseCookie>): void {
  try {
    const cookiesList = cookies()
    
    cookiesList.set({
      name,
      value,
      ...options
    })
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error)
  }
}

// Get a cookie value
export function getCookie(name: string): string | undefined {
  try {
    const cookiesList = cookies()
    return cookiesList.get(name)?.value
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error)
    return undefined
  }
}

// Delete a cookie
export function deleteCookie(name: string, options?: { path?: string }): void {
  try {
    const cookiesList = cookies()
    
    cookiesList.delete({
      name,
      ...options
    })
  } catch (error) {
    console.error(`Error deleting cookie ${name}:`, error)
  }
} 