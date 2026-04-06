'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/lib/products'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

const skinTypeColors: Record<string, string> = {
  oily: 'bg-blue-50 text-blue-700',
  dry: 'bg-amber-50 text-amber-700',
  combination: 'bg-purple-50 text-purple-700',
  acne: 'bg-red-50 text-red-700',
  aging: 'bg-green-50 text-green-700',
  sensitive: 'bg-pink-50 text-pink-700',
  dull: 'bg-yellow-50 text-yellow-700',
  dehydrated: 'bg-sky-50 text-sky-700',
  all: 'bg-gray-50 text-gray-600',
  rosacea: 'bg-rose-50 text-rose-700',
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      {/* Card lifts on hover; border subtly appears */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-transparent group-hover:border-cream-200/70 group-hover:shadow-card-hover group-hover:-translate-y-1 transition-all duration-300 ease-out">

        {/* Image */}
        <div className="relative aspect-square bg-cream-100 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-smooth"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Bottom gradient so text always reads */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[9px] font-semibold tracking-[0.12em] uppercase text-ink-600 rounded-full border border-white/60 shadow-sm">
            {product.category}
          </span>

          {/* Volume badge top-right */}
          <span className="absolute top-3 right-3 px-2 py-1 bg-cream-100/90 backdrop-blur-sm text-[9px] font-medium text-ink-500 rounded-full border border-cream-200/60">
            {product.volume}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 pt-4">
          {/* Name */}
          <h3 className="font-serif text-base font-bold text-ink-900 leading-snug group-hover:text-sand-300 transition-colors duration-200 mb-1">
            {product.name}
          </h3>

          {variant === 'default' && (
            <p className="text-[13px] text-ink-400 mb-3 leading-relaxed line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Skin type tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.skinTypes.slice(0, 3).map((type) => (
              <span
                key={type}
                className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize tracking-wide ${skinTypeColors[type] ?? 'bg-gray-50 text-gray-600'}`}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Price + Add to cart */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="font-serif text-xl font-bold text-ink-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Invert-on-hover button — warm cream → dark fill */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white border-transparent'
                : 'bg-cream-100 text-ink-900 border border-cream-300 hover:bg-ink-900 hover:text-white hover:border-ink-900 active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <CheckIcon />
                Added to Cart
              </>
            ) : (
              <>
                Add to Cart
                <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                  <ArrowIcon />
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
