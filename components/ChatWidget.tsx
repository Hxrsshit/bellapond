'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/LoginModal'

const BRAND_ID    = 'bellapond'
const FREE_LIMIT  = 3   // messages before login gate

interface Message {
  role: 'user' | 'assistant'
  content: string
  displayContent?: string   // for typewriter effect
  products?: RecommendedProduct[]
  imagePreview?: string
  skinAnalysis?: string
  isTyping?: boolean
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

// Parse [Product Name] tokens in assistant text → inline image chips
function renderMessageContent(text: string, isTyping: boolean) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]$/)
        if (match) {
          const name = match[1]
          const meta = lookupProduct(name)
          if (meta) {
            return (
              <Link
                key={i}
                href={`/products/${meta.id}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  verticalAlign: 'middle', margin: '0 3px',
                  padding: '3px 8px 3px 3px',
                  borderRadius: '20px',
                  background: 'rgba(212,175,55,0.12)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(212,175,55,0.22)'
                  el.style.borderColor = 'rgba(212,175,55,0.55)'
                  el.style.boxShadow = '0 0 12px rgba(212,175,55,0.2)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(212,175,55,0.12)'
                  el.style.borderColor = 'rgba(212,175,55,0.3)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', overflow: 'hidden',
                  flexShrink: 0, background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(212,175,55,0.2)', position: 'relative',
                }}>
                  <Image src={meta.image} alt={name} fill className="object-cover" sizes="22px" />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffd700', whiteSpace: 'nowrap' }}>
                  {name}
                </span>
              </Link>
            )
          }
          // product not in meta map — render as plain bold text
          return <strong key={i} style={{ color: '#ffd700' }}>{name}</strong>
        }
        return <span key={i}>{part}</span>
      })}
      {isTyping && (
        <span style={{
          display: 'inline-block', width: '2px', height: '13px',
          background: 'rgba(212,175,55,0.8)', marginLeft: '2px',
          verticalAlign: 'middle', borderRadius: '1px',
          animation: 'bellaCursor 0.8s step-end infinite',
        }} />
      )}
    </>
  )
}

export default function ChatWidget() {
  const { user, signOut }                 = useAuth()
  const [isOpen, setIsOpen]               = useState(false)
  const [showLogin, setShowLogin]         = useState(false)
  const [userMsgCount, setUserMsgCount]   = useState(0)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages]           = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Bella, your personal skincare advisor. Tell me about your skin type or concern and I'll find the perfect products for you. ✨",
      displayContent: "Hi! I'm Bella, your personal skincare advisor. Tell me about your skin type or concern and I'll find the perfect products for you. ✨",
    },
  ])
  const [input, setInput]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [imageFile, setImageFile]         = useState<File | null>(null)
  const [imagePreview, setImagePreview]   = useState<string | null>(null)
  const [isHovered, setIsHovered]         = useState(false)
  const bottomRef                         = useRef<HTMLDivElement>(null)
  const inputRef                          = useRef<HTMLInputElement>(null)
  const fileInputRef                      = useRef<HTMLInputElement>(null)

  // Auto-open after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400)
  }, [isOpen])

  // Typewriter effect
  const typeMessage = (fullText: string, msgIndex: number) => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setMessages(prev => prev.map((m, idx) =>
        idx === msgIndex
          ? { ...m, displayContent: fullText.slice(0, i), isTyping: i < fullText.length }
          : m
      ))
      if (i >= fullText.length) clearInterval(interval)
    }, 18)
  }

  const buildHistory = () =>
    messages.map((m) => ({ role: m.role, content: m.content }))

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new window.Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        const MAX = 800
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
          else { width = Math.round((width * MAX) / height); height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas not supported')); return }
        ctx.drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(objectUrl)
        resolve(canvas.toDataURL('image/jpeg', 0.75).split(',')[1])
      }
      img.onerror = reject
      img.src = objectUrl
    })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    const hasImage = !!imageFile
    if ((!trimmed && !hasImage) || loading) return

    // Gate: show login modal after FREE_LIMIT messages for non-logged-in users
    if (!user && userMsgCount >= FREE_LIMIT) {
      setShowLogin(true)
      return
    }

    const currentFile    = imageFile
    const currentPreview = imagePreview

    setError(null)
    setInput('')
    clearImage()

    setMessages(prev => [...prev, {
      role: 'user',
      content: trimmed || '(skin photo)',
      displayContent: trimmed || '(skin photo)',
      imagePreview: currentPreview ?? undefined,
    }])
    setUserMsgCount(prev => prev + 1)
    setLoading(true)

    try {
      const image_base64 = currentFile ? await compressImage(currentFile) : undefined
      // Route through Next.js API (handles auth + Supabase saving)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed || 'Analyze my skin from this photo and recommend the best products.',
          brand_id: BRAND_ID,
          conversation_history: buildHistory(),
          conversation_id: conversationId,
          ...(image_base64 ? { image_base64 } : {}),
        }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      // Persist conversation_id for subsequent messages
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id)
      }

      const newMsgIndex = messages.length + 1
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        displayContent: '',
        products: data.retrieved_products?.slice(0, 3) ?? [],
        skinAnalysis: data.skin_analysis ?? undefined,
        isTyping: true,
      }])

      setTimeout(() => typeMessage(data.response, newMsgIndex), 100)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg.includes('Server error:')
        ? `Server error — check Railway logs.`
        : 'Could not reach Bella. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <style>{`
        @keyframes bellaFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bellaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5), 0 8px 32px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(212,175,55,0), 0 8px 32px rgba(0,0,0,0.5); }
        }
        @keyframes bellaGradientBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bellaStars {
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
          100% { opacity: 0.2; transform: scale(1); }
        }
        @keyframes bellaAurora {
          0%, 100% { opacity: 0.4; transform: translate(0,0) scale(1); }
          33% { opacity: 0.7; transform: translate(15px,-10px) scale(1.1); }
          66% { opacity: 0.3; transform: translate(-10px,8px) scale(0.95); }
        }
        @keyframes bellaShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bellaDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes bellaCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes bellaFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bellaOrb {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(10px,-10px) scale(1.05); }
          66% { transform: translate(-8px,6px) scale(0.95); }
        }
        .bella-widget-collapsed {
          animation: bellaFloat 4s ease-in-out infinite, bellaPulse 2.5s ease-in-out infinite;
        }
        .bella-widget-collapsed:hover {
          animation: none;
          box-shadow: 0 0 0 2px rgba(212,175,55,0.7), 0 0 32px rgba(212,175,55,0.35), 0 8px 32px rgba(0,0,0,0.5) !important;
          transform: scale(1.03);
        }
        .bella-gradient-border {
          background: linear-gradient(90deg, #b8860b, #ffd700, #f5deb3, #daa520, #fffacd, #b8860b);
          background-size: 300% 300%;
          animation: bellaGradientBorder 3s ease infinite;
        }
        /* bella-cursor is now rendered as an inline element in renderMessageContent */
        .bella-msg-in {
          animation: bellaFadeUp 0.3s ease forwards;
        }
        .bella-orb {
          animation: bellaOrb 8s ease-in-out infinite;
        }
        .bella-dot-1 { animation: bellaDot 1.4s ease-in-out 0s infinite; }
        .bella-dot-2 { animation: bellaDot 1.4s ease-in-out 0.2s infinite; }
        .bella-dot-3 { animation: bellaDot 1.4s ease-in-out 0.4s infinite; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.25); border-radius: 2px; }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>

        {/* ── EXPANDED PANEL ──────────────────────────────── */}
        <div style={{
          width: isOpen ? '380px' : '0px',
          maxWidth: 'calc(100vw - 48px)',
          height: isOpen ? '580px' : '0px',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(5, 4, 12, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(212,175,55,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(212,175,55,0.08), 0 0 60px rgba(212,175,55,0.04)',
        }}>

          {/* Gradient border top */}
          <div className="bella-gradient-border" style={{ height: '2px', flexShrink: 0 }} />

          {/* Header */}
          <div style={{
            position: 'relative',
            padding: '16px 18px 14px',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {/* Galaxy aurora orbs */}
            <div className="bella-orb" style={{
              position: 'absolute', top: '-20px', right: '-10px',
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(184,134,11,0.08) 50%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div className="bella-orb" style={{
              position: 'absolute', top: '-10px', left: '30%',
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
              animationDelay: '2s',
            }} />
            <div style={{
              position: 'absolute', bottom: '-20px', left: '10px',
              width: '90px', height: '90px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(218,165,32,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              {/* Avatar */}
              <div style={{
                width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
                background: 'linear-gradient(135deg, #b8860b, #daa520, #ffd700)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.15)',
              }}>
                <NeuralIcon />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '14px', fontWeight: 700, letterSpacing: '0.01em',
                    background: 'linear-gradient(90deg, #ffd700, #f5deb3, #daa520)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'bellaShimmer 3s linear infinite',
                  }}>
                    Bella AI
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px',
                    background: 'rgba(212,175,55,0.12)', color: '#daa520',
                    border: '1px solid rgba(212,175,55,0.3)', letterSpacing: '0.05em',
                  }}>SKINCARE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 6px #34d399',
                    display: 'inline-block',
                  }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}>
                    Online · Science-backed advisor
                  </span>
                </div>
              </div>
                      {/* User avatar or sign-in nudge */}
              {user ? (
                <button onClick={() => signOut()} title="Sign out" style={{
                  width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #92680a, #daa520)',
                  color: '#000', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(212,175,55,0.4)',
                }}>
                  {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                </button>
              ) : (
                <button onClick={() => setShowLogin(true)} style={{
                  fontSize: '10px', fontWeight: 600, padding: '4px 8px', borderRadius: '8px',
                  border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.08)',
                  color: '#daa520', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  Sign in
                </button>
              )}

              {/* Minimize */}
              <button onClick={() => setIsOpen(false)} style={{
                width: '28px', height: '28px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)' }}
              >
                <MinimizeIcon />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} className="bella-msg-in" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {/* Image preview */}
                {msg.role === 'user' && msg.imagePreview && (
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden',
                    marginBottom: '6px', border: '1px solid rgba(212,175,55,0.25)',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={msg.imagePreview} alt="Skin photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                {/* Bubble */}
                <div style={{
                  maxWidth: msg.role === 'user' ? '85%' : '100%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '13px', lineHeight: '1.7',
                  ...(msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #92680a, #b8860b, #daa520)',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(184,134,11,0.4)',
                    whiteSpace: 'pre-wrap',
                  } : {
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    width: '100%',
                  }),
                }}>
                  {msg.role === 'assistant'
                    ? renderMessageContent(msg.displayContent ?? msg.content, !!msg.isTyping)
                    : (msg.displayContent ?? msg.content)
                  }
                </div>

                {/* Skin analysis badge */}
                {msg.role === 'assistant' && msg.skinAnalysis && !msg.isTyping && (
                  <div style={{
                    marginTop: '8px', padding: '10px 12px', borderRadius: '12px', width: '100%',
                    background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                    fontSize: '11px', color: 'rgba(218,165,32,0.9)', lineHeight: '1.5',
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: '3px', letterSpacing: '0.05em', fontSize: '10px', color: '#daa520' }}>
                      SKIN ANALYSIS
                    </div>
                    {msg.skinAnalysis}
                  </div>
                )}

                {/* Product cards */}
                {msg.role === 'assistant' && msg.products && msg.products.length > 0 && !msg.isTyping && (
                  <div style={{ marginTop: '10px', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(218,165,32,0.7)', textTransform: 'uppercase' }}>
                      Recommended for you
                    </div>
                    {msg.products.map((product, pi) => {
                      const meta  = lookupProduct(product.name)
                      const href  = meta ? `/products/${meta.id}` : '/products'
                      const image = meta?.image ?? null
                      return (
                        <Link key={pi} href={href} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px', borderRadius: '14px', textDecoration: 'none',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.background = 'rgba(212,175,55,0.1)'
                          el.style.borderColor = 'rgba(212,175,55,0.3)'
                          el.style.boxShadow = '0 0 16px rgba(139,92,246,0.15)'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.background = 'rgba(255,255,255,0.04)'
                          el.style.borderColor = 'rgba(255,255,255,0.08)'
                          el.style.boxShadow = 'none'
                        }}>
                          <div style={{
                            width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden',
                            flexShrink: 0, background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.08)', position: 'relative',
                          }}>
                            {image ? (
                              <Image src={image} alt={product.name} fill className="object-cover" sizes="52px" />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                                <PlaceholderIcon />
                              </div>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#f5f3ff', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px', textTransform: 'capitalize' }}>
                              {product.category}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: '#daa520' }}>
                                ${Number(product.price).toFixed(2)}
                              </span>
                              <span style={{ fontSize: '10px', color: 'rgba(218,165,32,0.6)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                View →
                              </span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="bella-msg-in" style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0,1,2].map(i => (
                    <span key={i} className={`bella-dot-${i+1}`} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'rgba(212,175,55,0.75)', display: 'inline-block',
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 13px', borderRadius: '12px', fontSize: '12px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                color: 'rgba(252,165,165,0.9)', lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            {/* Soft gate nudge — shows at 2 messages, hard gate at 3 */}
            {!user && userMsgCount === FREE_LIMIT - 1 && (
              <div style={{
                padding: '10px 14px', borderRadius: '14px', fontSize: '12px',
                background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                color: 'rgba(218,165,32,0.9)', lineHeight: 1.5, textAlign: 'center',
              }}>
                1 free message left ✨{' '}
                <button onClick={() => setShowLogin(true)} style={{
                  background: 'none', border: 'none', color: '#ffd700',
                  fontWeight: 700, cursor: 'pointer', fontSize: '12px', padding: 0,
                }}>
                  Sign in for unlimited
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && !loading && (
            <div style={{
              padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px', flexShrink: 0,
            }}>
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  fontSize: '11px', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer',
                  background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                  color: 'rgba(218,165,32,0.9)', transition: 'all 0.2s', letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(212,175,55,0.2)'
                  el.style.borderColor = 'rgba(212,175,55,0.4)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(212,175,55,0.08)'
                  el.style.borderColor = 'rgba(212,175,55,0.2)'
                }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Image preview */}
          {imagePreview && (
            <div style={{
              margin: '0 16px 8px', padding: '8px 10px', borderRadius: '12px',
              background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)',
              display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: 'rgba(218,165,32,0.9)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {imageFile?.name}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
                  Photo ready to analyze
                </div>
              </div>
              <button onClick={clearImage} style={{
                width: '22px', height: '22px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: '14px', lineHeight: 1,
              }}>×</button>
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 16px 16px', flexShrink: 0,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Camera */}
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} style={{
                width: '38px', height: '38px', borderRadius: '11px', cursor: 'pointer', flexShrink: 0,
                background: imagePreview ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
                border: imagePreview ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: imagePreview ? '#daa520' : 'rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              } as React.CSSProperties}>
                <CameraIcon />
              </button>

              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                placeholder={imagePreview ? 'Describe your concern (optional)…' : 'Tell me what you\'re looking for…'}
                disabled={loading}
                style={{
                  flex: 1, height: '38px', borderRadius: '11px', outline: 'none',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#f5f3ff', fontSize: '13px', padding: '0 14px',
                  transition: 'all 0.2s',
                } as React.CSSProperties}
                onFocus={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'
                }}
                onBlur={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />

              {/* Send */}
              <button type="submit" disabled={(!input.trim() && !imagePreview) || loading} style={{
                width: '38px', height: '38px', borderRadius: '11px', border: 'none', cursor: 'pointer', flexShrink: 0,
                background: (!input.trim() && !imagePreview) || loading
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, #92680a, #b8860b, #daa520)',
                color: (!input.trim() && !imagePreview) || loading ? 'rgba(255,255,255,0.25)' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: (!input.trim() && !imagePreview) || loading ? 'none' : '0 4px 20px rgba(184,134,11,0.5)',
              }}>
                <SendIcon />
              </button>
            </form>
          </div>
        </div>

        {/* ── COLLAPSED TAB ───────────────────────────────── */}
        <button
          onClick={() => setIsOpen(v => !v)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={isOpen ? '' : 'bella-widget-collapsed'}
          aria-label="Open Bella AI"
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', borderRadius: '18px', cursor: 'pointer',
            background: 'rgba(5, 4, 12, 0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(212,175,55,0.25)',
            boxShadow: isOpen
              ? '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.06)'
              : '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.1)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            width: isOpen ? '100%' : 'auto',
            justifyContent: isOpen ? 'space-between' : 'flex-start',
          } as React.CSSProperties}
        >
          {/* Icon */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, #92680a, #b8860b, #daa520)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(212,175,55,0.55)',
          }}>
            <NeuralIcon />
          </div>

          {/* Text */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1,
              background: 'linear-gradient(90deg, #ffd700, #fffacd, #daa520)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'bellaShimmer 3s linear infinite',
            }}>
              Bella AI
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(218,165,32,0.7)', marginTop: '3px' }}>
              {isOpen ? 'Tap to minimise' : 'What are we feeling today?'}
            </div>
          </div>

          {/* Chevron */}
          <div style={{
            marginLeft: 'auto',
            color: 'rgba(218,165,32,0.6)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            display: 'flex',
          }}>
            <ChevronUpIcon />
          </div>
        </button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          messageCount={userMsgCount}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  )
}

/* ── Icons ──────────────────────────────────────────────── */

function NeuralIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="4" cy="6" r="2" />
      <circle cx="20" cy="6" r="2" />
      <circle cx="4" cy="18" r="2" />
      <circle cx="20" cy="18" r="2" />
      <line x1="6" y1="6" x2="10" y2="10" />
      <line x1="18" y1="6" x2="14" y2="10" />
      <line x1="6" y1="18" x2="10" y2="14" />
      <line x1="18" y1="18" x2="14" y2="14" />
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function PlaceholderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
