# 📤 Panduan Upload ke GitHub

## Persiapan

### 1. Pastikan Git Terinstall

```bash
git --version
```

Jika belum terinstall, download dari: https://git-scm.com/

### 2. Setup Git (Jika Belum)

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"
```

## 🚀 Langkah Upload

### 1. Inisialisasi Git Repository

```bash
git init
```

### 2. Tambahkan Semua File

```bash
git add .
```

### 3. Commit Pertama

```bash
git commit -m "Initial commit: AenulDev Portfolio"
```

### 4. Buat Repository di GitHub

1. Buka https://github.com/new
2. Nama repository: `aenuldev-portfolio` (atau nama lain)
3. Deskripsi: "Professional portfolio website with admin dashboard"
4. Pilih **Public** atau **Private**
5. **JANGAN** centang "Initialize with README" (sudah ada)
6. Klik **Create repository**

### 5. Connect ke GitHub

```bash
git remote add origin https://github.com/username/aenuldev-portfolio.git
```

Ganti `username` dengan username GitHub kamu.

### 6. Push ke GitHub

```bash
git branch -M main
git push -u origin main
```

## ✅ Verifikasi

Buka repository di GitHub dan pastikan:

- ✅ Semua file terupload
- ✅ File `.env` TIDAK ada (hanya `.env.example`)
- ✅ Folder `node_modules` TIDAK ada
- ✅ Folder `dist` TIDAK ada
- ✅ README.md tampil dengan baik

## 🔄 Update Selanjutnya

Setiap kali ada perubahan:

```bash
# 1. Tambahkan file yang berubah
git add .

# 2. Commit dengan pesan yang jelas
git commit -m "Deskripsi perubahan"

# 3. Push ke GitHub
git push
```

## 📝 Tips Commit Message

Gunakan format yang jelas:

- `feat: add blog image compression`
- `fix: resolve image rendering issue`
- `style: update navbar design`
- `docs: update README`
- `refactor: improve code structure`

## 🔒 Keamanan

### File yang TIDAK boleh di-upload:

- ❌ `.env` (credentials asli)
- ❌ `node_modules/` (dependencies)
- ❌ `dist/` (build output)
- ❌ `.kiro/` (IDE config)

Semua sudah ada di `.gitignore`, jadi aman!

### Jika Tidak Sengaja Upload `.env`:

1. Hapus dari Git:

```bash
git rm --cached .env
git commit -m "Remove .env from repository"
git push
```

2. **PENTING**: Ganti semua credentials di Supabase!
   - Generate API key baru
   - Update di `.env` lokal

## 🌐 Deploy ke Vercel/Netlify

Setelah di GitHub, kamu bisa deploy:

### Vercel:

1. Buka https://vercel.com
2. Import repository dari GitHub
3. Tambahkan environment variables dari `.env`
4. Deploy!

### Netlify:

1. Buka https://netlify.com
2. New site from Git
3. Connect GitHub repository
4. Tambahkan environment variables
5. Deploy!

## 🆘 Troubleshooting

### Error: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/username/repo.git
```

### Error: "failed to push"

```bash
git pull origin main --rebase
git push
```

### Lupa Commit Message

```bash
git commit --amend -m "Pesan baru"
```

## 📚 Resources

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf

---

**Selamat! Portfolio kamu sekarang sudah di GitHub! 🎉**
