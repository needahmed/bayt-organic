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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Upload, X } from "lucide-react"
import { updateProduct, getProductById } from "@/app/actions/products.action"
import { getCategories } from "@/app/actions/categories.action"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"
import { ManageProductCollections } from "@/components/admin/manage-product-collections"
import { useParamId } from "@/app/utils/params"

// Define types for product data
interface ProductData {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  discountedPrice: string;
  weight: string;
  stock: string;
  status: string;
  ingredients: string;
  benefits: string;
  howToUse: string;
}

// Define type for category and collection
interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  productIds?: string[];
}

export default function EditProductPage({ params }: { params: any }) {
  // Safely extract ID from params using the utility function
  const id = useParamId(params);

  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [productImages, setProductImages] = useState<string[]>([])
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    discountedPrice: "",
    weight: "",
    stock: "",
    status: "ACTIVE",
    ingredients: "",
    benefits: "",
    howToUse: "",
  })
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [categoriesResult, productResult] = await Promise.all([
          getCategories(),
          getProductById(id)
        ])
        
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data)
        }
        
        if (productResult.success && productResult.data) {
          const product = productResult.data
          
          setProductData({
            name: product.name || "",
            description: product.description || "",
            categoryId: product.categoryId || "",
            price: product.price?.toString() || "",
            discountedPrice: product.discountedPrice?.toString() || "",
            weight: product.weight || "",
            stock: product.stock?.toString() || "",
            status: product.status || "ACTIVE",
            ingredients: product.ingredients || "",
            benefits: Array.isArray(product.benefits) ? product.benefits.join(', ') : "",
            howToUse: product.howToUse || "",
          })
          
          // Set product images directly as URLs
          setProductImages(Array.isArray(product.images) ? product.images : [])
        } else {
          toast.error("Failed to load product data")
          router.push("/admin/products")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("An error occurred while loading data")
      } finally {
        setIsInitialLoading(false)
      }
    }
    
    fetchProductData()
  }, [id, router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductData({
      ...productData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setProductData({
      ...productData,
      [name]: value,
    })
  }
  
  const handleImagesChange = (images: string[]) => {
    setProductImages(images);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      
      // Add product data
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })
      
      // Add images - these are now URLs, not Files
      productImages.forEach(url => {
        formData.append('existingImages', url)
      })
      
      // Update product
      const result = await updateProduct(id, formData as any)
      
      if (result.success) {
        toast.success("Product updated successfully")
        router.push("/admin/products")
      } else {
        toast.error(result.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("An error occurred while updating the product")
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Attributes</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
          
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
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={productData.categoryId}
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={productData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="List the ingredients"
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    name="benefits"
                    value={productData.benefits}
                    onChange={handleInputChange}
                    placeholder="Describe the benefits"
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="howToUse">How to Use</Label>
                  <Textarea
                    id="howToUse"
                    name="howToUse"
                    value={productData.howToUse}
                    onChange={handleInputChange}
                    placeholder="Explain how to use the product"
                    className="min-h-32"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload and manage product images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload 
                  images={productImages}
                  onChange={handleImagesChange}
                  maxImages={5}
                />
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
                <ManageProductCollections productId={id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 