# AenulDev Portfolio

Portfolio website profesional dengan fitur admin dashboard lengkap, dibangun menggunakan React, TypeScript, dan Supabase.

## ✨ Fitur Utama

### Frontend

- 🎨 **Modern UI/UX** - Desain futuristik dengan animasi smooth
- 📱 **Fully Responsive** - Optimal di semua device
- 🎯 **Custom Cursor** - Interactive cursor effect
- 🌙 **Dark Theme** - Professional dark mode design
- ⚡ **Fast Performance** - Optimized dengan Vite

### Admin Dashboard

- 👤 **Profile Management** - Edit hero section & about
- 📝 **Blog Manager** - Rich text editor dengan image upload
- 💼 **Project Manager** - Manage portfolio projects
- 💰 **Pricing Manager** - Edit pricing plans
- 📧 **Contact Manager** - View & manage messages
- 🔐 **Secure Authentication** - Supabase Auth

### Blog System

- ✍️ **Rich Text Editor** - Markdown support dengan preview
- 🖼️ **Image Upload** - Auto compression ke WebP
- 📺 **YouTube Embed** - Lazy loading thumbnails
- 💬 **Comment System** - Nested replies support
- 🔒 **Captcha Protection** - Custom visual captcha

### Contact Form

- 📨 **Webhook Integration** - Send to n8n
- 🤖 **Captcha Verification** - Spam protection
- ✅ **Form Validation** - Real-time validation

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Styling**: CSS Variables + Custom CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Deployment**: Docker + Nginx

## 📦 Installation

1. Clone repository:

```bash
git clone https://github.com/yourusername/aenuldev-portfolio.git
cd aenuldev-portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables:

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan credentials Supabase kamu:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

4. Setup database:

- Buka Supabase SQL Editor
- Jalankan migrations di folder `supabase/migrations/` secara berurutan:
  - `001_initial_schema.sql`
  - `002_seed_data.sql`
  - `003_rls_policies.sql`
  - `004_add_comment_replies.sql`
  - `005_create_orders_table.sql`
  - `006_fix_orders_rls.sql`
  - `007_orders_complete_setup.sql`
- Jalankan `supabase/CREATE_STORAGE_BUCKET.sql` untuk storage
- Jalankan `supabase/ADD_BLOG_IMAGE.sql` untuk blog images

5. Run development server:

```bash
npm run dev
```

## 🔧 Configuration

### Supabase Setup

Lihat `SUPABASE_SETUP.md` untuk panduan lengkap setup Supabase.

### N8N Webhook

Lihat `N8N_WEBHOOK_SETUP.md` untuk setup webhook contact form.

### Blog Manager

Lihat `BLOG_MANAGER_GUIDE.md` untuk panduan menggunakan blog manager.

## 📝 Usage

### Admin Access

1. Buka `/login`
2. Login dengan credentials Supabase
3. Akses admin dashboard

### Blog Management

- Upload gambar otomatis dikompres ke WebP
- Support markdown formatting
- YouTube embed dengan lazy loading
- Featured image untuk setiap post

### Project Management

- Add/Edit/Delete projects
- Categorize by type (web/mobile/other)
- Tech stack tags

## 🎨 Customization

### Colors

Edit CSS variables di `src/index.css`:

```css
:root {
  --primary-color: #00ff9d;
  --secondary-color: #00b8ff;
  --accent-color: #ffd700;
}
```

### Logo & Branding

- Logo: `public/favicon.svg`
- Title: `index.html`
- Navbar: `src/components/Navbar.tsx`

## 📚 Documentation

- `BLOG_MANAGER_GUIDE.md` - Blog management guide
- `PROJECT_MANAGER_GUIDE.md` - Project management guide
- `SUPABASE_SETUP.md` - Database setup guide
- `N8N_WEBHOOK_SETUP.md` - Webhook integration guide
- `QUICK_REFERENCE.md` - Quick reference guide

## 🔒 Security

- Environment variables tidak di-commit
- RLS policies di Supabase
- Captcha protection di contact form
- Secure authentication dengan Supabase Auth

## 📄 License

MIT License - feel free to use for your own portfolio!

## 👨‍💻 Author

**Muhammad Aenul Fahir**

- Portfolio: [aenuldev.com](https://aenuldev.com)
- GitHub: [@aenulfh](https://github.com/aenulfh)

## 🙏 Acknowledgments

- React Team
- Supabase Team
- Vite Team
- Lucide Icons
