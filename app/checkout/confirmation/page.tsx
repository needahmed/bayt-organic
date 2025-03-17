"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { CheckCircle, ChevronLeft, Package, Truck, Clock, AlertCircle } from "lucide-react"
import { getOrderById } from "@/app/actions/orders.action"
import { toast } from "sonner"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("No order ID provided")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const result = await getOrderById(orderId)

        if (result.success && result.data) {
          setOrder(result.data)
        } else {
          setError(result.error || "Failed to load order details")
          toast.error(result.error || "Failed to load order details")
        }
      } catch (error) {
        console.error("Error loading order:", error)
        setError("An error occurred while loading your order")
        toast.error("An error occurred while loading your order")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-green-700">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-medium text-green-800 mb-2">Order not found</h2>
            <p className="text-green-600 mb-6">{error || "We couldn't find the order you're looking for."}</p>
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "PROCESSING":
        return <Package className="h-5 w-5 text-blue-500" />
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Paid"
      case "PENDING":
        return "Payment Pending"
      case "FAILED":
        return "Payment Failed"
      case "REFUNDED":
        return "Refunded"
      default:
        return status
    }
  }

  // Display customer information section
  const renderCustomerInfo = () => {
    // Handle case where user info might be missing (guest checkout)
    const name = order.user?.name || order.shippingAddress?.name || "Guest";
    const email = order.user?.email || "No email provided";
    const phone = order.shippingAddress?.phone || "No phone provided";
    
    return (
      <div className="space-y-1">
        <p className="font-medium">{name}</p>
        <p>{email}</p>
        <p>{phone}</p>
      </div>
    );
  };

  // Display shipping address section
  const renderShippingAddress = () => {
    if (!order.shippingAddress) {
      return <p>No shipping address provided</p>;
    }
    
    return (
      <div className="space-y-1">
        <p className="font-medium">{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.phone}</p>
        <p>{order.shippingAddress.address}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 bg-green-50/30">
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
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-700" />
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
            <p className="text-green-700 max-w-md mx-auto">
              Thank you for your order. We've received your order and will begin processing it right away.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-green-600">Order Number</p>
                      <p className="font-medium text-green-800">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Date</p>
                      <p className="font-medium text-green-800">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Payment</p>
                      <p className="font-medium text-green-800">{getPaymentStatusText(order.paymentStatus)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Status</p>
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="font-medium text-green-800 ml-1">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-green-800 mb-3">Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            {item.product?.images?.[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-green-800 truncate">{item.name}</p>
                            <p className="text-sm text-green-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right text-green-700">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-green-800 mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          {renderShippingAddress()}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-6">
                        <h3 className="font-medium text-green-800 mb-3">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="font-medium text-green-800">
                            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit/Debit Card"}
                          </p>
                          {order.paymentMethod === "cod" ? (
                            <p className="text-sm text-green-600">Pay when you receive your order</p>
                          ) : (
                            <p className="text-sm text-green-600">Payment processed securely</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-green-800 mb-3">Customer Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          {renderCustomerInfo()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-green-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {order.subtotal.toLocaleString()}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-pink-500">
                      <span>Discount</span>
                      <span>- Rs. {order.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0 ? "Free" : `Rs. ${order.shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-green-800 text-lg">
                    <span>Total</span>
                    <span>Rs. {order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Button asChild className="w-full bg-green-700 hover:bg-green-800 text-white">
                    <Link href="/profile/orders">View All Orders</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-green-700 text-green-700 hover:bg-green-50">
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-green-800 mb-2">Need Help?</h3>
              <p className="text-sm text-green-700 mb-2">
                If you have any questions about your order, please contact our customer service team.
              </p>
              <Link href="/contact" className="text-sm text-pink-500 hover:text-pink-600 font-medium">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

