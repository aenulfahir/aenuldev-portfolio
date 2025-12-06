# Project Manager - User Guide

## Fitur-Fitur Baru

### 1. **Form yang Lebih Profesional**

Form tambah/edit project sekarang memiliki tampilan yang lebih terorganisir dengan sections yang jelas:

- Basic Information
- Technology Stack
- Project Links

### 2. **Technology Stack Management**

- **Manual Input**: Ketik teknologi yang digunakan, pisahkan dengan koma
- **Quick Add Buttons**: Klik tombol teknologi yang tersedia untuk menambahkan dengan cepat
- **Visual Tags**: Teknologi yang dipilih ditampilkan sebagai tag dengan tombol hapus
- **Common Technologies**: 25+ teknologi populer tersedia untuk quick-add

Teknologi yang tersedia:

- Frontend: React, Vue.js, Angular, Next.js
- Mobile: React Native, Flutter
- Backend: Node.js, Express
- Styling: Tailwind CSS, Bootstrap, Material-UI
- Database: MongoDB, PostgreSQL, MySQL, Firebase, Supabase
- Cloud & DevOps: AWS, Docker, Kubernetes
- API: GraphQL, REST API
- State Management: Redux, Zustand
- Testing: Jest, Cypress

### 3. **Project Types**

Pilihan tipe project yang lebih lengkap:

- Web Development
- Mobile App
- Desktop Application
- API / Backend
- UI/UX Design
- Other

### 4. **Enhanced Fields**

- **Thumbnail URL**: Tambahkan gambar thumbnail untuk project
- **Live Demo URL**: Link ke website/aplikasi yang sudah live
- **Repository URL**: Link ke GitHub atau repository lainnya
- **Rich Description**: Textarea dengan character counter

### 5. **Better UX**

- **Success/Error Messages**: Notifikasi visual saat save berhasil/gagal
- **Loading States**: Button disabled saat proses saving
- **Hover Effects**: Card project memiliki animasi hover yang smooth
- **Responsive Design**: Form dan card otomatis menyesuaikan dengan ukuran layar
- **Empty State**: Pesan yang jelas saat belum ada project

### 6. **Project Cards**

Setiap project card menampilkan:

- Project type badge
- Date/period
- Title
- Description
- Technology tags (max 5 visible, sisanya "+X more")
- Live demo link (jika ada)
- Edit & Delete buttons

### 7. **Responsive Design**

- Desktop: Grid 3-4 kolom
- Tablet: Grid 2 kolom
- Mobile: Single column
- Form fields otomatis stack di mobile

## Cara Menggunakan

### Menambah Project Baru

1. Klik tombol "Add New Project"
2. Isi informasi basic:
   - Project Title (required)
   - Project Type (required)
   - Description (required)
   - Date/Period
   - Thumbnail URL (optional)
3. Pilih teknologi:
   - Ketik manual atau klik quick-add buttons
   - Hapus teknologi dengan klik X pada tag
4. Tambahkan links (optional):
   - Live Demo URL
   - Repository URL
5. Klik "Create Project"

### Mengedit Project

1. Klik tombol "Edit" pada project card
2. Form akan muncul dengan data project yang sudah terisi
3. Edit field yang ingin diubah
4. Klik "Update Project"

### Menghapus Project

1. Klik tombol trash icon pada project card
2. Konfirmasi penghapusan
3. Project akan dihapus dari database

## Tips

- Gunakan quick-add buttons untuk menambah teknologi dengan cepat
- Pastikan URL dimulai dengan `https://` atau `http://`
- Description yang baik akan membuat portfolio lebih menarik
- Tambahkan thumbnail untuk visual yang lebih menarik
- Gunakan date format yang konsisten (e.g., "Jan 2024" atau "Q1 2024")

## Keyboard Shortcuts

- **Enter**: Submit form (saat focus di input field)
- **Escape**: Cancel edit (akan ditambahkan di update berikutnya)

## Troubleshooting

### Project tidak tersimpan

- Pastikan semua field required terisi (Title, Type, Description)
- Check console browser untuk error messages
- Pastikan koneksi ke Supabase aktif

### Teknologi tidak muncul

- Pastikan format input benar (pisahkan dengan koma)
- Refresh halaman jika ada masalah

### Form tidak responsive

- Clear browser cache
- Pastikan CSS sudah ter-load dengan benar
