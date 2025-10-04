# 🚀 Kanban Task Manager

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-7.1.7-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Supabase-2.58.0-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Tailwind-4.1.13-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</div>

<div align="center">
  <h3>مدير المهام الحديث مع واجهة سحب وإسقاط تفاعلية</h3>
  <p>تطبيق Kanban متطور مبني بـ React و Supabase مع ميزات الوقت الفعلي</p>
  <a href="https://kanban-ten-jet.vercel.app">🌐 عرض مباشر</a> |
  <a href="#installation">📦 التثبيت</a> |
  <a href="#features">✨ الميزات</a>
</div>

---

## 📋 نظرة عامة

Kanban Task Manager هو تطبيق إدارة مهام حديث يوفر تجربة مستخدم سلسة لتنظيم المشاريع والمهام. يدعم التطبيق المصادقة الآمنة، العمل التعاوني، والتحديثات في الوقت الفعلي.

### 🎯 الهدف من المشروع
- توفير أداة إدارة مهام بصرية وبديهية
- دعم العمل الجماعي والتعاون
- واجهة مستخدم حديثة ومتجاوبة
- الأمان والموثوقية في إدارة البيانات

## ✨ الميزات الأساسية

### 🔐 المصادقة والأمان
- تسجيل الدخول الآمن عبر Supabase Auth
- إدارة الجلسات التلقائية
- حماية البيانات الشخصية

### 📊 إدارة اللوحات والمشاريع
- إنشاء لوحات متعددة للمشاريع المختلفة
- تخصيص أسماء الأعمدة حسب سير العمل
- تعديل وحذف اللوحات

### 📝 إدارة المهام المتقدمة
- إضافة مهام جديدة مع الوصف التفصيلي
- المهام الفرعية مع تتبع التقدم
- تعديل وحذف المهام
- عرض تفصيلي للمهام

### 🎨 واجهة المستخدم التفاعلية
- سحب وإسقاط المهام بين الأعمدة
- تصميم مظلم أنيق
- واجهة متجاوبة لجميع الأجهزة
- رسوم متحركة سلسة

### ⚡ الأداء والتحديثات الفورية
- تحديثات فورية عبر Supabase Realtime
- تحميل سريع مع Vite
- إدارة حالة محسنة

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 19.1.1** - مكتبة واجهة المستخدم الحديثة
- **Vite 7.1.7** - أداة البناء السريعة
- **Tailwind CSS 4.1.13** - إطار عمل CSS المرن

### Backend & Database
- **Supabase 2.58.0** - قاعدة البيانات والمصادقة
- **PostgreSQL** - قاعدة بيانات قوية

### UI Libraries
- **@dnd-kit** - مكتبة السحب والإسقاط
- **Radix UI** - مكونات UI يمكن الوصول إليها
- **Lucide React** - أيقونات حديثة

### Development Tools
- **ESLint** - فحص جودة الكود
- **Prettier** - تنسيق الكود
- **SWC** - مجمع JavaScript سريع

## 📦 التثبيت {#installation}

### المتطلبات الأساسية
- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- حساب Supabase

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/mahrandev/Kanban.git
cd Kanban
```

2. **تثبيت التبعيات**
```bash
npm install
# أو
yarn install
```

3. **إعداد متغيرات البيئة**
```bash
# إنشاء ملف .env.local
cp .env.example .env.local
```

أضف معلومات Supabase:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **تشغيل خادم التطوير**
```bash
npm run dev
# أو
yarn dev
```

5. **فتح التطبيق**
اذهب إلى `http://localhost:5173`

## 🗄️ إعداد قاعدة البيانات

### SQL Schema

قم بتنفيذ هذا الكود في Supabase SQL Editor:

```sql
-- إنشاء جدول اللوحات
create table boards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- إنشاء جدول الأعمدة
create table columns (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  board_id uuid references boards(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- إنشاء جدول المهام
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text not null,
  column_id uuid references columns(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- إنشاء جدول المهام الفرعية
create table subtasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  is_completed boolean default false,
  task_id uuid references tasks(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- إعداد Row Level Security (RLS)
alter table boards enable row level security;
alter table columns enable row level security;
alter table tasks enable row level security;
alter table subtasks enable row level security;

-- سياسات الأمان
create policy "Users can only see their own boards" on boards
  for all using (auth.uid() = user_id);

create policy "Users can only see columns of their boards" on columns
  for all using (
    exists (
      select 1 from boards 
      where boards.id = columns.board_id 
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can only see tasks of their boards" on tasks
  for all using (
    exists (
      select 1 from boards 
      join columns on columns.board_id = boards.id 
      where columns.id = tasks.column_id 
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can only see subtasks of their boards" on subtasks
  for all using (
    exists (
      select 1 from boards 
      join columns on columns.board_id = boards.id 
      join tasks on tasks.column_id = columns.id
      where tasks.id = subtasks.task_id 
      and boards.user_id = auth.uid()
    )
  );
```

## 🚀 النشر

### Vercel (مستحسن)
1. ربط المشروع مع Vercel
2. إضافة متغيرات البيئة
3. النشر التلقائي

### Netlify
1. بناء المشروع: `npm run build`
2. نشر مجلد `dist`
3. إعداد متغيرات البيئة

## 📁 هيكل المشروع

```
Kanban/
├── public/              # الملفات العامة
├── src/
│   ├── components/      # مكونات React
│   │   ├── shared/      # المكونات المشتركة
│   │   └── ui/          # مكونات UI الأساسية
│   ├── lib/            # المكتبات والأدوات المساعدة
│   ├── assets/         # الصور والملفات الثابتة
│   ├── App.jsx         # المكون الرئيسي
│   ├── main.jsx        # نقطة الدخول
│   └── index.css       # الأنماط العامة
├── package.json        # تبعيات المشروع
├── vite.config.js      # إعدادات Vite
├── tailwind.config.js  # إعدادات Tailwind
└── README.md          # التوثيق
```

## 🔧 أوامر المشروع

```bash
# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة النسخة المبنية
npm run preview

# فحص الكود
npm run lint
```

## 🧪 التطوير والاختبار

### إضافة ميزات جديدة
1. إنشاء branch جديد
2. تطوير الميزة
3. اختبار الوظائف
4. إرسال Pull Request

### معايير الكود
- استخدام ESLint للتحقق من الكود
- تنسيق الكود باستخدام Prettier
- كتابة تعليقات واضحة
- اتباع نمط التسمية المتفق عليه

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع هذه الخطوات:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

### إرشادات المساهمة
- اتباع معايير التكويد المحددة
- كتابة تعليقات واضحة
- اختبار التغييرات قبل الإرسال
- توثيق الميزات الجديدة

## 🐛 الإبلاغ عن الأخطاء

إذا واجهت خطأ، يرجى:
1. التحقق من Issues الموجودة
2. إنشاء Issue جديد مع:
   - وصف مفصل للخطأ
   - خطوات إعادة الإنتاج
   - لقطات شاشة (إن أمكن)
   - معلومات البيئة

## 📚 الموارد والتوثيق

- [React Documentation](https://reactjs.org/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DnD Kit Documentation](https://docs.dndkit.com/)

## 🔮 خارطة الطريق

- [ ] إضافة التنبيهات والإشعارات
- [ ] دعم الملفات المرفقة
- [ ] تقارير الإنتاجية
- [ ] التصدير والاستيراد
- [ ] API للتكامل مع التطبيقات الأخرى
- [ ] تطبيق الهاتف المحمول

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف [LICENSE](LICENSE) للمزيد من التفاصيل.

## 👨‍💻 المطور

**Mahran** - [@mahrandev](https://github.com/mahrandev)

- 📧 البريد الإلكتروني: [contact@mahrandev.com]
- 🐦 تويتر: [@mahrandev]
- 💼 LinkedIn: [mahrandev]

## 🙏 شكر وتقدير

- [React Team](https://reactjs.org/) للمكتبة الرائعة
- [Supabase](https://supabase.com/) للـ Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) للتصميم
- [Radix UI](https://www.radix-ui.com/) للمكونات
- [DnD Kit](https://dndkit.com/) لوظائف السحب والإسقاط

---

<div align="center">
  <p>تم تطويره بـ ❤️ بواسطة <a href="https://github.com/mahrandev">Mahran</a></p>
  <p>⭐ إذا أعجبك المشروع، لا تنس إعطاءه نجمة!</p>
</div>