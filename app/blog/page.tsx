"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Tag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define blog post types
type BlogPost = {
  id: string
  title: string
  excerpt: string
  category: "ingredients" | "tips"
  slug: string
  image: string
  date: string
  readTime: string
  featured: boolean
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { toast } = useToast()
  
  // List of all blog articles
  const articles: BlogPost[] = [
    {
      id: "1",
      title: "Activated Charcoal: Nature's Skin Detoxifier",
      excerpt: "Discover how activated charcoal draws impurities from the skin, leaving it cleaner and clearer. Learn about its benefits for oily and acne-prone skin.",
      category: "ingredients",
      slug: "/blog/ingredients/activated-charcoal-skin-detoxification",
      image: "/blog/charcoal.jpg",
      date: "June 15, 2023",
      readTime: "5 min read",
      featured: true
    },
    {
      id: "2",
      title: "Raw Honey: The Natural Moisturizer",
      excerpt: "Explore the moisturizing and antibacterial properties of raw honey, and why it's a star ingredient in natural skincare products.",
      category: "ingredients",
      slug: "/blog/ingredients/raw-honey-natural-moisturizer",
      image: "/blog/honey.jpg",
      date: "July 3, 2023",
      readTime: "4 min read",
      featured: true
    },
    {
      id: "3",
      title: "Coconut Oil: The Beauty Multitasker",
      excerpt: "From moisturizing to makeup removal, explore the many uses of coconut oil in your natural beauty routine.",
      category: "ingredients",
      slug: "/blog/ingredients/coconut-oil-beauty-multitasker",
      image: "/blog/coconut.jpg",
      date: "July 21, 2023",
      readTime: "6 min read",
      featured: true
    },
    {
      id: "4",
      title: "The Gentle Guide to Exfoliation",
      excerpt: "Learn how to effectively exfoliate without damaging your skin, including techniques and natural ingredients to try at home.",
      category: "tips",
      slug: "/blog/tips/gentle-exfoliation-guide",
      image: "/blog/exfoliation.jpg",
      date: "August 5, 2023",
      readTime: "7 min read",
      featured: true
    },
    {
      id: "5",
      title: "Why Hydration is Key to Healthy Skin",
      excerpt: "Discover why proper hydration is essential for skin health and practical tips to keep your skin hydrated from the inside out.",
      category: "tips",
      slug: "/blog/tips/hydration-healthy-skin",
      image: "/blog/hydration.jpg",
      date: "August 19, 2023",
      readTime: "5 min read",
      featured: true
    },
    {
      id: "6",
      title: "Face Steaming: Benefits and How-To",
      excerpt: "Learn about the benefits of face steaming, how to do it safely at home, and which herbs can enhance your steaming routine.",
      category: "tips",
      slug: "/blog/tips/face-steaming-benefits",
      image: "/blog/steaming.jpg",
      date: "September 2, 2023",
      readTime: "4 min read",
      featured: true
    },
  ]

  // Filter posts based on active category
  const filteredPosts = activeCategory 
    ? articles.filter(post => post.category === activeCategory)
    : articles

  // Categories for filtering
  const categories = [
    { name: "All", slug: "all" },
    { name: "Ingredient Spotlight", slug: "ingredients" },
    { name: "DIY Tips", slug: "tips" }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-green-800 mb-4">
          Bayt Organic Blog
        </h1>
        <p className="text-lg text-green-600 max-w-2xl mx-auto">
          Explore natural skincare tips, ingredient spotlights, and DIY beauty advice
          to help you achieve healthy, glowing skin the natural way.
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-10"
      >
        {categories.map((category) => (
          <Badge 
            key={category.slug}
            variant="outline" 
            className={`text-sm py-2 px-4 cursor-pointer hover:bg-green-50 ${
              (category.slug === activeCategory) || (category.slug === 'all' && !activeCategory) 
                ? 'bg-green-100 border-green-300' 
                : ''
            }`}
            onClick={() => setActiveCategory(category.slug === 'all' ? null : category.slug)}
          >
            {category.name}
          </Badge>
        ))}
      </motion.div>

      {/* Featured Articles */}
      <div className="mb-16">
        <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">
          Featured Articles
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts
            .filter(article => article.featured)
            .map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <Link href={article.slug} className="block">
                  <div className="relative h-52 w-full">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3 text-xs bg-green-50 text-green-700 border-green-200">
                      {article.category === "ingredients" ? "Ingredient Spotlight" : "DIY Tips"}
                    </Badge>
                    <h3 className="font-playfair text-xl font-bold text-green-800 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-green-600 text-sm mb-4">
                      <span className="flex items-center gap-1 mb-1">
                        <Clock size={14} /> {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag size={14} /> {article.date}
                      </span>
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-green-700 font-medium">
                      Read more <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>

      {/* All Articles */}
      <div>
        <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">
          All Articles
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href={article.slug} className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <Badge variant="outline" className="mb-2 text-xs bg-green-50 text-green-700 border-green-200">
                    {article.category === "ingredients" ? "Ingredient Spotlight" : "DIY Tips"}
                  </Badge>
                  <h3 className="font-playfair text-lg font-bold text-green-800 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-green-600 text-xs mb-3">
                    <span className="flex items-center gap-1 mb-1">
                      <Clock size={12} /> {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> {article.date}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-green-700 text-sm font-medium">
                    Read more <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 bg-green-50 p-8 md:p-12 rounded-lg text-center"
      >
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-green-600 mb-6 max-w-2xl mx-auto">
          Get the latest natural skincare tips, DIY recipes, and exclusive offers delivered straight to your inbox.
        </p>
        <form
          className="flex flex-col sm:flex-row max-w-md mx-auto gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
            const email = emailInput.value;
            
            try {
              const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              
              const data = await response.json();
              
              if (data.success) {
                toast({
                  title: "Success!",
                  description: data.message || "You've been subscribed to our newsletter.",
                  variant: "default"
                });
                emailInput.value = '';
              } else {
                toast({
                  title: "Error",
                  description: data.error || "Failed to subscribe. Please try again.",
                  variant: "destructive"
                });
              }
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to subscribe. Please try again.",
                variant: "destructive"
              });
            }
          }}
        >
          <input
            type="email"
            placeholder="Your email address"
            className="px-4 py-2 border border-green-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
            Subscribe
          </Button>
        </form>
      </motion.div>
    </div>
  )
} 