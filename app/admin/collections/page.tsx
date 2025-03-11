"use client"

import { useState, useEffect } from "react"
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
import { getCollections } from "@/app/actions/collections.action"
import { toast } from "sonner"

// Define Collection type
interface Collection {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  slug: string;
  _count?: {
    products: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function CollectionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch collections from the database
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true)
        const result = await getCollections()
        
        if (result.success) {
          setCollections(result.data || [])
        } else {
          toast.error(result.error || "Failed to load collections")
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
        toast.error("An error occurred while loading collections")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (collection.description && collection.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCollections(filteredCollections.map((collection) => collection.id.toString()))
    } else {
      setSelectedCollections([])
    }
  }

  const handleSelectCollection = (checked: boolean, collectionId: string) => {
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
                      data-state={isPartiallySelected ? "indeterminate" : isAllSelected ? "checked" : "unchecked"}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                        <span>Loading collections...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCollections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No collections found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCollections.includes(collection.id.toString())}
                          onCheckedChange={(checked: boolean) => handleSelectCollection(checked, collection.id.toString())}
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
                          <span>{collection._count?.products || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-sm">-</span>
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

