'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import './globals.css'
import { Playfair_Display as PlayfairDisplay, Poppins } from 'next/font/google'
import AzureInitializer from './components/AzureInitializer'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const playfair = PlayfairDisplay({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${playfair.variable} font-sans ${isAdminPage ? 'admin-mode' : ''}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Azure Storage Initializer */}
          <AzureInitializer />
          
          {isAdminPage ? (
            // Admin pages don't need Header and Footer
            <>{children}</>
          ) : (
            // Store pages need Header and Footer
            <div className="store-layout">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}