import { NextResponse } from 'next/server'
import { createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const RECOBOT_URL = process.env.RECOBOT_URL || process.env.NEXT_PUBLIC_RECOBOT_URL || 'http://localhost:8000'

export async function POST(request: Request) {
  const body = await request.json()
  const { message, brand_id, conversation_history, image_base64, conversation_id } = body

  // ── 1. Get current user (if logged in) ──────────────────
  const cookieStore = await cookies()
  const supabase = createClient(
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

  // ── 3. Save to Supabase if user is logged in ─────────────
  if (user) {
    try {
      let convId = conversation_id

      // Create conversation if this is the first message
      if (!convId) {
        const { data: conv } = await supabase
          .from('conversations')
          .insert({ user_id: user.id, brand_id: brand_id || 'bellapond' })
          .select('id')
          .single()
        convId = conv?.id
      }

      if (convId) {
        // Save user message
        await supabase.from('messages').insert({
          conversation_id: convId,
          role: 'user',
          content: message,
          products_recommended: null,
          skin_analysis: null,
        })

        // Save assistant message
        await supabase.from('messages').insert({
          conversation_id: convId,
          role: 'assistant',
          content: data.response,
          products_recommended: data.retrieved_products ?? null,
          skin_analysis: data.skin_analysis ?? null,
        })

        // Update conversation timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', convId)

        data.conversation_id = convId
      }
    } catch (err) {
      console.error('[Supabase] Failed to save conversation:', err)
      // Don't fail the request — chat still works
    }
  }

  return NextResponse.json(data)
}
