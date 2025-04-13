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
import { useCart } from "@/app/context/CartContext"
import { getCategories } from "@/app/actions/categories.action"

// Define category type for TypeScript
type NavCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  hasParent?: boolean;
  subcategoriesCount?: number;
  subcategories?: NavCategory[];
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount, openCart } = useCart()
  const [categories, setCategories] = useState<NavCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  // Enhanced console logging to debug categories fetching
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        
        // Detailed logging for troubleshooting
        console.log('🚀 Starting to fetch categories for navigation...');
        
        // Use a more reliable approach - fetch via API
        const response = await fetch('/api/test-categories-fetch');
        const result = await response.json();
        
        console.log('📊 Categories API response:', {
          success: result.success,
          count: result.categories?.length || 0
        });
        
        if (result.success && result.categories) {
          // Get all categories first
          const fetchedCategories = result.categories as NavCategory[];
          
          // Get parent categories
          const parentCategories = fetchedCategories.filter((cat: NavCategory) => 
            !cat.parentId || cat.parentId === ""
          );
          
          console.log(`🔍 Found ${parentCategories.length} parent categories`);
          
          // Add subcategories to each parent
          const categoriesWithSubs = parentCategories.map((parent: NavCategory) => {
            const subs = fetchedCategories.filter((cat: NavCategory) => 
              cat.parentId === parent.id
            );
            
            console.log(`📁 Category ${parent.name} has ${subs.length} subcategories`);
            
            return {
              ...parent,
              subcategories: subs
            };
          });
          
          // Set categories state
          setCategories(categoriesWithSubs);
          console.log('✅ Navigation menu categories set:', categoriesWithSubs.length);
        } else {
          console.error('❌ Failed to fetch categories:', result.error);
        }
      } catch (error) {
        console.error("❌ Error fetching navigation categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

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
              {isLoading ? (
                // Loading state
                <NavigationMenuItem>
                </NavigationMenuItem>
              ) : categories.length > 0 ? (
                // Display dynamically fetched categories
                categories.map((category) => (
                  <NavigationMenuItem key={category.id}>
                    {category.subcategories && category.subcategories.length > 0 ? (
                      <>
                        <NavigationMenuTrigger className="text-green-700 hover:text-green-800 font-medium">
                          {category.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-3 p-4">
                            {/* Link to the parent category itself */}
                            <li>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/products/${category.slug}`}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-50 hover:text-green-800 font-medium"
                                >
                                  <div className="text-sm">All {category.name}</div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                            
                            {/* Links to subcategories */}
                            {category.subcategories.map((subcat: any) => (
                              <li key={subcat.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/products/${subcat.slug}`}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-50 hover:text-green-800"
                                  >
                                    <div className="text-sm font-medium">{subcat.name}</div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={`/products/${category.slug}`} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(navigationMenuTriggerStyle(), "text-green-700 hover:text-green-800 font-medium")}
                        >
                          {category.name}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))
              ) : (
                // No categories found message
                <NavigationMenuItem>
                  <span className="px-4 py-2 text-sm text-red-500">Failed to load categories</span>
                </NavigationMenuItem>
              )}
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
          <Button variant="ghost" size="icon" className="text-green-700" onClick={openCart}>
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </div>
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
              {categories.length > 0 ? (
                // Display dynamic categories in mobile menu
                categories.map((category) => (
                  <div key={category.id}>
                    {category.subcategories && category.subcategories.length > 0 ? (
                      <div className="py-2">
                        <Link
                          href={`/products/${category.slug}`}
                          className="text-green-700 font-medium mb-2 block"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                        <div className="pl-4 flex flex-col space-y-2">
                          {category.subcategories.map((subcat: any) => (
                            <Link
                              key={subcat.id}
                              href={`/products/${subcat.slug}`}
                              className="py-1 text-green-600"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subcat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={`/products/${category.slug}`}
                        className="py-2 text-green-700 font-medium block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                // Fallback static menu
                <>
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
                </>
              )}
              
              <div className="flex items-center space-x-4 pt-2">
                <Button variant="ghost" size="icon" className="text-green-700">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-green-700" asChild>
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="text-green-700" onClick={openCart}>
                  <div className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

