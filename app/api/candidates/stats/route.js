import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  try {
    const { count } = await supabase
      .from('candidates')
      .select('*', { count:'exact', head:true })
      .eq('is_visible', true)

    return Response.json({ total: count || 0 })
  } catch(e) {
    return Response.json({ total: 0 })
  }
}