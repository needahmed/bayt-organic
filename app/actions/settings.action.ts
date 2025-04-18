'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// Define the types for store settings
type StoreSettings = {
  storeName: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  timezone: string
  orderPrefix: string
}

// Define the types for email settings
type EmailSettings = {
  senderName: string
  senderEmail: string
  enableOrderConfirmation: boolean
  enableShippingConfirmation: boolean
  enableAbandonedCart: boolean
}

// Get the store settings
export async function getStoreSettings() {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Not authorized' }
    }
    
    // In a real implementation you would fetch this from a settings table
    // For now, we'll return defaults
    
    return { 
      success: true, 
      data: {
        storeName: "Bayt Organic",
        storeEmail: "info@baytorganic.com",
        storePhone: "+92 300 1234567",
        storeAddress: "123 Green Street, Clifton, Karachi, 75600, Pakistan",
        currency: "PKR",
        timezone: "Asia/Karachi",
        orderPrefix: "BO-",
      }
    }
  } catch (error) {
    console.error('Error getting store settings:', error)
    return { success: false, error: 'Failed to get store settings' }
  }
}

// Get email settings
export async function getEmailSettings() {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Not authorized' }
    }
    
    // In a real implementation you would fetch this from a settings table
    // For now, we'll return defaults
    
    return { 
      success: true, 
      data: {
        senderName: "Bayt Organic",
        senderEmail: "noreply@baytorganic.com",
        enableOrderConfirmation: true,
        enableShippingConfirmation: true,
        enableAbandonedCart: false,
      }
    }
  } catch (error) {
    console.error('Error getting email settings:', error)
    return { success: false, error: 'Failed to get email settings' }
  }
}

// Save store settings
export async function saveStoreSettings(settings: StoreSettings) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Not authorized' }
    }
    
    // In a real implementation, you would save to a settings table
    // For demo purposes, we'll just log the settings
    console.log('Saving store settings:', settings)
    
    revalidatePath('/admin/settings')
    
    return { success: true }
  } catch (error) {
    console.error('Error saving store settings:', error)
    return { success: false, error: 'Failed to save store settings' }
  }
}

// Save email settings
export async function saveEmailSettings(settings: EmailSettings) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Not authorized' }
    }
    
    // In a real implementation, you would save to a settings table
    // For demo purposes, we'll just log the settings
    console.log('Saving email settings:', settings)
    
    revalidatePath('/admin/settings')
    
    return { success: true }
  } catch (error) {
    console.error('Error saving email settings:', error)
    return { success: false, error: 'Failed to save email settings' }
  }
} 