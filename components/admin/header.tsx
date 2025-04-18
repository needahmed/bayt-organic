"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { Menu, Search, Settings, User, LogOut } from "lucide-react"
import { handleLogout, getUserProfile } from "@/app/actions/user.actions"
import { useToast } from "@/components/ui/use-toast"
import NotificationsPopover from "./NotificationsPopover"

export default function AdminHeader({ onMobileMenuClick }: { onMobileMenuClick: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true)
        const result = await getUserProfile()
        
        if (result.success && result.data) {
          setUserData(result.data)
        } else {
          // Handle error
          console.error("Failed to load profile data:", result.error)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
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

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!userData || !userData.name) return "AD"
    return userData.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMobileMenuClick} className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <Link href="/admin/dashboard" className="font-bold text-xl">Bayt Organic Admin</Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-[140px] rounded-md border border-input pl-8 py-2 text-sm md:w-[200px] lg:w-[300px] bg-background"
          />
        </div>

        <NotificationsPopover />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.image || ""} alt={userData?.name || "Admin"} />
                <AvatarFallback>{isLoading ? "..." : getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData?.name || "Admin User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{userData?.email || "admin@example.com"}</p>
                {userData?.role && (
                  <p className="text-xs font-medium text-green-600 mt-1">{userData.role}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
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

