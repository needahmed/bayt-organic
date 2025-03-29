"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, Heart, Share2, ArrowLeft } from "lucide-react";

export default function FaceSteamingArticlePage() {
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
        <span className="text-green-800">Face Steaming</span>
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
            Face Steaming: Benefits and How-To
          </h1>
          <div className="flex items-center text-green-600 mb-4">
            <Clock size={16} className="mr-1" />
            <span className="mr-4">4 min read</span>
            <span>Published September 2, 2023</span>
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
              src="/blog/steaming.jpg"
              alt="Woman enjoying a facial steam treatment with herbs"
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
            Face steaming is a time-honored beauty ritual that has been practiced across cultures for centuries. This simple yet effective technique uses the power of warm steam to cleanse, nourish, and rejuvenate the skin. In today's fast-paced world, taking a few minutes for a facial steam can be both a skin-enhancing treatment and a moment of self-care.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            The Science Behind Face Steaming
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            When warm steam makes contact with your face, it raises the skin's temperature and induces sweating. This process offers several benefits:
          </p>
          
          <ul className="mt-4 mb-6 space-y-2 text-green-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Opens pores:</strong> The warmth causes pores to dilate, making it easier to remove trapped dirt, oil, and impurities.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Enhances circulation:</strong> The heat stimulates blood flow to the face, bringing oxygen and nutrients to skin cells.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Promotes hydration:</strong> Steam helps to hydrate the skin by increasing oil production and preventing water loss.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Enhances product absorption:</strong> After steaming, your skin can better absorb the active ingredients in your skincare products.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span><strong>Softens sebum and blackheads:</strong> Makes extraction of blackheads easier and less traumatic to the skin.</span>
            </li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-200 p-6 my-8 rounded-r">
            <blockquote className="italic text-green-700 text-lg">
              "Face steaming is like giving your skin a mini-sauna session. It softens, cleanses, and prepares your skin to receive the maximum benefits from the rest of your skincare routine."
            </blockquote>
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            How to Perform a Facial Steam at Home
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            You don't need fancy equipment to enjoy the benefits of face steaming. Here's how to create an effective facial steam treatment in your own home:
          </p>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            What You'll Need:
          </h3>
          <ul className="mt-4 mb-6 space-y-2 text-green-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>A large bowl</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Boiling water</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>A towel large enough to cover your head and the bowl</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Optional: herbs, essential oils, or tea bags for added benefits</span>
            </li>
          </ul>
          
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-green-800 mt-6 mb-3">
            Step-by-Step Instructions:
          </h3>
          <ol className="mt-4 mb-6 list-decimal pl-5 space-y-2 text-green-700">
            <li className="pl-2">
              <span className="font-bold">Cleanse your face</span> - Start with clean skin to maximize the benefits of steaming. Use a gentle cleanser to remove surface dirt and makeup.
            </li>
            <li className="pl-2">
              <span className="font-bold">Prepare your steam</span> - Boil water and carefully pour it into a heat-safe bowl. If you're adding herbs or essential oils, add them now.
            </li>
            <li className="pl-2">
              <span className="font-bold">Position yourself</span> - Place the bowl on a stable surface at a comfortable height. Sit so your face is about 8-10 inches from the water.
            </li>
            <li className="pl-2">
              <span className="font-bold">Create a tent</span> - Drape the towel over your head and the bowl to trap the steam.
            </li>
            <li className="pl-2">
              <span className="font-bold">Steam your face</span> - Remain under the towel for 5-10 minutes. If the steam feels too hot, lift the towel slightly to release some heat.
            </li>
            <li className="pl-2">
              <span className="font-bold">Follow up with skincare</span> - After steaming, pat your face dry and immediately apply toner, serum, and moisturizer while your skin is still receptive.
            </li>
          </ol>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Enhancing Your Steam with Herbs and Essential Oils
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            Adding natural botanicals to your facial steam can enhance the benefits and create a more spa-like experience. Here are some excellent additions to consider:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-playfair font-bold text-green-800 mb-2">Herbs for Facial Steaming</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Chamomile:</strong> Soothes inflammation and calms sensitive skin</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Rosemary:</strong> Stimulates circulation and has antimicrobial properties</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Lavender:</strong> Balances oil production and promotes relaxation</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Peppermint:</strong> Refreshes and invigorates tired skin</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-5 rounded-lg">
              <h4 className="font-playfair font-bold text-green-800 mb-2">Essential Oils for Facial Steaming</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Tea Tree:</strong> Antibacterial and excellent for acne-prone skin</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Eucalyptus:</strong> Purifying and helps clear congestion</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Rose:</strong> Hydrating and soothing for dry or mature skin</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
                  <span><strong>Geranium:</strong> Balances sebum production and tones the skin</span>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="text-lg leading-relaxed text-green-700">
            <strong>Note:</strong> When using essential oils, add only 2-3 drops to your steam as they are highly concentrated. If you have allergies or sensitive skin, test a small amount first or consult with a healthcare provider.
          </p>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Who Should Avoid Face Steaming?
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            While facial steaming is beneficial for many, it's not suitable for everyone. You should avoid or use caution with facial steaming if you have:
          </p>
          <ul className="mt-4 mb-6 space-y-2 text-green-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Rosacea, as the heat can trigger flare-ups</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Severe acne, which might be aggravated by increased circulation</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Very dry or eczema-prone skin</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Sunburned or otherwise compromised skin barrier</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full"></span>
              <span>Recent cosmetic procedures like chemical peels or laser treatments</span>
            </li>
          </ul>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-green-800 mt-8 mb-4">
            Integrating Face Steaming Into Your Routine
          </h2>
          <p className="text-lg leading-relaxed text-green-700">
            For most skin types, face steaming once or twice a week is sufficient. For oily or acne-prone skin, you might benefit from up to two sessions per week, while those with dry or sensitive skin should limit steaming to once every 1-2 weeks.
          </p>
          
          <p className="text-lg leading-relaxed text-green-700">
            The best time to steam your face is in the evening, when you can follow it with a thorough skincare routine and allow your skin to absorb all those beneficial ingredients overnight. It's also an excellent practice before applying a facial mask, as the steam opens pores and allows the mask to penetrate more deeply.
          </p>
          
          <div className="mt-12 bg-green-50 p-8 rounded-lg shadow-sm">
            <h3 className="font-playfair text-xl font-bold text-green-800 mb-3">Enhance your post-steam skincare routine</h3>
            <p className="text-lg text-green-700 mb-4">After steaming, your skin is perfectly prepped to receive the antibacterial and detoxifying benefits of our Charcoal and Tea Tree Body Soap, which can also be used as a facial cleanser for oily or acne-prone skin.</p>
            <div className="mt-4">
              <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
                <Link href="/products/soaps/1">Shop Charcoal and Tea Tree Body Soap</Link>
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
          </div>
        </div>
      </article>
    </div>
  );
} 