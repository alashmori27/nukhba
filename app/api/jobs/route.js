import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        company_id:   body.company_id,
        company_name: body.company_name,
        title:        body.title,
        description:  body.description,
        requirements: body.requirements,
        location:     body.location,
        salary_range: body.salary_range,
        questions:    body.questions,
        created_at:   new Date().toISOString()
      }])
      .select()
      .single()
    if (error) throw error
    return Response.json({ id: data.id })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return Response.json({ jobs: data })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}