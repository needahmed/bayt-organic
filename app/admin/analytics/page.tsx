"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, BarChart4, LineChart, PieChart, TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react"
import { getDashboardAnalytics } from "@/app/actions/dashboard.action"
import { toast } from "sonner"
import Link from "next/link"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("last30")
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true)
        const result = await getDashboardAnalytics()
        
        if (result.success && result.data) {
          setAnalytics(result.data)
        } else {
          toast.error(result.error || "Failed to load analytics")
        }
      } catch (error) {
        console.error("Error loading analytics:", error)
        toast.error("An error occurred while loading analytics")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-700 mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-2">Analytics</h1>
          <p className="text-muted-foreground">Detailed performance metrics for your store</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Revenue Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">Rs. {analytics.totalRevenue.toLocaleString()}</div>
                    <div className={`text-xs ${analytics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analytics.revenueChange >= 0 ? '+' : ''}{analytics.revenueChange}% from last month
                    </div>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 text-green-700">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                    <div className={`text-xs ${analytics.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analytics.ordersChange >= 0 ? '+' : ''}{analytics.ordersChange}% from last month
                    </div>
                  </div>
                  <div className="rounded-full bg-pink-100 p-3 text-pink-700">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                    <div className={`text-xs ${analytics.productsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analytics.productsChange >= 0 ? '+' : ''}{analytics.productsChange}% new this month
                    </div>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                    <BarChart4 className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customers Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
                    <div className={`text-xs ${analytics.customersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analytics.customersChange >= 0 ? '+' : ''}{analytics.customersChange}% from last month
                    </div>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3 text-orange-700">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Daily revenue for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end gap-2 pb-6">
                  {analytics.salesData.daily.map((value: number, index: number) => (
                    <div
                      key={index}
                      className="relative flex-1 rounded-t-md bg-green-600 transition-all duration-300"
                      style={{ height: `${(value / Math.max(...analytics.salesData.daily)) * 80}%` }}
                    >
                      <div className="absolute -top-7 w-full text-center text-xs font-medium">
                        Rs. {value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-xs">Mon</div>
                  <div className="text-xs">Tue</div>
                  <div className="text-xs">Wed</div>
                  <div className="text-xs">Thu</div>
                  <div className="text-xs">Fri</div>
                  <div className="text-xs">Sat</div>
                  <div className="text-xs">Sun</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Detailed sales metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12 text-muted-foreground">
                <LineChart className="h-12 w-12 mx-auto mb-4 text-green-700" />
                <h3 className="text-lg font-semibold">Detailed Sales Analytics</h3>
                <p>More detailed sales metrics coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
              <CardDescription>Product performance insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12 text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-4 text-green-700" />
                <h3 className="text-lg font-semibold">Product Performance</h3>
                <p>Product analytics coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Customer behavior and demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-700" />
                <h3 className="text-lg font-semibold">Customer Insights</h3>
                <p>Customer analytics coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 