# نخبة (Nukhba) — ملف السياق للمحادثة الجديدة

## المشروع
- **الموقع:** nukhbahr.com
- **GitHub:** github.com/alashmori27/nukhba
- **Stack:** Next.js 14 + Supabase + Claude API + Vercel
- **المسار المحلي:** `C:/Users/Dell/Saved Games/نخبة/SSSSSSSSSSSSSSS/مجلد جديد/nukhba-next`
- **Git Bash للتشغيل**
- **Supabase Region:** Oceania (Sydney) — ⚠️ خارج السعودية، خطة نقل لـ Frankfurt مؤجلة لجلسة مخصصة (البيانات الحالية تجريبية بالكامل، لا تهم)
- **إيميلات رسمية:** info@nukhbahr.com (عام) و support@nukhbahr.com (دعم فني)

---

## ما أُنجز في الجلسة الأخيرة (تفصيلي)

### 1. حقل الجنسية — ميزة كاملة من طرف لطرف ✅
- `lib/constants.js`: إضافة الجنسية لأسئلة المقابلة (`STAGE_GUIDELINES.basics`) وبنية `PROFILE_SYSTEM` JSON
- `InterviewClient.js`: سؤال الجنسية كخطوة رابعة بمقابلات الوظائف المحددة
- `candidate/profile/page.js`: عرض الجنسية بالـ CV (ويب + Word، عربي وإنجليزي)
- `company/post-job/page.js`: قائمة منسدلة (غير محدد/سعودي/أخرى) — `nationality_preference`
- `api/jobs/route.js`: حفظ الحقل (`body.nationality_preference || 'all'`)
- `candidate/jobs/page.js`: شارة 🌍 تظهر قبل الدفع لو الوظيفة مقيّدة بجنسية
- Supabase: عمود `jobs.nationality_preference` (SQL: `ALTER TABLE jobs ADD COLUMN...`)

### 2. ميزة نسخة CV متوافقة مع ATS ✅
- دالة `downloadATSWord()` بملف `candidate/profile/page.js` — نسخة إنجليزية فقط، Heading Styles حقيقية، Bullet Lists حقيقية، بدون ألوان زخرفية
- زر "🎯 نسخة ATS" أضيف لشبكة أزرار التحميل (5 أزرار الآن بدل 4)
- قسم ترويجي مخصص أضيف بالصفحة الرئيسية (`app/page.js`) يبرز هذي الميزة (بطاقة خضراء `#4a9c6e` مميزة، بعد قسم "القيمة الكاملة")

### 3. إصلاحات نظام المقابلة ✅
- **مشكلة اللخبطة بين المراحل:** أعيد هيكلة `INTERVIEW_SYSTEM` بالكامل — بدل ما يُرسل كل وصف المراحل الستة مع بعض بكل رسالة، صار فيه دالة `buildInterviewSystem(stageId)` ديناميكية ترسل بس وصف المرحلة الحالية + قاعدة صارمة "STAY STRICTLY within the current stage"
- **مشكلة عدم انتهاء المقابلة:** أضيفت شبكة أمان بـ `InterviewClient.js` (دالة `send`) — لو آخر مرحلة والرد يحتوي عبارة وداع (regex `farewellPattern`) بدون `[STAGE_COMPLETE]`، يُعتبر انتهت المقابلة تلقائيًا
- **سؤال الإيميل:** أضيف بعد الجوال بمرحلة `basics`، وأضيف حقل `email` لبنية `PROFILE_SYSTEM`
- **مشكلة Hard Navigation:** رابط "ابدأ المقابلة" بلوحة تحكم المرشح (`candidate/dashboard/page.js`) تحوّل من `<Link>` إلى `<a>` عادي — يجبر تحميل كامل للصفحة، يمنع Next.js من الاحتفاظ بحالة `consented=true` من مقابلة سابقة بنفس الجلسة (كان يسبب تخطي شاشة موافقة PDPL)

### 4. إصلاح خلل حرج بـ InterviewClient.js ✅
- كان فيه `useEffect` متداخل داخل `useEffect` وداخل `onClick` (خطأ React قاتل) — تم استبداله بدالة `handleConsent()` عادية بدون hooks متداخلة

### 5. توحيد الهوية البصرية بالكامل ✅
تم إنشاء مكوّن `components/Footer.js` مشترك (روابط: للشركات، الخصوصية، الشروط، الأسئلة الشائعة، تواصل معنا)، واستُبدل الـ Navbar/Footer اليدوي القديم (خط Tajawal) بـ `<Navbar/>` و`<Footer/>` المشتركين (خط IBM Plex Sans Arabic + design tokens `var(--color-*)`) في:

**صفحات عامة:** الرئيسية، for-companies، contact، faq (صفحة جديدة مستقلة، منفصلة عن contact)، terms، privacy

**صفحات المرشح:** dashboard (كان محدث أصلاً)، profile، profiles، applications، jobs، account (+ إعادة تصميم كاملة: بطاقات أوضح، أيقونات للأقسام)

**صفحات الشركة:** dashboard (خط فقط، كان يستخدم `DashboardNav` مشترك أصلاً)، jobs، candidates، applicants

**⚠️ لم يُنجز بعد:** لا توجد صفحات متبقية معروفة من قائمة الجرد الأصلية — إذا ظهرت صفحة قديمة الطراز، طبّق نفس النمط (استبدال nav/footer اليدوي بـ`<Navbar/>`/`<Footer/>`، خط IBM Plex Sans Arabic)

### 6. إضافات تنقل بالـ Navbar ✅
روابط "كيف يعمل" و"المميزات" تظهر بالصفحة الرئيسية و`/for-companies` فقط (`pathname === '/' || pathname === '/for-companies'`)، تستخدم مسار ديناميكي `${pathname}#anchor` (مو مسار ثابت) عشان تشتغل صح بأي صفحة منهم. رابط "الأسئلة الشائعة" يظهر بكل الصفحات دايمًا (خارج الشرط الشرطي).

### 7. توحيد الأرقام ✅
كل الأرقام المعروضة بالصفحة الرئيسية وصفحة الشركات وُحّدت للإنجليزية (كانت خليط عربي/إنجليزي).

### 8. إصلاح ثغرة أمنية حرجة — تجاوز حد الوظائف المجانية 🔴→✅
**المشكلة:** كانت الشركة تقدر تتحايل على حد "3 وظائف مجانية" بحذف وظيفة ونشر بديلة مجانًا (الفحص كان على عدد الوظائف *الحالي* الموجود بقاعدة البيانات، مو تراكمي)، وأيضًا زر "+ وظيفة جديدة" بصفحة `/company/jobs` ما كان فيه أي فحص إطلاقًا.

**الحل المطبّق:**
- عمود جديد `users.jobs_posted_count` (تراكمي، لا يتأثر بالحذف) + عمود `users.plan` (افتراضي `'free'`، لتفعيله لاحقًا مع Moyasar)
- `api/jobs/route.js` (POST): يتحقق من `jobs_posted_count >= 3` **قبل** الإدراج، يرفض بـ 403 لو تجاوز الحد وليس مشتركًا؛ يزيد العداد التراكمي بعد كل نشر ناجح
- نقطة API جديدة **`app/api/company/limits/route.js`** (GET) — ترجع `{ isPaid, posted, remaining, limit }` بناءً على العداد التراكمي الحقيقي
- `company/jobs/page.js`: يستخدم `/api/company/limits` لعرض زر "🔒 استهلكت الوظائف المجانية" بدل زر النشر لو `remaining === 0`
- `company/dashboard/page.js`: تم تعديله ليستخدم نفس `/api/company/limits` بدل الحساب القديم على أساس `stats.jobs` (العدد الحالي) — **⚠️ آخر إجراء بالجلسة، لم يُؤكد نجاح تطبيقه ولا اختباره فعليًا بعد — أول شي تتحقق منه بالمحادثة القادمة**

**⚠️ ملاحظة مهمة لأي محادثة قادمة:** تكرر بهذي الجلسة عدة مرات مشكلة "تعديل لا ينحفظ فعليًا رغم تأكيد المستخدم بالنجاح". دائمًا اطلب `grep` أو `head` للتأكد من وصول التعديل للملف الفعلي على القرص قبل الانتقال للخطوة التالية، ولا تفترض النجاح من كلام المستخدم فقط. كذلك انتبه لمشكلة تكرار الكود عند اللصق فوق نسخة سابقة جزئية (صار مرتين بهذي الجلسة) — الأفضل دائمًا تسليم الملف كاملاً نظيفاً بدل تعليمات "ابحث واستبدل" عند الشك بوجود نسخة سابقة غير مكتملة.

---

## هيكل قاعدة البيانات (محدّث)

### جدول `users`
```
id, email, password (bcrypt), name, role (candidate|company|admin),
crn, phone, is_banned, created_at,
jobs_posted_count (integer, default 0) ← جديد،
plan (text, default 'free') ← جديد
```

### جدول `candidates`
```
id, name, specialization, location, experience_years, score,
profile_json (jsonb) — يتضمن الآن: nationality, email ← جديد،
transcript (text), job_id, company_id, user_id,
is_visible, is_paid, status, notes, created_at
```

### جدول `jobs`
```
id, company_id, company_name, title, description, requirements,
location, salary_range, salary_visible, work_type,
questions (jsonb), status, nationality_preference (text, default 'all') ← جديد، created_at
```

### جدول `notifications`
```
id, user_id, type, title, body, is_read, meta (jsonb), created_at
```

---

## ملاحظات تقنية مهمة (محدّثة)

1. **Design System موحّد:** خط `IBM Plex Sans Arabic` (بدل Tajawal القديم)، ألوان عبر `var(--color-*)` design tokens (بدل hex ثابتة بالصفحات الجديدة). الصفحات القديمة اللي تستخدم كائن `C = {...}` محلي (ألوان hex ثابتة) لسا موجودة ببعض صفحات المرشح/الشركة الداخلية ولم تُوحّد بالكامل مع النظام الجديد (فقط الـ Navbar/Footer تم توحيده فيها، الألوان الداخلية للبطاقات بقيت كما هي عمدًا لتفادي كسر التصميم الوظيفي)
2. **مكوّنات مشتركة:** `components/Navbar.js`، `components/Footer.js` (جديد هذي الجلسة)، `components/DashboardNav.js` (للوحات التحكم)
3. **مشكلة متكررة بالـ Git Bash:** أحيانًا يفشل تنفيذ أوامر multi-line بسبب `bracketed paste` — الحل: `bind 'set enable-bracketed-paste off'`
4. **مشكلة متكررة:** نسيان حفظ الملف (Ctrl+S) بعد اللصق بـ VS Code، خصوصًا مع أكثر من تعديل بنفس الملف — يسبب `git commit` يرجع "nothing to commit" رغم إرسال المستخدم تأكيد النجاح
5. **VS Code Restricted Mode:** لو ظهرت رسالة "Workspace Trust"، لازم الضغط على "Trust" لتفعيل الحفظ والامتدادات بشكل كامل
6. **getAuthUser في APIs:** يقبل session cookie أولاً ثم `x-user-id`/`x-user-role` headers كـ fallback
7. **SUPABASE_SERVICE_KEY:** يُستخدم لكل العمليات الحساسة (بايباس RLS)

---

## متغيرات Vercel
```
ANTHROPIC_API_KEY ✅
NEXT_PUBLIC_SUPABASE_URL ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY ✅
SUPABASE_SERVICE_KEY ✅
ADMIN_PASSWORD = hAssAn202026@
ADMIN_SESSION_SECRET ✅
SESSION_SECRET ✅
```

---

## Claude Code Session
```bash
cd "/c/Users/Dell/Saved Games/نخبة/SSSSSSSSSSSSSSS/مجلد جديد/nukhba-next"
claude
```

---

## الأولويات بالترتيب (محدّثة)

1. **التحقق النهائي** من إصلاح ثغرة الحد المجاني — تأكيد `company/dashboard/page.js` محدّث ويعمل صح مع نفس منطق `company/jobs/page.js` (آخر شي تم إرساله بالجلسة السابقة، غير مؤكد التطبيق)
2. **نقل Supabase من Sydney لـ Frankfurt** — جلسة مخصصة منفصلة (مشروع جديد من الصفر، البيانات الحالية تجريبية فلا حاجة لـ migration فعلي)
3. **Moyasar (الدفع الحقيقي)** — بانتظار السجل التجاري؛ عمود `users.plan` جاهز مسبقًا لتفعيله
4. **خطة تسويقية تدريجية:**
   - المرحلة 1: استقطاب الباحثين عن عمل (تويتر/تيك توك/مجموعات واتساب — محتوى جاهز تم تجهيزه)
   - المرحلة 2: أول 10-20 شركة (تواصل مباشر بالقصيم)
5. **أول عميل حقيقي**
