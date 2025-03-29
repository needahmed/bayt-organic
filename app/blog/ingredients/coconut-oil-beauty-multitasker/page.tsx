"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, Heart, Share2, ArrowLeft } from "lucide-react";

export default function CoconutOilArticlePage() {
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
        <Link href="/blog#ingredients" className="hover:text-green-800">Ingredients</Link>
        <span className="mx-2">/</span>
        <span className="text-green-800">Coconut Oil</span>
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
            Ingredient Spotlight
          </Badge>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4">
            Coconut Oil: The Beauty Multitasker
          </h1>
          <div className="flex items-center text-green-600 mb-4">
            <Clock size={16} className="mr-1" />
            <span className="mr-4">6 min read</span>
            <span>Published July 21, 2023</span>
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
              src="/blog/coconut.jpg"
              alt="Coconut oil in a jar with fresh coconuts"
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
            Coconut oil has become a staple in natural beauty routines around the world, and for good reason. This versatile oil extracted from the meat of mature coconuts offers numerous benefits for skin, hair, and overall wellness. Its natural composition makes it an excellent choice for those seeking clean, effective beauty solutions.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            What Makes Coconut Oil Special?
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            Coconut oil contains medium-chain fatty acids, primarily lauric acid, which has antimicrobial properties. This unique fatty acid profile gives coconut oil its ability to moisturize deeply while also providing protective benefits. Virgin or unrefined coconut oil retains more of its natural nutrients and pleasant tropical scent.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-200 p-6 my-8 rounded-r">
            <blockquote className="italic text-green-700 text-lg">
              "Coconut oil is nature's perfect multitasker - it simplifies your beauty routine while delivering impressive results across different applications."
            </blockquote>
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Top Beauty Uses for Coconut Oil
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            The versatility of coconut oil is what makes it truly remarkable. Here are some of the most popular ways to incorporate it into your beauty routine:
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            1. Natural Moisturizer
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Coconut oil is an excellent moisturizer for both face and body. Its molecular structure allows it to penetrate the skin more deeply than many other oils, providing lasting hydration. The oil creates a protective barrier that helps skin retain moisture while still allowing it to breathe.
          </p>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            For best results, apply to slightly damp skin after showering. A little goes a long way - start with a small amount and warm it between your palms before applying.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            2. Makeup Remover
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            Coconut oil easily dissolves even waterproof makeup while nourishing the delicate skin around your eyes. Simply massage a small amount onto dry skin, then wipe away with a warm, damp cloth. It's gentle, effective, and leaves skin feeling soft instead of stripped.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            3. Hair Conditioning Treatment
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            The fatty acids in coconut oil have a natural affinity for hair proteins, allowing them to penetrate the hair shaft where they can strengthen and protect from within. Use it as a pre-shampoo treatment, leave-in conditioner, or frizz-tamer.
          </p>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            For deep conditioning, warm a few tablespoons of coconut oil and massage through dry hair, focusing on the ends. Wrap hair in a warm towel and leave for 30 minutes or overnight before shampooing thoroughly.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            4. Natural Lip Balm
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            The moisturizing properties of coconut oil make it perfect for soothing dry, chapped lips. Its slight natural sweetness is an added bonus. Apply a small amount as needed throughout the day for soft, hydrated lips.
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            5. Oil Pulling
          </h3>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            This Ayurvedic practice involves swishing oil (traditionally sesame, but coconut oil is now popular) in your mouth for about 15-20 minutes. Proponents say it helps remove toxins and improve oral health. The antimicrobial properties of coconut oil may help reduce harmful bacteria in the mouth.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Choosing the Right Coconut Oil
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            When selecting coconut oil for beauty purposes, consider these factors:
          </p>
          <ul className="mt-4 mb-6 space-y-2 text-green-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Virgin vs. Refined:</strong> Virgin (unrefined) coconut oil retains more nutrients and has that classic coconut scent. Refined oil has a more neutral smell but may have fewer beneficial compounds.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Organic:</strong> Choose organic when possible to avoid pesticide residues.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Cold-Pressed:</strong> This extraction method preserves more of the oil's beneficial properties.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Glass Packaging:</strong> Preferably stored in glass rather than plastic.</span>
            </li>
          </ul>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Coconut Oil in Our Products
          </h2>
          <p className="text-lg leading-relaxed text-green-700 mb-4">
            At Bayt Organic, we recognize the exceptional benefits of coconut oil, which is why we feature it prominently in our Coconut Milk & Vanilla Body Soap. This gentle cleanser combines organic coconut oil with moisturizing coconut milk and the comforting scent of vanilla for a luxurious bathing experience that leaves skin soft and nourished.
          </p>
          
          <div className="mt-12 bg-green-50 p-8 rounded-lg shadow-sm">
            <h3 className="font-playfair text-xl font-bold text-green-800 mb-3">Experience the benefits of coconut oil</h3>
            <p className="text-lg text-green-700 mb-4">Our Coconut Milk & Vanilla Body Soap harnesses the moisturizing power of coconut oil in a gentle, everyday cleanser suitable for all skin types.</p>
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
              <Link href="/blog/ingredients/activated-charcoal-skin-detoxification" className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src="/blog/charcoal.jpg"
                    alt="Activated Charcoal"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <Badge variant="outline" className="mb-2 text-xs bg-green-50 text-green-700 border-green-200">
                    Ingredient Spotlight
                  </Badge>
                  <h3 className="font-playfair text-lg font-bold text-green-800 mb-2">
                    Activated Charcoal: Nature's Skin Detoxifier
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover how activated charcoal draws impurities from the skin, leaving it cleaner and clearer.
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