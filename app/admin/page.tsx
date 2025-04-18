"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { seedNotifications } from "@/app/actions/seed-notifications.action"

export default function AdminHomePage() {
  // This is just a redirect page to the dashboard
  useEffect(() => {
    // Seed notifications for demo purposes (this would not be in a production app)
    async function seedDemoNotifications() {
      try {
        await seedNotifications()
      } catch (error) {
        console.error("Error seeding notifications:", error)
      }
    }
    
    seedDemoNotifications()
    redirect("/admin/dashboard")
  }, [])
  
  return null
}

