"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, Heart, Share2, ArrowLeft } from "lucide-react";

export default function NaturalOilsArticlePage() {
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
        <span className="text-green-800">Natural Oils</span>
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
            How to Lock in Moisture with Natural Oils
          </h1>
          <div className="flex items-center text-green-600 mb-4">
            <Clock size={16} className="mr-1" />
            <span className="mr-4">6 min read</span>
            <span>Published May 27, 2023</span>
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
              src="/blog/oils.jpg"
              alt="Various natural oils in glass bottles"
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
            In natural skincare, one of the most effective ways to maintain soft, supple skin is by properly locking in moisture. Natural oils play a crucial role in this process, forming a protective barrier that prevents water loss while delivering beneficial nutrients to the skin. This article explores how to use different natural oils effectively to maximize hydration and create a healthy skin barrier.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Understanding Skin Hydration
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            Before diving into how oils work, it's important to understand the difference between hydration and moisturization:
          </p>
          <ul className="mt-4 mb-6 space-y-2 text-green-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Hydration</strong> refers to the water content within your skin cells, making them plump and elastic.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Moisturization</strong> refers to trapping and sealing that hydration into the skin with emollients like oils.</span>
            </li>
          </ul>
          
          <p className="text-lg leading-relaxed text-green-700">
            For truly healthy skin, you need both: first water-based hydration, then oil-based moisture to lock it in. Natural oils excel at the second part of this process.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-200 p-6 my-8 rounded-r">
            <blockquote className="italic text-green-700 text-lg">
              "Think of your skin like a sponge. You want it soaked with water first, then sealed with oil to prevent that water from evaporating too quickly."
            </blockquote>
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            The Science Behind Natural Oils
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            Natural oils typically contain a mix of fatty acids, vitamins, and antioxidants that benefit the skin in multiple ways. When it comes to moisture retention, oils work through two primary mechanisms:
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            1. Occlusive Properties
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Many natural oils create a physical barrier on the skin's surface that prevents transepidermal water loss (TEWL). This occlusive property is especially important in dry environments or during winter months when skin is more prone to dehydration.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            2. Emollient Effects
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Oils fill in the tiny cracks between skin cells, creating a smoother surface and softer feel. This smoothing effect improves the skin's barrier function and helps maintain hydration over time.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Choosing the Right Oils for Your Skin Type
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            Not all oils are created equal, and different skin types benefit from different oils:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-playfair font-bold text-green-800 mb-2">For Dry Skin</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Avocado Oil:</strong> Rich and deeply moisturizing</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Olive Oil:</strong> Contains squalene, similar to our skin's natural oils</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Argan Oil:</strong> High in vitamin E and fatty acids</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Shea Butter:</strong> Although technically a butter, it melts into an oil and provides excellent moisture retention</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-playfair font-bold text-green-800 mb-2">For Oily/Combination Skin</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Jojoba Oil:</strong> Closely resembles human sebum and can help balance oil production</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Grapeseed Oil:</strong> Light and easily absorbed with astringent properties</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Squalane:</strong> Light, non-comedogenic moisture that mimics skin's natural sebum</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Hemp Seed Oil:</strong> Balancing and rich in omega fatty acids</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-playfair font-bold text-green-800 mb-2">For Sensitive Skin</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Calendula Oil:</strong> Soothing and calming for irritated skin</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Rosehip Oil:</strong> Gentle yet effective, rich in vitamins A and C</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Sunflower Seed Oil:</strong> Light and non-irritating, helps repair skin barrier</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-playfair font-bold text-green-800 mb-2">For Mature Skin</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Rosehip Oil:</strong> Contains retinol-like compounds that support skin regeneration</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Pomegranate Seed Oil:</strong> Rich in antioxidants and ellagic acid</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Sea Buckthorn Oil:</strong> Exceptionally high in omega-7 fatty acids</span>
                </li>
              </ul>
            </div>
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Effective Techniques for Applying Oils
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            The way you apply oils makes a significant difference in how well they lock in moisture. Follow these techniques for maximum benefit:
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            1. The Damp Skin Method
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            One of the most effective techniques is applying oil to slightly damp skin, ideally within 3 minutes of washing or misting your face:
          </p>
          <ol className="mt-4 mb-6 list-decimal pl-5 space-y-2 text-green-700">
            <li className="pl-2">Cleanse your skin with a gentle, non-stripping cleanser</li>
            <li className="pl-2">Pat (don't rub) your skin until it's just slightly damp</li>
            <li className="pl-2">Apply a few drops of oil to your palms and warm it by rubbing your hands together</li>
            <li className="pl-2">Press (don't rub) the oil into your skin, starting from the center and working outward</li>
            <li className="pl-2">Allow a minute or two for the oil to absorb before applying makeup or sunscreen</li>
          </ol>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            2. The Layering Method
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            For extremely dry skin or harsh environments, try this layering technique:
          </p>
          <ol className="mt-4 mb-6 list-decimal pl-5 space-y-2 text-green-700">
            <li className="pl-2">Apply a hydrating toner or essence to clean skin</li>
            <li className="pl-2">Follow with a water-based serum containing humectants like hyaluronic acid or glycerin</li>
            <li className="pl-2">Apply a few drops of facial oil</li>
            <li className="pl-2">Seal everything with a small amount of a balm or butter-based product if needed</li>
          </ol>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            3. The Overnight Treatment
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            For intensive moisture replenishment, try this overnight routine:
          </p>
          <ol className="mt-4 mb-6 list-decimal pl-5 space-y-2 text-green-700">
            <li className="pl-2">Cleanse thoroughly and apply any treatment products</li>
            <li className="pl-2">Apply a generous layer of a rich oil or oil blend</li>
            <li className="pl-2">Consider using a silk pillowcase to prevent the oil from being absorbed by your bedding</li>
          </ol>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Common Mistakes to Avoid
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            When using oils to lock in moisture, be careful to avoid these common pitfalls:
          </p>
          <ul className="mt-4 mb-6 space-y-2 text-green-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Using too much:</strong> Oils are concentrated; a few drops are usually sufficient. Using too much can leave skin feeling greasy and may interfere with sunscreen or makeup application.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Applying to dry skin:</strong> Oils lock in moisture, but they don't provide much hydration on their own. Always apply to damp skin or over water-based products.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Incorrect layering:</strong> Oils should generally come after water-based products but before heavier creams or sunscreen.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Neglecting to patch test:</strong> Always test new oils on a small area before applying to your entire face, especially if you have sensitive skin.</span>
            </li>
          </ul>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            DIY Oil Blends for Moisture Retention
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            Creating your own oil blends can be both economical and effective. Here are some combinations to try:
          </p>
          
          <div className="p-6 bg-green-50 rounded-lg my-6">
            <h4 className="font-playfair font-bold text-green-800 mb-3">Dry Skin Nourishing Blend</h4>
            <ul className="space-y-2 text-green-700">
              <li>3 parts argan oil</li>
              <li>2 parts avocado oil</li>
              <li>1 part rosehip oil</li>
              <li>2-3 drops of lavender essential oil (optional)</li>
            </ul>
            <p className="mt-3 text-green-700 italic">Apply a few drops to damp skin in the evening for intense overnight hydration.</p>
          </div>
          
          <div className="p-6 bg-green-50 rounded-lg my-6">
            <h4 className="font-playfair font-bold text-green-800 mb-3">Balanced Skin Blend</h4>
            <ul className="space-y-2 text-green-700">
              <li>3 parts jojoba oil</li>
              <li>1 part grapeseed oil</li>
              <li>1 part squalane</li>
              <li>2-3 drops of frankincense essential oil (optional)</li>
            </ul>
            <p className="mt-3 text-green-700 italic">Perfect for morning application under makeup or sunscreen.</p>
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            At Bayt Organic: Our Approach to Moisture-Locking
          </h2>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            At Bayt Organic, we understand the importance of proper hydration and moisture retention. Our soaps are formulated with carefully selected natural oils that cleanse without stripping your skin's natural moisture. For optimal results, we recommend a simple routine that incorporates our soaps followed by natural oils to lock in moisture.
          </p>
          
          <div className="mt-12 bg-green-50 p-8 rounded-lg shadow-sm">
            <h3 className="font-playfair text-xl font-bold text-green-800 mb-3">Experience the perfect cleanse-and-moisturize ritual</h3>
            <p className="text-lg text-green-700 mb-4">Our Coconut Milk & Vanilla Body Soap contains nourishing coconut oil that works harmoniously with your post-shower oil application to keep skin soft and hydrated.</p>
            <div className="mt-4">
              <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
                <Link href="/products/soaps/3">Shop Coconut Milk & Vanilla Body Soap</Link>
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
              <Link href="/blog/tips/hydration-healthy-skin" className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src="/blog/hydration.jpg"
                    alt="Skin hydration"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <Badge variant="outline" className="mb-2 text-xs bg-green-50 text-green-700 border-green-200">
                    DIY Tips
                  </Badge>
                  <h3 className="font-playfair text-lg font-bold text-green-800 mb-2">
                    Why Hydration is Key to Healthy Skin
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover why proper hydration is essential for skin health and practical tips to keep your skin hydrated.
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
              <Link href="/blog/ingredients/coconut-oil-beauty-multitasker" className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src="/blog/coconut.jpg"
                    alt="Coconut Oil"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <Badge variant="outline" className="mb-2 text-xs bg-green-50 text-green-700 border-green-200">
                    Ingredient Spotlight
                  </Badge>
                  <h3 className="font-playfair text-lg font-bold text-green-800 mb-2">
                    Coconut Oil: The Beauty Multitasker
                  </h3>
                  <p className="text-gray-600 text-sm">
                    From moisturizing to makeup removal, explore the many uses of coconut oil in your natural beauty routine.
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