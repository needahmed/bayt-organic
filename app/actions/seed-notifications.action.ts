'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { NotificationType } from '@prisma/client'

/**
 * Creates sample notifications for demonstration purposes
 */
export async function seedNotifications() {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Check if user already has notifications
    const existingNotifications = await prisma.notification.count({
      where: { userId: session.user.id }
    })
    
    if (existingNotifications > 0) {
      return { 
        success: true, 
        message: `User already has ${existingNotifications} notifications` 
      }
    }
    
    // Sample notifications data
    const notifications = [
      {
        userId: session.user.id,
        message: 'New order #BO-1234 has been placed',
        type: NotificationType.ORDER,
        read: false,
        link: '/admin/orders',
      },
      {
        userId: session.user.id,
        message: 'Payment of Rs. 5,600 received for order #BO-1234',
        type: NotificationType.PAYMENT,
        read: false,
        link: '/admin/orders',
      },
      {
        userId: session.user.id,
        message: 'Product "Organic Honey" is low in stock (3 remaining)',
        type: NotificationType.PRODUCT,
        read: false,
        link: '/admin/products',
      },
      {
        userId: session.user.id,
        message: 'New customer registration: Muhammad Ahmed',
        type: NotificationType.SYSTEM,
        read: true,
        link: '/admin/customers',
      },
      {
        userId: session.user.id,
        message: 'Order #BO-1230 has been marked as delivered',
        type: NotificationType.ORDER,
        read: true,
        link: '/admin/orders',
      },
    ]
    
    // Create all notifications
    await prisma.notification.createMany({
      data: notifications
    })
    
    revalidatePath('/admin')
    
    return { 
      success: true, 
      message: `Created ${notifications.length} sample notifications` 
    }
  } catch (error) {
    console.error('Error seeding notifications:', error)
    return { success: false, error: 'Failed to seed notifications' }
  }
}