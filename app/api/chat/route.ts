import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const RECOBOT_URL = process.env.RECOBOT_URL || process.env.NEXT_PUBLIC_RECOBOT_URL || 'http://localhost:8000'

// Service role client — bypasses RLS for server-side writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: Request) {
  const body = await request.json()
  const { message, brand_id, conversation_history, image_base64, conversation_id, anon_id } = body

  // ── 1. Get current user (if logged in) ──────────────────
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ── 2. Forward to Railway RecoBot ───────────────────────
  const recoRes = await fetch(`${RECOBOT_URL}/api/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, brand_id, conversation_history, image_base64 }),
  })

  if (!recoRes.ok) {
    return NextResponse.json({ error: 'RecoBot error' }, { status: recoRes.status })
  }

  const data = await recoRes.json()

  // ── 3. Save conversation (anon OR logged-in) ─────────────
  try {
    let convId = conversation_id

    if (!convId) {
      // Create new conversation
      const insertData = user
        ? { user_id: user.id, anon_id: null, brand_id: brand_id || 'bellapond' }
        : { user_id: null, anon_id: anon_id || null, brand_id: brand_id || 'bellapond' }

      const { data: conv } = await supabaseAdmin
        .from('conversations')
        .insert(insertData)
        .select('id')
        .single()
      convId = conv?.id
    }

    if (convId) {
      // Save user message
      await supabaseAdmin.from('messages').insert({
        conversation_id: convId,
        role: 'user',
        content: message,
        products_recommended: null,
        skin_analysis: null,
      })

      // Save assistant message
      await supabaseAdmin.from('messages').insert({
        conversation_id: convId,
        role: 'assistant',
        content: data.response,
        products_recommended: data.retrieved_products ?? null,
        skin_analysis: data.skin_analysis ?? null,
      })

      await supabaseAdmin
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', convId)

      data.conversation_id = convId
    }
  } catch (err) {
    console.error('[Supabase] Failed to save conversation:', err)
  }

  // ── 4. If user just logged in, merge anon conversations ──
  if (user && anon_id) {
    try {
      await supabaseAdmin
        .from('conversations')
        .update({ user_id: user.id, anon_id: null })
        .eq('anon_id', anon_id)
    } catch (err) {
      console.error('[Supabase] Failed to merge anon conversations:', err)
    }
  }

  return NextResponse.json(data)
}
