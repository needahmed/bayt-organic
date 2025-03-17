"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Eye, Printer, Package, Truck, CheckCircle, XCircle, Filter, Loader2, Clock } from "lucide-react"
import { getOrders, updateOrderStatus, updatePaymentStatus } from "@/app/actions/orders.action"
import { toast } from "sonner"
import Link from "next/link"

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const result = await getOrders()
        
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

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (checked: boolean, orderId: string) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId])
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      setIsUpdating(true)
      const result = await updateOrderStatus(orderId, status as any)
      
      if (result.success) {
        toast.success(`Order status updated to ${status}`)
        // Update the order in the local state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        ))
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

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      setIsUpdating(true)
      const result = await updatePaymentStatus(orderId, paymentStatus as any)
      
      if (result.success) {
        toast.success(`Payment status updated to ${paymentStatus}`)
        // Update the order in the local state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, paymentStatus } : order
        ))
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

  const isAllSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length
  const isPartiallySelected = selectedOrders.length > 0 && !isAllSelected

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print Orders
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-700" />
              <span className="ml-2 text-green-700">Loading orders...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        data-state={isPartiallySelected ? "indeterminate" : isAllSelected ? "checked" : "unchecked"}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked: boolean) => handleSelectOrder(checked, order.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.user?.name || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">{order.user?.email || "No email"}</div>
                          </div>
                        </TableCell>
                        <TableCell>Rs. {order.total.toLocaleString()}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                        <TableCell>{getFulfillmentStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={isUpdating}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateOrderStatus(order.id, "PENDING")}
                                disabled={order.status === "PENDING" || isUpdating}
                              >
                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateOrderStatus(order.id, "PROCESSING")}
                                disabled={order.status === "PROCESSING" || isUpdating}
                              >
                                <Package className="mr-2 h-4 w-4 text-blue-500" />
                                Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateOrderStatus(order.id, "SHIPPED")}
                                disabled={order.status === "SHIPPED" || isUpdating}
                              >
                                <Truck className="mr-2 h-4 w-4 text-purple-500" />
                                Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateOrderStatus(order.id, "DELIVERED")}
                                disabled={order.status === "DELIVERED" || isUpdating}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Delivered
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdateOrderStatus(order.id, "CANCELLED")}
                                disabled={order.status === "CANCELLED" || isUpdating}
                              >
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Cancelled
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => handleUpdatePaymentStatus(order.id, "PENDING")}
                                disabled={order.paymentStatus === "PENDING" || isUpdating}
                              >
                                Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdatePaymentStatus(order.id, "PAID")}
                                disabled={order.paymentStatus === "PAID" || isUpdating}
                              >
                                Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdatePaymentStatus(order.id, "FAILED")}
                                disabled={order.paymentStatus === "FAILED" || isUpdating}
                              >
                                Failed
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUpdatePaymentStatus(order.id, "REFUNDED")}
                                disabled={order.paymentStatus === "REFUNDED" || isUpdating}
                              >
                                Refunded
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

