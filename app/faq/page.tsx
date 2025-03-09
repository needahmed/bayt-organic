"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Search, ShoppingBag, Truck, RefreshCw, CreditCard, HelpCircle } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // FAQ data organized by category
  const faqData = {
    products: [
      {
        question: "Are your products 100% natural?",
        answer:
          "Yes, all our products are made with 100% natural ingredients. We never use synthetic chemicals, artificial fragrances, or preservatives in our formulations. Our commitment is to provide truly natural products that are safe for you and the environment.",
      },
      {
        question: "Are your products suitable for sensitive skin?",
        answer:
          "Most of our products are gentle and suitable for sensitive skin. However, we always recommend doing a patch test before using a new product, especially if you have known sensitivities. Our Honey & Oats Soap and Milk Soap are particularly good options for sensitive skin.",
      },
      {
        question: "Do you test on animals?",
        answer:
          "Absolutely not. Bayt Organic is proudly cruelty-free. We never test our products on animals, and we don't work with suppliers who conduct animal testing.",
      },
      {
        question: "How should I store my products?",
        answer:
          "To maximize the shelf life of our products, store them in a cool, dry place away from direct sunlight. For soaps, we recommend using a draining soap dish to keep them dry between uses.",
      },
      {
        question: "What is the shelf life of your products?",
        answer:
          "Our products have a shelf life of 6-12 months, depending on the specific item. Each product has a 'best before' date printed on the packaging. Because we don't use artificial preservatives, it's best to use our products within the recommended timeframe for optimal effectiveness.",
      },
    ],
    orders: [
      {
        question: "How do I place an order?",
        answer:
          "You can place an order easily through our website. Simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide your shipping information and payment details to complete your purchase.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "If you need to modify or cancel your order, please contact our customer service team as soon as possible. We can usually accommodate changes if the order hasn't been processed yet. Once an order has been shipped, we cannot make changes.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "Yes, we take data security very seriously. Our website uses SSL encryption to protect your personal and payment information. We never share your data with third parties without your consent.",
      },
      {
        question: "Do you offer wholesale options?",
        answer:
          "Yes, we offer wholesale options for retailers interested in carrying Bayt Organic products. Please contact us at wholesale@baytorganic.com for more information about our wholesale program.",
      },
    ],
    shipping: [
      {
        question: "How long will it take to receive my order?",
        answer:
          "Standard shipping typically takes 3-5 business days within Pakistan. Express shipping is 1-2 business days. International shipping times vary by location. You'll receive a tracking number once your order ships so you can monitor its progress.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes, we offer free standard shipping on all orders over Rs. 2000 within Pakistan. Orders below this amount incur a shipping fee of Rs. 150 for standard shipping.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to select countries in the Middle East and South Asia. International shipping costs and delivery times vary by location. Please contact our customer service team for specific information about shipping to your country.",
      },
      {
        question: "What if my package is damaged during shipping?",
        answer:
          "If your package arrives damaged, please contact us immediately with photos of the damaged package and products. We'll arrange a replacement or refund as quickly as possible.",
      },
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer:
          "We accept returns within 14 days of delivery. Items must be unused, in their original condition, and in the original packaging. Some items, such as personal care products that have been opened, cannot be returned for hygiene reasons.",
      },
      {
        question: "How do I return an item?",
        answer:
          "To initiate a return, please email our customer service team at support@baytorganic.com with your order number and reason for return. We'll provide you with return instructions and a return shipping label if applicable.",
      },
      {
        question: "How long does it take to process a refund?",
        answer:
          "Once we receive your return, we'll inspect the items and process your refund within 3-5 business days. The refund will be issued to your original payment method and may take an additional 7-10 business days to appear on your statement, depending on your bank or credit card company.",
      },
      {
        question: "Do I have to pay for return shipping?",
        answer:
          "If you're returning an item due to our error (wrong item shipped, defective product, etc.), we'll cover the return shipping costs. For returns due to change of mind or other reasons, the customer is responsible for return shipping costs.",
      },
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept credit/debit cards (Visa, Mastercard), bank transfers, and cash on delivery (COD) for orders within Pakistan.",
      },
      {
        question: "Is it safe to use my credit card on your website?",
        answer:
          "Yes, our website uses SSL encryption to ensure that your payment information is secure. We do not store your credit card details on our servers.",
      },
      {
        question: "When will my card be charged?",
        answer:
          "Your card will be charged when you place your order. If for any reason we cannot fulfill your order, we will issue a full refund.",
      },
      {
        question: "Do you offer installment payment options?",
        answer:
          "Currently, we do not offer installment payment options, but we're working on implementing this feature in the future.",
      },
    ],
  }

  // Function to filter FAQs based on search query
  const filterFAQs = () => {
    let filteredFAQs = []

    // If a specific category is selected
    if (activeTab !== "all") {
      filteredFAQs = faqData[activeTab]
    } else {
      // Combine all categories
      Object.values(faqData).forEach((category) => {
        filteredFAQs = [...filteredFAQs, ...category]
      })
    }

    // Filter by search query if one exists
    if (searchQuery.trim() !== "") {
      return filteredFAQs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filteredFAQs
  }

  const filteredFAQs = filterFAQs()

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-green-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-green-700 max-w-2xl mx-auto">
            Find answers to common questions about our products, ordering, shipping, and more
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for a question..."
              className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 h-auto bg-green-50">
              <TabsTrigger value="all" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
                <HelpCircle className="h-4 w-4 mr-2" />
                All
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
                <Truck className="h-4 w-4 mr-2" />
                Shipping
              </TabsTrigger>
              <TabsTrigger value="returns" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
                <RefreshCw className="h-4 w-4 mr-2" />
                Returns
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* FAQ Accordion */}
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger className="text-green-800 font-medium text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-green-700">
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-green-50 rounded-lg"
            >
              <HelpCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h3 className="font-medium text-green-800 mb-2">No Results Found</h3>
              <p className="text-green-700 mb-4">
                We couldn't find any FAQs matching your search. Please try a different query or browse by category.
              </p>
              <Button
                variant="outline"
                className="border-green-700 text-green-700 hover:bg-green-50"
                onClick={() => {
                  setSearchQuery("")
                  setActiveTab("all")
                }}
              >
                Clear Search
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-pink-50 rounded-lg p-8 text-center"
        >
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-4">Still Have Questions?</h2>
          <p className="text-green-700 max-w-2xl mx-auto mb-6">
            If you couldn't find the answer you were looking for, our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
              <Link href="/shipping">View Shipping & Returns</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

