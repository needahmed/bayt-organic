"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ShoppingBag, Menu, X, Search, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const bodyProducts = [
    { title: "Body Deodorant", href: "/products/body-deodorant" },
    { title: "Anti-Aging Face Serum", href: "/products/anti-aging-face-serum" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="relative z-10">
          <Image
            src="/placeholder-logo.png"
            alt="Bayt Organic"
            width={600}
            height={300}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/products/soaps" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "text-green-700 hover:text-green-800 font-medium")}
                  >
                    Soaps
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/products/shampoos" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "text-green-700 hover:text-green-800 font-medium")}
                  >
                    Shampoos
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-green-700 hover:text-green-800 font-medium">
                  Body Care
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    {bodyProducts.map((product) => (
                      <li key={product.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={product.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-50 hover:text-green-800"
                          >
                            <div className="text-sm font-medium">{product.title}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/products/accessories" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "text-green-700 hover:text-green-800 font-medium")}
                  >
                    Accessories
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-green-700">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-green-700" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-green-700">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-0 right-0 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-green-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/products/soaps"
                className="py-2 text-green-700 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Soaps
              </Link>
              <Link
                href="/products/shampoos"
                className="py-2 text-green-700 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shampoos
              </Link>
              <div className="py-2">
                <div className="text-green-700 font-medium mb-2">Body Care</div>
                <div className="pl-4 flex flex-col space-y-2">
                  {bodyProducts.map((product) => (
                    <Link
                      key={product.title}
                      href={product.href}
                      className="py-1 text-green-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {product.title}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/products/accessories"
                className="py-2 text-green-700 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accessories
              </Link>
              <div className="flex items-center space-x-4 pt-2">
                <Button variant="ghost" size="icon" className="text-green-700">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-green-700" asChild>
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="text-green-700">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute top-0 right-0 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    0
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

