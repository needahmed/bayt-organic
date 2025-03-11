"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2, RefreshCw } from "lucide-react"
import AnimatedLeaf from "@/components/animated-leaf"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Honey & Oats Body Soap",
      price: 1000,
      quantity: 2,
      image: "/placeholder.svg?height=300&width=300",
      weight: "90 gram",
    },
    {
      id: 2,
      name: "Coconut Milk Shampoo Bar",
      price: 1200,
      quantity: 1,
      image: "/placeholder.svg?height=300&width=300",
      weight: "150 gram",
    },
    {
      id: 3,
      name: "Anti-Aging Face Serum",
      price: 1500,
      quantity: 1,
      image: "/placeholder.svg?height=300&width=300",
      weight: "30 ml",
    },
  ])

  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id.toString() === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id.toString() !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "bayt10") {
      setPromoApplied(true)
      setDiscount(subtotal * 0.1) // 10% discount
    } else {
      setPromoApplied(false)
      setDiscount(0)
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const shipping = subtotal > 2000 ? 0 : 150
  const total = subtotal - discount + shipping

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
                              onClick={() => removeItem(item.id.toString())}
                              className="text-pink-500 text-sm flex items-center mt-1 hover:text-pink-600"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-center text-green-700">
                          <span className="md:hidden font-medium text-green-800 mr-2">Price:</span>
                          Rs. {item.price.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id.toString(), item.quantity - 1)}
                              className="h-8 w-8 rounded-none text-green-700"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="w-10 text-center text-green-800">{item.quantity}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id.toString(), item.quantity + 1)}
                              className="h-8 w-8 rounded-none text-green-700"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right font-medium text-green-800">
                          <span className="md:hidden font-medium text-green-800 mr-2">Total:</span>
                          Rs. {(item.price * item.quantity).toLocaleString()}
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
                  />
                  <Button onClick={applyPromoCode} className="bg-green-700 hover:bg-green-800 text-white">
                    Apply
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
                        <span>Discount (10%)</span>
                        <span>- Rs. {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-green-800 text-lg">
                      <span>Total</span>
                      <span>Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center text-sm text-green-700">
                      <AnimatedLeaf className="h-4 w-4 mr-2" />
                      <span>Free shipping on orders over Rs. 2000</span>
                    </div>
                    <div className="flex items-center text-sm text-green-700">
                      <AnimatedLeaf className="h-4 w-4 mr-2" delay={0.1} />
                      <span>100% secure checkout</span>
                    </div>
                    <div className="flex items-center text-sm text-green-700">
                      <AnimatedLeaf className="h-4 w-4 mr-2" delay={0.2} />
                      <span>Handmade with love</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Need Help?</h3>
                <p className="text-sm text-green-700 mb-2">
                  Our customer service team is here to help you with any questions about your order.
                </p>
                <Link href="/contact" className="text-sm text-pink-500 hover:text-pink-600 font-medium">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-green-700" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-green-800 mb-2">Your Cart is Empty</h2>
            <p className="text-green-700 mb-6 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. Explore our collection to find natural
              products you'll love.
            </p>
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/">Start Shopping</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

