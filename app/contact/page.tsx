"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      subject: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send the form data to your backend here
    console.log("Form submitted:", formData)

    // Show success message
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-green-800 mb-4">Contact Us</h1>
          <p className="text-green-700 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our products, need help with an order, or want
            to collaborate, we're here to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-md p-6 md:p-8"
          >
            <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">Send Us a Message</h2>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 rounded-lg p-6 text-center"
              >
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-medium text-green-800 text-lg mb-2">Message Sent!</h3>
                <p className="text-green-700">Thank you for reaching out. We'll get back to you as soon as possible.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={handleSelectChange} required>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-inquiry">Product Inquiry</SelectItem>
                      <SelectItem value="order-status">Order Status</SelectItem>
                      <SelectItem value="return-refund">Return/Refund</SelectItem>
                      <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="How can we help you?"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-playfair text-2xl font-bold text-green-800 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">Email</h3>
                    <p className="text-green-700">info@baytorganic.com</p>
                    <p className="text-green-700">support@baytorganic.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">Phone</h3>
                    <p className="text-green-700">+92 300 1234567</p>
                    <p className="text-green-700">+92 21 12345678</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">Address</h3>
                    <p className="text-green-700">
                      123 Green Street, Clifton
                      <br />
                      Karachi, 75600
                      <br />
                      Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Clock className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">Business Hours</h3>
                    <p className="text-green-700">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden h-64 relative">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Map"
                alt="Map location"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button className="bg-green-700 hover:bg-green-800 text-white">View on Google Maps</Button>
              </div>
            </div>

            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="font-playfair text-xl font-bold text-green-800 mb-3">Visit Our Store</h3>
              <p className="text-green-700 mb-4">
                We'd love to meet you in person! Visit our store to experience our products firsthand and get
                personalized recommendations from our team.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=200&width=200&text=Store+${i}`}
                      alt={`Store image ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-2">Frequently Asked Questions</h2>
          <p className="text-green-700 mb-8">Find quick answers to common questions</p>
          <Button asChild className="bg-green-700 hover:bg-green-800 text-white">
            <a href="/faq">View All FAQs</a>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

