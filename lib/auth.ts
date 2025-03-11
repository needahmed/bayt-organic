import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { User } from '@prisma/client'
import crypto from 'crypto'

// Simple token-based authentication for demo purposes
// In a production app, you would use a proper authentication system like NextAuth.js

// Generate a secure token
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// Hash a password
export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Verify a password
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  return hash === hashedPassword
}

// Set a session cookie
export const setSessionCookie = async (userId: string): Promise<void> => {
  const token = generateToken()
  
  // Store the token in the database (in a real app, you'd have a sessions table)
  // For now, we'll just set the cookie
  
  // Note: This function can only be used in server components or server actions
  try {
    // Get the cookie store
    const cookiesList = await cookies()
    
    // Set session token
    cookiesList.set({
      name: 'session_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    
    // Set user ID
    cookiesList.set({
      name: 'user_id',
      value: userId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
  } catch (error) {
    console.error('Error setting session cookie:', error)
  }
}

// Clear the session cookie
export const clearSessionCookie = async (): Promise<void> => {
  // Note: This function can only be used in server components or server actions
  try {
    const cookiesList = await cookies()
    
    cookiesList.delete({
      name: 'session_token',
      path: '/',
    })
    
    cookiesList.delete({
      name: 'user_id',
      path: '/',
    })
  } catch (error) {
    console.error('Error clearing session cookie:', error)
  }
}

// Get the current user
export async function getCurrentUser(): Promise<User | null> {
  // Note: This function can only be used in server components or server actions
  try {
    const cookiesList = await cookies()
    const userId = cookiesList.get('user_id')?.value
    
    if (!userId) {
      return null
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Check if the user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

// Check if the user is an admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
} 