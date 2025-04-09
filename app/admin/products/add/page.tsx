"use client"

import { useState, useEffect } from "react"
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
import { createProduct, ProductFormData } from "@/app/actions/products.action"
import { ProductStatus } from "@prisma/client"
import { getCategories } from "@/app/actions/categories.action"
import { getCollections } from "@/app/actions/collections.action"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

// Define types for product data
interface ProductData {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  discountedPrice: string;
  weight: string;
  stock: string;
  status: ProductStatus;
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

export default function AddProductPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [productImages, setProductImages] = useState<string[]>([])
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    discountedPrice: "",
    weight: "",
    stock: "",
    status: "ACTIVE" as ProductStatus,
    ingredients: "",
    benefits: "",
    howToUse: "",
  })

  // Fetch categories and collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResult = await getCategories()
        if (categoriesResult.success) {
          setCategories(categoriesResult.data || [])
        }
        
        // Fetch collections
        const collectionsResult = await getCollections()
        if (collectionsResult.success) {
          setCollections(collectionsResult.data || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load categories and collections")
      }
    }

    fetchData()
  }, [])

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

  const handleCollectionToggle = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(selectedCollections.filter((id) => id !== collectionId))
    } else {
      setSelectedCollections([...selectedCollections, collectionId])
    }
  }

  const handleImagesChange = (images: string[]) => {
    setProductImages(images);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!productData.name || !productData.description || !productData.categoryId) {
        toast.error("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      // Create product data object - REVERTED: Still using existingImages
      const productFormData: ProductFormData = {
        ...productData,
        // Keep original type conversions/handling
        price: productData.price,
        discountedPrice: productData.discountedPrice,
        stock: productData.stock,
        benefits: productData.benefits, 
        collectionIds: selectedCollections,
        existingImages: productImages, // Send URLs for now
        images: null // Still sending null for File objects
      }

      // Create product
      const result = await createProduct(productFormData)
      
      if (result.success) {
        toast.success("Product created successfully")
        router.push("/admin/products")
      } else {
        toast.error(result.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("An error occurred while creating the product")
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
            {isLoading ? "Creating..." : "Create Product"}
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
                      value={productData.categoryId}
                      onValueChange={(value) => handleSelectChange("categoryId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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

