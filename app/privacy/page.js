'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Privacy() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;600&display=swap');
        body { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}</style>

      <Navbar/>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'60px 24px' }}>
        <div style={{ marginBottom:48 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'var(--color-primary)', textTransform:'uppercase', marginBottom:12 }}>Legal</p>
          <h1 style={{ fontSize:36, fontWeight:800, color:'var(--color-foreground)', marginBottom:8 }}>سياسة الخصوصية</h1>
          <p style={{ fontSize:13, color:'var(--color-foreground-muted)' }}>آخر تحديث: يوليو 2025</p>
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
            content:'لك الحق في الاطلاع على بياناتك وتعديلها وحذفها في أي وقت. يمكنك طلب ذلك عبر التواصل معنا على البريد الإلكتروني: info@nukhbahr.com وسنستجيب خلال 7 أيام عمل.'
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
            content:'لأي استفسارات تتعلق بهذه السياسة، تواصل معنا على: info@nukhbahr.com'
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom:36, paddingBottom:36, borderBottom:'1px solid var(--color-border)' }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'var(--color-primary)', marginBottom:14 }}>{s.title}</h2>
            <p style={{ fontSize:15, color:'var(--color-foreground)', lineHeight:1.9 }}>{s.content}</p>
          </div>
        ))}
      </div>

      <Footer/>
    </>
  )
}