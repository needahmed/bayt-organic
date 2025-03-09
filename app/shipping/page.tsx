"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { Truck, Package, RefreshCw, ShieldCheck } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-green-800 mb-4">Shipping & Returns</h1>
          <p className="text-green-700 max-w-2xl mx-auto">
            Everything you need to know about our shipping policies, delivery times, and return process
          </p>
        </motion.div>

        {/* Shipping Info Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Truck className="h-8 w-8 text-green-600" />,
              title: "Free Shipping",
              description: "On all orders over Rs. 2000",
            },
            {
              icon: <Package className="h-8 w-8 text-green-600" />,
              title: "Careful Packaging",
              description: "Eco-friendly and secure",
            },
            {
              icon: <RefreshCw className="h-8 w-8 text-green-600" />,
              title: "Easy Returns",
              description: "Within 14 days of delivery",
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
              title: "Secure Shipping",
              description: "Tracked delivery options",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="font-playfair text-xl font-bold text-green-800 mb-2">{item.title}</h3>
              <p className="text-green-700">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Shipping Information */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">Shipping Information</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-green-800 font-medium">
                  Shipping Methods & Timeframes
                </AccordionTrigger>
                <AccordionContent className="text-green-700">
                  <p className="mb-2">We offer the following shipping methods:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Standard Shipping (3-5 business days)</li>
                    <li>Express Shipping (1-2 business days)</li>
                  </ul>
                  <p>
                    Please note that these timeframes are estimates and may vary depending on your location and other
                    factors.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-green-800 font-medium">Shipping Costs</AccordionTrigger>
                <AccordionContent className="text-green-700">
                  <p className="mb-2">Our shipping costs are as follows:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Standard Shipping: Rs. 150</li>
                    <li>Express Shipping: Rs. 300</li>
                  </ul>
                  <p className="font-medium">Free standard shipping on all orders over Rs. 2000!</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-green-800 font-medium">Order Processing</AccordionTrigger>
                <AccordionContent className="text-green-700">
                  <p>
                    All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be
                    processed on the next business day. Once your order has been processed, you will receive a shipping
                    confirmation email with tracking information.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-green-800 font-medium">International Shipping</AccordionTrigger>
                <AccordionContent className="text-green-700">
                  <p>
                    We currently ship to select countries in the Middle East and South Asia. International shipping
                    costs and delivery times vary by location. Please contact our customer service team for more
                    information about shipping to your country.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">Returns & Refunds</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-green-800 font-medium">Return Policy</AccordionTrigger>
                <AccordionContent className="text-green-700">
                  <p>
                    We accept returns within 14 days of delivery. To be eligible for a return, your item must be unused
                    and in the same condition that you received it. It must also be in the original packaging. Some
                    items, such as personal care products that have been opened, cannot be returned for hygiene reasons.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-green-800 font-medium">How to Initiate a Return</AccordionTrigger>
                <AccordionContent className="text-green-700">
                  <p className="mb-2">To start a return, please follow these steps:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Contact our customer service team at support@baytorganic.com</li>
                    <li>Include your order number and the reason for your return</li>
                    <li>Wait for confirmation and return instructions</li>
                    <li>Ship the items back to us using the provided return label</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-green-800 font-medium">Refund Process</AccordionTrigger>
                <AccordionContent className="text-green-700">
                  <p>
                    Once we receive and inspect your return, we will send you an email to notify you that we have
                    received your returned item. We will also notify you of the approval or rejection of your refund. If
                    approved, your refund will be processed, and a credit will automatically be applied to your original
                    method of payment within 7-10 business days.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-green-800 font-medium">Damaged or Defective Items</AccordionTrigger>
                <AccordionContent className="text-green-700">
                  <p>
                    If you receive a damaged or defective item, please contact us immediately at support@baytorganic.com
                    with photos of the damaged product. We will work with you to resolve the issue promptly, either by
                    sending a replacement or issuing a refund.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>

        {/* Packaging Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-green-50 rounded-lg p-8 mb-16"
        >
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-4 text-center">
            Our Eco-Friendly Packaging
          </h2>
          <p className="text-green-700 text-center max-w-3xl mx-auto mb-8">
            At Bayt Organic, we're committed to reducing our environmental impact. That's why we use sustainable,
            eco-friendly packaging for all our products.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Recyclable Materials",
                description:
                  "All our packaging is made from recyclable or biodegradable materials, including recycled paper, cardboard, and plant-based plastics.",
              },
              {
                title: "Minimal Packaging",
                description:
                  "We use the minimum amount of packaging necessary to ensure your products arrive safely, reducing waste without compromising protection.",
              },
              {
                title: "Reusable Elements",
                description:
                  "Many of our packaging elements can be repurposed or reused, such as our glass containers and cotton bags.",
              },
            ].map((item, index) => (
              <div key={item.title} className="bg-white rounded-lg p-6">
                <h3 className="font-playfair text-lg font-bold text-green-800 mb-2">{item.title}</h3>
                <p className="text-green-700">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full mb-8">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-green-800 font-medium">How can I track my order?</AccordionTrigger>
              <AccordionContent className="text-green-700">
                <p>
                  Once your order has been shipped, you will receive a shipping confirmation email with a tracking
                  number. You can use this tracking number on our website or the courier's website to track your
                  package.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-green-800 font-medium">
                What if I'm not home when my package arrives?
              </AccordionTrigger>
              <AccordionContent className="text-green-700">
                <p>
                  If you're not home when your package arrives, the courier will typically leave a delivery notice with
                  instructions on how to collect your package or schedule a redelivery.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-green-800 font-medium">
                Can I change my shipping address after placing an order?
              </AccordionTrigger>
              <AccordionContent className="text-green-700">
                <p>
                  If you need to change your shipping address after placing an order, please contact our customer
                  service team as soon as possible. We'll do our best to update your address if the order hasn't been
                  processed yet. Once an order has been shipped, we cannot change the delivery address.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-green-800 font-medium">Do you offer gift wrapping?</AccordionTrigger>
              <AccordionContent className="text-green-700">
                <p>
                  Yes, we offer eco-friendly gift wrapping for an additional fee of Rs. 100. You can select this option
                  during checkout. We use recycled paper and natural twine for a beautiful, sustainable presentation.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-center">
            <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
              <Link href="/faq">View All FAQs</Link>
            </Button>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-pink-50 rounded-lg p-8 text-center"
        >
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-4">Need More Help?</h2>
          <p className="text-green-700 max-w-2xl mx-auto mb-6">
            If you have any questions about shipping, returns, or your order, our customer service team is here to help.
          </p>
          <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

