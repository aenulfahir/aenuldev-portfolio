# Orders Table Setup Guide

## Errors yang Mungkin Terjadi

### Error 1: Table Not Found (404)

```
Failed to load resource: the server responded with a status of 404
Error submitting order: Object
```

**Penyebab:** Table `orders` belum dibuat di Supabase database.

**Solusi:** Jalankan migration `005_create_orders_table.sql`

### Error 2: RLS Policy Violation (401) ⚠️ MOST COMMON

```
Error submitting order: Object
code: "42501"
message: "new row violates row-level security policy for table \"orders\""
```

**Penyebab:** RLS policy tidak mengizinkan public insert.

**Solusi Cepat:** 👉 [RUN_THIS_SQL.md](RUN_THIS_SQL.md) (1 menit)

**Solusi Lengkap:** Jalankan migration `007_orders_complete_setup.sql`

## Solusi: Jalankan Migration

### Cara 1: Via Supabase Dashboard (RECOMMENDED)

#### Step 1: Create Orders Table

1. **Buka Supabase Dashboard**

   - Go to: https://supabase.com/dashboard
   - Login dengan akun Anda
   - Pilih project Anda

2. **Buka SQL Editor**

   - Click "SQL Editor" di sidebar kiri
   - Click "New Query" button

3. **Copy & Paste SQL**

   - Buka file: `supabase/migrations/005_create_orders_table.sql`
   - Copy semua isinya
   - Paste di SQL Editor

4. **Run Migration**

   - Click "Run" button (atau Ctrl+Enter)
   - Tunggu sampai selesai
   - Anda akan lihat "Success" message

5. **Verify Table Created**
   - Click "Table Editor" di sidebar
   - Anda akan lihat table "orders" di list

#### Step 2: Fix RLS Policies (IMPORTANT!)

1. **Buka SQL Editor Lagi**

   - Click "New Query" button

2. **Copy & Paste RLS Fix**

   - Buka file: `supabase/migrations/006_fix_orders_rls.sql`
   - Copy semua isinya
   - Paste di SQL Editor

3. **Run RLS Fix**

   - Click "Run" button (atau Ctrl+Enter)
   - Tunggu sampai selesai
   - Anda akan lihat "Success" message

4. **Verify Policies**
   - Click "Authentication" → "Policies"
   - Pilih table "orders"
   - Anda akan lihat 4 policies:
     - ✅ Public can insert orders (INSERT, anon + authenticated)
     - ✅ Authenticated users can view orders (SELECT, authenticated)
     - ✅ Authenticated users can update orders (UPDATE, authenticated)
     - ✅ Authenticated users can delete orders (DELETE, authenticated)

### Cara 2: Via Supabase CLI (Advanced)

```bash
# Install Supabase CLI (jika belum)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push
```

## Verify Setup

Setelah migration berhasil, test order form:

1. Buka aplikasi: http://localhost:5173
2. Navigate ke Pricing page
3. Click "Choose Plan"
4. Isi form dan submit
5. Check Supabase Dashboard → Table Editor → orders
6. Data order akan muncul!

## Table Structure

Table `orders` memiliki kolom:

### Plan Information

- `plan_id` - ID dari pricing plan
- `plan_title` - Nama plan (e.g., "Web Developer")
- `plan_price` - Harga plan

### Personal Information

- `full_name` - Nama lengkap customer
- `email` - Email address
- `phone` - Nomor telepon
- `company` - Nama perusahaan (optional)

### Project Details

- `project_name` - Nama project
- `project_description` - Deskripsi project
- `timeline` - Timeline pengerjaan
- `budget` - Budget range
- `target_audience` - Target audience
- `preferred_start_date` - Tanggal mulai yang diinginkan

### Requirements

- `selected_features` - Array of additional features
- `additional_features` - Custom features description
- `design_preference` - Preferensi design style
- `has_existing_design` - Apakah sudah ada design
- `has_content_ready` - Apakah content sudah siap
- `additional_notes` - Catatan tambahan

### Status & Timestamps

- `status` - Status order (pending/approved/rejected)
- `created_at` - Waktu order dibuat
- `updated_at` - Waktu terakhir diupdate

## RLS Policies

Table ini memiliki Row Level Security (RLS) policies:

1. **Public Insert** - Siapa saja bisa create order (tidak perlu login)
2. **Authenticated Read** - Hanya admin yang login bisa lihat orders
3. **Authenticated Update** - Hanya admin yang login bisa update orders

## Troubleshooting

### Error: "relation orders does not exist"

**Solution:** Migration belum dijalankan. Ikuti langkah di atas.

### Error: "permission denied for table orders"

**Solution:** RLS policies belum di-setup. Pastikan semua SQL di migration file dijalankan.

### Error: "Invalid Refresh Token"

**Solution:** Ini normal untuk public insert. Order tetap akan tersimpan.

### Data tidak muncul di table

**Solution:**

1. Check browser console untuk error
2. Verify migration sudah dijalankan
3. Check Supabase logs di Dashboard

## Webhook Integration

Order form sudah terintegrasi dengan n8n webhook untuk notifikasi real-time.

### Setup Webhook

1. **Environment Variable**

   ```env
   VITE_ORDER_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing
   ```

2. **Webhook Payload**
   Setiap order baru akan mengirim data ke webhook:

   ```json
   {
     "order_id": "uuid",
     "plan_id": "web-developer",
     "plan_title": "Web Developer",
     "plan_price": "5.000.000",
     "full_name": "John Doe",
     "email": "john@example.com",
     "phone": "+62 812 3456 7890",
     "company": "PT Example",
     "project_name": "Company Website",
     "project_description": "...",
     "timeline": "1-2 weeks",
     "budget": "5-10 million",
     "selected_features": ["SEO Optimization", "Analytics"],
     "additional_features": "...",
     "design_preference": "modern",
     "target_audience": "Young professionals",
     "has_existing_design": "no",
     "has_content_ready": "yes",
     "preferred_start_date": "2024-12-15",
     "additional_notes": "...",
     "status": "pending",
     "created_at": "2024-12-05T10:30:00Z",
     "submitted_at": "2024-12-05T10:30:00Z"
   }
   ```

3. **Error Handling**
   - Jika webhook gagal, order tetap tersimpan di database
   - Error webhook hanya di-log di console
   - Tidak mengganggu user experience

### n8n Workflow Setup

Di n8n, Anda bisa setup workflow untuk:

1. **Instant Notification**

   - Kirim email ke admin
   - Kirim notifikasi Telegram/Discord
   - Update Google Sheets

2. **Auto Response**

   - Kirim email konfirmasi ke customer
   - Kirim WhatsApp message

3. **CRM Integration**
   - Sync ke CRM system
   - Create task di project management tool

## Next Steps

Setelah table dibuat, Anda bisa:

1. **View Orders** - Lihat semua orders di Supabase Dashboard
2. **Export Data** - Export orders ke CSV/Excel
3. **Create Admin Page** - Buat halaman admin untuk manage orders
4. **Webhook Notifications** - ✅ Sudah terintegrasi dengan n8n
5. **Status Updates** - Update status order (pending → approved/rejected)

## Admin Page (Coming Soon)

Untuk melihat dan manage orders, Anda bisa membuat admin page:

```typescript
// src/pages/admin/OrderManager.tsx
// - List all orders
// - Filter by status
// - Update order status
// - View order details
// - Export to CSV
```

---

**Created:** December 5, 2024  
**Status:** ⚠️ Migration Required  
**Priority:** 🔴 High - Required for order functionality
