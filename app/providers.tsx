'use client'

import { CartProvider } from './context/CartContext'
import { ThemeProvider } from '@/components/theme-provider'
import { ClientProvider } from '@/components/providers/client-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <ClientProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ClientProvider>
    </ThemeProvider>
  )
} 