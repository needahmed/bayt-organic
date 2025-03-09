"use client"

import { useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import AdminSidebar from '@/components/admin/sidebar'
import AdminHeader from '@/components/admin/header'
import { Playfair_Display as PlayfairDisplay, Poppins } from 'next/font/google'
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const playfair = PlayfairDisplay({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar isMobile={false} onClose={() => {}} />
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <AdminSidebar isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onMobileMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

