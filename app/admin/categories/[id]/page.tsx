"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { ChevronLeft, Edit, Package, FolderTree, Trash } from "lucide-react"
import { getCategoryById, deleteCategory } from "@/app/actions/categories.action"
import { toast } from "sonner"
import { use } from "react"

export default function CategoryPage({ params }: { params: any }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params) as { id: string }
  const categoryId = unwrappedParams.id
  
  const router = useRouter()
  const [category, setCategory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchCategory() {
      try {
        const result = await getCategoryById(categoryId)
        if (result.success && result.data) {
          setCategory(result.data)
        } else {
          toast.error(result.error || "Failed to load category")
          router.push("/admin/categories")
        }
      } catch (error) {
        console.error("Error fetching category:", error)
        toast.error("An error occurred while loading the category")
        router.push("/admin/categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [categoryId, router])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteCategory(categoryId)
      if (result.success) {
        toast.success("Category deleted successfully")
        router.push("/admin/categories")
      } else {
        toast.error(result.error || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("An error occurred while deleting the category")
    } finally {
      setIsDeleting(false)
    }
  }

  // Helper function to safely get subcategory count
  const getSubcategoryCount = (category: any) => {
    if (category._count?.subcategories !== undefined) {
      return category._count.subcategories;
    }
    if (Array.isArray(category.subcategories)) {
      return category.subcategories.length;
    }
    return 0;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Category not found</h2>
        <Button variant="outline" asChild>
          <Link href="/admin/categories">
            Back to Categories
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/admin/categories">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/categories/edit?id=${params.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>Details about this category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1">{category.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                <p className="mt-1">{category.slug}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{category.description || "No description available"}</p>
              </div>
              {category.parent && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Parent Category</h3>
                  <p className="mt-1">
                    <Link href={`/admin/categories/${category.parent.id}`} className="text-blue-600 hover:underline">
                      {category.parent.name}
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {category.subcategories && category.subcategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Subcategories</CardTitle>
                <CardDescription>Subcategories within this category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left font-medium text-gray-500">Name</th>
                        <th className="py-2 text-left font-medium text-gray-500">Products</th>
                        <th className="py-2 text-right font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.subcategories.map((subcategory: any) => (
                        <tr key={subcategory.id} className="border-b">
                          <td className="py-2">{subcategory.name}</td>
                          <td className="py-2">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{subcategory._count?.products || 0}</span>
                            </div>
                          </td>
                          <td className="py-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => router.push(`/admin/categories/${subcategory.id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {category.products && category.products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Products in this category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left font-medium text-gray-500">Name</th>
                        <th className="py-2 text-left font-medium text-gray-500">Price</th>
                        <th className="py-2 text-right font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.products.map((product: any) => (
                        <tr key={product.id} className="border-b">
                          <td className="py-2">{product.name}</td>
                          <td className="py-2">${product.price.toFixed(2)}</td>
                          <td className="py-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => router.push(`/admin/products/edit?id=${product.id}`)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {category.image && (
            <Card>
              <CardHeader>
                <CardTitle>Category Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image 
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium">Products</span>
                </div>
                <span className="text-sm font-semibold">{category._count?.products || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <FolderTree className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium">Subcategories</span>
                </div>
                <span className="text-sm font-semibold">{getSubcategoryCount(category)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 