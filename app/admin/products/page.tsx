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
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, Tag } from "lucide-react"
import { useRouter } from "next/navigation"

// Sample product data
const products = [
  {
    id: 1,
    name: "Charcoal and Tree Body Soap",
    price: 900,
    discountedPrice: 0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Soaps",
    collections: ["Best Sellers", "New Arrivals"],
    stock: 25,
    status: "Active",
  },
  {
    id: 2,
    name: "Honey & Oats Body Soap",
    price: 1000,
    discountedPrice: 900,
    image: "/placeholder.svg?height=300&width=300",
    category: "Soaps",
    collections: ["Best Sellers"],
    stock: 18,
    status: "Active",
  },
  {
    id: 3,
    name: "Coconut Milk Shampoo Bar",
    price: 1200,
    discountedPrice: 0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Shampoos",
    collections: ["New Arrivals"],
    stock: 12,
    status: "Active",
  },
  {
    id: 4,
    name: "Hair Growth Oil",
    price: 1500,
    discountedPrice: 1350,
    image: "/placeholder.svg?height=300&width=300",
    category: "Body Care",
    collections: ["Best Sellers"],
    stock: 8,
    status: "Active",
  },
  {
    id: 5,
    name: "Anti-Aging Face Serum",
    price: 1500,
    discountedPrice: 0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Body Care",
    collections: ["Premium"],
    stock: 15,
    status: "Active",
  },
  {
    id: 6,
    name: "Lavender Lip Balm",
    price: 500,
    discountedPrice: 0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Body Care",
    collections: [],
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 7,
    name: "Dental Powder",
    price: 700,
    discountedPrice: 0,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
    collections: [],
    stock: 5,
    status: "Active",
  },
]

export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducts, setSelectedProducts] = useState([])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((product) => product.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (checked, productId) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }

  const isAllSelected = filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length
  const isPartiallySelected = selectedProducts.length > 0 && !isAllSelected

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
                          onCheckedChange={(checked) => handleSelectProduct(checked, product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.collections.length > 0 ? (
                            product.collections.map((collection) => (
                              <Badge key={collection} variant="outline" className="text-xs">
                                {collection}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.discountedPrice > 0 ? (
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
                            product.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/products/edit/${product.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Tag className="mr-2 h-4 w-4" />
                              Manage Collections
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
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

