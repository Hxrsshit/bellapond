import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-white">Bellpond</span>
              <span className="block text-[9px] tracking-widest uppercase text-ink-300 mt-0.5 font-sans">
                Sample Website
              </span>
            </Link>
            <p className="text-sm text-ink-300 leading-relaxed max-w-xs">
              Science-backed skincare formulated with integrity. Every ingredient serves a purpose. No fillers, no fluff.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-ink-300 mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products?category=Serums', label: 'Serums' },
                { href: '/products?category=Moisturizers', label: 'Moisturizers' },
                { href: '/products?category=Cleansers', label: 'Cleansers' },
                { href: '/products?category=Exfoliants', label: 'Exfoliants' },
                { href: '/products?category=Eye+Care', label: 'Eye Care' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink-300 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-ink-300 mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'Our Story' },
                { href: '#', label: 'Ingredients Index' },
                { href: '#', label: 'Sustainability' },
                { href: '#', label: 'Press' },
                { href: '#', label: 'Careers' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-ink-300 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-ink-300 mb-5">Support</h4>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'FAQ' },
                { href: '#', label: 'Shipping & Returns' },
                { href: '#', label: 'Track Your Order' },
                { href: '#', label: 'Contact Us' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-ink-300 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter mini */}
            <div className="mt-8">
              <p className="text-xs text-ink-300 mb-3">Get skincare tips in your inbox.</p>
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-500">
            &copy; {new Date().getFullYear()} Bellpond (Sample Website). All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
              <Link key={item} href="#" className="text-xs text-ink-500 hover:text-ink-300 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
