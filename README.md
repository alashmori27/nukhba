# نخبة · Nukhba — AI Talent Platform

## إعداد المشروع

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد المتغيرات البيئية
```bash
cp .env.local.example .env.local
```
عدّل الملف وأضف:
- `ANTHROPIC_API_KEY` — من console.anthropic.com
- `NEXT_PUBLIC_SUPABASE_URL` — من لوحة Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — من لوحة Supabase

### 3. إعداد Supabase (اختياري في البداية)
- اذهب إلى supabase.com وأنشئ مشروعاً مجانياً
- في SQL Editor شغّل محتوى ملف `supabase-schema.sql`

### 4. تشغيل محلي
```bash
npm run dev
```
افتح: http://localhost:3000

### 5. النشر على Vercel
```bash
npx vercel
```
أو ارفع المشروع على GitHub واربطه بـ Vercel تلقائياً.

في Vercel أضف المتغيرات البيئية من Settings → Environment Variables.

## هيكل المشروع
```
nukhba-next/
├── app/
│   ├── api/
│   │   ├── chat/route.js        ← Claude AI
│   │   └── candidates/route.js  ← حفظ/جلب المرشحين
│   ├── interview/               ← صفحة المقابلة
│   ├── profile/                 ← ملف المرشح + CV
│   ├── companies/               ← لوحة الشركات
│   ├── page.js                  ← الصفحة الرئيسية
│   ├── layout.js
│   └── globals.css
├── components/
│   └── Navbar.js
├── lib/
│   ├── constants.js             ← STAGES + PROMPTS
│   └── supabase.js
└── supabase-schema.sql
```
