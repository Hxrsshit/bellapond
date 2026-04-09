'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const RECOBOT_URL = process.env.NEXT_PUBLIC_RECOBOT_URL || 'http://localhost:8000'
const BRAND_ID = 'bellapond'

interface Message {
  role: 'user' | 'assistant'
  content: string
  products?: RecommendedProduct[]
  imagePreview?: string   // data URL shown in the chat bubble
  skinAnalysis?: string   // returned by backend vision model
}

interface RecommendedProduct {
  name: string
  price: number
  category: string
  skin_type: string
  concerns: string
}

const SUGGESTED_QUESTIONS = [
  'I have oily, acne-prone skin',
  'My skin is very dry and flaky',
  'I want to reduce fine lines',
  'Help me with dark spots',
]

// Module-level constant — keys are lowercase for case-insensitive lookup
const PRODUCT_META: Record<string, { id: string; image: string }> = {
  'niacinamide 10% + zinc 1%':         { id: '1',  image: '/products/niacinamide-10-zinc-1.png' },
  'hyaluronic acid 2% + b5':           { id: '2',  image: '/products/hyaluronic-acid-2-b5.png' },
  'retinol 0.5% in squalane':          { id: '3',  image: '/products/retinol-0-5-squalane.png' },
  'vitamin c 15% + ferulic acid':      { id: '4',  image: '/products/vitamin-c-15-ferulic-acid.png' },
  'aha 30% + bha 2% peeling solution': { id: '5',  image: '/products/aha-30-bha-2-peeling-solution.png' },
  'natural moisturizing factors + ha': { id: '6',  image: '/products/natural-moisturizing-factors-ha.png' },
  'squalane facial cleanser':          { id: '7',  image: '/products/squalane-facial-cleanser.png' },
  'glycolic acid 7% toning solution':  { id: '8',  image: '/products/glycolic-acid-7-toning-solution.png' },
  'caffeine solution 5% + egcg':       { id: '9',  image: '/products/caffeine-solution-5-egcg.png' },
  'azelaic acid suspension 10%':       { id: '10', image: '/products/azelaic-acid-suspension-10.png' },
  'lactic acid 10% + ha':              { id: '11', image: '/products/lactic-acid-10-ha.png' },
  'argireline solution 10%':           { id: '12', image: '/products/argireline-solution-10.png' },
}

function lookupProduct(name: string) {
  return PRODUCT_META[name.trim().toLowerCase()] ?? null
}

export default function ChatWidget() {
  const [isOpen, setIsOpen]     = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Bella, your personal skincare advisor. Tell me about your skin type or concern and I'll find the perfect products for you. ✨",
    },
  ])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)
  const fileInputRef              = useRef<HTMLInputElement>(null)

  // Auto-open after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
      setHasOpened(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  const buildHistory = () =>
    messages.map((m) => ({ role: m.role, content: m.content }))

  // Resize to max 800px and compress to JPEG ~75% — keeps payload under ~150 KB
  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new window.Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        const MAX = 800
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height * MAX) / width)
            width = MAX
          } else {
            width = Math.round((width * MAX) / height)
            height = MAX
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas not supported')); return }
        ctx.drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(objectUrl)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
        resolve(dataUrl.split(',')[1]) // return raw base64 only
      }
      img.onerror = reject
      img.src = objectUrl
    })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
  }

  const sendMessage = async (text: string, file?: File | null, preview?: string | null) => {
    const trimmed = text.trim()
    const hasImage = !!(file ?? imageFile)
    if (!trimmed && !hasImage || loading) return

    const currentFile    = file    !== undefined ? file    : imageFile
    const currentPreview = preview !== undefined ? preview : imagePreview

    setError(null)
    setInput('')
    clearImage()

    const userMsg: Message = {
      role: 'user',
      content: trimmed || '(skin photo)',
      imagePreview: currentPreview ?? undefined,
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const image_base64 = currentFile ? await compressImage(currentFile) : undefined

      const res = await fetch(`${RECOBOT_URL}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed || 'Analyze my skin from this photo and recommend the best products.',
          brand_id: BRAND_ID,
          conversation_history: buildHistory(),
          ...(image_base64 ? { image_base64 } : {}),
        }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          products: data.retrieved_products?.slice(0, 3) ?? [],
          skinAnalysis: data.skin_analysis ?? undefined,
        },
      ])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('Server error: 5') || msg.includes('Server error: 4')) {
        setError(`Bella hit an error (${msg}). The server is running but something went wrong — check the server logs.`)
      } else {
        setError('Could not reach Bella. Make sure the RecoBot server is running: cd recobot-ai && uvicorn backend.app:app --reload')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const toggleOpen = () => {
    setIsOpen((v) => !v)
    if (!hasOpened) setHasOpened(true)
  }

  return (
    <div className="fixed bottom-0 right-6 z-50 flex flex-col items-stretch w-[370px] max-w-[calc(100vw-1.5rem)]">

      {/* ── CHAT PANEL ─────────────────────────────────── */}
      <div
        className={`flex flex-col bg-white border border-ink-100/60 border-b-0 overflow-hidden transition-all duration-500 ease-smooth rounded-t-2xl
          ${isOpen ? 'max-h-[540px] shadow-float opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="relative flex flex-col px-5 pt-5 pb-4 bg-ink-900 flex-shrink-0 overflow-hidden">
          {/* Warm glow blob */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full bg-cream-300/10 blur-2xl pointer-events-none" />

          {/* Top row: avatar + name + controls */}
          <div className="relative flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 to-cream-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <SparkleIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none tracking-wide">Bella AI</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-ink-400 tracking-wide">Online · Skincare Advisor</span>
              </div>
            </div>
            {/* Minimize button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chat"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-ink-800 hover:bg-ink-700 text-ink-400 hover:text-white transition-colors"
            >
              <MinimizeIcon />
            </button>
          </div>

          {/* Tagline */}
          <p className="relative font-serif text-xl font-bold text-cream-100 leading-snug tracking-tight">
            What are we<br />
            <span className="text-amber-200">feeling today?</span>
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 bg-white">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'w-full'}`}>
                {/* Uploaded image (user bubble only) */}
                {msg.role === 'user' && msg.imagePreview && (
                  <div className="mb-1.5 rounded-xl overflow-hidden border border-ink-700 w-36 h-36 relative ml-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.imagePreview}
                      alt="Uploaded skin photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'user'
                      ? 'bg-ink-900 text-white rounded-br-sm'
                      : 'bg-cream-50 text-ink-800 border border-cream-200/80 rounded-bl-sm'
                    }`}
                >
                  {msg.content}
                </div>

                {/* Skin analysis badge (assistant only, when triggered by photo) */}
                {msg.role === 'assistant' && msg.skinAnalysis && (
                  <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-relaxed">
                    <span className="font-semibold block mb-0.5">Skin Analysis</span>
                    {msg.skinAnalysis}
                  </div>
                )}

                {/* Recommended product cards */}
                {msg.role === 'assistant' && msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 space-y-2">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-ink-400 px-0.5">
                      Recommended for you
                    </p>
                    {msg.products.map((product, pi) => {
                      const meta  = lookupProduct(product.name)
                      const href  = meta ? `/products/${meta.id}` : '/products'
                      const image = meta?.image ?? null

                      return (
                        <Link
                          key={pi}
                          href={href}
                          className="flex items-center gap-3 p-2.5 bg-white border border-cream-200 rounded-xl hover:border-cream-400 hover:shadow-card transition-all duration-200 group"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-cream-100 border border-cream-200/60">
                            {image ? (
                              <Image
                                src={image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-ink-300">
                                <PlaceholderIcon />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-serif font-bold text-ink-900 leading-snug group-hover:text-sand-300 transition-colors line-clamp-2">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-ink-400 capitalize mt-0.5">{product.category}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-sm font-bold text-ink-900">
                                ${Number(product.price).toFixed(2)}
                              </span>
                              <span className="text-[10px] font-semibold text-cream-500 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                                View <ChevronIcon />
                              </span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 bg-cream-50 border border-cream-200/80 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 leading-relaxed">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested questions — only show at start */}
        {messages.length === 1 && !loading && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5 flex-shrink-0 bg-white">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-cream-300 bg-cream-50 text-ink-700 hover:bg-cream-200 hover:border-cream-400 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Image preview strip */}
        {imagePreview && (
          <div className="px-3 pt-2 pb-0 bg-white flex-shrink-0 flex items-center gap-2">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-cream-300 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-ink-600 font-medium truncate">{imageFile?.name}</p>
              <p className="text-[10px] text-ink-400">Photo ready to send</p>
            </div>
            <button
              type="button"
              onClick={clearImage}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-ink-100 hover:bg-red-100 text-ink-400 hover:text-red-500 transition-colors flex-shrink-0"
              aria-label="Remove image"
            >
              <RemoveIcon />
            </button>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-3 border-t border-ink-100 bg-white flex-shrink-0"
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Camera / upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            aria-label="Upload skin photo"
            className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all
              ${imagePreview
                ? 'border-amber-300 bg-amber-50 text-amber-600'
                : 'border-ink-150 bg-ink-50 text-ink-400 hover:bg-cream-100 hover:text-ink-700'
              } disabled:opacity-40`}
          >
            <CameraIcon />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={imagePreview ? 'Describe your concern (optional)…' : 'Ask about your skin concern…'}
            disabled={loading}
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-ink-150 bg-ink-50 text-ink-900 placeholder-ink-400 focus:outline-none focus:border-cream-300 focus:bg-white transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={(!input.trim() && !imagePreview) || loading}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-ink-900 text-white hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </form>
      </div>

      {/* ── TAB (always visible) ────────────────────────── */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? 'Minimize Bella AI' : 'Open Bella AI'}
        className={`flex items-center justify-between w-full px-4 py-3 bg-ink-900 hover:bg-ink-800 transition-all duration-300 group
          ${isOpen ? 'border-t border-ink-700' : 'rounded-t-2xl shadow-float'}`}
      >
        {/* Left: avatar + text */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-200 to-cream-300 flex items-center justify-center flex-shrink-0">
            <SparkleIcon small />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white leading-none tracking-wide">Bella AI</p>
            <p className="text-[10px] text-ink-400 mt-0.5 tracking-wide">
              {isOpen ? 'Tap to minimise' : 'What are we feeling today?'}
            </p>
          </div>
        </div>

        {/* Right: chevron */}
        <span className={`text-ink-400 group-hover:text-white transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <TabChevronIcon />
        </span>
      </button>
    </div>
  )
}

/* ── Icons ──────────────────────────────────────────────── */

function SparkleIcon({ small }: { small?: boolean }) {
  const size = small ? 13 : 16
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  )
}

function MinimizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function TabChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function PlaceholderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
