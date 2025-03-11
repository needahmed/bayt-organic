"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCollectionBySlug } from "@/app/actions/collections.action"
import { ensureFeaturedCollection } from "@/app/actions/setup.action"
import { ManageCollectionProducts } from "@/components/admin/manage-collection-products"
import { toast } from "sonner"
import { Package, RefreshCw } from "lucide-react"

export default function FeaturedProductsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [collectionId, setCollectionId] = useState<string | null>(null)
  const [productCount, setProductCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedCollection = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // First ensure the Featured collection exists
      await ensureFeaturedCollection()
      
      // Then fetch it
      const result = await getCollectionBySlug('featured')
      if (result.success && result.data) {
        setCollectionId(result.data.id)
        setProductCount(result.data.products.length)
      } else {
        setError('Failed to load Featured collection')
        toast.error('Failed to load Featured collection')
      }
    } catch (err) {
      console.error('Error fetching Featured collection:', err)
      setError('An error occurred while loading the Featured collection')
      toast.error('An error occurred while loading the Featured collection')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeaturedCollection()
  }, [])

  const handleRefresh = () => {
    fetchFeaturedCollection()
    toast.success('Refreshed featured products')
  }

  const handleProductsUpdated = () => {
    fetchFeaturedCollection()
    toast.success('Featured products updated successfully')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Featured Products</h1>
          <p className="text-muted-foreground">Manage products featured on the home page</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
          <CardDescription>
            These products will be displayed in the Featured section on the home page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchFeaturedCollection}>Try Again</Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-green-700" />
                  <span>
                    {productCount} product{productCount !== 1 ? 's' : ''} in Featured collection
                  </span>
                </div>
                
                {collectionId && (
                  <ManageCollectionProducts 
                    collectionId={collectionId} 
                    trigger={
                      <Button className="bg-green-700 hover:bg-green-800 text-white">
                        Manage Featured Products
                      </Button>
                    }
                    onSaved={handleProductsUpdated}
                  />
                )}
              </div>
              
              {productCount === 0 && (
                <div className="text-center py-8 bg-amber-50 rounded-lg">
                  <p className="text-amber-800 mb-4">
                    No products in the Featured collection yet. Add some products to display them on the home page.
                  </p>
                  {collectionId && (
                    <ManageCollectionProducts 
                      collectionId={collectionId} 
                      trigger={
                        <Button className="bg-green-700 hover:bg-green-800 text-white">
                          Add Featured Products
                        </Button>
                      }
                      onSaved={handleProductsUpdated}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 