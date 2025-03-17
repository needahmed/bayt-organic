"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getOrdersByUserId } from "@/app/actions/orders.action"
import { toast } from "sonner"
import Link from "next/link"
import { Loader2, ShoppingBag, Eye } from "lucide-react"
import { auth } from "@/auth"

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const session = await auth()
        
        if (!session?.user?.id) {
          toast.error("You must be logged in to view your orders")
          return
        }
        
        const result = await getOrdersByUserId(session.user.id)
        
        if (result.success && result.data) {
          setOrders(result.data)
        } else {
          toast.error(result.error || "Failed to load orders")
        }
      } catch (error) {
        console.error("Error loading orders:", error)
        toast.error("An error occurred while loading orders")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadOrders()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">View and track your order history</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-green-700" />
          <span className="ml-2 text-green-700">Loading your orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-gray-100 p-4">
                <ShoppingBag className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium">No orders yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button asChild className="mt-4">
                <Link href="/products">
                  Browse Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                    <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    {getFulfillmentStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Items</h3>
                      <p>{order.items.length} item(s)</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Total</h3>
                      <p>Rs. {order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                      <p>{order.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Order Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 