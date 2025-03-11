"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { getCollections } from "@/app/actions/collections.action"
import { updateProduct, getProductById } from "@/app/actions/products.action"
import { toast } from "sonner"
import { Tag } from "lucide-react"
import { ProductStatus } from "@prisma/client"

interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

interface Product {
  id: string
  name: string
  collections: Collection[]
  collectionIds: string[]
  description?: string
  price?: number
  benefits?: string[]
  status?: ProductStatus
  categoryId?: string
  stock?: number
}

interface ManageProductCollectionsProps {
  productId: string
  trigger?: React.ReactNode
  onSaved?: () => void
}

export function ManageProductCollections({ productId, trigger, onSaved }: ManageProductCollectionsProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Load collections and product data when dialog opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          // Fetch all collections
          const collectionsResult = await getCollections()
          if (collectionsResult.success && collectionsResult.data) {
            setCollections(collectionsResult.data)
          }

          // Fetch product to get current collections
          const productResult = await getProductById(productId)
          if (productResult.success && productResult.data) {
            setProduct(productResult.data)
            // Set selected collections based on product's current collections
            setSelectedCollections(productResult.data.collectionIds || [])
          }
        } catch (error) {
          console.error("Error fetching data:", error)
          toast.error("Failed to load collections")
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [open, productId])

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleSave = async () => {
    if (!product) return

    setIsLoading(true)
    try {
      // Create a FormData object for the update
      const formData = new FormData()
      
      // Add basic product data
      formData.append('name', product.name)
      formData.append('description', product.description || '')
      if (product.price) formData.append('price', product.price.toString())
      if (product.stock) formData.append('stock', product.stock.toString())
      if (product.status) formData.append('status', product.status)
      if (product.categoryId) formData.append('categoryId', product.categoryId)
      
      // Add collection IDs
      selectedCollections.forEach(id => {
        formData.append('collectionIds', id)
      })

      const result = await updateProduct(productId, formData as any)

      if (result.success) {
        toast.success("Collections updated successfully")
        setOpen(false)
        // Call the onSaved callback if provided
        if (onSaved) onSaved()
      } else {
        toast.error(result.error || "Failed to update collections")
      }
    } catch (error) {
      console.error("Error updating collections:", error)
      toast.error("An error occurred while updating collections")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter collections based on search query
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Tag className="mr-2 h-4 w-4" />
            Manage Collections
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Collections</DialogTitle>
          <DialogDescription>
            Select the collections this product belongs to.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                {filteredCollections.map((collection) => (
                  <div key={collection.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`collection-${collection.id}`}
                      checked={selectedCollections.includes(collection.id)}
                      onCheckedChange={() => handleCollectionToggle(collection.id)}
                    />
                    <Label 
                      htmlFor={`collection-${collection.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      {collection.name}
                    </Label>
                  </div>
                ))}
                
                {filteredCollections.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No collections found
                  </p>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 