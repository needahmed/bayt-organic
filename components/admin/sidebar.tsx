"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from "lucide-react"
import { handleLogout } from "@/app/actions/user.actions"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSidebar({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean
  onClose: () => void
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { toast } = useToast()

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

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/admin/dashboard",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      current: pathname === "/admin/products",
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
      current: pathname === "/admin/customers",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: pathname === "/admin/orders",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
    },
  ]

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/admin/dashboard" className="flex items-center">
          <span
            className={cn(
              "font-playfair text-xl font-bold text-green-800",
              collapsed ? "hidden" : "block"
            )}
          >
            Bayt Admin
          </span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                item.current
                  ? "bg-green-100 text-green-800"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  item.current ? "text-green-700" : "text-gray-500 group-hover:text-green-600"
                )}
                aria-hidden="true"
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-gray-200 p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-600 hover:bg-red-50 hover:text-red-700",
            collapsed ? "px-2" : "px-2"
          )}
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={true} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex h-full flex-col">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-gray-200 bg-white",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </div>
  )
}

