"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { CheckCircle2, Package, Truck, Calendar, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"

export default function ConfirmationPage() {
  useEffect(() => {
    // Trigger confetti animation on page load
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number): number {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#4ade80", "#f472b6", "#ffffff"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#4ade80", "#f472b6", "#ffffff"],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // Order details
  const orderNumber = "BO-" + Math.floor(10000 + Math.random() * 90000)
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const orderItems = [
    {
      id: 1,
      name: "Honey & Oats Body Soap",
      price: 1000,
      quantity: 2,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Coconut Milk Shampoo Bar",
      price: 1200,
      quantity: 1,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Anti-Aging Face Serum",
      price: 1500,
      quantity: 1,
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const shipping = subtotal > 2000 ? 0 : 150
  const total = subtotal + shipping

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-700" />
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-green-700 mb-2">Your order has been received and is being processed.</p>
          <p className="text-green-700">Order confirmation has been sent to your email.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 md:p-8 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="font-playfair text-xl font-bold text-green-800 mb-1">Order #{orderNumber}</h2>
                <p className="text-green-700">Placed on {orderDate}</p>
              </div>
              <Button
                asChild
                variant="outline"
                className="mt-4 md:mt-0 border-green-700 text-green-700 hover:bg-green-50"
              >
                <Link href="/profile/orders">View Order History</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <Package className="h-5 w-5 text-green-700 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Order Status</h3>
                  <p className="text-green-700">Processing</p>
                </div>
              </div>
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-green-700 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Shipping Method</h3>
                  <p className="text-green-700">Standard Delivery</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-green-700 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Estimated Delivery</h3>
                  <p className="text-green-700">{estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="font-playfair text-lg font-bold text-green-800 mb-4">Order Summary</h3>

            <div className="space-y-4 mb-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800 line-clamp-1">{item.name}</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Qty: {item.quantity}</span>
                      <span className="text-green-700 font-medium">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-green-700">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-green-800">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-green-50 flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-700 mb-4 md:mb-0">Thank you for shopping with Bayt Organic!</p>
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/" className="inline-flex items-center">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-green-800 mb-4">Shipping Address</h3>
            <address className="not-italic text-green-700">
              John Doe
              <br />
              123 Main Street
              <br />
              Apartment 4B
              <br />
              Karachi, 75300
              <br />
              Pakistan
            </address>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-green-800 mb-4">Payment Information</h3>
            <p className="text-green-700">
              Payment Method: Credit Card
              <br />
              Card ending in: **** 1234
              <br />
              Billing Address: Same as shipping
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

