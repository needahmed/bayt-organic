"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { getProducts } from "@/app/actions/products.action"
import { getCollectionById, updateCollection } from "@/app/actions/collections.action"
import { toast } from "sonner"
import { Package } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  images: string[]
  price: number
  discountedPrice?: number | null
}

interface Collection {
  id: string
  name: string
  slug: string
  description?: string | null
  productIds: string[]
  products: Product[]
}

interface ManageCollectionProductsProps {
  collectionId: string
  trigger?: React.ReactNode
  onSaved?: () => void
}

export function ManageCollectionProducts({ collectionId, trigger, onSaved }: ManageCollectionProductsProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [collection, setCollection] = useState<Collection | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Load products and collection data when dialog opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          // Fetch all products
          const productsResult = await getProducts()
          if (productsResult.success && productsResult.data) {
            setProducts(productsResult.data)
          }

          // Fetch collection to get current products
          const collectionResult = await getCollectionById(collectionId)
          if (collectionResult.success && collectionResult.data) {
            setCollection(collectionResult.data)
            // Set selected products based on collection's current products
            setSelectedProducts(collectionResult.data.productIds || [])
          }
        } catch (error) {
          console.error("Error fetching data:", error)
          toast.error("Failed to load products")
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [open, collectionId])

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSave = async () => {
    if (!collection) return

    setIsLoading(true)
    try {
      // Create a minimal collection update with just the products
      const result = await updateCollection(collectionId, {
        name: collection.name,
        slug: collection.slug,
        description: collection.description || "",
        productIds: selectedProducts
      })

      if (result.success) {
        toast.success("Products updated successfully")
        setOpen(false)
        // Call the onSaved callback if provided
        if (onSaved) onSaved()
      } else {
        toast.error(result.error || "Failed to update products")
      }
    } catch (error) {
      console.error("Error updating products:", error)
      toast.error("An error occurred while updating products")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Package className="mr-2 h-4 w-4" />
            Manage Products
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Products</DialogTitle>
          <DialogDescription>
            Select the products to include in this collection.
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
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-72 pr-4">
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`product-${product.id}`}
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                    />
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Label 
                      htmlFor={`product-${product.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {product.discountedPrice 
                            ? `Rs. ${product.discountedPrice} (Rs. ${product.price})`
                            : `Rs. ${product.price}`
                          }
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No products found
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