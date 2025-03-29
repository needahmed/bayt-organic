"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, Heart, Share2, ArrowLeft } from "lucide-react";

export default function HydrationArticlePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center text-sm text-green-600"
      >
        <Link href="/" className="hover:text-green-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-green-800">Blog</Link>
        <span className="mx-2">/</span>
        <Link href="/blog#tips" className="hover:text-green-800">DIY Tips</Link>
        <span className="mx-2">/</span>
        <span className="text-green-800">Hydration</span>
      </motion.div>

      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-4 bg-green-50 text-green-700 border-green-200">
            DIY Tips
          </Badge>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4">
            Why Hydration is Key to Healthy Skin
          </h1>
          <div className="flex items-center text-green-600 mb-4">
            <Clock size={16} className="mr-1" />
            <span className="mr-4">5 min read</span>
            <span>Published August 19, 2023</span>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 relative rounded-lg overflow-hidden shadow-lg"
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/blog/hydration.jpg"
              alt="Woman drinking water and holding a moisturizer"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-lg prose-green max-w-none"
        >
          <p className="text-lg leading-relaxed text-green-700">
            When it comes to achieving healthy, radiant skin, there's one fundamental factor that often gets overlooked amidst the excitement of new products and trendy ingredients: hydration. Proper hydration is the foundation of skin health, affecting everything from texture and appearance to the skin's ability to protect and heal itself.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Understanding Skin Hydration
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            Skin hydration refers to the water content within skin cells. When skin is well-hydrated, it appears plump, smooth, and luminous. Dehydrated skin, on the other hand, can look dull, feel tight, show more visible fine lines, and may be more prone to irritation and inflammation.
          </p>
          
          <p className="text-lg leading-relaxed text-green-700">
            It's important to understand that hydration (water content) is different from moisturization (oil content). While both are essential for skin health, they serve different functions: hydration fills skin cells with water, while moisturization creates a protective barrier that prevents water loss.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-200 p-6 my-8 rounded-r">
            <blockquote className="italic text-green-700 text-lg">
              "Think of your skin cells as tiny grapes. Well-hydrated cells are like plump, juicy grapes, while dehydrated cells are more like raisins. Proper hydration helps maintain that plumpness that gives skin its youthful appearance."
            </blockquote>
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Signs Your Skin Needs More Hydration
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            How do you know if your skin is dehydrated? Look for these common indicators:
          </p>
          <ul className="mt-4 mb-6 space-y-2 text-green-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Increased sensitivity or irritation</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Tight feeling, especially after cleansing</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Dull complexion lacking radiance</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>More visible fine lines and wrinkles</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Flaking or peeling, even in oily areas</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Increased oil production (as skin tries to compensate for water loss)</span>
            </li>
          </ul>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            The Science of Skin Hydration
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            Our skin has a natural moisture barrier, known as the acid mantle or lipid barrier, which helps protect against water loss and environmental aggressors. This barrier consists of natural oils, fatty acids, and ceramides. When this barrier is compromised—by harsh cleansers, environmental factors, aging, or other stressors—skin becomes more prone to dehydration.
          </p>
          
          <p className="text-lg leading-relaxed text-green-700">
            Additionally, the skin contains natural moisturizing factors (NMFs), which are substances that attract and hold water within the skin. Maintaining these NMFs is crucial for keeping skin hydrated from within.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Hydration from the Inside Out
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            While topical products play an important role in skin hydration, internal hydration is equally vital. Here's how to support your skin's hydration from the inside:
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            1. Drink Adequate Water
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            The age-old advice to drink eight glasses of water daily is a good starting point, but individual needs vary based on factors like activity level, climate, and overall health. A good rule of thumb is to drink enough that your urine is pale yellow throughout the day.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            2. Consume Water-Rich Foods
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Fruits and vegetables with high water content—such as cucumber, watermelon, strawberries, and lettuce—can contribute significantly to your daily water intake while also providing valuable nutrients that support skin health.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            3. Limit Dehydrating Substances
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Caffeine and alcohol can have diuretic effects, increasing water loss. While you don't need to eliminate these entirely, be mindful of your consumption and increase your water intake to compensate.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Topical Hydration Strategies
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            To optimize skin hydration from the outside, consider these effective approaches:
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            1. Use Humectants
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Humectants are ingredients that attract water to the skin. Look for products containing hyaluronic acid, glycerin, aloe vera, or honey—all natural humectants that draw moisture into the skin.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            2. Seal in Moisture
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            After applying hydrating ingredients, use natural oils or butters to create a barrier that prevents water evaporation. Ingredients like shea butter, coconut oil, and jojoba oil are excellent for this purpose.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            3. Be Gentle with Cleansing
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Harsh cleansers can strip away the skin's natural oils, disrupting the moisture barrier. Opt for gentle, pH-balanced cleansers that clean effectively without over-drying.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            4. Consider Environmental Factors
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Use a humidifier in dry climates or during winter months to add moisture to the air. Shield your skin from harsh winds and extreme temperatures, which can accelerate water loss.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Hydration for Different Skin Types
          </h2>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            While everyone's skin needs hydration, the approach may vary based on skin type:
          </p>
          
          <ul className="mt-4 mb-6 space-y-4 text-green-700">
            <li>
              <h4 className="font-bold text-green-800">Oily Skin</h4>
              <p>Contrary to popular belief, oily skin can still be dehydrated. Focus on water-based hydrators and lighter moisturizers that won't feel heavy.</p>
            </li>
            <li>
              <h4 className="font-bold text-green-800">Dry Skin</h4>
              <p>Layer hydrating products and use richer emollients to seal in moisture. Consider using a hydrating mask 1-2 times weekly.</p>
            </li>
            <li>
              <h4 className="font-bold text-green-800">Combination Skin</h4>
              <p>Use different products for different areas, or find balanced formulas that provide adequate hydration without excess oil.</p>
            </li>
            <li>
              <h4 className="font-bold text-green-800">Sensitive Skin</h4>
              <p>Choose fragrance-free hydrators with soothing ingredients like aloe vera and chamomile.</p>
            </li>
          </ul>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Hydration in Your Bayt Organic Routine
          </h2>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            At Bayt Organic, we understand the critical importance of hydration for skin health. Our honey-based products are particularly beneficial for maintaining skin hydration. Raw honey is a natural humectant that draws moisture into the skin while also providing antibacterial and antioxidant benefits.
          </p>
          
          <div className="mt-12 bg-green-50 p-8 rounded-lg shadow-sm">
            <h3 className="font-playfair text-xl font-bold text-green-800 mb-3">Support your skin's hydration</h3>
            <p className="text-lg text-green-700 mb-4">Our Honey & Oats Body Soap combines the natural humectant properties of honey with the gentle exfoliation of oats to maintain your skin's moisture balance while cleansing.</p>
            <div className="mt-4">
              <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
                <Link href="/products/soaps/2">Shop Honey & Oats Body Soap</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Article Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-green-100 flex justify-between"
        >
          <div className="flex space-x-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-green-700 border-green-200">
              <Heart size={16} /> Like
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-green-700 border-green-200">
              <Share2 size={16} /> Share
            </Button>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-green-700">
            <Link href="/blog" className="flex items-center gap-1">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </Button>
        </motion.div>

        {/* Related Articles */}
        <div className="mt-16">
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href="/blog/tips/gentle-exfoliation-guide" className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src="/blog/exfoliation.jpg"
                    alt="Gentle exfoliation"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <Badge variant="outline" className="mb-2 text-xs bg-green-50 text-green-700 border-green-200">
                    DIY Tips
                  </Badge>
                  <h3 className="font-playfair text-lg font-bold text-green-800 mb-2">
                    The Gentle Guide to Exfoliation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Learn how to effectively exfoliate without damaging your skin, including techniques and natural ingredients to try at home.
                  </p>
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href="/blog/ingredients/raw-honey-natural-moisturizer" className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src="/blog/honey.jpg"
                    alt="Raw Honey"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <Badge variant="outline" className="mb-2 text-xs bg-green-50 text-green-700 border-green-200">
                    Ingredient Spotlight
                  </Badge>
                  <h3 className="font-playfair text-lg font-bold text-green-800 mb-2">
                    Raw Honey: The Natural Moisturizer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Explore the moisturizing and antibacterial properties of raw honey, and why it's a star ingredient in natural skincare.
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </article>
    </div>
  );
} 