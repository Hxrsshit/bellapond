'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import { getProductById, getRelatedProducts } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/ProductCard'

const skinTypeColors: Record<string, string> = {
  oily:        'bg-blue-50 text-blue-700 border-blue-200',
  dry:         'bg-amber-50 text-amber-700 border-amber-200',
  combination: 'bg-purple-50 text-purple-700 border-purple-200',
  acne:        'bg-red-50 text-red-700 border-red-200',
  aging:       'bg-green-50 text-green-700 border-green-200',
  sensitive:   'bg-pink-50 text-pink-700 border-pink-200',
  dull:        'bg-yellow-50 text-yellow-700 border-yellow-200',
  dehydrated:  'bg-sky-50 text-sky-700 border-sky-200',
  all:         'bg-gray-50 text-gray-600 border-gray-200',
  rosacea:     'bg-rose-50 text-rose-700 border-rose-200',
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)
  if (!product) notFound()

  const related = getRelatedProducts(product, 4)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'how-to-use'>('description')

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-cream-50 border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-ink-400">
            <Link href="/" className="hover:text-ink-700 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-ink-700 transition-colors">Products</Link>
            <span>›</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-ink-700 transition-colors">
              {product.category}
            </Link>
            <span>›</span>
            <span className="text-ink-600 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Category badge */}
              <span className="absolute top-5 left-5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-xs font-semibold tracking-widest uppercase text-ink-700 rounded-full shadow-sm">
                {product.category}
              </span>
            </div>
            {/* Thumbnails (placeholder) */}
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`relative w-20 h-20 rounded-xl overflow-hidden bg-cream-100 cursor-pointer border-2 transition-colors ${i === 1 ? 'border-ink-900' : 'border-transparent hover:border-ink-300'}`}>
                  <Image
                    src={product.image}
                    alt={`${product.name} view ${i}`}
                    fill
                    className="object-cover opacity-80"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="pb-6 border-b border-ink-100">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.skinTypes.map((type) => (
                  <span
                    key={type}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize border ${skinTypeColors[type] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  >
                    {type}
                  </span>
                ))}
              </div>

              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-ink-900 mb-3 leading-tight">
                {product.name}
              </h1>

              <p className="text-base text-ink-600 leading-relaxed mb-5">
                {product.shortDescription}
              </p>

              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-ink-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-ink-400">{product.volume}</span>
              </div>
            </div>

            {/* Star rating (decorative) */}
            <div className="py-4 border-b border-ink-100 flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((star) => (
                  <StarIcon key={star} filled={star <= 4} />
                ))}
              </div>
              <span className="text-sm text-ink-500">4.8 out of 5 (128 reviews)</span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="py-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ink-700">Quantity</span>
                <div className="flex items-center border border-ink-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-ink-600 hover:bg-ink-100 transition-colors font-medium"
                  >
                    −
                  </button>
                  <span className="px-5 py-2.5 text-sm font-semibold text-ink-900 min-w-[50px] text-center border-x border-ink-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2.5 text-ink-600 hover:bg-ink-100 transition-colors font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl text-base font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-ink-900 text-white hover:bg-ink-700 active:scale-[0.98]'
                }`}
              >
                {added ? (
                  <>
                    <CheckIcon /> Added to Cart!
                  </>
                ) : (
                  <>
                    <CartIcon /> Add to Cart — ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>

              <button className="w-full py-4 border-2 border-ink-200 text-ink-800 rounded-xl text-base font-semibold hover:border-ink-400 hover:bg-ink-50 transition-colors">
                Save to Wishlist ♡
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-ink-100">
              {[
                { icon: '🚚', label: 'Free shipping', sub: 'over $40' },
                { icon: '↩️', label: 'Easy returns', sub: '30-day policy' },
                { icon: '🧪', label: 'Dermatologist', sub: 'tested formula' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center p-3 bg-cream-50 rounded-xl">
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span className="text-xs font-semibold text-ink-800">{item.label}</span>
                  <span className="text-[10px] text-ink-400">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Ingredients / How to Use */}
        <div className="mt-16 lg:mt-20">
          <div className="flex gap-0 border-b border-ink-100">
            {(['description', 'ingredients', 'how-to-use'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-ink-900 text-ink-900'
                    : 'border-transparent text-ink-400 hover:text-ink-700'
                }`}
              >
                {tab === 'how-to-use' ? 'How to Use' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-3xl">
            {activeTab === 'description' && (
              <p className="text-base text-ink-600 leading-relaxed">{product.fullDescription}</p>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <p className="text-sm text-ink-500 mb-4 leading-relaxed">
                  Full ingredient list (INCI). Ingredients are listed in descending order of concentration.
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-cream-50 border border-cream-200 rounded-full text-sm text-ink-700"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'how-to-use' && (
              <div className="space-y-4">
                <p className="text-base text-ink-600 leading-relaxed">{product.howToUse}</p>
                <div className="mt-6 p-4 bg-cream-50 border border-cream-200 rounded-xl">
                  <p className="text-sm font-semibold text-ink-800 mb-1">⚠️ Important</p>
                  <p className="text-sm text-ink-600 leading-relaxed">
                    Always patch test new products before applying to your full face. If irritation occurs, discontinue use. Consult a dermatologist for persistent skin concerns.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 lg:mt-20 pt-10 border-t border-ink-100">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-ink-400 mb-2">You May Also Like</p>
                <h2 className="font-serif text-3xl font-bold text-ink-900">Complete Your Routine</h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-semibold text-ink-600 hover:text-ink-900 transition-colors hidden sm:block"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="text-cream-400">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
