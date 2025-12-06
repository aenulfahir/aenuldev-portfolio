# Panduan Setup Supabase untuk Portfolio Website

> ✅ **Status**: Integrasi Supabase sudah selesai dan siap digunakan!

## 📋 Struktur Database

Database ini terdiri dari 11 tabel yang saling terhubung:

### Tabel Utama:

| Tabel              | Deskripsi                                                |
| ------------------ | -------------------------------------------------------- |
| `profiles`         | Data hero section (nama, greeting, titles, social links) |
| `about`            | Data tentang diri (summary, kontak)                      |
| `skills`           | Daftar skill/keahlian                                    |
| `experiences`      | Pengalaman kerja                                         |
| `education`        | Riwayat pendidikan                                       |
| `certifications`   | Sertifikasi                                              |
| `projects`         | Daftar proyek portfolio                                  |
| `pricing_plans`    | Paket layanan dan harga                                  |
| `blog_posts`       | Artikel blog                                             |
| `blog_comments`    | Komentar pada blog                                       |
| `contact_messages` | Pesan dari form kontak                                   |

### Relasi Antar Tabel:

```
profiles (1) ──── (1) about
                      │
                      ├── skills (many)
                      ├── experiences (many)
                      ├── education (many)
                      └── certifications (many)

blog_posts (1) ──── (many) blog_comments
```

## 🚀 Langkah Setup

### 1. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) dan login
2. Klik "New Project"
3. Isi nama project dan password database
4. Pilih region terdekat (Singapore untuk Indonesia)
5. Tunggu project selesai dibuat

### 2. Jalankan Migration SQL

1. Buka **SQL Editor** di dashboard Supabase
2. Jalankan file SQL secara berurutan:
   - `supabase/migrations/001_initial_schema.sql` - Membuat struktur tabel
   - `supabase/migrations/002_seed_data.sql` - Mengisi data awal
   - `supabase/migrations/003_rls_policies.sql` - Mengatur keamanan
   - `supabase/migrations/004_add_comment_replies.sql` - Fitur reply komentar

### 3. Konfigurasi Environment

1. Copy `.env.example` menjadi `.env`
2. Isi dengan kredensial dari Supabase:
   - Buka **Settings > API** di dashboard
   - Copy `Project URL` ke `VITE_SUPABASE_URL`
   - Copy `anon public` key ke `VITE_SUPABASE_ANON_KEY`

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Setup Authentication (WAJIB untuk Admin)

1. Buka **Authentication > Users** di dashboard Supabase
2. Klik **"Add User"** > **"Create new user"**
3. Masukkan:
   - **Email**: email admin kamu (contoh: admin@example.com)
   - **Password**: password yang kuat (minimal 6 karakter)
4. Klik **"Create user"**
5. Gunakan email dan password ini untuk login ke admin panel di `/login`

> ⚠️ **Penting**: Tanpa membuat user di Supabase Auth, kamu tidak bisa login ke admin panel!

## 📁 Struktur File

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── database.types.ts    # TypeScript types
│   └── services/
│       ├── index.ts         # Export semua services
│       ├── profileService.ts
│       ├── projectService.ts
│       ├── blogService.ts
│       ├── pricingService.ts
│       └── contactService.ts

supabase/
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_seed_data.sql
    └── 003_rls_policies.sql
```

## 🔒 Row Level Security (RLS)

Kebijakan keamanan yang diterapkan:

| Tabel            | Public Read | Public Insert | Admin Full Access |
| ---------------- | ----------- | ------------- | ----------------- |
| profiles         | ✅          | ❌            | ✅                |
| about            | ✅          | ❌            | ✅                |
| skills           | ✅          | ❌            | ✅                |
| experiences      | ✅          | ❌            | ✅                |
| education        | ✅          | ❌            | ✅                |
| certifications   | ✅          | ❌            | ✅                |
| projects         | ✅          | ❌            | ✅                |
| pricing_plans    | ✅          | ❌            | ✅                |
| blog_posts       | ✅          | ❌            | ✅                |
| blog_comments    | ✅          | ✅            | ✅ (delete)       |
| contact_messages | ❌          | ✅            | ✅                |

## 💡 Contoh Penggunaan

### Fetch Projects

```typescript
import { getProjects } from "./lib/services";

const projects = await getProjects();
```

### Submit Contact Form

```typescript
import { submitContactMessage } from "./lib/services";

await submitContactMessage("John", "john@email.com", "Hello!");
```

### Add Blog Comment

```typescript
import { addComment } from "./lib/services";

await addComment(blogPostId, "Username", "Great article!");
```

## 🔄 Migrasi dari localStorage

Website saat ini menggunakan localStorage. Untuk migrasi ke Supabase:

1. Update `DataContext.tsx` untuk menggunakan services
2. Ganti `localStorage.getItem/setItem` dengan fungsi Supabase
3. Tambahkan loading states dan error handling

---

Dibuat untuk Portfolio Website Muhammad Aenul Fahir
