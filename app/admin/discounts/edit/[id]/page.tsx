"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"
import { getDiscountById, updateDiscount, DiscountFormData } from "@/app/actions/discounts.action"
import { toast } from "sonner"
import { DiscountType } from "@prisma/client"

// Sample products for the selection
const products = [
  { id: 1, name: "Charcoal and Tree Body Soap", category: "Soaps" },
  { id: 2, name: "Honey & Oats Body Soap", category: "Soaps" },
  { id: 3, name: "Coconut Milk Shampoo Bar", category: "Shampoos" },
  { id: 4, name: "Hair Growth Oil", category: "Body Care" },
  { id: 5, name: "Anti-Aging Face Serum", category: "Body Care" },
]

// Sample collections for the selection
const collections = [
  { id: 1, name: "Best Sellers" },
  { id: 2, name: "New Arrivals" },
  { id: 3, name: "Premium" },
]

export default function EditDiscountPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // Access id directly but with a comment to address the warning
  // In a future version of Next.js, we'll need to use React.use() to unwrap params
  const id = params.id
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(true)
  const [discountData, setDiscountData] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minOrderValue: "",
    applicableTo: "all",
    specificProducts: [],
    specificCollections: [],
    usageLimit: "",
    startDate: "",
    endDate: "",
    status: "active",
  })

  // Load discount data
  useEffect(() => {
    const loadDiscount = async () => {
      try {
        setIsLoadingDiscount(true)
        const result = await getDiscountById(id)
        
        if (!result.success || !result.data) {
          toast.error(result.error || "Failed to load discount")
          router.push("/admin/discounts")
          return
        }
        
        const discount = result.data
        
        // Format dates for input fields
        const formatDateForInput = (date: Date) => {
          const d = new Date(date)
          return d.toISOString().split('T')[0]
        }
        
        // Determine status based on isActive and dates
        let status = "active"
        if (!discount.isActive) {
          status = "disabled"
        } else if (new Date(discount.endDate) < new Date()) {
          status = "expired"
        } else if (new Date(discount.startDate) > new Date()) {
          status = "scheduled"
        }
        
        setDiscountData({
          code: discount.code,
          description: discount.description || "",
          type: discount.type === DiscountType.PERCENTAGE ? "percentage" : "fixed",
          value: discount.value.toString(),
          minOrderValue: discount.minAmount ? discount.minAmount.toString() : "",
          applicableTo: "all", // Default value
          specificProducts: [],
          specificCollections: [],
          usageLimit: "",
          startDate: formatDateForInput(discount.startDate),
          endDate: formatDateForInput(discount.endDate),
          status: status,
        })
      } catch (error) {
        console.error("Error loading discount:", error)
        toast.error("Failed to load discount")
      } finally {
        setIsLoadingDiscount(false)
      }
    }

    loadDiscount()
  }, [id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDiscountData({
      ...discountData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setDiscountData({
      ...discountData,
      [name]: value,
    })
  }

  const handleRadioChange = (name: string, value: string) => {
    setDiscountData({
      ...discountData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!discountData.code) {
        toast.error("Discount code is required")
        setIsLoading(false)
        return
      }

      if (!discountData.value) {
        toast.error("Discount value is required")
        setIsLoading(false)
        return
      }

      // Convert type to DiscountType enum
      const discountType = discountData.type === "percentage" ? 
        DiscountType.PERCENTAGE : DiscountType.FIXED;

      // Create discount data
      const formData: DiscountFormData = {
        code: discountData.code,
        description: discountData.description,
        type: discountType,
        value: parseFloat(discountData.value),
        minOrderValue: discountData.minOrderValue ? parseFloat(discountData.minOrderValue) : undefined,
        startDate: discountData.startDate || new Date(),
        endDate: discountData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default to 1 year
        isActive: discountData.status === "active" || discountData.status === "scheduled"
      }

      // Update discount
      const result = await updateDiscount(id, formData)
      
      if (result.success) {
        toast.success("Discount updated successfully")
        router.push("/admin/discounts")
      } else {
        toast.error(result.error || "Failed to update discount")
      }
    } catch (error) {
      console.error("Error updating discount:", error)
      toast.error("An error occurred while updating the discount")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingDiscount) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading discount...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/admin/discounts">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Discount</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/discounts")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="limits">Usage Limits</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic details about your discount</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Discount Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    value={discountData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., SUMMER20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={discountData.description}
                    onChange={handleInputChange}
                    placeholder="Enter discount description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Discount Type *</Label>
                  <RadioGroup
                    value={discountData.type}
                    onValueChange={(value) => handleRadioChange("type", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage">Percentage discount</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed amount discount</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Discount Value *</Label>
                  <div className="flex items-center">
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      value={discountData.value}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      className="flex-1"
                    />
                    <span className="ml-2 text-gray-500">{discountData.type === "percentage" ? "%" : "Rs."}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={discountData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Discount Conditions</CardTitle>
                <CardDescription>Set conditions for when this discount applies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">Minimum Order Value (Rs.)</Label>
                  <Input
                    id="minOrderValue"
                    name="minOrderValue"
                    type="number"
                    value={discountData.minOrderValue}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500">Leave blank for no minimum</p>
                </div>

                <div className="space-y-2">
                  <Label>Applicable To</Label>
                  <RadioGroup
                    value={discountData.applicableTo}
                    onValueChange={(value) => handleRadioChange("applicableTo", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">All products</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific_products" id="specific_products" />
                      <Label htmlFor="specific_products">Specific products</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific_collections" id="specific_collections" />
                      <Label htmlFor="specific_collections">Specific collections</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
                <CardDescription>Set limits on how this discount can be used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    value={discountData.usageLimit}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500">Leave blank for unlimited uses</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={discountData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={discountData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
} 