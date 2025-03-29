'use server'

import { prisma } from '@/lib/prisma'
import { OrderStatus, PaymentStatus } from '@prisma/client'

// Type definitions
export type TimeRange = 'daily' | 'weekly' | 'monthly'
export type AnalyticsData = {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalProducts: number
  productsChange: number
  totalCustomers: number
  customersChange: number
  salesData: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
  recentOrders: {
    id: string
    orderNumber: string
    customer: string
    date: string
    status: string
    amount: number
    items: number
  }[]
}

// Get all dashboard analytics data
export async function getDashboardAnalytics(): Promise<{ success: boolean; data?: AnalyticsData; error?: string }> {
  try {
    // Calculate date ranges
    const now = new Date()
    const oneMonthAgo = new Date(now)
    oneMonthAgo.setMonth(now.getMonth() - 1)
    
    const twoMonthsAgo = new Date(now)
    twoMonthsAgo.setMonth(now.getMonth() - 2)

    // Get total revenue (all paid orders)
    const revenue = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        paymentStatus: PaymentStatus.PAID,
        createdAt: {
          gte: oneMonthAgo
        }
      }
    })

    // Get revenue from previous month for comparison
    const previousRevenue = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        paymentStatus: PaymentStatus.PAID,
        createdAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo
        }
      }
    })

    // Calculate revenue change percentage
    const currentRevenue = revenue._sum.total || 0
    const prevMonthRevenue = previousRevenue._sum.total || 0
    const revenueChange = prevMonthRevenue === 0 
      ? 100 
      : Math.round(((currentRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)

    // Get total orders count from last month
    const ordersCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: oneMonthAgo
        }
      }
    })

    // Get orders count from previous month
    const previousOrdersCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo
        }
      }
    })

    // Calculate orders change percentage
    const ordersChange = previousOrdersCount === 0 
      ? 100 
      : Math.round(((ordersCount - previousOrdersCount) / previousOrdersCount) * 100)

    // Get total products
    const productsCount = await prisma.product.count()
    
    // Get how many products were added in the last month
    const newProductsCount = await prisma.product.count({
      where: {
        createdAt: {
          gte: oneMonthAgo
        }
      }
    })

    // Calculate products change
    const productsChange = Math.round((newProductsCount / productsCount) * 100)

    // Get customers count
    const customersCount = await prisma.user.count({
      where: {
        role: 'CUSTOMER'
      }
    })

    // Get new customers from last month
    const newCustomersCount = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: {
          gte: oneMonthAgo
        }
      }
    })

    // Get new customers from previous month
    const previousNewCustomersCount = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo
        }
      }
    })

    // Calculate customers change
    const customersChange = previousNewCustomersCount === 0 
      ? 100 
      : Math.round(((newCustomersCount - previousNewCustomersCount) / previousNewCustomersCount) * 100)

    // Get sales data for charts
    // For daily data (last 7 days)
    const dailySales = await getSalesByDateRange(7, 'day')
    
    // For weekly data (last 7 weeks)
    const weeklySales = await getSalesByDateRange(7, 'week')
    
    // For monthly data (last 7 months)
    const monthlySales = await getSalesByDateRange(7, 'month')

    // Get recent orders
    const recentOrdersData = await prisma.order.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    // Format recent orders
    const recentOrders = recentOrdersData.map(order => {
      const date = new Date(order.createdAt)
      const now = new Date()
      const diffInHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      const diffInDays = Math.floor(diffInHours / 24)
      
      let dateString = ''
      if (diffInHours < 24) {
        dateString = `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
      } else {
        dateString = `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
      }

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.user?.name || 'Guest User',
        date: dateString,
        status: order.status,
        amount: order.total,
        items: order.items.length
      }
    })

    return {
      success: true,
      data: {
        totalRevenue: currentRevenue,
        revenueChange,
        totalOrders: ordersCount,
        ordersChange,
        totalProducts: productsCount,
        productsChange,
        totalCustomers: customersCount,
        customersChange,
        salesData: {
          daily: dailySales,
          weekly: weeklySales,
          monthly: monthlySales
        },
        recentOrders
      }
    }
  } catch (error) {
    console.error('Error getting dashboard analytics:', error)
    return { success: false, error: 'Failed to get dashboard analytics' }
  }
}

// Helper function to get sales by date range
async function getSalesByDateRange(count: number, interval: 'day' | 'week' | 'month'): Promise<number[]> {
  const now = new Date()
  const sales: number[] = []
  
  for (let i = count - 1; i >= 0; i--) {
    const start = new Date(now)
    const end = new Date(now)
    
    if (interval === 'day') {
      start.setDate(now.getDate() - i - 1)
      end.setDate(now.getDate() - i)
    } else if (interval === 'week') {
      start.setDate(now.getDate() - (i + 1) * 7)
      end.setDate(now.getDate() - i * 7)
    } else {
      start.setMonth(now.getMonth() - i - 1)
      end.setMonth(now.getMonth() - i)
    }
    
    const result = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        paymentStatus: PaymentStatus.PAID,
        createdAt: {
          gte: start,
          lt: end
        }
      }
    })
    
    sales.push(result._sum.total || 0)
  }
  
  return sales
} 