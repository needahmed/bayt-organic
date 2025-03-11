"use client"

import { useState } from "react"
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
import { Search, MoreHorizontal, Eye, Printer, Package, Truck, CheckCircle, XCircle, Filter } from "lucide-react"

// Sample orders data
const orders = [
  {
    id: "ORD-001",
    customer: "Sarah M.",
    email: "sarah@example.com",
    date: "2023-07-15",
    total: 3700,
    items: 3,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
  },
  {
    id: "ORD-002",
    customer: "Ahmed K.",
    email: "ahmed@example.com",
    date: "2023-07-14",
    total: 2100,
    items: 2,
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
  },
  {
    id: "ORD-003",
    customer: "Layla R.",
    email: "layla@example.com",
    date: "2023-07-13",
    total: 4500,
    items: 4,
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
  },
  {
    id: "ORD-004",
    customer: "Tariq A.",
    email: "tariq@example.com",
    date: "2023-07-12",
    total: 1800,
    items: 1,
    paymentStatus: "Pending",
    fulfillmentStatus: "Unfulfilled",
  },
  {
    id: "ORD-005",
    customer: "Zainab H.",
    email: "zainab@example.com",
    date: "2023-07-11",
    total: 2800,
    items: 3,
    paymentStatus: "Failed",
    fulfillmentStatus: "Cancelled",
  },
  {
    id: "ORD-006",
    customer: "Omar J.",
    email: "omar@example.com",
    date: "2023-07-10",
    total: 3200,
    items: 2,
    paymentStatus: "Refunded",
    fulfillmentStatus: "Returned",
  },
  {
    id: "ORD-007",
    customer: "Fatima S.",
    email: "fatima@example.com",
    date: "2023-07-09",
    total: 1500,
    items: 1,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const isAllSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length
  const isPartiallySelected = selectedOrders.length > 0 && !isAllSelected

  const getFulfillmentStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>
      case "Shipped":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Shipped</Badge>
      case "Processing":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Processing</Badge>
      case "Unfulfilled":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unfulfilled</Badge>
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      case "Returned":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Returned</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
      case "Failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      case "Refunded":
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
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-xs text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>Rs. {order.total.toLocaleString()}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell>{getFulfillmentStatusBadge(order.fulfillmentStatus)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Mark as Processed
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
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
        </CardContent>
      </Card>
    </div>
  )
}

