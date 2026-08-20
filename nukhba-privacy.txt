import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#080810;color:#ede8df;font-family:'Tajawal',sans-serif}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:60, background:'#0e0e1a', borderBottom:'1px solid #252538' }}>
        <Link href="/" style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textDecoration:'none' }}>نخبة</Link>
        <Link href="/" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>← الرئيسية</Link>
      </nav>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'60px 24px' }}>
        <div style={{ marginBottom:48 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'#c8a04a', textTransform:'uppercase', marginBottom:12 }}>Legal</p>
          <h1 style={{ fontSize:36, fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>سياسة الخصوصية</h1>
          <p style={{ fontSize:13, color:'#7a7690' }}>آخر تحديث: يوليو 2025</p>
        </div>

        {[
          {
            title:'١. مقدمة',
            content:'نخبة (Nukhba) منصة توظيف ذكية تعمل بتقنية الذكاء الاصطناعي. نحن نلتزم بحماية خصوصية مستخدمينا وبياناتهم الشخصية. تصف هذه السياسة كيفية جمعنا للمعلومات واستخدامها وحمايتها.'
          },
          {
            title:'٢. المعلومات التي نجمعها',
            content:'نجمع المعلومات التي تقدمها عند إنشاء حساب (الاسم والبريد الإلكتروني ورقم الجوال اختياري)، والمعلومات المهنية التي تشاركها خلال المقابلات الذكية، وبيانات الاستخدام الأساسية لتحسين تجربتك.'
          },
          {
            title:'٣. كيف نستخدم معلوماتك',
            content:'نستخدم معلوماتك لإنشاء ملفك المهني وعرضه للشركات المناسبة (بموافقتك)، وتشغيل خدمات المنصة وتحسينها، والتواصل معك بشأن حسابك وطلباتك. لا نبيع بياناتك لأي طرف ثالث.'
          },
          {
            title:'٤. مشاركة المعلومات',
            content:'لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية: عند موافقتك الصريحة على مشاركة ملفك مع شركات بعينها، أو عند الضرورة القانونية وفق ما تقتضيه الأنظمة والتشريعات السعودية.'
          },
          {
            title:'٥. أمان البيانات',
            content:'نستخدم تشفير SSL لحماية بياناتك أثناء النقل، ونحفظها في قواعد بيانات آمنة (Supabase) تلتزم بأعلى معايير الأمان. مع ذلك، لا يمكن ضمان الأمان المطلق عبر الإنترنت.'
          },
          {
            title:'٦. حقوقك',
            content:'لك الحق في الاطلاع على بياناتك وتعديلها وحذفها في أي وقت. يمكنك طلب ذلك عبر التواصل معنا على البريد الإلكتروني: soonh127@gmail.com وسنستجيب خلال 7 أيام عمل.'
          },
          {
            title:'٧. ملفات تعريف الارتباط (Cookies)',
            content:'نستخدم ملفات تعريف الارتباط الضرورية فقط لتشغيل الموقع وتحسين تجربتك. لا نستخدم ملفات تتبع للإعلانات.'
          },
          {
            title:'٨. التعديلات على السياسة',
            content:'قد نحدث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار في الموقع. استمرارك في استخدام المنصة يعني قبولك للسياسة المحدثة.'
          },
          {
            title:'٩. التواصل',
            content:'لأي استفسارات تتعلق بهذه السياسة، تواصل معنا على: soonh127@gmail.com'
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom:36, paddingBottom:36, borderBottom:'1px solid #252538' }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#c8a04a', marginBottom:14 }}>{s.title}</h2>
            <p style={{ fontSize:15, color:'#ede8df', lineHeight:1.9 }}>{s.content}</p>
          </div>
        ))}
      </div>

      <footer style={{ padding:'32px 40px', borderTop:'1px solid #252538', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ fontSize:16, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · Nukhba</div>
        <div style={{ display:'flex', gap:20 }}>
          <Link href="/privacy" style={{ fontSize:13, color:'#c8a04a', textDecoration:'none' }}>سياسة الخصوصية</Link>
          <Link href="/terms" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>الشروط</Link>
          <Link href="/contact" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>تواصل معنا</Link>
        </div>
      </footer>
    </>
  )
}