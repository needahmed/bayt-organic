"use client"

import { useState, useEffect } from "react"
// import React from "react" // Uncomment when migrating to React.use()
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Printer, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2
} from "lucide-react"
import { getOrderById, updateOrderStatus, updatePaymentStatus } from "@/app/actions/orders.action"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

// TODO: In the future, we'll need to update the code to use React.use() like this:
// export default function OrderDetailsPage({ params }: { params: { id: string } }) {
//   const id = React.use(params).id
//   ...
// }

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  // For now, access params.id directly as it's still supported for migration
  // In a future version of Next.js, we'll need to use React.use() to unwrap the params
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setIsLoading(true)
        const result = await getOrderById(params.id)
        
        if (result.success && result.data) {
          setOrder(result.data)
        } else {
          toast.error(result.error || "Failed to load order")
        }
      } catch (error) {
        console.error("Error loading order:", error)
        toast.error("An error occurred while loading order")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadOrder()
  }, [params.id])

  const handleUpdateOrderStatus = async (status: string) => {
    try {
      setIsUpdating(true)
      const result = await updateOrderStatus(params.id, status as any)
      
      if (result.success) {
        toast.success(`Order status updated to ${status}`)
        setOrder({ ...order, status })
      } else {
        toast.error(result.error || "Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("An error occurred while updating order status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdatePaymentStatus = async (paymentStatus: string) => {
    try {
      setIsUpdating(true)
      const result = await updatePaymentStatus(params.id, paymentStatus as any)
      
      if (result.success) {
        toast.success(`Payment status updated to ${paymentStatus}`)
        setOrder({ ...order, paymentStatus })
      } else {
        toast.error(result.error || "Failed to update payment status")
      }
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast.error("An error occurred while updating payment status")
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  const getFulfillmentStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>
      case "SHIPPED":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Shipped</Badge>
      case "PROCESSING":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Processing</Badge>
      case "PENDING":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Pending</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
      case "FAILED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      case "REFUNDED":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Refunded</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
        <span className="ml-2 text-green-700">Loading order details...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Fulfillment Status</div>
                  <div className="text-lg font-medium">{getFulfillmentStatusBadge(order.status)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Payment Status</div>
                  <div className="text-lg font-medium">{getPaymentStatusBadge(order.paymentStatus)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="text-lg font-medium">{order.paymentMethod}</div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateOrderStatus("PENDING")}
                    disabled={order.status === "PENDING" || isUpdating}
                  >
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    Mark as Pending
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateOrderStatus("PROCESSING")}
                    disabled={order.status === "PROCESSING" || isUpdating}
                  >
                    <Package className="mr-2 h-4 w-4 text-blue-500" />
                    Mark as Processing
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateOrderStatus("SHIPPED")}
                    disabled={order.status === "SHIPPED" || isUpdating}
                  >
                    <Truck className="mr-2 h-4 w-4 text-purple-500" />
                    Mark as Shipped
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateOrderStatus("DELIVERED")}
                    disabled={order.status === "DELIVERED" || isUpdating}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Mark as Delivered
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateOrderStatus("CANCELLED")}
                    disabled={order.status === "CANCELLED" || isUpdating}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                </div>
                <h3 className="text-lg font-medium mt-6">Update Payment</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdatePaymentStatus("PENDING")}
                    disabled={order.paymentStatus === "PENDING" || isUpdating}
                  >
                    Mark as Pending
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdatePaymentStatus("PAID")}
                    disabled={order.paymentStatus === "PAID" || isUpdating}
                    className="text-green-600"
                  >
                    Mark as Paid
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdatePaymentStatus("FAILED")}
                    disabled={order.paymentStatus === "FAILED" || isUpdating}
                    className="text-red-600"
                  >
                    Mark as Failed
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdatePaymentStatus("REFUNDED")}
                    disabled={order.paymentStatus === "REFUNDED" || isUpdating}
                    className="text-purple-600"
                  >
                    Mark as Refunded
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-start space-x-4 py-4 border-b last:border-0">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{item.product?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      Rs. {item.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p>{order.user?.name || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{order.user?.email || "No email"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{order.user?.phone || "No phone"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p>{order.shippingAddress?.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>- Rs. {(order.discount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Rs. {(order.shipping || 0).toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>Rs. {(order.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 