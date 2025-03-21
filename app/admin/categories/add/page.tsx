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
import { ChevronLeft, Upload } from "lucide-react"
import { toast } from "sonner"
import { createCategory, getParentCategories, CategoryFormData } from "@/app/actions/categories.action"

export default function AddCategoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingParents, setIsLoadingParents] = useState(true)
  const [parentCategories, setParentCategories] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    parentId: "",
  })

  // Fetch parent categories
  useEffect(() => {
    async function fetchParentCategories() {
      try {
        setIsLoadingParents(true);
        const result = await getParentCategories();
        console.log("Parent categories result:", result);
        
        if (result.success && result.data) {
          setParentCategories(result.data || []);
        } else {
          toast.error(result.error || "Failed to load parent categories");
        }
      } catch (error) {
        console.error("Error fetching parent categories:", error);
        toast.error("An error occurred while loading parent categories");
      } finally {
        setIsLoadingParents(false);
      }
    }

    fetchParentCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCategoryData({
      ...categoryData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setCategoryData({
      ...categoryData,
      [name]: value === "none" ? "" : value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
      
      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(fileUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!categoryData.name) {
        toast.error("Category name is required")
        setIsLoading(false)
        return
      }

      // Generate a slug from the name
      const slug = categoryData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      // Create category form data
      const formData: CategoryFormData = {
        name: categoryData.name,
        slug: slug,
        description: categoryData.description,
        parentId: categoryData.parentId || null,
      }

      // Add the image if one was selected
      if (selectedFile) {
        formData.image = selectedFile
      }

      const result = await createCategory(formData)

      if (result.success) {
        toast.success("Category created successfully")
        router.push("/admin/categories")
      } else {
        toast.error(result.error || "Failed to create category")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error("An error occurred while creating the category")
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold tracking-tight">Add New Category</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/categories")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>Create a new category to organize your products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={categoryData.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category</Label>
            <Select 
              value={categoryData.parentId || "none"} 
              onValueChange={(value) => handleSelectChange("parentId", value)}
              disabled={isLoadingParents}
            >
              <SelectTrigger>
                <SelectValue placeholder="None (top-level category)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (top-level category)</SelectItem>
                {parentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingParents && <p className="text-sm text-muted-foreground mt-2">Loading parent categories...</p>}
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              {previewUrl ? (
                <div className="mx-auto flex flex-col items-center justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-md mb-4">
                    <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="mx-auto flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-gray-700 font-medium mb-1">Drag and drop an image</h3>
                  <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                  <Input
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("image")?.click()}>
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 