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
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, Package, FolderTree } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCategories, deleteCategory, migrateCategories } from "@/app/actions/categories.action"
import { toast } from "sonner"

// Define Category type
interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  slug: string;
  parentId: string | null;
  parent?: {
    id: string;
    name: string;
  } | null;
  _count?: {
    products: number;
    subcategories?: number;
  };
  subcategories?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export default function CategoriesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch categories from the database
  useEffect(() => {
    const initCategories = async () => {
      try {
        // First migrate any existing categories that need updates
        await migrateCategories();
        // Then fetch all categories
        await fetchCategories();
      } catch (error) {
        console.error("Error initializing categories:", error);
        toast.error("An error occurred while initializing categories");
      }
    };
    
    initCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const result = await getCategories()
      
      if (result.success) {
        setCategories(result.data || [])
      } else {
        toast.error(result.error || "Failed to load categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("An error occurred while loading categories")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Helper function to safely get subcategory count
  const getSubcategoryCount = (category: Category) => {
    if (category._count?.subcategories !== undefined) {
      return category._count.subcategories;
    }
    if (Array.isArray(category.subcategories)) {
      return category.subcategories.length;
    }
    return 0;
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(filteredCategories.map((category) => category.id.toString()))
    } else {
      setSelectedCategories([])
    }
  }

  const handleSelectCategory = (checked: boolean, categoryId: string) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      setDeletingId(id)
      const result = await deleteCategory(id)
      
      if (result.success) {
        toast.success("Category deleted successfully")
        // Remove from selected categories if it was selected
        setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id))
        // Refresh the categories list
        fetchCategories()
      } else {
        toast.error(result.error || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("An error occurred while deleting the category")
    } finally {
      setDeletingId(null)
    }
  }

  const isAllSelected = filteredCategories.length > 0 && selectedCategories.length === filteredCategories.length
  const isPartiallySelected = selectedCategories.length > 0 && !isAllSelected

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories and subcategories</p>
        </div>
        <Button
          className="bg-green-700 hover:bg-green-800 text-white"
          onClick={() => router.push("/admin/categories/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search categories..."
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
                  <TableHead>Category</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                        <span>Loading categories...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCategories.includes(category.id.toString())}
                          onCheckedChange={(checked: boolean) => handleSelectCategory(checked, category.id.toString())}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        {category.parent ? (
                          <span className="text-sm">{category.parent.name}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{category._count?.products || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FolderTree className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{getSubcategoryCount(category)}</span>
                        </div>
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/categories/edit?id=${category.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCategory(category.id)}
                              disabled={deletingId === category.id}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {deletingId === category.id ? "Deleting..." : "Delete"}
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