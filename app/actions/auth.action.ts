'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

// Types for auth operations
export type SignUpFormData = {
  name: string
  email: string
  password: string
}

export type SignInFormData = {
  email: string
  password: string
}

// Generate a secure token
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// Sign up a new user
export async function signUp(data: SignUpFormData) {
  try {
    // Check if the email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      return { success: false, error: 'Email is already in use' }
    }
    
    // Hash the password
    const hashedPassword = hashPassword(data.password)
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      }
    })
    
    // In a real application, you would set cookies here
    // For now, we'll just return the user data
    
    revalidatePath('/')
    
    return { 
      success: true, 
      data: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        token: generateToken() // This would normally be stored in a cookie
      } 
    }
  } catch (error) {
    console.error('Error signing up:', error)
    return { success: false, error: 'Failed to sign up' }
  }
}

// Sign in a user
export async function signIn(data: SignInFormData) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    // Verify the password
    const isPasswordValid = user.password ? verifyPassword(data.password, user.password) : false
    
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    // In a real application, you would set cookies here
    // For now, we'll just return the user data
    
    revalidatePath('/')
    
    return { 
      success: true, 
      data: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        token: generateToken() // This would normally be stored in a cookie
      } 
    }
  } catch (error) {
    console.error('Error signing in:', error)
    return { success: false, error: 'Failed to sign in' }
  }
}

// Sign out a user
export async function signOut() {
  try {
    // In a real application, you would clear cookies here
    
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false, error: 'Failed to sign out' }
  }
}

// Update user profile
export async function updateProfile(userId: string, name: string, email: string) {
  try {
    // In a real application, you would check if the user is authorized
    // For now, we'll just proceed with the update
    
    // Check if the email is already in use by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      })
      
      if (existingUser) {
        return { success: false, error: 'Email is already in use' }
      }
    }
    
    // Update the user
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        email: email || undefined,
      }
    })
    
    revalidatePath('/profile')
    
    return { success: true, data: { id: user.id, name: user.name, email: user.email } }
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error)
    return { success: false, error: 'Failed to update profile' }
  }
}

// Change password
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // In a real application, you would check if the user is authorized
    // For now, we'll just proceed with the password change
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }
    
    // Verify the current password
    const isPasswordValid = user.password ? verifyPassword(currentPassword, user.password) : false
    
    if (!isPasswordValid) {
      return { success: false, error: 'Current password is incorrect' }
    }
    
    // Hash the new password
    const hashedPassword = hashPassword(newPassword)
    
    // Update the password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error(`Error changing password for user ${userId}:`, error)
    return { success: false, error: 'Failed to change password' }
  }
} 