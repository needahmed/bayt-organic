import type { Metadata } from 'next'
import { Playfair_Display as PlayfairDisplay, Poppins } from 'next/font/google'
import ClientLayout from './layout'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const playfair = PlayfairDisplay({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Bayt Organic | Natural Handmade Products',
  description: 'Handmade natural products for your body and home',
  metadataBase: new URL('https://bayt-organic.vercel.app'),
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  )
} 