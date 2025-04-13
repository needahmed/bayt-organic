"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Footer() {
  const { toast } = useToast()

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
    const email = emailInput.value
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: data.message || "You've been subscribed to our newsletter.",
          variant: "default"
        })
        emailInput.value = ''
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to subscribe. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <footer className="bg-green-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image
              src="/placeholder-logo.png"
              alt="Bayt Organic"
              width={150}
              height={75}
              className="h-16 w-auto"
            />
            <p className="text-green-700 max-w-xs">
              Handmade natural products for your body and home. Made with love and care for you and the environment.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-green-700 hover:text-green-800 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-green-700 hover:text-green-800 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-green-700 hover:text-green-800 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-lg font-medium text-green-800 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/soaps" className="text-green-700 hover:text-green-800 transition-colors">
                  Soaps
                </Link>
              </li>
              <li>
                <Link href="/products/shampoos" className="text-green-700 hover:text-green-800 transition-colors">
                  Shampoos
                </Link>
              </li>
              <li>
                <Link href="/products/body-care" className="text-green-700 hover:text-green-800 transition-colors">
                  Body Care
                </Link>
              </li>
              <li>
                <Link href="/products/accessories" className="text-green-700 hover:text-green-800 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-lg font-medium text-green-800 mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-green-700 hover:text-green-800 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-700 hover:text-green-800 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-green-700 hover:text-green-800 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-green-700 hover:text-green-800 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-lg font-medium text-green-800 mb-4">Newsletter</h3>
            <p className="text-green-700 mb-4">
              Subscribe to our newsletter for updates on new products and special offers.
            </p>
            <form className="space-y-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-green-200 mt-12 pt-8 text-center text-green-700">
          <p>© {new Date().getFullYear()} Bayt Organic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

