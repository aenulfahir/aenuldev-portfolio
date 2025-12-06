# 🚀 DEPLOY SEKARANG!

## ✅ File Docker Sudah Dibuat!

Saya sudah membuat file-file yang dibutuhkan untuk deployment:

- ✅ `Dockerfile` - Docker configuration
- ✅ `nginx.conf` - Nginx web server config
- ✅ `.dockerignore` - Docker ignore rules
- ✅ `EASYPANEL_DEPLOYMENT.md` - Deployment guide

## ⚡ Quick Deploy Steps

### 1. Commit & Push File Baru

```bash
git add Dockerfile nginx.conf .dockerignore EASYPANEL_DEPLOYMENT.md
git commit -m "Add Docker configuration for Easypanel deployment"
git push
```

### 2. Update Environment Variables di Easypanel

**⚠️ PENTING!** Ganti placeholder dengan credentials ASLI:

```env
VITE_SUPABASE_URL=https://uupnygdqeeqehxkfrwkd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cG55Z2RxZWVxZWh4a2Zyd2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjQyOTAsImV4cCI6MjA4MDQwMDI5MH0.al9EsKy4-Hes2huLMFghk1MEgiheNPcbgAKF2VVbs9I
```

Optional (jika pakai webhook):

```env
VITE_ORDER_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-order
VITE_CONTACT_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pesan
```

### 3. Redeploy di Easypanel

1. Buka Easypanel dashboard
2. Pilih project kamu
3. Klik **Redeploy** atau **Deploy**
4. Tunggu build selesai (2-5 menit)

## 🎯 Setelah Deploy

### Test Checklist:

- [ ] Website bisa diakses
- [ ] Login admin berfungsi (`/login`)
- [ ] Blog manager berfungsi
- [ ] Contact form berfungsi
- [ ] Upload gambar berfungsi
- [ ] Responsive di mobile

### Jika Ada Error:

1. Cek logs di Easypanel
2. Cek browser console (F12)
3. Pastikan environment variables benar
4. Lihat `EASYPANEL_DEPLOYMENT.md` untuk troubleshooting

## 📝 Commands Summary

```bash
# 1. Add Docker files
git add Dockerfile nginx.conf .dockerignore EASYPANEL_DEPLOYMENT.md DEPLOY_NOW.md

# 2. Commit
git commit -m "Add Docker configuration for Easypanel deployment"

# 3. Push
git push
```

Kemudian redeploy di Easypanel!

## 🔍 Verify Deployment

Setelah deploy sukses, test:

```bash
# Health check
curl https://your-domain.com/health
# Response: healthy

# Homepage
curl https://your-domain.com
# Response: HTML content
```

## 💡 Pro Tips

1. **Environment Variables**: Selalu gunakan credentials ASLI, bukan placeholder
2. **Build Time**: First build ~3-5 menit, subsequent builds ~2-3 menit
3. **Auto Deploy**: Setiap push ke GitHub akan auto-deploy
4. **Logs**: Monitor logs di Easypanel untuk debug

## 🆘 Troubleshooting

### Build Failed?

- Cek environment variables format
- Pastikan semua required vars ada
- Lihat build logs untuk detail error

### White Screen?

- Buka browser console (F12)
- Cek network tab untuk failed requests
- Verify Supabase credentials

### 404 on Refresh?

- Nginx config sudah handle ini
- Jika masih error, cek nginx.conf ter-copy

---

## ✅ READY TO DEPLOY!

Jalankan commands di atas dan deploy! 🚀

**Good luck!** 🎉
