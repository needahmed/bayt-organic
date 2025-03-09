"use client"

import { useState } from "react"
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
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, Package } from "lucide-react"
import { useRouter } from "next/navigation"

// Sample collections data
const collections = [
  {
    id: 1,
    name: "Best Sellers",
    description: "Our most popular products",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 12,
    status: "Active",
    featured: true,
  },
  {
    id: 2,
    name: "New Arrivals",
    description: "Recently added products",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 8,
    status: "Active",
    featured: true,
  },
  {
    id: 3,
    name: "Premium",
    description: "Luxury and high-end products",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 5,
    status: "Active",
    featured: false,
  },
  {
    id: 4,
    name: "Gift Sets",
    description: "Perfect for gifting",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 4,
    status: "Active",
    featured: true,
  },
  {
    id: 5,
    name: "Seasonal",
    description: "Limited time collections",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 0,
    status: "Draft",
    featured: false,
  },
]

export default function CollectionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollections, setSelectedCollections] = useState([])

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCollections(filteredCollections.map((collection) => collection.id))
    } else {
      setSelectedCollections([])
    }
  }

  const handleSelectCollection = (checked, collectionId) => {
    if (checked) {
      setSelectedCollections([...selectedCollections, collectionId])
    } else {
      setSelectedCollections(selectedCollections.filter((id) => id !== collectionId))
    }
  }

  const isAllSelected = filteredCollections.length > 0 && selectedCollections.length === filteredCollections.length
  const isPartiallySelected = selectedCollections.length > 0 && !isAllSelected

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Organize your products into collections</p>
        </div>
        <Button
          className="bg-green-700 hover:bg-green-800 text-white"
          onClick={() => router.push("/admin/collections/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search collections..."
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
                      indeterminate={isPartiallySelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No collections found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCollections.includes(collection.id)}
                          onCheckedChange={(checked) => handleSelectCollection(checked, collection.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={collection.image || "/placeholder.svg"}
                            alt={collection.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{collection.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{collection.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{collection.productCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            collection.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {collection.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {collection.featured ? (
                          <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/collections/${collection.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/collections/edit/${collection.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Manage Products
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

