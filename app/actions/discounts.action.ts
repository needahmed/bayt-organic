'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { DiscountType } from '@prisma/client'

// Types for discount operations
export type DiscountFormData = {
  code: string
  description?: string
  type: DiscountType
  value: number
  minOrderValue?: number
  startDate?: Date | string
  endDate?: Date | string
  isActive?: boolean
  usageLimit?: number
  applicableTo?: string
}

// Get all discounts
export async function getDiscounts() {
  try {
    const discounts = await prisma.discount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return { success: true, data: discounts }
  } catch (error) {
    console.error('Error getting discounts:', error)
    return { success: false, error: 'Failed to get discounts' }
  }
}

// Get discount by ID
export async function getDiscountById(id: string) {
  try {
    const discount = await prisma.discount.findUnique({
      where: { id },
    })
    
    if (!discount) {
      return { success: false, error: 'Discount not found' }
    }
    
    return { success: true, data: discount }
  } catch (error) {
    console.error(`Error getting discount with ID ${id}:`, error)
    return { success: false, error: 'Failed to get discount' }
  }
}

// Create a new discount
export async function createDiscount(data: DiscountFormData) {
  try {
    // Check if code already exists
    const existingDiscount = await prisma.discount.findFirst({
      where: { code: data.code },
    })
    
    if (existingDiscount) {
      return { success: false, error: 'Discount code already exists' }
    }
    
    // Create the discount in the database
    const discount = await prisma.discount.create({
      data: {
        code: data.code,
        description: data.description,
        type: data.type,
        value: data.value,
        minAmount: data.minOrderValue || 0,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default to 1 year from now
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    })
    
    revalidatePath('/admin/discounts')
    
    return { success: true, data: discount }
  } catch (error) {
    console.error('Error creating discount:', error)
    return { success: false, error: 'Failed to create discount' }
  }
}

// Update a discount
export async function updateDiscount(id: string, data: DiscountFormData) {
  try {
    // Check if discount exists
    const existingDiscount = await prisma.discount.findUnique({
      where: { id },
    })
    
    if (!existingDiscount) {
      return { success: false, error: 'Discount not found' }
    }
    
    // Check if code already exists (if changing code)
    if (data.code !== existingDiscount.code) {
      const codeExists = await prisma.discount.findFirst({
        where: { 
          code: data.code,
          id: { not: id }
        },
      })
      
      if (codeExists) {
        return { success: false, error: 'Discount code already exists' }
      }
    }
    
    // Update the discount
    const discount = await prisma.discount.update({
      where: { id },
      data: {
        code: data.code,
        description: data.description,
        type: data.type,
        value: data.value,
        minAmount: data.minOrderValue || 0,
        startDate: data.startDate ? new Date(data.startDate) : existingDiscount.startDate,
        endDate: data.endDate ? new Date(data.endDate) : existingDiscount.endDate,
        isActive: data.isActive !== undefined ? data.isActive : existingDiscount.isActive,
      },
    })
    
    revalidatePath('/admin/discounts')
    
    return { success: true, data: discount }
  } catch (error) {
    console.error(`Error updating discount with ID ${id}:`, error)
    return { success: false, error: 'Failed to update discount' }
  }
}

// Delete a discount
export async function deleteDiscount(id: string) {
  try {
    // Check if discount exists
    const existingDiscount = await prisma.discount.findUnique({
      where: { id },
    })
    
    if (!existingDiscount) {
      return { success: false, error: 'Discount not found' }
    }
    
    // Delete the discount
    await prisma.discount.delete({
      where: { id },
    })
    
    revalidatePath('/admin/discounts')
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting discount with ID ${id}:`, error)
    return { success: false, error: 'Failed to delete discount' }
  }
} 