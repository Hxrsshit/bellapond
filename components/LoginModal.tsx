'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface Props {
  onClose: () => void
  messageCount: number
}

export default function LoginModal({ onClose, messageCount }: Props) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode,     setMode]     = useState<'login' | 'signup'>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = mode === 'login'
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password, name)
    setLoading(false)
    if (err) setError(err)
    else onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', bottom: '110px', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10001, width: '360px', maxWidth: 'calc(100vw - 32px)',
        background: 'rgba(5, 4, 12, 0.96)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: '24px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.08)',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, sans-serif",
        animation: 'bellaFadeUp 0.3s ease forwards',
      }}>

        {/* Gold top strip */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, #b8860b, #ffd700, #f5deb3, #daa520, #b8860b)',
          backgroundSize: '300% 300%',
          animation: 'bellaGradientBorder 3s ease infinite',
        }} />

        <div style={{ padding: '28px 28px 24px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px', margin: '0 auto 14px',
              background: 'linear-gradient(135deg, #92680a, #b8860b, #daa520)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(212,175,55,0.4)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><circle cx="4" cy="6" r="2" /><circle cx="20" cy="6" r="2" />
                <circle cx="4" cy="18" r="2" /><circle cx="20" cy="18" r="2" />
                <line x1="6" y1="6" x2="10" y2="10" /><line x1="18" y1="6" x2="14" y2="10" />
                <line x1="6" y1="18" x2="10" y2="14" /><line x1="18" y1="18" x2="14" y2="14" />
              </svg>
            </div>
            <div style={{
              fontSize: '18px', fontWeight: 700, marginBottom: '6px',
              background: 'linear-gradient(90deg, #ffd700, #fffacd, #daa520)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'bellaShimmer 3s linear infinite',
            }}>
              You're on a roll! ✨
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>
              You've used {messageCount} free messages. Sign in to unlock unlimited chats + save your skin history.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={() => signInWithGoogle()}
            style={{
              width: '100%', padding: '11px', borderRadius: '12px', border: 'none',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.2s', marginBottom: '16px',
            } as React.CSSProperties}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)' }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mode === 'signup' && (
              <input
                type="text" placeholder="Your name" value={name}
                onChange={e => setName(e.target.value)} required
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)' }}
                onBlur={e =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            )}
            <input
              type="email" placeholder="Email address" value={email}
              onChange={e => setEmail(e.target.value)} required
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)' }}
              onBlur={e =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)' }}
              onBlur={e =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
            />

            {error && (
              <p style={{ fontSize: '12px', color: 'rgba(252,165,165,0.9)', margin: '0', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px', borderRadius: '12px', border: 'none',
                background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #92680a, #b8860b, #daa520)',
                color: '#000', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(184,134,11,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Just a sec…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle mode */}
          <p style={{ textAlign: 'center', marginTop: '16px', marginBottom: 0, fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
              style={{ background: 'none', border: 'none', color: '#daa520', cursor: 'pointer', fontSize: '12px', fontWeight: 600, padding: 0 }}
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f5f3ff', fontSize: '13px', outline: 'none',
  transition: 'all 0.2s', boxSizing: 'border-box',
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
