import { cookies } from 'next/headers'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// Set a cookie
export async function setCookie(name: string, value: string, options?: Partial<ResponseCookie>): Promise<void> {
  try {
    const cookiesList = await cookies()
    
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
export async function getCookie(name: string): Promise<string | undefined> {
  try {
    const cookiesList = await cookies()
    return cookiesList.get(name)?.value
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error)
    return undefined
  }
}

// Delete a cookie
export async function deleteCookie(name: string, options?: { path?: string }): Promise<void> {
  try {
    const cookiesList = await cookies()
    
    cookiesList.delete({
      name,
      ...options
    })
  } catch (error) {
    console.error(`Error deleting cookie ${name}:`, error)
  }
} 