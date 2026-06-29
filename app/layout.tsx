import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Oswald } from 'next/font/google'
import { CartProvider } from '@/components/cart/cart-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], preload: false })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], preload: false })
const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  preload: false,
})

export const metadata: Metadata = {
  title: 'Drive Frame — Premium Automotive Posters',
  description:
    'Upgrade your walls with premium quality framed posters featuring luxury cars, sports cars, and automotive culture. Delivered across Tunisia.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}