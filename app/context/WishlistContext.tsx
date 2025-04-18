"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentUser } from "@/app/actions/auth.action"

// Define types
export type WishlistItem = {
  id: string
  productId: string
  name: string
  price: number
  discountedPrice?: number | null
  image: string
  weight: string
}

type WishlistContextType = {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: Omit<WishlistItem, "id">) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  // Get user ID and fetch wishlist on mount
  useEffect(() => {
    const getUserAndWishlist = async () => {
      try {
        // Try to get the current user from the server
        const userResult = await getCurrentUser()
        
        if (userResult.success && userResult.data) {
          const userId = userResult.data.id
          setUserId(userId)
          
          // Load wishlist from localStorage
          const savedWishlist = typeof window !== 'undefined' ? localStorage.getItem(`wishlist-${userId}`) : null
          if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist))
          }
        } else {
          // For non-logged in users, get wishlist from localStorage
          const savedWishlist = typeof window !== 'undefined' ? localStorage.getItem("wishlist") : null
          if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist))
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      }
    }
    
    getUserAndWishlist()
  }, [])

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (userId) {
        localStorage.setItem(`wishlist-${userId}`, JSON.stringify(wishlistItems))
      } else {
        localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
      }
    }
  }, [wishlistItems, userId])

  // Add item to wishlist
  const addToWishlist = (item: Omit<WishlistItem, "id">) => {
    // Check if the item is already in the wishlist
    const existingItem = wishlistItems.find(
      (wishlistItem) => wishlistItem.productId === item.productId
    )
    
    if (!existingItem) {
      setWishlistItems([
        ...wishlistItems,
        { ...item, id: item.productId }
      ])
      
      toast({
        title: "Added to wishlist",
        description: `${item.name} has been added to your wishlist`,
      })
    }
  }

  // Remove item from wishlist
  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.productId !== productId))
    
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    })
  }

  // Check if an item is in the wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId)
  }

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([])
    if (typeof window !== 'undefined') {
      if (userId) {
        localStorage.removeItem(`wishlist-${userId}`)
      } else {
        localStorage.removeItem("wishlist")
      }
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
} 