import { Playfair_Display as PlayfairDisplay, Poppins } from 'next/font/google'
import AzureInitializer from './components/AzureInitializer'
import { Providers } from './providers'
import './globals.css'

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${playfair.variable} font-sans`}>
        {/* Azure Storage Initializer */}
        <AzureInitializer />
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}