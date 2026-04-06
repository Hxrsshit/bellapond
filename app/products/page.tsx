'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { products, categories, skinTypeOptions } from '@/lib/products'

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A–Z', value: 'name-asc' },
]

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-100 flex items-center justify-center"><p className="text-ink-400 text-sm">Loading products...</p></div>}>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Initialize from URL params
  useEffect(() => {
    const cat = searchParams.get('category')
    const skin = searchParams.get('skinType')
    if (cat) setSelectedCategory(cat)
    if (skin) setSelectedSkinTypes([skin])
  }, [searchParams])

  const toggleSkinType = (type: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const filtered = useMemo(() => {
    let list = [...products]

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory)
    }

    if (selectedSkinTypes.length > 0) {
      list = list.filter((p) =>
        selectedSkinTypes.some((t) => p.skinTypes.includes(t))
      )
    }

    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break
      default:           list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return list
  }, [selectedCategory, selectedSkinTypes, sortBy])

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedSkinTypes([])
    setSortBy('featured')
  }

  const hasActiveFilters = selectedCategory !== 'All' || selectedSkinTypes.length > 0

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-cream-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-ink-400 mb-3">
            {filtered.length} products
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink-900 mb-3">
            {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
          </h1>
          <p className="text-base text-ink-500 max-w-xl">
            Science-backed formulas for every skin concern. Transparent ingredients, effective results.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                selectedCategory === 'All'
                  ? 'bg-ink-900 text-white'
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                  selectedCategory === cat
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 border border-ink-200 rounded-full text-sm font-medium text-ink-700"
            >
              <FilterIcon />
              Filters {hasActiveFilters && <span className="w-2 h-2 bg-cream-400 rounded-full" />}
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-400 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-ink-200 rounded-lg px-3 py-2 text-ink-700 bg-white focus:outline-none focus:border-ink-400 transition-colors"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden sm:block w-52 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-ink-400 mb-4">Skin Type</h3>
                <div className="space-y-2">
                  {skinTypeOptions.filter(t => t !== 'all').map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleSkinType(type)}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                          selectedSkinTypes.includes(type)
                            ? 'bg-ink-900 border-ink-900'
                            : 'border-ink-300 group-hover:border-ink-600'
                        }`}
                      >
                        {selectedSkinTypes.includes(type) && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span
                        onClick={() => toggleSkinType(type)}
                        className={`text-sm capitalize transition-colors cursor-pointer ${
                          selectedSkinTypes.includes(type) ? 'text-ink-900 font-medium' : 'text-ink-600'
                        }`}
                      >
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-ink-500 hover:text-red-500 font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>✕</span> Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Mobile filter panel */}
          {filtersOpen && (
            <div className="sm:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setFiltersOpen(false)}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg font-bold text-ink-900">Filter by Skin Type</h3>
                  <button onClick={() => setFiltersOpen(false)} className="text-ink-500">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {skinTypeOptions.filter(t => t !== 'all').map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleSkinType(type)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors capitalize ${
                        selectedSkinTypes.includes(type)
                          ? 'bg-ink-900 text-white border-ink-900'
                          : 'border-ink-200 text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {hasActiveFilters && (
                  <button onClick={() => { clearFilters(); setFiltersOpen(false) }} className="mt-4 w-full py-2.5 text-sm text-red-500 font-medium border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                    Clear Filters
                  </button>
                )}
                <button onClick={() => setFiltersOpen(false)} className="mt-3 w-full py-3 bg-ink-900 text-white text-sm font-semibold rounded-xl">
                  Show {filtered.length} Results
                </button>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-serif text-2xl font-bold text-ink-800 mb-2">No products found</p>
                <p className="text-sm text-ink-500 mb-6">Try adjusting your filters to find what you&apos;re looking for.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-ink-900 text-white text-sm font-semibold rounded-xl hover:bg-ink-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
