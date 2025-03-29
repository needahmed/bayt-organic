'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import { sendOrderConfirmationEmail } from '@/lib/email-utils'
import { auth } from "@/auth";

// Types for order operations
export type OrderFormData = {
  userId?: string
  items: {
    productId: string
    quantity: number
    price: number
    name: string
  }[]
  addressId?: string
  shippingAddress?: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  email?: string
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
    console.log("Starting order creation process", new Date().toISOString());
    
    // Generate a unique order number
    const orderNumber = generateOrderNumber()
    console.log("Generated order number:", orderNumber);
    
    // First handle the shipping address
    let addressId = data.addressId;
    
    if (!addressId && data.shippingAddress) {
      try {
        console.log("Creating new address for order");
        
        // Create a new address for the order without userId for guest users
        const addressData: any = {
          name: data.shippingAddress.name,
          phone: data.shippingAddress.phone,
          address: data.shippingAddress.street,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          postalCode: data.shippingAddress.postalCode,
          country: data.shippingAddress.country,
          isDefault: false
        };
        
        // Only connect userId if it exists (for logged-in users)
        if (data.userId && /^[0-9a-fA-F]{24}$/.test(data.userId)) {
          addressData.user = {
            connect: { id: data.userId }
          };
        }
        
        // Create the address first
        const address = await prisma.address.create({
          data: addressData
        });
        
        // Use the new address ID
        addressId = address.id;
        console.log("Address created with ID:", addressId);
      } catch (error) {
        console.error("Error creating address:", error);
        return { success: false, error: 'Failed to create shipping address: ' + (error instanceof Error ? error.message : String(error)) };
      }
    }
    
    if (!addressId) {
      return { success: false, error: 'Shipping address is required' };
    }
    
    // Filter out any invalid product IDs
    const validItems = data.items.filter(item => {
      // MongoDB ObjectIDs are 24 hex characters
      const isValid = item.productId && /^[0-9a-fA-F]{24}$/.test(item.productId);
      if (!isValid) {
        console.log("Filtering out invalid product ID:", item.productId);
      }
      return isValid;
    });
    
    if (validItems.length === 0) {
      return { success: false, error: 'No valid products in cart. Please make sure all products have valid IDs.' };
    }
    
    console.log("Filtered valid items:", validItems.length);
    
    // Create the order in the database with step-by-step approach instead of transaction
    try {
      console.log("Creating order in database");
      
      // Prepare base order data
      const orderData: any = {
        orderNumber,
        subtotal: data.subtotal,
        shipping: data.shipping,
        discount: data.discount,
        total: data.total,
        paymentMethod: data.paymentMethod,
        notes: data.notes || "",
        status: OrderStatus.PENDING,
        paymentStatus: data.paymentMethod === "cod" ? PaymentStatus.PENDING : PaymentStatus.PAID,
        shippingAddress: {
          connect: { id: addressId }
        }
      };
      
      // Only connect user if userId exists and is a valid MongoDB ObjectID
      if (data.userId && /^[0-9a-fA-F]{24}$/.test(data.userId)) {
        orderData.user = {
          connect: { id: data.userId }
        };
      }
      
      console.log("Order data prepared:", JSON.stringify(orderData, null, 2));
      
      // First, create the order without items
      const order = await prisma.order.create({
        data: orderData
      });
      
      console.log("Order created with ID:", order.id);
      
      // Then, create order items one by one
      const orderItems = [];
      let errorCount = 0;
      for (const item of validItems) {
        try {
          console.log(`Creating order item for product ${item.productId}:`, JSON.stringify(item));
          
          // First check if product exists
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true }
          });
          
          if (!product) {
            console.error(`Product with ID ${item.productId} not found in database`);
            errorCount++;
            continue;
          }
          
          console.log(`Product found: ${product.name}`);
          
          const orderItem = await prisma.orderItem.create({
            data: {
              order: {
                connect: { id: order.id }
              },
              product: {
                connect: { id: item.productId }
              },
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }
          });
          orderItems.push(orderItem);
          console.log(`Order item created successfully for ${item.name}`);
          
          // Update product stock
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
          console.log(`Updated stock for product ${item.productId}`);
        } catch (itemError) {
          console.error(`Error creating order item for product ${item.productId}:`, itemError);
          errorCount++;
          // Continue with other items even if one fails
        }
      }
      
      console.log(`Created ${orderItems.length} order items with ${errorCount} errors`);
      
      // If all items failed, return an error
      if (errorCount === validItems.length && validItems.length > 0) {
        return { success: false, error: 'Failed to create any order items. Please check product IDs.' };
      }
      
      // Clear the user's cart if they're logged in
      if (data.userId && /^[0-9a-fA-F]{24}$/.test(data.userId)) {
        try {
          const cart = await prisma.cart.findUnique({
            where: { userId: data.userId },
            select: { id: true }
          });
          
          if (cart) {
            await prisma.cartItem.deleteMany({
              where: { cartId: cart.id }
            });
            console.log("Cart cleared for user:", data.userId);
          }
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
          // Don't fail the order if we can't clear the cart
        }
      }
      
      // Get the complete order with items
      const completeOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          shippingAddress: true,
        }
      });
      
      if (!completeOrder) {
        console.error("Order was created but could not be found on retrieval:", order.id);
        return { success: false, error: 'Order was created but could not be retrieved' };
      }
      
      // Revalidate relevant paths
      try {
        revalidatePath('/profile/orders');
        revalidatePath('/admin/orders');
      } catch (revalidateError) {
        console.error("Error revalidating paths:", revalidateError);
        // Don't fail the order if we can't revalidate paths
      }
      
      // Send order confirmation email
      try {
        // Determine the email address to use
        // First try to use the email from form data if provided (e.g., guest checkout)
        // Then, if user is connected, try to get their email
        // Fallback to checking the shipping address for an email
        let emailToUse = data.email;
        
        if (!emailToUse && data.userId) {
          const user = await prisma.user.findUnique({
            where: { id: data.userId },
            select: { email: true }
          });
          if (user?.email) {
            emailToUse = user.email;
          }
        }
        
        if (emailToUse && completeOrder.shippingAddress) {
          console.log("Sending order confirmation email to:", emailToUse);
          const emailSent = await sendOrderConfirmationEmail(emailToUse, {
            ...completeOrder,
            shippingAddress: completeOrder.shippingAddress
          });
          console.log("Order confirmation email sent:", emailSent);
        } else {
          console.log(
            emailToUse 
              ? "No shipping address available for order confirmation" 
              : "No email address available for order confirmation"
          );
        }
      } catch (emailError) {
        console.error("Error sending order confirmation email:", emailError);
        // Don't fail the order if email sending fails
      }
      
      console.log("Order creation successful, returning result", new Date().toISOString());
      return { success: true, data: completeOrder };
    } catch (orderError) {
      console.error("Error in order creation process:", orderError);
      return { success: false, error: 'Failed to create order: ' + (orderError instanceof Error ? orderError.message : String(orderError)) };
    }
  } catch (error) {
    console.error('Fatal error in createOrder:', error);
    return { success: false, error: 'Fatal error in order creation: ' + (error instanceof Error ? error.message : String(error)) };
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

// Get orders for the currently authenticated user
export async function getOrdersForCurrentUser() {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userId = session.user.id;
    
    // Use the existing function to get orders by user ID
    return await getOrdersByUserId(userId);
  } catch (error) {
    console.error('Error getting orders for current user:', error);
    return { success: false, error: 'Failed to get orders' };
  }
} 