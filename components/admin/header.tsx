"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Search, Settings, User, LogOut } from "lucide-react"
import { handleLogout } from "@/app/actions/user.actions"
import { useToast } from "@/components/ui/use-toast"

export default function AdminHeader({ onMobileMenuClick }: { onMobileMenuClick: () => void }) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(3)
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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-white border-b border-gray-200 px-4 shadow-sm">
      <div className="flex items-center lg:hidden mr-2">
        <Button variant="ghost" size="icon" onClick={onMobileMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            placeholder="Search..."
            className="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {notifications}
              </span>
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

