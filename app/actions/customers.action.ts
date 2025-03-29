'use server'

import { prisma } from '@/lib/prisma'

// Type definition for customer data
export type CustomerData = {
  id: string
  name: string
  email: string
  phone: string | null
  totalOrders: number
  totalSpent: number
  status: string
  createdAt: Date
}

// Get all customers with their order statistics
export async function getCustomers(): Promise<{ success: boolean; data?: CustomerData[]; error?: string }> {
  try {
    // Get all users with the CUSTOMER role
    const customers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            paymentStatus: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to include statistics
    const customersWithStats = customers.map(customer => {
      // Calculate orders count
      const totalOrders = customer.orders.length
      
      // Calculate total spent (sum of all paid orders)
      const totalSpent = customer.orders
        .filter(order => order.paymentStatus === 'PAID')
        .reduce((sum, order) => sum + order.total, 0)
      
      // Determine status based on order activity (if they've made at least one order, they're active)
      const status = totalOrders > 0 ? 'active' : 'inactive'
      
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        totalOrders,
        totalSpent,
        status,
        createdAt: customer.createdAt
      }
    })

    return { success: true, data: customersWithStats }
  } catch (error) {
    console.error('Error getting customers:', error)
    return { success: false, error: 'Failed to get customers' }
  }
} 