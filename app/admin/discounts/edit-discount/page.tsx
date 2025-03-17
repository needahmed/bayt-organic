"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

interface DiscountFormState {
  code: string;
  description: string;
  type: string;
  value: string;
  minOrderValue: string;
  applicableTo: string;
  specificProducts: string[];
  specificCollections: string[];
  startDate: string;
  endDate: string;
  usageLimit: string;
  isActive: boolean;
}

export default function EditDiscountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(true)
  const [discountData, setDiscountData] = useState<DiscountFormState>({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minOrderValue: "",
    applicableTo: "all",
    specificProducts: [],
    specificCollections: [],
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true
  })

  // Load discount data
  useEffect(() => {
    if (!id) {
      toast.error("Discount ID is required")
      router.push("/admin/discounts")
      return
    }
    
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
          if (!date) return ""
          const d = new Date(date)
          return d.toISOString().split('T')[0]
        }
        
        setDiscountData({
          code: discount.code,
          description: discount.description || "",
          type: discount.type.toLowerCase(),
          value: discount.value.toString(),
          minOrderValue: discount.minAmount?.toString() || "",
          applicableTo: "all", // Default value
          specificProducts: [],
          specificCollections: [],
          startDate: formatDateForInput(discount.startDate),
          endDate: formatDateForInput(discount.endDate),
          usageLimit: "",
          isActive: discount.isActive
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
    
    if (!id) {
      toast.error("Discount ID is required")
      return
    }
    
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

      // Create discount form data
      const discountFormData: DiscountFormData = {
        code: discountData.code,
        description: discountData.description,
        type: discountData.type as DiscountType,
        value: parseFloat(discountData.value),
        minOrderValue: discountData.minOrderValue ? parseFloat(discountData.minOrderValue) : undefined,
        applicableTo: discountData.applicableTo,
        startDate: discountData.startDate ? new Date(discountData.startDate) : undefined,
        endDate: discountData.endDate ? new Date(discountData.endDate) : undefined,
        usageLimit: discountData.usageLimit ? parseInt(discountData.usageLimit) : undefined,
        isActive: discountData.isActive
      }

      const result = await updateDiscount(id, discountFormData)
      
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

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Discount Information</CardTitle>
              <CardDescription>Basic information about the discount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Discount Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    value={discountData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. SUMMER20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <Select
                    value={discountData.isActive ? "active" : "inactive"}
                    onValueChange={(value) => 
                      setDiscountData({
                        ...discountData,
                        isActive: value === "active"
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <Label>Discount Type</Label>
                <RadioGroup
                  value={discountData.type}
                  onValueChange={(value) => handleRadioChange("type", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage">Percentage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed Amount</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  {discountData.type === "percentage" ? "Percentage Value *" : "Fixed Amount *"}
                </Label>
                <div className="relative">
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    value={discountData.value}
                    onChange={handleInputChange}
                    placeholder={discountData.type === "percentage" ? "e.g. 20" : "e.g. 500"}
                    className="pl-8"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">{discountData.type === "percentage" ? "%" : "Rs."}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Discount Conditions</CardTitle>
              <CardDescription>Set conditions for when this discount applies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Minimum Order Value</Label>
                <div className="relative">
                  <Input
                    id="minOrderValue"
                    name="minOrderValue"
                    type="number"
                    value={discountData.minOrderValue}
                    onChange={handleInputChange}
                    placeholder="e.g. 1000"
                    className="pl-8"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Leave empty for no minimum</p>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Applicable To</Label>
                <RadioGroup
                  value={discountData.applicableTo}
                  onValueChange={(value) => handleRadioChange("applicableTo", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Products</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific_products" id="specific_products" />
                    <Label htmlFor="specific_products">Specific Products</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific_collections" id="specific_collections" />
                    <Label htmlFor="specific_collections">Specific Collections</Label>
                  </div>
                </RadioGroup>
              </div>

              {discountData.applicableTo === "specific_products" && (
                <div className="space-y-2 pt-4">
                  <Label>Select Products</Label>
                  <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2 py-2">
                        <input
                          type="checkbox"
                          id={`product-${product.id}`}
                          checked={discountData.specificProducts.includes(product.id.toString())}
                          onChange={(e) => {
                            const productId = product.id.toString()
                            if (e.target.checked) {
                              setDiscountData({
                                ...discountData,
                                specificProducts: [...discountData.specificProducts, productId]
                              })
                            } else {
                              setDiscountData({
                                ...discountData,
                                specificProducts: discountData.specificProducts.filter(id => id !== productId)
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`product-${product.id}`} className="cursor-pointer">
                          {product.name}
                          <span className="text-sm text-gray-500 ml-2">({product.category})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {discountData.applicableTo === "specific_collections" && (
                <div className="space-y-2 pt-4">
                  <Label>Select Collections</Label>
                  <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                    {collections.map((collection) => (
                      <div key={collection.id} className="flex items-center space-x-2 py-2">
                        <input
                          type="checkbox"
                          id={`collection-${collection.id}`}
                          checked={discountData.specificCollections.includes(collection.id.toString())}
                          onChange={(e) => {
                            const collectionId = collection.id.toString()
                            if (e.target.checked) {
                              setDiscountData({
                                ...discountData,
                                specificCollections: [...discountData.specificCollections, collectionId]
                              })
                            } else {
                              setDiscountData({
                                ...discountData,
                                specificCollections: discountData.specificCollections.filter(id => id !== collectionId)
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`collection-${collection.id}`} className="cursor-pointer">
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

        <TabsContent value="limits" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Discount Limits</CardTitle>
              <CardDescription>Set usage limits and validity period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  value={discountData.usageLimit}
                  onChange={handleInputChange}
                  placeholder="e.g. 100"
                />
                <p className="text-sm text-gray-500">Leave empty for unlimited usage</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2 justify-end">
        <Button variant="outline" onClick={() => router.push("/admin/discounts")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
} 