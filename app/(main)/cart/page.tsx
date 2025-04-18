"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2, RefreshCw, Leaf, Truck } from "lucide-react"
import { useCart } from "@/app/context/CartContext"
import { validateDiscountCode } from "@/app/actions/discounts.action"
import { calculateShippingCost } from "@/app/actions/shipping.action"
import { toast } from "sonner"

export default function CartPage() {
  const { cartItems, updateItemQuantity, removeItem, subtotal, total, isLoading } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState("")
  const [discountValue, setDiscountValue] = useState(0)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [shippingMessage, setShippingMessage] = useState("")
  const [isLoadingShipping, setIsLoadingShipping] = useState(true)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2000)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Set initialLoading to false after the first render
    if (isLoading === false) {
      setInitialLoading(false)
    }
  }, [isLoading])

  useEffect(() => {
    const loadShippingCost = async () => {
      try {
        setIsLoadingShipping(true);
        const result = await calculateShippingCost(subtotal);
        
        if (result.success) {
          setShippingCost(result.shippingCost);
          setShippingMessage(result.message || "");
          
          // If we have shipping settings with a free shipping threshold, save it
          if (result.freeShippingThreshold) {
            setFreeShippingThreshold(result.freeShippingThreshold);
          }
        } else {
          console.error("Failed to calculate shipping:", result.error);
          toast.error("Failed to calculate shipping rates");
          setShippingCost(150); // Default shipping cost
        }
      } catch (error) {
        console.error("Error loading shipping cost:", error);
        setShippingCost(150); // Default shipping cost
      } finally {
        setIsLoadingShipping(false);
      }
    };

    if (cartItems.length > 0) {
      loadShippingCost();
    } else {
      setShippingCost(0);
      setIsLoadingShipping(false);
    }
  }, [subtotal, cartItems.length]);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code")
      return
    }
    
    setIsApplyingPromo(true)
    
    try {
      const result = await validateDiscountCode(promoCode, subtotal)
      
      if (result.success && result.data) {
        setPromoApplied(true)
        setDiscount(result.data.discountAmount)
        setDiscountType(result.data.discountType)
        setDiscountValue(result.data.discountValue)
        toast.success("Promo code applied successfully!")
      } else {
        setPromoApplied(false)
        setDiscount(0)
        setDiscountType("")
        setDiscountValue(0)
        toast.error(result.error || "Invalid promo code")
      }
    } catch (error) {
      console.error("Error applying promo code:", error)
      toast.error("Failed to apply promo code")
      setPromoApplied(false)
      setDiscount(0)
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const finalTotal = (total - discount) + shippingCost;

  // Only show loading on initial page load, not during quantity updates
  if (initialLoading || (isLoadingShipping && initialLoading)) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-green-700">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle quantity updates without showing loading state
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Optimistically update the UI first
    const itemToUpdate = cartItems.find(item => item.id === id);
    if (itemToUpdate) {
      // Call the update function from context
      updateItemQuantity(id, newQuantity);
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-800 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <ShoppingBag className="h-6 w-6 text-green-700 mr-2" />
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-green-800">Your Cart</h1>
          </motion.div>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-green-800 mb-4">
                    <div className="col-span-2">Product</div>
                    <div className="text-center">Price</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Total</div>
                  </div>

                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 items-center border-b border-gray-100">
                        <div className="col-span-2 flex items-center space-x-4">
                          <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-green-800">{item.name}</h3>
                            <p className="text-sm text-green-600">Weight: {item.weight}</p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-pink-500 text-sm flex items-center mt-1 hover:text-pink-600"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-center text-green-700">
                          <span className="md:hidden font-medium text-green-800 mr-2">Price:</span>
                          Rs. {(item.discountedPrice || item.price).toLocaleString()}
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 rounded-none text-green-700"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="w-10 text-center text-green-800">{item.quantity}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 rounded-none text-green-700"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right font-medium text-green-800">
                          <span className="md:hidden font-medium text-green-800 mr-2">Total:</span>
                          Rs. {((item.discountedPrice || item.price) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Button
                  variant="outline"
                  className="border-green-700 text-green-700 hover:bg-green-50 inline-flex items-center"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Cart
                </Button>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-32 md:w-40"
                    disabled={isApplyingPromo}
                  />
                  <Button 
                    onClick={applyPromoCode} 
                    className="bg-green-700 hover:bg-green-800 text-white" 
                    disabled={isApplyingPromo || !promoCode.trim()}
                  >
                    {isApplyingPromo ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="font-playfair text-xl font-bold text-green-800 mb-4">Order Summary</h2>
                  <div className="space-y-3 text-green-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-pink-500">
                        <span>
                          {discountType === "PERCENTAGE" 
                            ? `Discount (${discountValue}%)` 
                            : "Discount (Fixed)"}
                        </span>
                        <span>- Rs. {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-green-600" />
                        <span>Shipping</span>
                      </div>
                      <span>
                        {shippingCost === 0 
                          ? "Free" 
                          : `Rs. ${shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    {shippingMessage && (
                      <div className="text-sm text-green-600 italic text-right">
                        {shippingMessage}
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-green-800 text-lg">
                      <span>Total</span>
                      <span>Rs. {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center text-sm text-green-700">
                      <Leaf className="h-4 w-4 mr-2 text-green-600" />
                      <span>Free shipping on orders over Rs. {freeShippingThreshold.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-green-700">
                      <Leaf className="h-4 w-4 mr-2 text-green-600" />
                      <span>100% secure checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-green-200" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-green-800 mb-2">Your cart is empty</h2>
            <p className="text-green-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

