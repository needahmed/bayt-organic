'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Get cart by user ID
export async function getCartByUserId(userId: string) {
  try {
    // Find or create a cart for the user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user: {
            connect: { id: userId }
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    }
    
    return { success: true, data: cart }
  } catch (error) {
    console.error(`Error getting cart for user ${userId}:`, error)
    return { success: false, error: 'Failed to get cart' }
  }
}

// Add item to cart
export async function addToCart(userId: string, productId: string, quantity: number) {
  try {
    // Find or create a cart for the user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true }
    })
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user: {
            connect: { id: userId }
          }
        }
      })
    }
    
    // Check if the product is already in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    })
    
    if (existingCartItem) {
      // Update the quantity of the existing cart item
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity
        }
      })
    } else {
      // Add a new cart item
      await prisma.cartItem.create({
        data: {
          cart: {
            connect: { id: cart.id }
          },
          product: {
            connect: { id: productId }
          },
          quantity
        }
      })
    }
    
    revalidatePath('/cart')
    
    return { success: true }
  } catch (error) {
    console.error(`Error adding product ${productId} to cart for user ${userId}:`, error)
    return { success: false, error: 'Failed to add item to cart' }
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      // Remove the item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      })
    } else {
      // Update the quantity
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
      })
    }
    
    revalidatePath('/cart')
    
    return { success: true }
  } catch (error) {
    console.error(`Error updating quantity for cart item ${cartItemId}:`, error)
    return { success: false, error: 'Failed to update cart item quantity' }
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId: string) {
  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })
    
    revalidatePath('/cart')
    
    return { success: true }
  } catch (error) {
    console.error(`Error removing cart item ${cartItemId}:`, error)
    return { success: false, error: 'Failed to remove item from cart' }
  }
}

// Clear cart
export async function clearCart(userId: string) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true }
    })
    
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }
    
    revalidatePath('/cart')
    
    return { success: true }
  } catch (error) {
    console.error(`Error clearing cart for user ${userId}:`, error)
    return { success: false, error: 'Failed to clear cart' }
  }
} 