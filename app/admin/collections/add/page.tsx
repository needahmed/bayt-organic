"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Upload } from "lucide-react"

export default function AddCollectionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [collectionData, setCollectionData] = useState({
    name: "",
    description: "",
    status: "active",
    featured: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCollectionData({
      ...collectionData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setCollectionData({
      ...collectionData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name, checked) => {
    setCollectionData({
      ...collectionData,
      [name]: checked,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to collections page
      router.push("/admin/collections")
    } catch (error) {
      console.error("Error adding collection:", error)
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold tracking-tight">Add New Collection</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/collections")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Collection"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Information</CardTitle>
          <CardDescription>Create a new collection to organize your products</CardDescription>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

