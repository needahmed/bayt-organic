"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users, ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { getDashboardAnalytics } from "@/app/actions/dashboard.action"
import { toast } from "sonner"
import Link from "next/link"
import { InvoiceDialog } from "@/components/ui/invoice-dialog"

// Type definition for time range in charts
type TimeRangeKey = 'daily' | 'weekly' | 'monthly';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("daily")
  const [error, setError] = useState<Error | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)

  // Load dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        console.log("Admin dashboard component mounted");
        const result = await getDashboardAnalytics();
        
        if (result.success && result.data) {
          setDashboardData(result.data);
        } else {
          setError(new Error(result.error || "Failed to load dashboard data"));
        }
      } catch (err) {
        console.error("Error in admin dashboard:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoaded(true);
      }
    }
    
    loadDashboardData();
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
  if (!isLoaded || !dashboardData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-700 mx-auto mb-4" />
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
          <InvoiceDialog />
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Link href="/admin/analytics">
            <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white">
              View Analytics
            </Button>
          </Link>
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
                  <span className="text-2xl font-bold">Rs. {dashboardData.totalRevenue.toLocaleString()}</span>
                  <div className={`flex items-center text-sm ${dashboardData.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.revenueChange >= 0 ? 
                      <ArrowUp className="h-4 w-4 mr-1" /> : 
                      <ArrowDown className="h-4 w-4 mr-1" />
                    }
                    <span>{Math.abs(dashboardData.revenueChange)}% from last month</span>
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
                  <span className="text-2xl font-bold">{dashboardData.totalOrders}</span>
                  <div className={`flex items-center text-sm ${dashboardData.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.ordersChange >= 0 ? 
                      <ArrowUp className="h-4 w-4 mr-1" /> : 
                      <ArrowDown className="h-4 w-4 mr-1" />
                    }
                    <span>{Math.abs(dashboardData.ordersChange)}% from last month</span>
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
                  <span className="text-2xl font-bold">{dashboardData.totalProducts}</span>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span>{dashboardData.productsChange}% new this month</span>
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
                  <span className="text-2xl font-bold">{dashboardData.totalCustomers}</span>
                  <div className={`flex items-center text-sm ${dashboardData.customersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dashboardData.customersChange >= 0 ? 
                      <ArrowUp className="h-4 w-4 mr-1" /> : 
                      <ArrowDown className="h-4 w-4 mr-1" />
                    }
                    <span>{Math.abs(dashboardData.customersChange)}% from last month</span>
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
          <Tabs defaultValue="daily" className="w-full" onValueChange={(value: string) => setTimeRange(value as TimeRangeKey)}>
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
              {dashboardData.salesData[timeRange].map((value: number, index: number) => (
                <div
                  key={index}
                  className="relative flex-1 rounded-t-md bg-green-600 transition-all duration-300"
                  style={{ height: `${(value / Math.max(...dashboardData.salesData[timeRange])) * 80}%` }}
                >
                  <div className="absolute -top-7 w-full text-center text-xs font-medium">
                    {timeRange === "daily" ? `Rs. ${value.toLocaleString()}` : `Rs. ${(value / 1000).toFixed(1)}k`}
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
            {dashboardData.recentOrders.map((order: any) => (
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
                      order.status === "PROCESSING"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : order.status === "SHIPPED"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {order.status}
                  </Badge>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

