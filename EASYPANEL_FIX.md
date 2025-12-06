# 🔧 EASYPANEL DEPLOYMENT FIX

## ✅ File `dockerfile` Sudah Ada!

File sudah di-push ke GitHub dengan nama lowercase `dockerfile`.

## ⚠️ MASALAH UTAMA: Environment Variables

Error terjadi karena environment variables masih menggunakan **PLACEHOLDER**:

```env
❌ VITE_SUPABASE_URL=https://your-project.supabase.co
❌ VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🔧 SOLUSI: Update Environment Variables

### Di Easypanel Dashboard:

1. **Buka Project Settings**

   - Pilih project: `portoaenul`
   - Klik **Environment Variables** atau **Settings**

2. **Hapus Semua Variables Lama**

3. **Tambahkan Variables Baru dengan Credentials ASLI:**

```env
VITE_SUPABASE_URL=https://uupnygdqeeqehxkfrwkd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cG55Z2RxZWVxZWh4a2Zyd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjQyOTAsImV4cCI6MjA4MDQwMDI5MH0.al9EsKy4-Hes2huLMFghk1MEgiheNPcbgAKF2VVbs9I
VITE_ORDER_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-order
VITE_CONTACT_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pesan
```

4. **Save Changes**

5. **Redeploy**
   - Klik **Deploy** atau **Redeploy**
   - Tunggu build selesai

## 📋 Step-by-Step dengan Screenshot

### 1. Buka Project Settings

```
Dashboard → Projects → portoaenul → Settings
```

### 2. Scroll ke Environment Variables Section

### 3. Untuk Setiap Variable:

- Klik **Add Variable** atau **Edit**
- Name: `VITE_SUPABASE_URL`
- Value: `https://uupnygdqeeqehxkfrwkd.supabase.co`
- Klik **Save**

Ulangi untuk semua variables.

### 4. Redeploy

```
Dashboard → Projects → portoaenul → Deploy
```

## ✅ Verifikasi

Setelah deploy sukses, cek:

1. **Build Logs** - Harus sukses tanpa error
2. **Runtime Logs** - Tidak ada error
3. **Website** - Bisa diakses
4. **Login** - Bisa login admin

## 🔍 Troubleshooting

### Jika Masih Error "dockerfile not found":

**Option 1: Manual Dockerfile Upload**

1. Download `dockerfile` dari repository
2. Upload manual via Easypanel file manager

**Option 2: Rebuild from Scratch**

1. Delete project di Easypanel
2. Create new project
3. Connect GitHub repository
4. Set environment variables dengan credentials ASLI
5. Deploy

### Jika Build Sukses tapi White Screen:

1. Buka browser console (F12)
2. Cek error messages
3. Kemungkinan:
   - Environment variables salah
   - Supabase RLS policies belum aktif
   - CORS issue

### Jika Login Tidak Berfungsi:

1. Cek Supabase dashboard
2. Pastikan Authentication enabled
3. Cek RLS policies di database

## 📞 Need Help?

Jika masih error:

1. Screenshot error message
2. Copy build logs
3. Cek Easypanel documentation

## 🎯 Expected Result

Setelah fix:

```
✅ Build: Success
✅ Deploy: Success
✅ Website: Live
✅ Admin: Working
✅ All features: Functional
```

---

## ⚡ Quick Fix Commands

Jika perlu update repository:

```bash
# Ensure dockerfile is committed
git add dockerfile nginx.conf .dockerignore
git commit -m "Ensure dockerfile is lowercase"
git push

# Force Easypanel to pull latest
# (Do this in Easypanel dashboard: Redeploy)
```

---

**PENTING:** Jangan lupa ganti environment variables dengan credentials ASLI! 🔑
