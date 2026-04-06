'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { itemCount, toggleCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/96 backdrop-blur-md border-b border-ink-100/80 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 leading-none group">
              {/* Yellow accent dot */}
              <span className="w-2 h-2 rounded-full bg-cream-400 group-hover:bg-cream-500 transition-colors duration-200 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-serif text-[1.15rem] font-bold tracking-wide text-ink-900 group-hover:text-ink-700 transition-colors duration-200 leading-none">
                  Bellpond
                </span>
                <span className="text-[8px] tracking-[0.18em] uppercase text-ink-400 font-sans leading-none mt-0.5">
                  Sample Website
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Shop All' },
                { href: '/products?category=Serums', label: 'Serums' },
                { href: '/products?category=Moisturizers', label: 'Moisturizers' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm text-ink-600 hover:text-ink-900 font-medium transition-colors duration-200 py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-ink-900 after:transition-[width] after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-ink-700 hover:text-ink-900 hover:bg-cream-100 transition-all duration-200"
                aria-label="Open cart"
              >
                <CartIcon />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-ink-900 text-white text-[10px] font-bold rounded-full px-1 shadow-sm">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle mobile menu"
              >
                <span className={`block w-5 h-0.5 bg-ink-800 transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-ink-800 transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-ink-800 transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ink-100 bg-white">
            <nav className="flex flex-col px-4 py-4 gap-4">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Shop All' },
                { href: '/products?category=Serums', label: 'Serums' },
                { href: '/products?category=Moisturizers', label: 'Moisturizers' },
                { href: '/products?category=Exfoliants', label: 'Exfoliants' },
                { href: '/products?category=Cleansers', label: 'Cleansers' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-ink-800 hover:text-cream-500 py-1 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
