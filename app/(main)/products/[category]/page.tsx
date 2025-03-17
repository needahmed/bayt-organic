"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { ChevronLeft, AlertCircle } from "lucide-react"
import { getProducts } from "@/app/actions/products.action"
import { getCategories } from "@/app/actions/categories.action"
import { Product, Category } from "@prisma/client"

// Define the product type with related entities
type ProductWithRelations = Product & {
  category: Category;
};

export default function CategoryPage({ params }: { params: any }) {
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = use(params) as any
  const { category } = unwrappedParams
  
  const [sortOption, setSortOption] = useState("featured")
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch all products
        const productsResult = await getProducts()
        
        // Fetch all categories to get the current category info
        const categoriesResult = await getCategories()
        
        if (productsResult.success && categoriesResult.success && 
            productsResult.data && categoriesResult.data) {
          // Find the current category
          const currentCategory = categoriesResult.data.find(
            (cat: Category) => cat.slug === category
          )
          
          if (currentCategory) {
            setCategoryInfo(currentCategory)
            
            // Filter products by category
            const categoryProducts = productsResult.data.filter(
              (product: ProductWithRelations) => product.categoryId === currentCategory.id
            )
            
            // Sort products based on selected option
            const sortedProducts = [...categoryProducts]
            if (sortOption === "price-low") {
              sortedProducts.sort((a, b) => a.price - b.price)
            } else if (sortOption === "price-high") {
              sortedProducts.sort((a, b) => b.price - a.price)
            }
            
            setProducts(sortedProducts)
          } else {
            setError(`Category '${category}' not found`)
          }
        } else {
          setError(productsResult.error || categoriesResult.error || "Failed to fetch data")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("An error occurred while fetching data")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [category, sortOption])

  // Format category for display
  const formatCategory = (cat: string) => {
    return cat
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-green-700">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-4" />
              <p>{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4 bg-green-700 hover:bg-green-800 text-white">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const title = categoryInfo?.name || formatCategory(category)
  const description = `Browse our selection of ${formatCategory(category)}`

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-800 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-2">{title}</h1>
            <p className="text-green-700 max-w-3xl">{description}</p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <p className="text-green-700 mb-4 md:mb-0">Showing {products.length} products</p>
          <div className="w-full md:w-48">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={`/products/${category}/${product.id}`}>
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.discountedPrice && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Sale</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-green-800 mb-1">{product.name}</h3>
                    <p className="text-sm text-green-600 mb-2 flex-1">{product.description.substring(0, 100)}...</p>
                    <div className="text-xs text-green-600 mb-2">Weight: {product.weight}</div>
                    <div className="flex items-center justify-between">
                      {product.discountedPrice ? (
                        <div>
                          <span className="text-muted-foreground line-through text-xs">Rs. {product.price}</span>
                          <p className="text-pink-500 font-semibold">Rs. {product.discountedPrice}</p>
                        </div>
                      ) : (
                        <p className="text-pink-500 font-semibold">Rs. {product.price}</p>
                      )}
                      <Button className="bg-green-700 hover:bg-green-800 text-white" size="sm">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-green-700 mb-4">No products found in this category.</p>
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

