"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Share2, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function CharcoalArticlePage() {
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
              The Power of Activated Charcoal for Skin Detoxification
            </h1>
            
            <div className="flex items-center text-green-600 text-sm mb-8">
              <span className="flex items-center mr-6">
                <Clock className="h-4 w-4 mr-2" />
                May 20, 2023
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
              src="/placeholder.svg?height=800&width=1200&text=Activated+Charcoal"
              alt="Activated Charcoal"
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
              Activated charcoal has become a popular ingredient in natural skincare, and for good reason. This powerful detoxifier is known for its ability to draw impurities from the skin, leaving it cleaner and clearer. But what exactly is activated charcoal, and how does it work?
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">What is Activated Charcoal?</h2>
            <p className="text-lg leading-relaxed text-green-700">
              Activated charcoal is created by burning carbon-rich materials like wood, coconut shells, or bamboo at very high temperatures. The "activation" process increases its surface area and creates a highly porous structure. This structure is what gives activated charcoal its remarkable ability to trap toxins and impurities.
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">How Activated Charcoal Benefits Your Skin</h2>
            <p className="text-lg leading-relaxed text-green-700">
              When applied to the skin, activated charcoal works like a magnet for dirt, oil, and toxins. Its porous nature allows it to adsorb (bind to) these impurities, drawing them out from deep within pores. This makes it particularly effective for:
            </p>
            
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="font-bold mr-2">Deep Cleansing:</span>
                <span>Activated charcoal can remove dirt, excess oil, and environmental pollutants that regular cleansers might miss.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Treating Acne:</span>
                <span>By removing bacteria, dirt, and toxins that contribute to breakouts, activated charcoal can help prevent and treat acne.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Minimizing Pores:</span>
                <span>Regular use can help reduce the appearance of pores by keeping them clear of buildup.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Balancing Oily Skin:</span>
                <span>It helps absorb excess oil without stripping the skin of its natural moisture.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Gentle Exfoliation:</span>
                <span>Some activated charcoal products provide mild exfoliation, helping to remove dead skin cells and reveal fresher skin.</span>
              </li>
            </ul>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">Activated Charcoal in Our Products</h2>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              At Bayt Organic, we harness the detoxifying power of activated charcoal in our Charcoal and Tea Tree Body Soap. This powerful combination pairs the drawing properties of charcoal with the antibacterial benefits of tea tree essential oil, creating a soap that thoroughly cleanses while helping to combat skin issues.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-200 p-6 my-8 rounded-r">
              <blockquote className="italic text-green-700 text-lg">
                "Our Charcoal and Tea Tree Body Soap is one of our most effective products for oily and acne-prone skin. Customers often tell us they notice clearer skin within just a few weeks of regular use."
              </blockquote>
            </div>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">Who Should Use Activated Charcoal?</h2>
            <p className="text-lg leading-relaxed text-green-700">
              Activated charcoal is particularly beneficial for those with:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Oily skin</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Acne-prone skin</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Congested pores</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Skin exposed to high levels of pollution</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              However, even those with normal skin can benefit from the occasional deep cleanse that activated charcoal provides.
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">How to Use Products with Activated Charcoal</h2>
            <p className="text-lg leading-relaxed text-green-700">
              For best results with our Charcoal and Tea Tree Body Soap:
            </p>
            <ol className="mt-4 mb-6 list-decimal pl-5 space-y-2 text-green-700">
              <li className="pl-2">Wet your skin with warm water to open pores</li>
              <li className="pl-2">Lather the soap between your hands or use a washcloth</li>
              <li className="pl-2">Gently massage onto your skin using circular motions</li>
              <li className="pl-2">Allow it to sit on the skin for a minute to maximize the detoxifying effect</li>
              <li className="pl-2">Rinse thoroughly with warm water</li>
            </ol>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              While activated charcoal is generally suitable for most skin types, we recommend using it 2-3 times a week rather than daily, especially for those with sensitive or dry skin.
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">The Environmental Benefit</h2>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              Beyond its skincare benefits, activated charcoal is an environmentally friendly ingredient. The raw materials used to create it (like coconut shells) are often byproducts from other industries, making it a sustainable choice for conscious consumers.
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">Try It Yourself</h2>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              Experience the detoxifying power of activated charcoal with our Charcoal and Tea Tree Body Soap. Your skin will thank you for the deep cleanse, and you'll love the fresh, clean feeling it provides.
            </p>
            
            <div className="mt-12 bg-green-50 p-8 rounded-lg shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-green-800 mb-3">Ready to experience the benefits of activated charcoal?</h3>
              <p className="text-lg text-green-700 mb-4">Our Charcoal and Tea Tree Body Soap is perfect for deep cleansing and helping to combat skin issues. Try it as part of your natural skincare routine.</p>
              <div className="mt-4">
                <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
                  <Link href="/products/soaps/1">Shop Charcoal and Tea Tree Body Soap</Link>
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
              <Link href="/blog/ingredients/raw-honey-natural-moisturizer" className="group">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=400&width=600&text=Raw+Honey"
                    alt="Raw Honey"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-playfair text-lg font-bold text-green-800 group-hover:text-pink-500 transition-colors">
                  Why Raw Honey is Nature's Perfect Moisturizer
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