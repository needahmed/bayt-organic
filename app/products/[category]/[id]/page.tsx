"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ChevronLeft, Minus, Plus, Star, Truck, Shield } from "lucide-react"

// This would normally come from a database or API
const getProductData = (category, id) => {
  // Sample product data
  return {
    id: Number.parseInt(id),
    name: "Honey & Oats Body Soap",
    price: 1000,
    description:
      "Our Honey & Oats Body Soap is a nourishing blend of natural ingredients designed to cleanse and moisturize your skin. The combination of honey and oats provides gentle exfoliation while soothing and hydrating the skin.",
    weight: "90 gram",
    category: category,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600&text=Image+2",
      "/placeholder.svg?height=600&width=600&text=Image+3",
    ],
    ingredients:
      "Honey in equal water, Oats, Beeswax, Shea Butter, Multani Mitti, Rosemary, Almond Oil, Castor Oil, Extra Virgin Olive Oil, Coconut Oil, Cinnamon essential oil, Citric Acid, Sugar, NaOH, distilled water and Lye.",
    benefits: [
      "Gently exfoliates dead skin cells",
      "Moisturizes and nourishes the skin",
      "Soothes irritated skin",
      "Natural antibacterial properties",
      "Suitable for all skin types",
    ],
    howToUse:
      "Wet the soap and lather between your hands or on a washcloth. Apply to your body in circular motions, then rinse thoroughly. For best results, allow the soap to dry between uses.",
    reviews: [
      {
        id: 1,
        name: "Sarah M.",
        rating: 5,
        date: "2023-12-15",
        comment: "This soap is amazing! My skin feels so soft and the scent is divine. Will definitely purchase again.",
      },
      {
        id: 2,
        name: "Ahmed K.",
        rating: 4,
        date: "2023-11-20",
        comment: "Great product, very moisturizing. I wish the bar was a bit bigger though.",
      },
      {
        id: 3,
        name: "Layla R.",
        rating: 5,
        date: "2023-10-05",
        comment:
          "I have sensitive skin and this soap is perfect for me. No irritation at all and leaves my skin feeling clean but not dry.",
      },
    ],
    relatedProducts: [
      {
        id: 1,
        name: "Charcoal and Tree Body Soap",
        price: 900,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 3,
        name: "Milk Soap",
        price: 900,
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        id: 4,
        name: "Coconut & Lavender Body Soap",
        price: 900,
        image: "/placeholder.svg?height=300&width=300",
      },
    ],
  }
}

export default function ProductPage({ params }) {
  const { category, id } = params
  const product = getProductData(category, id)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
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
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
                {category
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Badge>
              <h1 className="font-playfair text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-sm text-green-700">({product.reviews.length} reviews)</span>
              </div>
              <p className="text-2xl font-semibold text-pink-500 mb-4">Rs. {product.price}</p>
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
                <Button className="bg-green-700 hover:bg-green-800 text-white flex-1">Add to Cart</Button>
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
                  <p>{product.ingredients}</p>
                </TabsContent>
                <TabsContent value="benefits" className="text-green-700 mt-4 p-4 bg-green-50 rounded-md">
                  <ul className="list-disc pl-5 space-y-1">
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="how-to-use" className="text-green-700 mt-4 p-4 bg-green-50 rounded-md">
                  <p>{product.howToUse}</p>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">Customer Reviews</h2>
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
                  <span className="text-sm text-gray-500">{review.date}</span>
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
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {product.relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={`/products/${category}/${relatedProduct.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium text-green-800 mb-1">{relatedProduct.name}</h3>
                  <p className="text-pink-500 font-semibold">Rs. {relatedProduct.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

