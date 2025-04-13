"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { addToCart, getCartByUserId, removeFromCart, updateCartItemQuantity } from "@/app/actions/cart.action"
import { getCurrentUser } from "@/app/actions/auth.action"

// Define types
export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  discountedPrice?: number | null
  quantity: number
  image: string
  weight: string
}

type CartContextType = {
  cartItems: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => Promise<void>
  updateItemQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => void
  isLoading: boolean
  subtotal: number
  total: number
  itemCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.discountedPrice || item.price) * item.quantity,
    0
  )
  const shipping = subtotal > 2000 ? 0 : 150
  const total = subtotal + shipping
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  // Get user ID and fetch cart on mount
  useEffect(() => {
    const getUserAndCart = async () => {
      try {
        setIsLoading(true)
        
        // Try to get the current user from the server
        const userResult = await getCurrentUser()
        
        if (userResult.success && userResult.data) {
          const userId = userResult.data.id
          setUserId(userId)
          
          // Store userId in localStorage for future reference
          if (typeof window !== 'undefined') {
            localStorage.setItem('userId', userId)
          }
          
          const result = await getCartByUserId(userId)
          
          if (result.success && result.data) {
            // Transform cart items from DB to our CartItem format
            const items = result.data.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              discountedPrice: item.product.discountedPrice,
              quantity: item.quantity,
              image: item.product.images[0] || "/placeholder.svg",
              weight: item.product.weight || "N/A"
            }))
            
            setCartItems(items)
          }
        } else {
          // For non-logged in users, get cart from localStorage
          const savedCart = typeof window !== 'undefined' ? localStorage.getItem("cart") : null
          if (savedCart) {
            setCartItems(JSON.parse(savedCart))
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
        toast({
          title: "Error",
          description: "Failed to load your cart",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    getUserAndCart()
  }, [toast])

  // Save cart to localStorage when it changes (for non-logged in users)
  useEffect(() => {
    if (!userId && !isLoading && typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, userId, isLoading])

  // Add item to cart
  const addItem = async (item: Omit<CartItem, "id">) => {
    try {
      if (userId) {
        // Add to database if logged in
        const result = await addToCart(userId, item.productId, item.quantity)
        
        if (result.success) {
          // Refetch cart to get updated items with IDs
          const cartResult = await getCartByUserId(userId)
          if (cartResult.success && cartResult.data) {
            const items = cartResult.data.items.map((dbItem: any) => ({
              id: dbItem.id,
              productId: dbItem.productId,
              name: dbItem.product.name,
              price: dbItem.product.price,
              discountedPrice: dbItem.product.discountedPrice,
              quantity: dbItem.quantity,
              image: dbItem.product.images[0] || "/placeholder.svg",
              weight: dbItem.product.weight || "N/A"
            }))
            
            setCartItems(items)
          }
        } else {
          throw new Error(result.error || "Failed to add item to cart")
        }
      } else {
        // Add to local state if not logged in
        const existingItemIndex = cartItems.findIndex(
          (cartItem) => cartItem.productId === item.productId
        )
        
        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          const updatedItems = [...cartItems]
          updatedItems[existingItemIndex].quantity += item.quantity
          setCartItems(updatedItems)
        } else {
          // Use the product ID directly for the cart item ID to make checkout work correctly
          // This ensures the item can be properly associated with a product during checkout
          setCartItems([
            ...cartItems,
            { ...item, id: item.productId }
          ])
        }
      }
      
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
    }
  }

  // Update item quantity
  const updateItemQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity < 1) return
      
      // CartItem IDs from the database are MongoDB ObjectIDs
      const isMongoDbId = /^[0-9a-fA-F]{24}$/.test(id);
      
      if (userId && isMongoDbId && !id.includes('product-')) {
        // For logged-in users with database cart items (which have MongoDB ObjectIDs)
        const result = await updateCartItemQuantity(id, quantity)
        
        if (result.success) {
          setCartItems(
            cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
          )
        } else {
          throw new Error(result.error || "Failed to update item quantity")
        }
      } else {
        // For guests or product IDs used as cart item IDs
        setCartItems(
          cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        )
      }
    } catch (error) {
      console.error("Error updating item quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive"
      })
    }
  }

  // Remove item from cart
  const removeItem = async (id: string) => {
    try {
      // CartItem IDs from the database are MongoDB ObjectIDs
      const isMongoDbId = /^[0-9a-fA-F]{24}$/.test(id);
      
      if (userId && isMongoDbId && !id.includes('product-')) {
        // For logged-in users with database cart items (which have MongoDB ObjectIDs)
        const result = await removeFromCart(id)
        
        if (result.success) {
          setCartItems(cartItems.filter((item) => item.id !== id))
        } else {
          throw new Error(result.error || "Failed to remove item from cart")
        }
      } else {
        // For guests or product IDs used as cart item IDs
        setCartItems(cartItems.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      })
    }
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
    if (!userId && typeof window !== 'undefined') {
      localStorage.removeItem("cart")
    }
  }

  // Cart sidebar controls
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        isLoading,
        subtotal,
        total,
        itemCount,
        isCartOpen,
        openCart,
        closeCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 