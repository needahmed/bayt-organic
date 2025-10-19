"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ChevronLeft, Minus, Plus, Star, Truck, Shield, AlertCircle, Heart } from "lucide-react"
import { getProductById } from "@/app/actions/products.action"
import { Product, Category, Collection, Review } from "@prisma/client"
import { useCart } from "@/app/context/CartContext"
import { useWishlist } from "@/app/context/WishlistContext"

// Define the product type with related entities
type ProductWithRelations = Product & {
  category: Category;
  collections: Collection[];
  reviews: Review[];
};

export default function ProductPage({ params }: { params: any }) {
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = use(params) as any
  const { category, id } = unwrappedParams
  
  const [product, setProduct] = useState<ProductWithRelations | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem, openCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const result = await getProductById(id)
        if (result.success && result.data) {
          setProduct(result.data as ProductWithRelations)
        } else {
          setError(result.error || "Failed to fetch product")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("An error occurred while fetching the product")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity: quantity,
        image: product.images[0] || "/placeholder.svg",
        weight: product.weight || "N/A"
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-green-700">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-4" />
              <p>{error || "Product not found"}</p>
              <Button onClick={() => window.location.reload()} className="mt-4 bg-green-700 hover:bg-green-800 text-white">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href={`/products/${category}`} className="inline-flex items-center text-green-700 hover:text-green-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to{" "}
            {category
              .split("-")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="sticky top-24">
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-green-500" : "opacity-70"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <Badge className="bg-green-100 text-green-800 mb-2">
                {product.category.name}
              </Badge>
              <div className="flex justify-between items-start">
                <h1 className="font-playfair text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
                <button 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isInWishlist(product.id) 
                      ? "bg-pink-500 text-white" 
                      : "bg-white text-pink-500 border border-pink-200 hover:bg-pink-100"
                  }`}
                  onClick={() => {
                    if (isInWishlist(product.id)) {
                      removeFromWishlist(product.id);
                    } else {
                      const productImage = product.images && product.images.length > 0 
                        ? product.images[0] 
                        : "/placeholder.svg";
                      addToWishlist({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        discountedPrice: product.discountedPrice || undefined,
                        image: productImage,
                        weight: product.weight || "150g"
                      });
                    }
                  }}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </button>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-sm text-green-700">({product.reviews.length} reviews)</span>
              </div>
              <p className="text-2xl font-semibold text-pink-500 mb-4">
                {product.discountedPrice ? (
                  <>
                    <span className="text-muted-foreground line-through text-lg mr-2">Rs. {product.price}</span>
                    Rs. {product.discountedPrice}
                  </>
                ) : (
                  <>Rs. {product.price}</>
                )}
              </p>
              <p className="text-green-700 mb-6">{product.description}</p>

              <div className="mb-6">
                <p className="text-sm text-green-600 mb-2">Weight: {product.weight}</p>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-10 w-10 rounded-none">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center">{quantity}</div>
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10 rounded-none">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  className="bg-green-700 hover:bg-green-800 text-white flex-1"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Adding...
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-green-700">
                  <Truck className="h-5 w-5 mr-2" />
                  <span>Free shipping on orders over Rs. 2000</span>
                </div>
                <div className="flex items-center text-green-700">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>100% natural ingredients</span>
                </div>
              </div>

              <Tabs defaultValue="ingredients">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
                </TabsList>
                <TabsContent value="ingredients" className="text-green-700 mt-4 p-4 bg-green-50 rounded-md">
                  <p>{product.ingredients || "No ingredients information available."}</p>
                </TabsContent>
                <TabsContent value="benefits" className="text-green-700 mt-4 p-4 bg-green-50 rounded-md">
                  <ul className="list-disc pl-5 space-y-1">
                    {product.benefits && product.benefits.length > 0 ? (
                      product.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))
                    ) : (
                      <li>No benefits information available.</li>
                    )}
                  </ul>
                </TabsContent>
                <TabsContent value="how-to-use" className="text-green-700 mt-4 p-4 bg-green-50 rounded-md">
                  <p>{product.howToUse || "No usage information available."}</p>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">Customer Reviews</h2>
          {product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="border-b border-gray-200 pb-6"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium text-green-800">{review.name}</h3>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                        strokeWidth={i < review.rating ? 0 : 1}
                      />
                    ))}
                  </div>
                  <p className="text-green-700">{review.comment}</p>
                </motion.div>
              ))
            }
            </div>
          ) : (
            <p className="text-green-700">No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        {/* Related Products Section */}
        {product.collections.length > 0 && (
          <div className="mt-16">
            <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">You May Also Like</h2>
            <p className="text-green-700 mb-6">Check out other products from our collections.</p>
          </div>
        )}
      </div>
    </div>
  )
}

