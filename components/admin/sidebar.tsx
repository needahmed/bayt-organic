"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Tag,
  Percent,
  ShoppingCart,
  Settings,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  Star,
} from "lucide-react"
import { handleLogout } from "@/app/actions/user.actions"
import { useToast } from "@/components/ui/use-toast"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Collections",
    href: "/admin/collections",
    icon: <Tag className="h-5 w-5" />,
  },
  {
    title: "Featured",
    href: "/admin/featured",
    icon: <Star className="h-5 w-5" />,
  },
  {
    title: "Discounts",
    href: "/admin/discounts",
    icon: <Percent className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: <Users className="h-5 w-5" />,
  },
]

export default function AdminSidebar({ 
  isMobile = false, 
  onClose 
}: { 
  isMobile?: boolean; 
  onClose: () => void 
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const { toast } = useToast()

  // Check if we're on larger screens and set collapsed state accordingly
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const onLogout = async () => {
    try {
      await handleLogout()
      // The redirect is handled by the server action
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sidebarContent = (
    <>
      <div className="px-4 py-6">
        <Link href="/admin/dashboard" className="flex items-center" onClick={isMobile ? onClose : undefined}>
          <Image
            src="/placeholder-logo.png"
            alt="Bayt Organic"
            width={120}
            height={60}
            className={cn("transition-all duration-300", collapsed ? "w-8" : "w-32")}
          />
          {!collapsed && <span className="ml-2 font-semibold text-green-800">Admin</span>}
        </Link>
      </div>

      <div className="px-3 py-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-green-100 text-green-900"
                  : "text-green-700 hover:bg-green-50 hover:text-green-900",
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto px-3 py-4">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start border-green-200 text-green-700 hover:bg-green-50 hover:text-green-900",
            collapsed && "justify-center",
          )}
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </>
  )

  // Mobile sidebar (overlay)
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50">
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex h-full flex-col">
            <div className="absolute right-0 top-0 mr-2 mt-2">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {sidebarContent}
          </div>
        </div>
      </div>
    )
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "hidden lg:flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-0 translate-x-1/2 rounded-full border shadow-sm bg-white h-6 w-6"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </Button>
      {sidebarContent}
    </div>
  )
}

