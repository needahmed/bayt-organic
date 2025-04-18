"use client"

import { useRef, useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "./button"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus } from "lucide-react"
import { useCart } from "@/app/context/CartContext"

export function CartSidebar() {
  const { cartItems, removeItem, updateItemQuantity, subtotal, total, isCartOpen, closeCart } = useCart()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Close cart when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sidebarRef.current === event.target) {
        closeCart()
      }
    }

    if (isCartOpen) {
      document.addEventListener("click", handleOutsideClick)
      // Prevent body scrolling when cart is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick)
      document.body.style.overflow = "auto"
    }
  }, [isCartOpen, closeCart])

  if (!isCartOpen) return null

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md overflow-auto p-0">
        <div className="flex flex-col h-full" ref={sidebarRef}>
          <div className="p-4 bg-green-700 text-white flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-2xl font-bold">YOUR CART</h2>
            <button onClick={closeCart} className="p-1 hover:bg-green-800 rounded">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <p className="text-center mb-6 text-green-800">Your cart is empty</p>
                <Button 
                  onClick={closeCart} 
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  CONTINUE SHOPPING
                </Button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 border-b border-gray-200">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-green-800">{item.name}</h3>
                        <p className="text-lg mt-1 text-pink-500">
                          Rs.{item.discountedPrice || item.price}.00
                        </p>
                        
                        <div className="flex items-center mt-2">
                          <div className="flex border border-gray-300">
                            <button 
                              className="px-3 py-1 border-r border-gray-300 hover:bg-green-50"
                              onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1 flex items-center justify-center min-w-[40px]">
                              {item.quantity}
                            </span>
                            <button 
                              className="px-3 py-1 border-l border-gray-300 hover:bg-green-50"
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button 
                            className="ml-4 text-sm underline text-pink-500 hover:text-pink-600"
                            onClick={() => removeItem(item.id)}
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-4 bg-green-50">
              <div className="mb-4 text-center">
                <textarea
                  placeholder="LEAVE A NOTE WITH YOUR ORDER"
                  className="w-full p-4 border resize-none h-28 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-xl font-bold py-2 text-green-800">
                  <span>TOTAL</span>
                  <span>RS.{total}.00 PKR</span>
                </div>
                <p className="text-sm text-green-600">Taxes and shipping calculated at checkout</p>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-green-700 hover:bg-green-800 text-white text-lg py-6" asChild>
                  <Link href="/cart" onClick={closeCart}>CHECKOUT</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-pink-500 text-pink-500 hover:bg-pink-50" 
                  onClick={closeCart}
                >
                  CONTINUE SHOPPING
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 