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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Upload } from "lucide-react"

// Sample collections for the dropdown
const collections = [
  { id: 1, name: "Best Sellers" },
  { id: 2, name: "New Arrivals" },
  { id: 3, name: "Premium" },
  { id: 4, name: "Gift Sets" },
  { id: 5, name: "Seasonal" },
]

// Sample categories for the dropdown
const categories = [
  { id: 1, name: "Soaps" },
  { id: 2, name: "Shampoos" },
  { id: 3, name: "Body Care" },
  { id: 4, name: "Accessories" },
]

export default function AddProductPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCollections, setSelectedCollections] = useState([])
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountedPrice: "",
    weight: "",
    stock: "",
    status: "draft",
    ingredients: "",
    benefits: "",
    howToUse: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductData({
      ...productData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setProductData({
      ...productData,
      [name]: value,
    })
  }

  const handleCollectionToggle = (collectionId) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(selectedCollections.filter((id) => id !== collectionId))
    } else {
      setSelectedCollections([...selectedCollections, collectionId])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to products page
      router.push("/admin/products")
    } catch (error) {
      console.error("Error adding product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/admin/products">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details of your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={productData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={productData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Rs.) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={productData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">Discounted Price (Rs.)</Label>
                    <Input
                      id="discountedPrice"
                      name="discountedPrice"
                      type="number"
                      value={productData.discountedPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight/Size</Label>
                    <Input
                      id="weight"
                      name="weight"
                      value={productData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 100 gram"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={productData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Add detailed information about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    name="ingredients"
                    value={productData.ingredients}
                    onChange={handleInputChange}
                    placeholder="List the ingredients used in this product"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    name="benefits"
                    value={productData.benefits}
                    onChange={handleInputChange}
                    placeholder="Describe the benefits of this product"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="howToUse">How to Use</Label>
                  <Textarea
                    id="howToUse"
                    name="howToUse"
                    value={productData.howToUse}
                    onChange={handleInputChange}
                    placeholder="Provide instructions on how to use this product"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload images of your product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="text-gray-700 font-medium mb-1">Drag and drop files</h3>
                      <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* This would show uploaded images */}
                      <div className="relative aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-400 text-sm">No images yet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Collections</CardTitle>
                <CardDescription>Assign this product to collections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collections.map((collection) => (
                    <div key={collection.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`collection-${collection.id}`}
                        checked={selectedCollections.includes(collection.id)}
                        onCheckedChange={() => handleCollectionToggle(collection.id)}
                      />
                      <Label
                        htmlFor={`collection-${collection.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {collection.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

