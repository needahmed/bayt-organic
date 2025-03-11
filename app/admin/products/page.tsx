"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
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
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, Tag, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getProducts, deleteProduct } from "@/app/actions/products.action"
import { Product, ProductStatus } from "@prisma/client"
import { toast } from "sonner"
import { ManageProductCollections } from "@/components/admin/manage-product-collections"

// Define the product type with related entities
type ProductWithRelations = Product & {
  category: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
  collections: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
  }[];
};

export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const result = await getProducts()
      if (result.success) {
        setProducts(result.data as ProductWithRelations[])
      } else {
        setError(result.error || "Unknown error")
      }
    } catch (err) {
      setError("Failed to fetch products")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((product) => product.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (checked: boolean, productId: string) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const result = await deleteProduct(productId)
        if (result.success) {
          toast.success("Product deleted successfully")
          // Remove the product from the state
          setProducts(products.filter(product => product.id !== productId))
        } else {
          toast.error(result.error || "Failed to delete product")
        }
      } catch (err) {
        toast.error("An error occurred while deleting the product")
        console.error(err)
      }
    }
  }

  const isAllSelected = filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length
  const isPartiallySelected = selectedProducts.length > 0 && !isAllSelected

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-green-700">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" />
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button
          className="bg-green-700 hover:bg-green-800 text-white"
          onClick={() => router.push("/admin/products/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
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
                      data-state={isPartiallySelected ? "indeterminate" : undefined}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(checked as boolean, product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.collections.length > 0 ? (
                            product.collections.map((collection) => (
                              <Badge key={collection.id} variant="outline" className="text-xs">
                                {collection.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.discountedPrice ? (
                          <div>
                            <span className="text-muted-foreground line-through text-xs">Rs. {product.price}</span>
                            <span className="ml-1 font-medium">Rs. {product.discountedPrice}</span>
                          </div>
                        ) : (
                          <span>Rs. {product.price}</span>
                        )}
                      </TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.status === ProductStatus.ACTIVE
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : product.status === ProductStatus.OUT_OF_STOCK
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/products/${product.category.slug}/${product.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/products/edit/${product.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <ManageProductCollections 
                                productId={product.id} 
                                onSaved={fetchProducts}
                                trigger={
                                  <div className="flex items-center w-full px-2 py-1.5 text-sm">
                                    <Tag className="mr-2 h-4 w-4" />
                                    Manage Collections
                                  </div>
                                }
                              />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
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

