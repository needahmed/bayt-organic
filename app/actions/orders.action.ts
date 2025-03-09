'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { OrderStatus, PaymentStatus } from '@prisma/client'

// Types for order operations
export type OrderFormData = {
  userId: string
  items: {
    productId: string
    quantity: number
    price: number
    name: string
  }[]
  addressId: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  paymentMethod: string
  notes?: string
}

// Generate a unique order number
const generateOrderNumber = (): string => {
  const timestamp = new Date().getTime().toString().slice(-8)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${timestamp}-${random}`
}

// Get all orders
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return { success: true, data: orders }
  } catch (error) {
    console.error('Error getting orders:', error)
    return { success: false, error: 'Failed to get orders' }
  }
}

// Get order by ID
export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              }
            }
          }
        },
        shippingAddress: true,
      },
    })
    
    if (!order) {
      return { success: false, error: 'Order not found' }
    }
    
    return { success: true, data: order }
  } catch (error) {
    console.error(`Error getting order with ID ${id}:`, error)
    return { success: false, error: 'Failed to get order' }
  }
}

// Get orders by user ID
export async function getOrdersByUserId(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              }
            }
          }
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return { success: true, data: orders }
  } catch (error) {
    console.error(`Error getting orders for user ${userId}:`, error)
    return { success: false, error: 'Failed to get orders' }
  }
}

// Create a new order
export async function createOrder(data: OrderFormData) {
  try {
    // Generate a unique order number
    const orderNumber = generateOrderNumber()
    
    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        user: {
          connect: { id: data.userId }
        },
        items: {
          create: data.items.map(item => ({
            product: {
              connect: { id: item.productId }
            },
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        },
        shippingAddress: {
          connect: { id: data.addressId }
        },
        subtotal: data.subtotal,
        shipping: data.shipping,
        discount: data.discount,
        total: data.total,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      },
      include: {
        items: true,
        shippingAddress: true,
      }
    })
    
    // Update product stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }
    
    // Clear the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: data.userId },
      select: { id: true }
    })
    
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }
    
    revalidatePath('/admin/orders')
    revalidatePath('/profile/orders')
    
    return { success: true, data: order }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })
    
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    revalidatePath('/profile/orders')
    
    return { success: true, data: order }
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error)
    return { success: false, error: 'Failed to update order status' }
  }
}

// Update payment status
export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
    })
    
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    revalidatePath('/profile/orders')
    
    return { success: true, data: order }
  } catch (error) {
    console.error(`Error updating payment status for order ${id}:`, error)
    return { success: false, error: 'Failed to update payment status' }
  }
} 