# 🚀 Easypanel Deployment Guide

## ✅ Prerequisites

- Repository sudah di GitHub
- Akun Easypanel sudah siap
- Supabase project sudah setup

## 📋 Langkah Deployment

### 1. Buat Project di Easypanel

1. Login ke Easypanel dashboard
2. Klik **Create Project**
3. Pilih **From GitHub**
4. Connect repository kamu
5. Pilih branch: `main`

### 2. Configure Build Settings

**Build Command:**

```bash
npm run build
```

**Output Directory:**

```
dist
```

**Install Command:**

```bash
npm ci
```

### 3. Set Environment Variables

Di Easypanel, tambahkan environment variables berikut:

#### Required Variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

#### Optional Variables:

```env
VITE_ORDER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/order
VITE_CONTACT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/contact
```

**⚠️ PENTING:** Ganti dengan credentials ASLI dari Supabase kamu!

### 4. Deploy

1. Klik **Deploy**
2. Tunggu proses build selesai (2-5 menit)
3. Aplikasi akan otomatis live!

## 🔧 Troubleshooting

### Error: "failed to read dockerfile"

✅ **SOLVED!** File `Dockerfile` sudah dibuat.

### Error: Build Failed

Cek environment variables sudah benar:

- `VITE_SUPABASE_URL` harus URL lengkap
- `VITE_SUPABASE_ANON_KEY` harus key yang valid

### Error: White Screen After Deploy

1. Cek browser console untuk error
2. Pastikan environment variables sudah di-set
3. Cek Supabase RLS policies sudah aktif

### Error: 404 on Refresh

✅ Nginx config sudah handle SPA routing

## 🔄 Update Deployment

Setiap kali push ke GitHub:

```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

Easypanel akan otomatis rebuild dan redeploy!

## 📊 Monitoring

### Check Logs

Di Easypanel dashboard:

1. Pilih project kamu
2. Klik **Logs**
3. Monitor build & runtime logs

### Health Check

Akses: `https://your-domain.com/health`
Response: `healthy`

## 🎯 Post-Deployment Checklist

- [ ] Website bisa diakses
- [ ] Login admin berfungsi
- [ ] Blog manager berfungsi
- [ ] Contact form berfungsi
- [ ] Images upload berfungsi
- [ ] Responsive di mobile
- [ ] No console errors

## 🌐 Custom Domain

### Setup Custom Domain:

1. Di Easypanel, pilih project
2. Klik **Domains**
3. Add custom domain
4. Update DNS records:
   - Type: `A`
   - Name: `@` atau `subdomain`
   - Value: IP dari Easypanel
5. Wait for DNS propagation (5-30 menit)

### SSL Certificate

Easypanel otomatis generate SSL certificate (Let's Encrypt)

## 💡 Tips

### Optimize Build Time

- Dependencies di-cache otomatis
- Build time: ~2-3 menit

### Environment Variables

- Bisa diupdate tanpa rebuild
- Restart service setelah update env vars

### Rollback

Di Easypanel:

1. Pilih **Deployments**
2. Pilih deployment sebelumnya
3. Klik **Rollback**

## 🔒 Security

### Environment Variables

- ✅ Tidak pernah di-commit ke Git
- ✅ Hanya tersimpan di Easypanel
- ✅ Encrypted at rest

### HTTPS

- ✅ SSL otomatis aktif
- ✅ HTTP redirect ke HTTPS

### Headers

- ✅ Security headers sudah di-set di nginx.conf
- ✅ XSS protection aktif
- ✅ Clickjacking protection aktif

## 📚 Resources

- Easypanel Docs: https://easypanel.io/docs
- Docker Docs: https://docs.docker.com
- Nginx Docs: https://nginx.org/en/docs

## 🆘 Need Help?

### Common Issues:

**Build gagal dengan error npm:**

```bash
# Hapus package-lock.json dan rebuild
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock"
git push
```

**Environment variables tidak terbaca:**

- Pastikan prefix `VITE_` ada
- Restart service setelah update
- Rebuild jika perlu

**404 Error:**

- Cek nginx.conf sudah ter-copy
- Pastikan SPA routing aktif

---

## ✅ Deployment Successful!

Aplikasi kamu sekarang live di Easypanel! 🎉

**Next Steps:**

1. Test semua fitur
2. Setup custom domain (optional)
3. Monitor logs
4. Share dengan dunia! 🌍
