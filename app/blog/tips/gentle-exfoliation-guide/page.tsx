"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Share2, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function ExfoliationGuidePage() {
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
            <Badge className="bg-green-100 text-green-800 mb-4">Beauty Tip</Badge>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold text-green-800 mb-4">
              The Art of Gentle Exfoliation for Glowing Skin
            </h1>
            
            <div className="flex items-center text-green-600 text-sm mb-8">
              <span className="flex items-center mr-6">
                <Clock className="h-4 w-4 mr-2" />
                April 10, 2023
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
              src="/placeholder.svg?height=800&width=1200&text=Gentle+Exfoliation"
              alt="Gentle Exfoliation"
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
              Regular exfoliation is one of the most transformative steps you can add to your skincare routine. By removing dead skin cells from the surface of your skin, exfoliation reveals the fresher, brighter skin underneath. However, the key to effective exfoliation lies in its gentleness. In this guide, we'll explore how to exfoliate properly to achieve that coveted glow without damaging your skin.
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">Why Exfoliation Matters</h2>
            <p className="text-lg leading-relaxed text-green-700">
              Your skin naturally sheds dead cells every 28-30 days. But as we age, this process slows down, leading to a buildup of dead cells on the skin's surface. This buildup can cause:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Dull, lackluster complexion</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Rough, uneven texture</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Clogged pores and breakouts</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Enhanced appearance of fine lines and wrinkles</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Poor absorption of skincare products</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              Proper exfoliation helps to clear away this buildup, allowing your skin to function optimally and your skincare products to penetrate more effectively.
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">Types of Exfoliation</h2>
            <p className="text-lg leading-relaxed text-green-700">
              There are two main approaches to exfoliation:
            </p>
            
            <h3 className="font-playfair text-xl font-bold text-green-800 mt-6 mb-3">Physical Exfoliation</h3>
            <p className="text-lg leading-relaxed text-green-700">
              This method uses small particles or tools to physically scrub away dead skin cells. Natural examples include:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Finely ground oats</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Sugar</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Salt</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Ground fruit pits or shells (when very finely milled)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Soft cloths or brushes</span>
              </li>
            </ul>
            
            <h3 className="font-playfair text-xl font-bold text-green-800 mt-6 mb-3">Chemical Exfoliation</h3>
            <p className="text-lg leading-relaxed text-green-700">
              This method uses acids or enzymes to dissolve the bonds between dead skin cells. Natural options include:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Fruit enzymes (papaya, pineapple)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Alpha hydroxy acids (found in milk, yogurt, fruits)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Beta hydroxy acids (found in willow bark)</span>
              </li>
            </ul>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-200 p-6 my-8 rounded-r">
              <blockquote className="italic text-green-700 text-lg">
                "The gentlest exfoliation yields the most beautiful results. It's not about how aggressively you can scrub, but how respectfully you can reveal your skin's natural radiance."
              </blockquote>
            </div>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">The Art of Gentle Exfoliation</h2>
            <p className="text-lg leading-relaxed text-green-700">
              For truly effective exfoliation that doesn't damage your skin barrier, follow these principles:
            </p>
            
            <h3 className="font-playfair text-xl font-bold text-green-800 mt-6 mb-3">1. Know Your Skin Type</h3>
            <p className="text-lg leading-relaxed text-green-700">
              Different skin types require different approaches:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="font-bold mr-2">Sensitive skin:</span>
                <span>Opt for very gentle exfoliators like oats or rice powder, used less frequently</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Dry skin:</span>
                <span>Choose hydrating exfoliators with moisturizing ingredients</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Oily/combination skin:</span>
                <span>May tolerate more frequent exfoliation</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Mature skin:</span>
                <span>Benefits from gentle chemical exfoliation to boost cell turnover</span>
              </li>
            </ul>
            
            <h3 className="font-playfair text-xl font-bold text-green-800 mt-6 mb-3">2. Be Mindful of Pressure</h3>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              When using physical exfoliants, gentle pressure is key. Let the exfoliant do the work, not your fingers. Use light, circular motions and never drag or pull at your skin.
            </p>
            
            <h3 className="font-playfair text-xl font-bold text-green-800 mt-6 mb-3">3. Respect Frequency Limits</h3>
            <p className="text-lg leading-relaxed text-green-700">
              More is not better when it comes to exfoliation. For most skin types:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Face: 1-3 times per week</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Body: 2-3 times per week</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Sensitive areas: Once a week or less</span>
              </li>
            </ul>
            
            <h3 className="font-playfair text-xl font-bold text-green-800 mt-6 mb-3">4. Listen to Your Skin</h3>
            <p className="text-lg leading-relaxed text-green-700 mb-4">
              If your skin feels tight, irritated, or looks red after exfoliation, you're likely overdoing it. Scale back frequency or switch to a gentler method.
            </p>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">Exfoliation in Your Natural Skincare Routine</h2>
            <p className="text-lg leading-relaxed text-green-700">
              At Bayt Organic, several of our products offer gentle exfoliation benefits:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="font-bold mr-2">Honey & Oats Body Soap:</span>
                <span>Contains finely ground oats that gently buff away dead skin while honey moisturizes</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Pink Salt Bar:</span>
                <span>Provides mineral-rich exfoliation for the body</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">Neem Body Soap:</span>
                <span>Features poppy seeds for light exfoliation alongside neem's purifying properties</span>
              </li>
            </ul>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">Post-Exfoliation Care</h2>
            <p className="text-lg leading-relaxed text-green-700">
              After exfoliating, your skin is especially receptive to treatments and moisturizers. Always follow exfoliation with:
            </p>
            <ol className="mt-4 mb-6 list-decimal pl-5 space-y-2 text-green-700">
              <li className="pl-2">A gentle, pH-balanced cleanser (if you haven't exfoliated with a cleanser)</li>
              <li className="pl-2">Hydrating toner or essence (optional)</li>
              <li className="pl-2">Serum tailored to your skin concerns</li>
              <li className="pl-2">Moisturizer to lock in benefits</li>
              <li className="pl-2">Sunscreen during daytime (exfoliated skin is more sun-sensitive)</li>
            </ol>
            
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">The Glow-Up Result</h2>
            <p className="text-lg leading-relaxed text-green-700">
              Consistent, gentle exfoliation offers remarkable benefits for your skin:
            </p>
            <ul className="mt-4 mb-6 space-y-2 text-green-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Enhanced natural radiance</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Smoother, softer texture</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Reduced appearance of pores and fine lines</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Fewer breakouts and clogged pores</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>Better absorption of skincare products</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                <span>More even skin tone over time</span>
              </li>
            </ul>
            
            <p className="text-lg leading-relaxed text-green-700 mb-6">
              Remember that glowing skin is a journey, not an overnight destination. Incorporate gentle exfoliation into your routine consistently, and you'll begin to notice your skin's natural radiance emerging.
            </p>
            
            <div className="mt-12 bg-green-50 p-8 rounded-lg shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-green-800 mb-3">Ready to add gentle exfoliation to your routine?</h3>
              <p className="text-lg text-green-700 mb-4">Try our Honey & Oats Body Soap for a natural way to exfoliate while nourishing your skin.</p>
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
              <Link href="/blog/tips/lock-moisture-natural-oils" className="group">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=400&width=600&text=Moisture+Lock"
                    alt="Moisture Lock"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-playfair text-lg font-bold text-green-800 group-hover:text-pink-500 transition-colors">
                  How to Lock in Moisture with Natural Oils
                </h3>
              </Link>
              <Link href="/blog/tips/face-steaming-benefits" className="group">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=400&width=600&text=Face+Steaming"
                    alt="Face Steaming"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-playfair text-lg font-bold text-green-800 group-hover:text-pink-500 transition-colors">
                  The Benefits of Face Steaming with Essential Oils
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