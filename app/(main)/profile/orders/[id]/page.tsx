"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Package, ChevronLeft, CheckCircle, Clock, Truck, XCircle, AlertCircle } from "lucide-react"
import { getOrderById } from "@/app/actions/orders.action"
import { useSession } from "next-auth/react"
import { Order, OrderItem as PrismaOrderItem } from "@prisma/client"

// Extend the OrderItem type to include the product relationship
interface OrderItem extends PrismaOrderItem {
  product?: {
    id: string;
    name: string;
    images: string[];
  } | null;
}

interface OrderWithDetails extends Order {
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  } | null;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise
  const unwrappedParams = React.use(params);
  const orderId = unwrappedParams.id;
  
  const router = useRouter()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (status === "loading") return

        if (status === "unauthenticated") {
          router.push(`/auth/login?callbackUrl=/profile/orders/${orderId}`)
          return
        }

        setIsLoading(true)
        
        if (!orderId) {
          setError("No order ID provided")
          setIsLoading(false)
          return
        }

        const result = await getOrderById(orderId)

        if (result.success && result.data) {
          // Check if this order belongs to the logged-in user
          if (!result.data.userId || result.data.userId !== session?.user?.id) {
            setError("You do not have permission to view this order")
            setOrder(null)
          } else {
            setOrder(result.data as OrderWithDetails)
          }
        } else {
          setError(result.error || "Failed to load order details")
        }
      } catch (error) {
        console.error("Error loading order:", error)
        setError("An error occurred while loading your order")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [orderId, status, router, session?.user?.id])

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
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "SHIPPED":
        return "bg-purple-100 text-purple-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery"
      case "card":
        return "Card Payment"
      default:
        return method
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-green-700">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-medium text-green-800 mb-2">Order Not Found</h2>
          <p className="text-green-600 mb-6">{error || "We couldn't find the order you're looking for."}</p>
          <Button
            asChild
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            <Link href="/profile/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/profile/orders"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-green-800 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-green-700">Placed on {formatDate(order.createdAt.toString())}</p>
            </div>
            <Badge 
              className={`${getStatusColor(order.status)} py-2 px-3 text-base flex items-center gap-2`}
            >
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
          </div>
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
              <CardTitle className="text-green-800">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-green-800">{item.name}</h3>
                      <p className="text-sm text-green-600">Qty: {item.quantity}</p>
                      <p className="text-sm text-green-600">Price: Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right text-green-700 font-medium">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-600">Subtotal</span>
                    <span className="text-green-800">Rs. {order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Shipping</span>
                    <span className="text-green-800">Rs. {order.shipping.toLocaleString()}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-800">- Rs. {order.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className="text-green-800">Total</span>
                    <span className="text-green-800">Rs. {order.total.toLocaleString()}</span>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-green-800 mb-2">Payment</h3>
                  <p className="text-green-600 mb-1">
                    <span className="font-medium">Method:</span> {getPaymentMethodText(order.paymentMethod)}
                  </p>
                  <p className="text-green-600">
                    <span className="font-medium">Status:</span> {getPaymentStatusText(order.paymentStatus)}
                  </p>
                </div>

                {order.notes && (
                  <div>
                    <h3 className="font-medium text-green-800 mb-2">Order Notes</h3>
                    <p className="text-green-600">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                {order.shippingAddress ? (
                  <div className="space-y-1">
                    <p className="font-medium text-green-800">{order.shippingAddress.name}</p>
                    <p className="text-green-600">{order.shippingAddress.phone}</p>
                    <p className="text-green-600">{order.shippingAddress.address}</p>
                    <p className="text-green-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-green-600">{order.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-amber-600">No shipping address available</p>
                )}
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
              >
                Print Order
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 