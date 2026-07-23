import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(req, { params }) {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('is_paid')
      .eq('id', params.id)
      .single()

    if (error) throw error
    return Response.json({ is_paid: data?.is_paid || false })
  } catch(e) {
    return Response.json({ is_paid: false })
  }
}