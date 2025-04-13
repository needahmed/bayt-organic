"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"

export function CartSidebar() {
  const { cartItems, removeItem, updateItemQuantity, subtotal, total, isCartOpen, closeCart } = useCart()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close cart when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (overlayRef.current === event.target) {
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
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 overflow-hidden"
    >
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold uppercase">Your Cart</h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y">
          {cartItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Your cart is empty</p>
              <Button className="mt-4 bg-green-700 hover:bg-green-800 text-white" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="p-4">
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
                      <h3 className="font-bold text-xl uppercase">{item.name}</h3>
                      <p className="text-lg mt-1">
                        RS.{item.discountedPrice || item.price}.00
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex border border-gray-300">
                          <button 
                            className="px-3 py-1 border-r border-gray-300"
                            onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 flex items-center justify-center min-w-[40px]">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-3 py-1 border-l border-gray-300"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button 
                          className="ml-4 text-sm underline"
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
          <div className="border-t p-4">
            <div className="mb-4 text-center">
              <textarea
                placeholder="LEAVE A NOTE WITH YOUR ORDER"
                className="w-full p-4 border resize-none h-28 text-sm"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xl font-bold py-2">
                <span>TOTAL</span>
                <span>RS.{total}.00 PKR</span>
              </div>
              <p className="text-sm text-gray-600">Taxes and shipping calculated at checkout</p>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full bg-black hover:bg-gray-800 text-white text-lg py-6" asChild>
                <Link href="/checkout">CHECKOUT</Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-black text-black hover:bg-gray-100" 
                onClick={closeCart}
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 