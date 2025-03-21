"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Leaf, Droplets, ShieldCheck, Recycle, Heart, Sparkles } from "lucide-react"
import { getCollectionBySlug } from "@/app/actions/collections.action"
import { ensureFeaturedCollection } from "@/app/actions/setup.action"
import { Product, Category } from "@prisma/client"
import { getCategories } from "@/app/actions/categories.action"

// Define the product type with related entities
type ProductWithRelations = Product & {
  category: Category;
};

type CollectionWithProducts = {
  id: string;
  name: string;
  products: ProductWithRelations[];
};

// Use a custom type for Category with subcategories
type CategoryWithRelations = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId: string | null;
  subcategories?: CategoryWithRelations[];
  _count?: {
    products: number;
  };
};

export default function Home() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryWithRelations[]>([])

  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

  // Fallback products in case the featured collection doesn't exist or is empty
  const fallbackProducts = [
    {
      id: "1",
      name: "Charcoal and Tree Body Soap",
      price: 900,
      images: ["/placeholder.svg?height=300&width=300"],
      category: { id: "1", name: "Soaps", slug: "soaps", image: null, createdAt: new Date(), updatedAt: new Date() },
    },
    {
      id: "2",
      name: "Honey & Oats Body Soap",
      price: 1000,
      images: ["/placeholder.svg?height=300&width=300"],
      category: { id: "1", name: "Soaps", slug: "soaps", image: null, createdAt: new Date(), updatedAt: new Date() },
    },
    {
      id: "3",
      name: "Coconut Milk Shampoo Bar",
      price: 1200,
      images: ["/placeholder.svg?height=300&width=300"],
      category: { id: "2", name: "Shampoos", slug: "shampoos", image: null, createdAt: new Date(), updatedAt: new Date() },
    },
    {
      id: "4",
      name: "Hair Growth Oil",
      price: 1500,
      images: ["/placeholder.svg?height=300&width=300"],
      category: { id: "3", name: "Body Care", slug: "body-care", image: null, createdAt: new Date(), updatedAt: new Date() },
    },
  ] as ProductWithRelations[]

  const benefits = [
    {
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      title: "100% Natural",
      description: "Made with pure, natural ingredients",
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      title: "Handmade",
      description: "Crafted with love and care",
    },
    {
      icon: <Droplets className="h-6 w-6 text-blue-500" />,
      title: "Chemical Free",
      description: "No harmful chemicals or additives",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-700" />,
      title: "Cruelty Free",
      description: "Never tested on animals",
    },
    {
      icon: <Recycle className="h-6 w-6 text-green-600" />,
      title: "Eco-Friendly",
      description: "Sustainable and environmentally conscious",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: "Organic",
      description: "Pure organic ingredients",
    },
  ]

  useEffect(() => {
    // Initialize Azure Blob Storage
    fetch('/api/azure-init')
      .then(response => response.json())
      .then(data => {
        console.log('Azure Storage initialization:', data.message)
      })
      .catch(error => {
        console.error('Failed to initialize Azure Storage:', error)
      })

    // Ensure Featured collection exists
    ensureFeaturedCollection()
      .then(result => {
        console.log('Featured collection setup:', result.message)
      })
      .catch(error => {
        console.error('Failed to setup Featured collection:', error)
      })

    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      setIsLoading(true)
      try {
        const result = await getCollectionBySlug('featured')
        if (result.success && result.data) {
          setFeaturedProducts(result.data.products)
        } else {
          console.warn('Featured collection not found or empty, using fallback products')
          setFeaturedProducts(fallbackProducts)
        }
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError('Failed to load featured products')
        setFeaturedProducts(fallbackProducts)
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch categories for debug section
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        if (result.success && result.data) {
          // Only keep parent categories with subcategories
          const parentCategories = result.data.filter((cat: CategoryWithRelations) => 
            !cat.parentId || cat.parentId === ""
          );
          
          setCategories(parentCategories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchFeaturedProducts();
    fetchCategories();
  }, [])

  // Display products based on what's available
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : fallbackProducts

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section ref={scrollRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-green-50/80 to-white/90 z-10" />
          <div className="absolute inset-0 w-full h-full">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://imagesbayt.blob.core.windows.net/videos/hero-video.mp4" type="video/mp4" />
              <img 
                src="/video.gif" 
                alt="Natural organic products" 
                className="w-full h-full object-cover"
              />
            </video>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-green-800 mb-4">
              Natural Products for a <span className="text-pink-500">Healthier</span> You
            </h1>
            <p className="text-lg md:text-xl text-green-700 mb-8">
              Handcrafted with love using only the finest natural ingredients. Experience the beauty of nature with Bayt
              Organic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,197.3C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-4">
              Why Choose Bayt Organic?
            </h2>
            <p className="text-green-700 max-w-2xl mx-auto">
              Our commitment to quality and sustainability sets us apart
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="mb-3 p-3 bg-white rounded-full shadow-sm">{benefit.icon}</div>
                <h3 className="font-medium text-green-800 mb-1">{benefit.title}</h3>
                <p className="text-sm text-green-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-4">Our Featured Products</h2>
            <p className="text-green-700 max-w-2xl mx-auto">Discover our most loved handmade natural products</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-green-700 hover:bg-green-800 text-white"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link href={`/products/${product.category.slug}/${product.id}`}>
                    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{product.category.name}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-green-800 mb-1 line-clamp-1">{product.name}</h3>
                        {product.discountedPrice ? (
                          <div>
                            <span className="text-muted-foreground line-through text-xs">Rs. {product.price}</span>
                            <p className="text-pink-500 font-semibold">Rs. {product.discountedPrice}</p>
                          </div>
                        ) : (
                          <p className="text-pink-500 font-semibold">Rs. {product.price}</p>
                        )}
                        <Button className="w-full mt-3 bg-green-700 hover:bg-green-800 text-white" size="sm">
                          View Product
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={ref} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-pink-100 rounded-full -z-10" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-100 rounded-full -z-10" />
              <video
                src="https://imagesbayt.blob.core.windows.net/videos/farm.mp4"
                autoPlay
                loop
                muted
                width={500}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-6">Our Story</h2>
              <p className="text-green-700 mb-4">
                Bayt Organic, meaning "home" in Arabic, was born from a passion for creating natural products that
                nurture both body and soul. Our journey began with a simple belief: what we put on our bodies should be
                as pure and natural as what we put in them.
              </p>
              <p className="text-green-700 mb-6">
                Every product is handcrafted in small batches using traditional methods and the finest natural
                ingredients. We take pride in our commitment to sustainability, using eco-friendly packaging and
                ethically sourced materials.
              </p>
              <Button className="bg-green-700 hover:bg-green-800 text-white">Learn More About Us</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-4">What Our Customers Say</h2>
            <p className="text-green-700 max-w-2xl mx-auto">
              Hear from people who have experienced the Bayt Organic difference
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="Customer"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">{["Sarah M.", "Ahmed K.", "Layla R."][item - 1]}</h4>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-green-700">
                  {
                    [
                      "I've been using the Honey & Oats soap for a month now and my skin has never felt better. It's gentle, moisturizing, and smells amazing!",
                      "The Coconut Milk Shampoo Bar is a game-changer. My hair feels so healthy and the scent is divine. Plus, I love that it's plastic-free!",
                      "The Anti-Aging Face Serum has made such a difference in my skin. It feels so luxurious and I've noticed my fine lines are less visible. Worth every penny!",
                    ][item - 1]
                  }
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-4">Follow Us on Instagram</h2>
            <p className="text-green-700 max-w-2xl mx-auto">@baytorganic</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={`/placeholder.svg?height=300&width=300&text=Instagram+${index + 1}`}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                  <span className="text-white text-sm">View Post</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-green-800 mb-4">Join Our Newsletter</h2>
              <p className="text-green-700 mb-6">
                Subscribe to receive updates, exclusive offers, and natural living tips
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-md border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <Button className="bg-green-700 hover:bg-green-800 text-white">Subscribe</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Add debug section for categories - can be removed after verification */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Categories Debug</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.length > 0 ? categories.map((category) => (
              <div key={category.id} className="border p-4 rounded">
                <h3 className="font-bold">{category.name}</h3>
                <p>Slug: {category.slug}</p>
                <p>Products: {category._count?.products || 0}</p>
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold">Subcategories:</p>
                    <ul className="list-disc pl-5">
                      {category.subcategories.map((sub: CategoryWithRelations) => (
                        <li key={sub.id}>{sub.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )) : (
              <p>No categories found</p>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

