import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import NewsletterForm from '@/components/NewsletterForm'
import { getFeaturedProducts } from '@/lib/products'

const categoryCards = [
  {
    name: 'Serums',
    tagline: 'Targeted treatments for every concern',
    href: '/products?category=Serums',
    image: 'https://placehold.co/600x750/FFF0C8/2C2C2C?text=Serums',
    bg: 'bg-[#FFF0C8]',
  },
  {
    name: 'Moisturizers',
    tagline: 'Restore, replenish, protect',
    href: '/products?category=Moisturizers',
    image: 'https://placehold.co/600x750/E8F5E8/2C2C2C?text=Moisturizers',
    bg: 'bg-[#E8F5E8]',
  },
  {
    name: 'Exfoliants',
    tagline: 'Resurface for radiant skin',
    href: '/products?category=Exfoliants',
    image: 'https://placehold.co/600x750/FFE8E8/2C2C2C?text=Exfoliants',
    bg: 'bg-[#FFE8E8]',
  },
  {
    name: 'Cleansers',
    tagline: 'A clean canvas for your routine',
    href: '/products?category=Cleansers',
    image: 'https://placehold.co/600x750/F0ECFF/2C2C2C?text=Cleansers',
    bg: 'bg-[#F0ECFF]',
  },
]

const concerns = [
  { label: 'Acne & Blemishes', value: 'acne', icon: '●' },
  { label: 'Dryness', value: 'dry', icon: '◆' },
  { label: 'Dullness', value: 'dull', icon: '▲' },
  { label: 'Aging & Lines', value: 'aging', icon: '◇' },
  { label: 'Oily Skin', value: 'oily', icon: '○' },
  { label: 'Sensitivity', value: 'sensitive', icon: '□' },
]

export default function HomePage() {
  const featured = getFeaturedProducts()

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream-100">
        {/* Background gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_#FFE8A3_0%,_transparent_70%)] opacity-50" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_#FFF0C8_0%,_transparent_70%)] opacity-40" />
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[88vh] items-center">
            {/* Text */}
            <div className="py-16 lg:py-20 lg:pr-16 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 mb-7">
                <span className="w-5 h-[1.5px] bg-cream-400" />
                <p className="eyebrow">Science-Backed Skincare</p>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.25rem] font-bold text-ink-900 leading-[1.04] mb-6 tracking-[-0.01em]">
                Honest<br />
                formulas.<br />
                <em className="not-italic text-gradient-warm">Real results.</em>
              </h1>

              <p className="text-base sm:text-[1.05rem] text-ink-500 max-w-md leading-[1.8] mb-10">
                Every ingredient serves a purpose. We believe skincare should be effective, affordable, and transparent — no fillers, no marketing fluff.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary">
                  Shop All Products
                  <ArrowRight size={15} />
                </Link>
                <Link href="/products?category=Serums" className="btn-outline">
                  Explore Serums
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3">
                {['Cruelty-Free', 'Vegan', 'No Parabens', 'Dermatologist Tested'].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-[11px] text-ink-400 font-medium tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-cream-300 flex-shrink-0" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:flex items-center justify-center h-full py-12 pl-6">
              <div className="relative w-full max-w-[320px]">
                {/* Decorative ring behind the image */}
                <div className="absolute inset-[-24px] rounded-[40px] border-[1.5px] border-cream-200/70 pointer-events-none" />
                <div className="absolute inset-[-52px] rounded-[56px] border border-cream-200/30 pointer-events-none" />

                {/* Main product image */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-float">
                  <Image
                    src="https://placehold.co/600x800/FFE8A3/2C2C2C?text=Bellpond"
                    alt="Bellpond featured product"
                    fill
                    className="object-cover"
                    sizes="400px"
                    priority
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cream-200/20 via-transparent to-transparent" />
                </div>

                {/* Floating card 1 — Best Seller */}
                <div className="absolute -left-14 top-[22%] bg-white rounded-2xl shadow-float px-4 py-3.5 max-w-[168px] animate-float border border-ink-100/60">
                  <p className="eyebrow mb-1.5">Best Seller</p>
                  <p className="text-sm font-serif font-bold text-ink-900 leading-snug">Niacinamide 10%</p>
                  <p className="text-xs text-ink-400 mt-1">From $7.50</p>
                </div>

                {/* Floating card 2 — Stat */}
                <div className="absolute -right-10 bottom-[22%] bg-gradient-to-br from-cream-200 to-cream-300 rounded-2xl shadow-float px-5 py-4 max-w-[148px] animate-float-slow border border-cream-300/60">
                  <p className="font-serif text-3xl font-bold text-ink-900 leading-none">98%</p>
                  <p className="text-[11px] text-ink-700 mt-1.5 leading-snug">saw visible results in 4 weeks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────── */}
      <div className="bg-ink-900 py-3 overflow-hidden">
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8">
              {['Free Shipping Over $40', 'Transparent Ingredients', 'Cruelty-Free Always', 'Science-Backed Formulas', 'No Hidden Fillers', 'Vegan Certified'].map((item) => (
                <span key={item} className="text-xs font-medium tracking-widest uppercase text-cream-200 mx-4">
                  {item} <span className="text-cream-400 mx-3">•</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-cream-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Collections</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-ink-900 mb-4 tracking-[-0.01em]">Shop by Category</h2>
            <p className="text-[15px] text-ink-400 max-w-md mx-auto leading-relaxed">
              Build a complete skincare routine with targeted formulas for every step.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {categoryCards.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group block">
                <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] ${cat.bg} shadow-card group-hover:shadow-card-hover group-hover:-translate-y-1 transition-all duration-300 ease-out`}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-smooth"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {/* Layered gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-serif text-xl font-bold text-white mb-1 leading-tight">{cat.name}</h3>
                    <p className="text-[11px] text-white/75 leading-snug hidden sm:block">{cat.tagline}</p>
                  </div>

                  {/* Hover: arrow pill appears */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-250">
                    <span className="text-white text-[10px] font-semibold">Shop</span>
                    <ArrowRight size={11} className="text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow mb-3">Bestsellers</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-ink-900 tracking-[-0.01em]">Most Loved</h2>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-ink-900 transition-colors link-underline"
            >
              View All Products
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY BANNER ────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-cream-100 via-[#FFFBEE] to-cream-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-[36px] border border-cream-200/60 pointer-events-none" />
              <div className="aspect-square rounded-3xl overflow-hidden bg-cream-200 shadow-warm-lg">
                <Image
                  src="https://placehold.co/700x700/FFE8A3/2C2C2C?text=Our+Philosophy"
                  alt="Our philosophy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Stat card */}
              <div className="absolute -bottom-5 -right-0 sm:-right-5 bg-white rounded-2xl shadow-float px-6 py-5 border border-ink-100/60">
                <p className="font-serif text-3xl font-bold text-ink-900 leading-none">50+</p>
                <p className="text-[11px] text-ink-500 mt-1.5 max-w-[110px] leading-snug">science-backed active ingredients</p>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">Our Philosophy</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-ink-900 leading-[1.1] mb-6 tracking-[-0.01em]">
                Skincare should<br />earn your trust.
              </h2>
              <div className="space-y-4 text-[15px] text-ink-500 leading-[1.8]">
                <p>
                  We believe the beauty industry has overcomplicated skincare. At Bellpond, we strip things back — every product contains only what your skin truly needs, with each ingredient listed openly and explained clearly.
                </p>
                <p>
                  Our formulations are developed by cosmetic scientists who prioritize clinical data over trends. What goes into your bottle is what we&apos;d put on our own skin.
                </p>
              </div>

              {/* Stats grid with left accent border */}
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { stat: '100%', label: 'Ingredient transparency' },
                  { stat: '0%',   label: 'Misleading claims' },
                  { stat: '12+',  label: 'Targeted formulas' },
                  { stat: '4.9★', label: 'Average rating' },
                ].map((item) => (
                  <div key={item.label} className="pl-4 border-l-2 border-cream-200">
                    <p className="font-serif text-2xl font-bold text-ink-900 leading-none">{item.stat}</p>
                    <p className="text-[11px] text-ink-400 mt-1.5 font-medium tracking-wide">{item.label}</p>
                  </div>
                ))}
              </div>

              <Link href="/products" className="btn-primary mt-10">
                Explore Our Range
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKIN CONCERNS ────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Personalised</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-ink-900 mb-4 tracking-[-0.01em]">Find Your Routine</h2>
            <p className="text-[15px] text-ink-400 max-w-md mx-auto leading-relaxed">
              Select your skin concern and discover products formulated to address it.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {concerns.map((concern) => (
              <Link
                key={concern.value}
                href={`/products?skinType=${concern.value}`}
                className="group flex flex-col items-center text-center p-5 rounded-2xl border border-ink-100/80 bg-white hover:border-cream-200 hover:bg-cream-50 hover:-translate-y-1 hover:shadow-card transition-all duration-250"
              >
                {/* Icon circle with warm gradient on hover */}
                <span className="w-10 h-10 rounded-full bg-cream-100 group-hover:bg-gradient-to-br group-hover:from-cream-200 group-hover:to-cream-300 flex items-center justify-center mb-3 text-sm text-ink-500 group-hover:text-ink-800 transition-all duration-300 group-hover:scale-110 group-hover:shadow-warm">
                  {concern.icon}
                </span>
                <span className="text-[13px] font-medium text-ink-600 group-hover:text-ink-900 leading-snug transition-colors duration-200">
                  {concern.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-900 py-16 lg:py-20">
        {/* Warm glow behind the text */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] rounded-full bg-[radial-gradient(ellipse,_rgba(255,200,60,0.07)_0%,_transparent_70%)]" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-4 h-[1px] bg-cream-400/60" />
            <p className="eyebrow text-cream-300/80">Stay In The Loop</p>
            <span className="w-4 h-[1px] bg-cream-400/60" />
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4 tracking-[-0.01em]">
            Skincare tips, new launches,<br className="hidden sm:block" /> and honest advice.
          </h2>
          <p className="text-[13px] text-ink-400 mb-8 leading-relaxed">
            Join 50,000+ subscribers. No spam, ever — just science-backed skincare content.
          </p>
          <NewsletterForm variant="dark" />
          <p className="text-[11px] text-ink-600 mt-4 tracking-wide">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}

function ArrowRight({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
