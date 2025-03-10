'use server'

import { prisma } from '@/lib/prisma'
import { auth, signOut } from '@/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Get the current user's profile data
export async function getUserProfile() {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Get the user with all fields
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })
    
    if (!user) {
      console.error('User not found in database:', session.user.id)
      return { 
        success: true, 
        data: {
          id: session.user.id,
          name: session.user.name || '',
          email: session.user.email || '',
          image: session.user.image || '',
          role: session.user.role || 'CUSTOMER',
          phone: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        }
      }
    }
    
    return { 
      success: true, 
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image || '',
        role: user.role,
        // Convert null values to empty strings
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
      }
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { success: false, error: 'Failed to get user profile' }
  }
}

// Update the current user's profile
export async function updateUserProfile(formData: FormData) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Extract form data
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const postalCode = formData.get('postalCode') as string
    const country = formData.get('country') as string
    
    // Combine first and last name
    const name = `${firstName} ${lastName}`.trim()
    
    // Update all fields
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
      }
    })
    
    revalidatePath('/profile')
    
    return { 
      success: true, 
      data: user
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

// Handle user logout
export async function handleLogout() {
  await signOut({ redirectTo: '/' })
} 