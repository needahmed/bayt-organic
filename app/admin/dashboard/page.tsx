"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users, ArrowUp, ArrowDown } from "lucide-react"

// Sample data for the dashboard
const recentOrders = [
  {
    id: "ORD-001",
    customer: "Sarah M.",
    date: "2 hours ago",
    status: "Processing",
    amount: 3700,
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Ahmed K.",
    date: "5 hours ago",
    status: "Shipped",
    amount: 2100,
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "Layla R.",
    date: "1 day ago",
    status: "Delivered",
    amount: 4500,
    items: 4,
  },
  {
    id: "ORD-004",
    customer: "Tariq A.",
    date: "2 days ago",
    status: "Delivered",
    amount: 1800,
    items: 1,
  },
]

// Sample chart data
const salesData = {
  daily: [1200, 1800, 1400, 2100, 1700, 2300, 2500],
  weekly: [8500, 9200, 7800, 10500, 11200, 9800, 12500],
  monthly: [35000, 42000, 38000, 45000, 52000, 48000, 56000],
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("daily")
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Add error boundary and initialization
  useEffect(() => {
    try {
      console.log("Admin dashboard component mounted");
      setIsLoaded(true);
    } catch (err) {
      console.error("Error in admin dashboard:", err);
      setError(err);
    }
  }, []);

  // If there's an error, show it
  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Error Loading Dashboard</h2>
        <p>{error.message || "An unknown error occurred"}</p>
        <pre className="mt-4 p-4 bg-white rounded overflow-auto text-sm">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  // Show a loading indicator until we're sure the component is mounted
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store's performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white">
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                  <span className="text-2xl font-bold">Rs. 124,500</span>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>12% from last month</span>
                  </div>
                </div>
                <div className="rounded-full bg-green-100 p-3 text-green-700">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Total Orders</span>
                  <span className="text-2xl font-bold">78</span>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>8% from last month</span>
                  </div>
                </div>
                <div className="rounded-full bg-pink-100 p-3 text-pink-700">
                  <ShoppingCart className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Total Products</span>
                  <span className="text-2xl font-bold">32</span>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>4 new this month</span>
                  </div>
                </div>
                <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Total Customers</span>
                  <span className="text-2xl font-bold">156</span>
                  <div className="flex items-center text-sm text-red-600">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    <span>3% from last month</span>
                  </div>
                </div>
                <div className="rounded-full bg-orange-100 p-3 text-orange-700">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>View your sales performance over time</CardDescription>
          <Tabs defaultValue="daily" className="w-full" onValueChange={setTimeRange}>
            <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {/* This would be a chart component in a real app */}
            <div className="flex h-full items-end gap-2 pb-6">
              {salesData[timeRange].map((value, index) => (
                <div
                  key={index}
                  className="relative flex-1 rounded-t-md bg-green-600 transition-all duration-300"
                  style={{ height: `${(value / Math.max(...salesData[timeRange])) * 80}%` }}
                >
                  <div className="absolute -top-7 w-full text-center text-xs font-medium">
                    {timeRange === "daily" ? `Rs. ${value}` : `Rs. ${value / 1000}k`}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {timeRange === "daily" && (
                <>
                  <div className="text-xs">Mon</div>
                  <div className="text-xs">Tue</div>
                  <div className="text-xs">Wed</div>
                  <div className="text-xs">Thu</div>
                  <div className="text-xs">Fri</div>
                  <div className="text-xs">Sat</div>
                  <div className="text-xs">Sun</div>
                </>
              )}
              {timeRange === "weekly" && (
                <>
                  <div className="text-xs">Week 1</div>
                  <div className="text-xs">Week 2</div>
                  <div className="text-xs">Week 3</div>
                  <div className="text-xs">Week 4</div>
                  <div className="text-xs">Week 5</div>
                  <div className="text-xs">Week 6</div>
                  <div className="text-xs">Week 7</div>
                </>
              )}
              {timeRange === "monthly" && (
                <>
                  <div className="text-xs">Jan</div>
                  <div className="text-xs">Feb</div>
                  <div className="text-xs">Mar</div>
                  <div className="text-xs">Apr</div>
                  <div className="text-xs">May</div>
                  <div className="text-xs">Jun</div>
                  <div className="text-xs">Jul</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`/placeholder.svg?height=36&width=36&text=${order.customer.charAt(0)}`} />
                    <AvatarFallback>{order.customer.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Rs. {order.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{order.items} items</p>
                  </div>
                  <Badge
                    className={
                      order.status === "Processing"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : order.status === "Shipped"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                    }
                  >
                    {order.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

