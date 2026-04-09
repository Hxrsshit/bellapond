import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import ChatWidget from '@/components/ChatWidget'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bellpond — Science-Backed Skincare',
    template: '%s | Bellpond',
  },
  description:
    'Premium, science-backed skincare formulated with transparency. Clean ingredients, proven results. Shop serums, moisturizers, cleansers and more.',
  keywords: ['skincare', 'serum', 'moisturizer', 'clean beauty', 'science skincare'],
  openGraph: {
    title: 'Bellpond — Science-Backed Skincare',
    description: 'Premium, science-backed skincare formulated with transparency.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
