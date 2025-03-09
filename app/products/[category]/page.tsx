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
import { ChevronLeft } from "lucide-react"

// Product data
const productData = {
  soaps: [
    {
      id: 1,
      name: "Charcoal and Tree Body Soap",
      price: 900,
      image: "/placeholder.svg?height=300&width=300",
      description:
        "Made with Extra Virgin Olive oil, Castor oil, Coconut Oil, Activated charcoal, Tea Tree essential oil, and more.",
      weight: "100 gram",
    },
    {
      id: 2,
      name: "Honey & Oats Body Soap",
      price: 1000,
      image: "/placeholder.svg?height=300&width=300",
      description: "A nourishing blend of Honey, Oats, Beeswax, Shea Butter, and essential oils.",
      weight: "90 gram",
    },
    {
      id: 3,
      name: "Milk Soap",
      price: 900,
      image: "/placeholder.svg?height=300&width=300",
      description: "Enriched with Cow milk, Yogurt, and a blend of essential oils.",
      weight: "100 gram",
    },
    {
      id: 4,
      name: "Coconut & Lavender Body Soap",
      price: 900,
      image: "/placeholder.svg?height=300&width=300",
      description: "A simple yet effective combination of Coconut Oil and Lavender Essential Oil.",
      weight: "70 gram",
    },
    {
      id: 5,
      name: "Neem Body Soap",
      price: 900,
      image: "/placeholder.svg?height=300&width=300",
      description: "Featuring Neem Oil and powder with Eucalyptus and Spearmint Essential Oils.",
      weight: "100 gram",
    },
    {
      id: 6,
      name: "Pink Salt Bar",
      price: 600,
      image: "/placeholder.svg?height=300&width=300",
      description: "A cleansing bar with pink salt and natural oils.",
      weight: "100 gram",
    },
    {
      id: 7,
      name: "Tallow Salt Bar",
      price: 600,
      image: "/placeholder.svg?height=300&width=300",
      description: "A traditional soap made with natural oils and salt.",
      weight: "100 gram",
    },
  ],
  shampoos: [
    {
      id: 1,
      name: "Coconut Milk Shampoo Bar",
      price: 1200,
      image: "/placeholder.svg?height=300&width=300",
      description: "Made with Extra Virgin Olive Oil, Coconut Oil, Coconut Milk, and essential oils.",
      weight: "150 gram",
    },
  ],
  "body-care": [
    {
      id: 1,
      name: "Body Deodorant",
      price: 800,
      image: "/placeholder.svg?height=300&width=300",
      description: "Natural deodorant with Cocoa butter, Shea butter, and essential oils.",
      weight: "50 gram",
    },
    {
      id: 2,
      name: "Hair Growth Oil",
      price: 1200,
      image: "/placeholder.svg?height=300&width=300",
      description: "Infused with Lavender, Black Seed Oil, and Rosemary Essential Oil.",
      weight: "100 ml",
    },
    {
      id: 3,
      name: "Lavender Lip Balm",
      price: 500,
      image: "/placeholder.svg?height=300&width=300",
      description: "Moisturizing lip balm with Cocoa Butter and Lavender Essential Oil.",
      weight: "15 gram",
    },
    {
      id: 4,
      name: "Rose Lip Balm",
      price: 500,
      image: "/placeholder.svg?height=300&width=300",
      description: "Nourishing lip balm with Cocoa Butter and Rose Essential Oil.",
      weight: "15 gram",
    },
    {
      id: 5,
      name: "Anti-Aging Face Serum",
      price: 1500,
      image: "/placeholder.svg?height=300&width=300",
      description: "Luxurious serum with Castor oil, Jojoba oil, and Frankincense Essential Oil.",
      weight: "30 ml",
    },
  ],
  accessories: [
    {
      id: 1,
      name: "Dental Powder",
      price: 700,
      image: "/placeholder.svg?height=300&width=300",
      description: "Natural dental care with Bentonite Clay, Activated Charcoal, and herbs.",
      weight: "50 gram",
    },
    {
      id: 2,
      name: "Soap Dish",
      price: 400,
      image: "/placeholder.svg?height=300&width=300",
      description: "Handcrafted wooden soap dish to keep your soap dry.",
      weight: "N/A",
    },
    {
      id: 3,
      name: "Loofah",
      price: 300,
      image: "/placeholder.svg?height=300&width=300",
      description: "Natural loofah for gentle exfoliation.",
      weight: "N/A",
    },
  ],
}

// Category titles and descriptions
const categoryInfo = {
  soaps: {
    title: "Natural Handmade Soaps",
    description: "Our soaps are made with natural oils and ingredients, free from harmful chemicals.",
  },
  shampoos: {
    title: "Natural Shampoo Bars",
    description: "Plastic-free, natural shampoo bars that cleanse and nourish your hair.",
  },
  "body-care": {
    title: "Body Care Products",
    description: "Natural products to nourish and care for your body from head to toe.",
  },
  accessories: {
    title: "Accessories & More",
    description: "Complementary products to enhance your natural skincare routine.",
  },
}

export default function CategoryPage({ params }) {
  // Use React.use() to unwrap the params Promise
  const unwrappedParams = use(params)
  const { category } = unwrappedParams
  
  const [sortOption, setSortOption] = useState("featured")
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Get products for this category
    const categoryProducts = productData[category] || []

    // Sort products based on selected option
    const sortedProducts = [...categoryProducts]
    if (sortOption === "price-low") {
      sortedProducts.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price-high") {
      sortedProducts.sort((a, b) => b.price - a.price)
    }
    // For "featured" we keep the original order

    setProducts(sortedProducts)
  }, [category, sortOption])

  // Format category for display
  const formatCategory = (cat) => {
    return cat
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const info = categoryInfo[category] || {
    title: formatCategory(category),
    description: `Browse our selection of ${formatCategory(category)}`,
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-800 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-2">{info.title}</h1>
            <p className="text-green-700 max-w-3xl">{info.description}</p>
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
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">New</Badge>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium text-green-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-green-600 mb-2 flex-1">{product.description}</p>
                  <div className="text-xs text-green-600 mb-2">Weight: {product.weight}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-pink-500 font-semibold">Rs. {product.price}</p>
                    <Button className="bg-green-700 hover:bg-green-800 text-white" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
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

