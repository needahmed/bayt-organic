'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// Types for address operations
export type AddressFormData = {
  name: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

// Get all addresses for the current user
export async function getUserAddresses() {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { id: 'desc' }
      ]
    })
    
    return { success: true, data: addresses }
  } catch (error) {
    console.error('Error getting user addresses:', error)
    return { success: false, error: 'Failed to get addresses' }
  }
}

// Get address by ID
export async function getAddressById(id: string) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    const address = await prisma.address.findUnique({
      where: { 
        id,
        userId: session.user.id // Ensure the address belongs to the current user
      }
    })
    
    if (!address) {
      return { success: false, error: 'Address not found' }
    }
    
    return { success: true, data: address }
  } catch (error) {
    console.error(`Error getting address with ID ${id}:`, error)
    return { success: false, error: 'Failed to get address' }
  }
}

// Create a new address
export async function createAddress(data: AddressFormData) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // If this is the first address or marked as default, update all other addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      })
    }
    
    // Check if this is the first address
    const addressCount = await prisma.address.count({
      where: { userId: session.user.id }
    })
    
    // If it's the first address, make it default
    const isDefault = addressCount === 0 ? true : !!data.isDefault
    
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        isDefault
      }
    })
    
    revalidatePath('/profile/addresses')
    revalidatePath('/checkout')
    
    return { success: true, data: address }
  } catch (error) {
    console.error('Error creating address:', error)
    return { success: false, error: 'Failed to create address' }
  }
}

// Update an existing address
export async function updateAddress(id: string, data: AddressFormData) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Check if the address belongs to the current user
    const existingAddress = await prisma.address.findUnique({
      where: { 
        id,
        userId: session.user.id
      }
    })
    
    if (!existingAddress) {
      return { success: false, error: 'Address not found or not authorized' }
    }
    
    // If setting as default, update all other addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }
    
    const address = await prisma.address.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: data.isDefault
      }
    })
    
    revalidatePath('/profile/addresses')
    revalidatePath('/checkout')
    
    return { success: true, data: address }
  } catch (error) {
    console.error(`Error updating address with ID ${id}:`, error)
    return { success: false, error: 'Failed to update address' }
  }
}

// Delete an address
export async function deleteAddress(id: string) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Check if the address belongs to the current user
    const existingAddress = await prisma.address.findUnique({
      where: { 
        id,
        userId: session.user.id
      }
    })
    
    if (!existingAddress) {
      return { success: false, error: 'Address not found or not authorized' }
    }
    
    await prisma.address.delete({
      where: { id }
    })
    
    // If the deleted address was the default, set another address as default
    if (existingAddress.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { id: 'desc' }
      })
      
      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true }
        })
      }
    }
    
    revalidatePath('/profile/addresses')
    revalidatePath('/checkout')
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting address with ID ${id}:`, error)
    return { success: false, error: 'Failed to delete address' }
  }
}

// Get the default address for the current user
export async function getDefaultAddress() {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    const address = await prisma.address.findFirst({
      where: { 
        userId: session.user.id,
        isDefault: true
      }
    })
    
    if (!address) {
      // If no default address, get the most recent one
      const mostRecent = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { id: 'desc' }
      })
      
      if (mostRecent) {
        return { success: true, data: mostRecent }
      }
      
      return { success: false, error: 'No addresses found' }
    }
    
    return { success: true, data: address }
  } catch (error) {
    console.error('Error getting default address:', error)
    return { success: false, error: 'Failed to get default address' }
  }
} 