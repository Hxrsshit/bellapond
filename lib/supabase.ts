import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  conversations: {
    id: string
    user_id: string
    brand_id: string
    created_at: string
    updated_at: string
  }
  messages: {
    id: string
    conversation_id: string
    role: 'user' | 'assistant'
    content: string
    products_recommended: object[] | null
    skin_analysis: string | null
    created_at: string
  }
}
