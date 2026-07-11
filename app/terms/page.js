import Link from 'next/link'

export default function Terms() {
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
          <h1 style={{ fontSize:36, fontWeight:800, color:'#f8f5ef', marginBottom:8 }}>الشروط والأحكام</h1>
          <p style={{ fontSize:13, color:'#7a7690' }}>آخر تحديث: يوليو 2025</p>
        </div>

        {[
          {
            title:'١. القبول بالشروط',
            content:'باستخدامك لمنصة نخبة (nukhba-inky.vercel.app)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي منها، يرجى التوقف عن استخدام المنصة.'
          },
          {
            title:'٢. وصف الخدمة',
            content:'نخبة منصة توظيف ذكية تستخدم الذكاء الاصطناعي لإجراء مقابلات العمل وبناء ملفات المرشحين، وربطهم بالشركات المناسبة. تقدم المنصة خدماتها للباحثين عن عمل والشركات في المملكة العربية السعودية وخارجها.'
          },
          {
            title:'٣. إنشاء الحساب',
            content:'يجب أن تكون بالغاً (18 عاماً أو أكثر) لاستخدام المنصة. أنت مسؤول عن دقة المعلومات التي تقدمها وعن سرية كلمة مرورك. أي نشاط يتم من خلال حسابك هو مسؤوليتك.'
          },
          {
            title:'٤. استخدام مقبول',
            content:'توافق على عدم استخدام المنصة لأغراض غير مشروعة، وعدم تقديم معلومات كاذبة أو مضللة، وعدم محاولة اختراق أو إيذاء النظام، وعدم انتهاك خصوصية المستخدمين الآخرين.'
          },
          {
            title:'٥. الملكية الفكرية',
            content:'جميع محتويات المنصة من تصميم وكود وعلامات تجارية هي ملك لنخبة. يُمنح المستخدمون ترخيصاً محدوداً لاستخدام الخدمة لأغراضهم الشخصية أو المهنية فقط.'
          },
          {
            title:'٦. المحتوى الذي تقدمه',
            content:'أنت تحتفظ بحقوق ملكية المعلومات التي تقدمها. بتقديمها، تمنح نخبة ترخيصاً لاستخدامها لتقديم الخدمة. أنت مسؤول عن دقة ومشروعية ما تقدمه.'
          },
          {
            title:'٧. إخلاء المسؤولية',
            content:'نخبة وسيط بين الباحثين عن عمل والشركات ولا تضمن الحصول على وظيفة أو توظيف مرشح معين. قرارات التوظيف النهائية تعود كلياً للشركات والمرشحين.'
          },
          {
            title:'٨. تعليق الحساب',
            content:'نحتفظ بالحق في تعليق أو إنهاء أي حساب يخالف هذه الشروط أو يُستخدم بطريقة تضر بالمنصة أو المستخدمين الآخرين، دون الحاجة لإشعار مسبق في الحالات الجسيمة.'
          },
          {
            title:'٩. القانون المطبق',
            content:'تخضع هذه الشروط لقوانين المملكة العربية السعودية. أي نزاع يُحل وفق الأنظمة السعودية المعمول بها.'
          },
          {
            title:'١٠. التواصل',
            content:'لأي استفسارات تتعلق بهذه الشروط: soonh127@gmail.com'
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
          <Link href="/privacy" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>سياسة الخصوصية</Link>
          <Link href="/terms" style={{ fontSize:13, color:'#c8a04a', textDecoration:'none' }}>الشروط</Link>
          <Link href="/contact" style={{ fontSize:13, color:'#7a7690', textDecoration:'none' }}>تواصل معنا</Link>
        </div>
      </footer>
    </>
  )
}