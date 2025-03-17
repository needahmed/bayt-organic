"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Upload } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { getCollectionById, updateCollection, CollectionFormData } from "@/app/actions/collections.action"
import { ManageCollectionProducts } from "@/components/admin/manage-collection-products"

export default function EditCollectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCollection, setIsLoadingCollection] = useState(true)
  const [collectionData, setCollectionData] = useState({
    name: "",
    description: "",
    status: "active",
    featured: false,
    image: ""
  })

  // Load collection data
  useEffect(() => {
    if (!id) {
      toast.error("Collection ID is required")
      router.push("/admin/collections")
      return
    }
    
    const loadCollection = async () => {
      try {
        setIsLoadingCollection(true)
        const result = await getCollectionById(id)
        
        if (!result.success || !result.data) {
          toast.error(result.error || "Failed to load collection")
          router.push("/admin/collections")
          return
        }
        
        const collection = result.data
        setCollectionData({
          name: collection.name,
          description: collection.description || "",
          status: "active", // Default value since it's not in the Collection type
          featured: false, // Default value since it's not in the Collection type
          image: collection.image || ""
        })
      } catch (error) {
        console.error("Error loading collection:", error)
        toast.error("Failed to load collection")
      } finally {
        setIsLoadingCollection(false)
      }
    }

    loadCollection()
  }, [id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCollectionData({
      ...collectionData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setCollectionData({
      ...collectionData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCollectionData({
      ...collectionData,
      [name]: checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id) {
      toast.error("Collection ID is required")
      return
    }
    
    setIsLoading(true)

    try {
      // Validate required fields
      if (!collectionData.name) {
        toast.error("Collection name is required")
        setIsLoading(false)
        return
      }

      // Generate a slug from the name
      const slug = collectionData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      // Create collection form data
      const collectionFormData: CollectionFormData = {
        name: collectionData.name,
        slug: slug,
        description: collectionData.description,
        existingImage: collectionData.image
      }

      const result = await updateCollection(id, collectionFormData)
      
      if (result.success) {
        toast.success("Collection updated successfully")
        router.push("/admin/collections")
      } else {
        toast.error(result.error || "Failed to update collection")
      }
    } catch (error) {
      console.error("Error updating collection:", error)
      toast.error("An error occurred while updating the collection")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingCollection) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/admin/collections">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Collection</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/collections")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Information</CardTitle>
          <CardDescription>Update the collection details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name *</Label>
            <Input
              id="name"
              name="name"
              value={collectionData.name}
              onChange={handleInputChange}
              placeholder="Enter collection name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={collectionData.description}
              onChange={handleInputChange}
              placeholder="Enter collection description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={collectionData.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
            <div className="space-y-2">
              <Label htmlFor="featured" className="block mb-2">
                Featured Collection
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={collectionData.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured">{collectionData.featured ? "Yes" : "No"}</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Collection Image</Label>
            {collectionData.image ? (
              <div className="relative aspect-video w-full h-48 mb-4 border rounded-md overflow-hidden">
                <Image
                  src={collectionData.image}
                  alt={collectionData.name}
                  fill
                  className="object-cover"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => setCollectionData({...collectionData, image: ""})}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <div className="mx-auto flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-gray-700 font-medium mb-1">Drag and drop an image</h3>
                  <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {id && (
        <Card>
          <CardHeader>
            <CardTitle>Collection Products</CardTitle>
            <CardDescription>Manage the products in this collection</CardDescription>
          </CardHeader>
          <CardContent>
            <ManageCollectionProducts collectionId={id} />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2 justify-end">
        <Button variant="outline" onClick={() => router.push("/admin/collections")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
} 