'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-smooth ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink-900">Your Cart</h2>
            <p className="text-xs text-ink-500 mt-0.5">
              {itemCount === 0 ? 'No items' : `${itemCount} item${itemCount > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-ink-100 text-ink-600 transition-colors"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center">
                <EmptyCartIcon />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-ink-800 mb-1">Your cart is empty</p>
                <p className="text-sm text-ink-500">Add some skincare essentials to get started.</p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 bg-ink-900 text-white text-sm font-semibold rounded-xl hover:bg-ink-700 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-4 border-b border-ink-100 last:border-0">
                  {/* Image */}
                  <Link
                    href={`/products/${product.id}`}
                    onClick={closeCart}
                    className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-cream-100"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.id}`}
                      onClick={closeCart}
                      className="font-serif text-sm font-semibold text-ink-900 hover:text-cream-500 transition-colors leading-snug block mb-0.5 pr-2"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-ink-400 mb-3">{product.volume}</p>

                    {/* Quantity + remove */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-ink-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-3 py-1.5 text-ink-600 hover:bg-ink-100 transition-colors text-sm font-medium"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold text-ink-900 min-w-[32px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-3 py-1.5 text-ink-600 hover:bg-ink-100 transition-colors text-sm font-medium"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-ink-900">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-ink-300 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-ink-100 px-6 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-600">Subtotal</span>
              <span className="font-serif text-lg font-bold text-ink-900">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-ink-400">Shipping and taxes calculated at checkout.</p>

            {/* Checkout */}
            <button
              className="w-full py-3.5 bg-ink-900 text-white font-semibold text-sm rounded-xl hover:bg-ink-700 active:scale-[0.99] transition-all duration-150"
              onClick={() => alert('Checkout coming soon! This is a sample website.')}
            >
              Proceed to Checkout
            </button>

            <button
              onClick={closeCart}
              className="w-full py-2.5 border border-ink-200 text-ink-700 font-medium text-sm rounded-xl hover:bg-ink-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function EmptyCartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-400">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
