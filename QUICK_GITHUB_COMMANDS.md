# ⚡ Quick GitHub Commands

## 🚀 First Time Upload

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. First commit
git commit -m "Initial commit: AenulDev Portfolio"

# 4. Add remote (ganti 'username' dengan username GitHub kamu)
git remote add origin https://github.com/username/aenuldev-portfolio.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

## 🔄 Update Code (Setelah Perubahan)

```bash
# Quick update (3 commands)
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

## 📊 Check Status

```bash
# Lihat file yang berubah
git status

# Lihat history commit
git log --oneline

# Lihat perubahan detail
git diff
```

## 🔙 Undo Changes

```bash
# Undo file yang belum di-commit
git checkout -- filename.txt

# Undo semua perubahan
git reset --hard

# Undo commit terakhir (keep changes)
git reset --soft HEAD~1

# Undo commit terakhir (discard changes)
git reset --hard HEAD~1
```

## 🌿 Branches

```bash
# Buat branch baru
git checkout -b feature-name

# Pindah branch
git checkout main

# Merge branch
git merge feature-name

# Hapus branch
git branch -d feature-name
```

## 🔍 Useful Commands

```bash
# Clone repository
git clone https://github.com/username/repo.git

# Pull latest changes
git pull

# View remote URL
git remote -v

# Change remote URL
git remote set-url origin https://github.com/username/new-repo.git
```

## 💡 Tips

### Commit Message Format

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "style: update design"
git commit -m "docs: update README"
git commit -m "refactor: improve code"
```

### Add Specific Files

```bash
git add src/components/Navbar.tsx
git add src/pages/*.tsx
```

### Ignore Already Tracked File

```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
```

## 🆘 Emergency

### Accidentally Committed .env

```bash
# 1. Remove from Git
git rm --cached .env
git commit -m "Remove .env"
git push

# 2. IMMEDIATELY change all credentials in Supabase!
```

### Force Push (Use with Caution!)

```bash
git push --force
```

### Reset to Remote

```bash
git fetch origin
git reset --hard origin/main
```

---

**Pro Tip**: Commit often, push regularly! 🚀
