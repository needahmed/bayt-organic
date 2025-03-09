"use client"

import { useState } from "react"
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

export default function AddDiscountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDiscountData({
      ...discountData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setDiscountData({
      ...discountData,
      [name]: value,
    })
  }

  const handleRadioChange = (name, value) => {
    setDiscountData({
      ...discountData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to discounts page
      router.push("/admin/discounts")
    } catch (error) {
      console.error("Error adding discount:", error)
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold tracking-tight">Add New Discount</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/discounts")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Discount"}
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
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shipping" id="shipping" />
                      <Label htmlFor="shipping">Free shipping</Label>
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
                    {discountData.type === "shipping" && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shipping" id="shipping_only" />
                        <Label htmlFor="shipping_only">Shipping only</Label>
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {discountData.applicableTo === "specific_products" && (
                  <div className="space-y-2 border rounded-md p-4">
                    <Label>Select Products</Label>
                    <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <Label htmlFor={`product-${product.id}`} className="text-sm">
                            {product.name} <span className="text-gray-500">({product.category})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {discountData.applicableTo === "specific_collections" && (
                  <div className="space-y-2 border rounded-md p-4">
                    <Label>Select Collections</Label>
                    <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                      {collections.map((collection) => (
                        <div key={collection.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`collection-${collection.id}`}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <Label htmlFor={`collection-${collection.id}`} className="text-sm">
                            {collection.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

                <div className="grid grid-cols-2 gap-4">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

