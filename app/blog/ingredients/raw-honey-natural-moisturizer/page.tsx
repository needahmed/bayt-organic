"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Share2, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function HoneyArticlePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link 
              href="/blog" 
              className="flex items-center text-green-700 hover:text-green-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Blog
            </Link>
          </motion.div>
        </div>
        
        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-pink-100 text-pink-800 mb-4">Ingredient Spotlight</Badge>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold text-green-800 mb-4">
              Why Raw Honey is Nature's Perfect Moisturizer
            </h1>
            
            <div className="flex items-center text-green-600 text-sm mb-8">
              <span className="flex items-center mr-6">
                <Clock className="h-4 w-4 mr-2" />
                June 5, 2023
              </span>
              <span>By Bayt Organic Team</span>
            </div>
          </motion.div>
        </div>
        
        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12 rounded-lg overflow-hidden shadow-lg"
        >
          <div className="relative h-[400px]">
            <Image
              src="/placeholder.svg?height=800&width=1200&text=Raw+Honey"
              alt="Raw Honey"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
        
        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-lg prose-green max-w-none"
          >
            <p className="text-lg leading-relaxed text-green-700">
              Raw honey has been treasured for centuries as both a food and a skincare ingredient. Unlike processed honey, raw honey retains all of its natural enzymes, antioxidants, and nutrients, making it a powerhouse ingredient for natural skincare. In this article, we'll explore why raw honey deserves a place in your beauty routine and how it functions as nature's perfect moisturizer.
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">What Makes Raw Honey Special?</h2>
            <p className="text-lg leading-relaxed text-green-700">
              Raw honey is honey in its purest form, taken straight from the honeycomb without pasteurization or filtering. This means it contains:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Natural enzymes that support skin healing</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Antioxidants that fight free radical damage</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Amino acids that nourish the skin</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Vitamins and minerals that support skin health</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Natural antibacterial properties</span>
              </li>
            </ul>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">The Moisturizing Magic of Honey</h2>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              As a natural humectant, honey attracts and retains moisture, making it exceptionally effective at hydrating the skin. When applied to the skin, honey forms a protective barrier that locks in moisture while still allowing the skin to breathe.
            </p>
            
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              Our Honey & Oats Body Soap harnesses these moisturizing properties, combining raw honey with soothing oats for a cleansing experience that hydrates rather than strips your skin.
            </p>
            
            <div className="mt-12 bg-green-50 p-8 rounded-lg shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-green-800 mb-3">Experience the moisturizing benefits of honey</h3>
              <p className="text-lg text-green-700 mb-4">Our Honey & Oats Body Soap combines the hydrating power of honey with the gentle exfoliation of oats.</p>
              <div className="mt-4">
                <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
                  <Link href="/products/soaps/2">Shop Honey & Oats Body Soap</Link>
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Share Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 border-t border-green-100 pt-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-green-700 font-medium">Share this article:</span>
              <div className="flex space-x-4">
                <button className="text-green-700 hover:text-green-800">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Related Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <h2 className="font-playfair text-2xl font-bold text-green-800 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/blog/ingredients/activated-charcoal-skin-detoxification" className="group">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=400&width=600&text=Activated+Charcoal"
                    alt="Activated Charcoal"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-playfair text-lg font-bold text-green-800 group-hover:text-pink-500 transition-colors">
                  The Power of Activated Charcoal for Skin Detoxification
                </h3>
              </Link>
              <Link href="/blog/ingredients/coconut-oil-beauty-multitasker" className="group">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=400&width=600&text=Coconut+Oil"
                    alt="Coconut Oil"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-playfair text-lg font-bold text-green-800 group-hover:text-pink-500 transition-colors">
                  Coconut Oil: The Multi-Tasking Beauty Ingredient
                </h3>
              </Link>
            </div>
          </motion.div>
          
          {/* Return to Blog */}
          <div className="mt-16 text-center">
            <Button asChild variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
              <Link href="/blog">Back to All Articles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 