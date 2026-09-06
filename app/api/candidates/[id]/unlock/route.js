import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// أكواد الخصم يُتحقق منها بالسيرفر فقط — لا تُكشف قيمها للواجهة
const PROMO_CODES = {
  'HA2030': { discount: 100 },
  'HA2026': { discount: 50 },
}

// ⚠️ مؤقت لحين تفعيل Moyasar: يُفعّل is_paid مباشرة بدون تحقق دفع فعلي حقيقي.
// عند تفعيل Moyasar، استبدل هذا المسار بالكامل بـ webhook يستقبل تأكيد الدفع
// من Moyasar نفسه (server-to-server)، ويحذف هذا الملف أو يعطّله تمامًا.
export async function POST(req, { params }) {
  try {
    const session = getSession(req)
    if (!session || session.role !== 'candidate') {
      return Response.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { data: row, error: fetchErr } = await supabase
      .from('candidates').select('user_id').eq('id', params.id).single()
    if (fetchErr || !row) return Response.json({ error: 'غير موجود' }, { status: 404 })
    if (row.user_id !== session.id) return Response.json({ error: 'غير مصرح' }, { status: 403 })

    const { promoCode } = await req.json().catch(() => ({}))
    const promo = promoCode ? PROMO_CODES[promoCode.trim().toUpperCase()] : null

    // TODO: عند تفعيل Moyasar — تحقق فعلي من نجاح عملية الدفع هنا قبل السطر التالي
    const { error } = await supabase
      .from('candidates')
      .update({ is_paid: true, is_visible: true })
      .eq('id', params.id)
    if (error) throw error

    return Response.json({ success: true, appliedDiscount: promo?.discount || 0 })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}