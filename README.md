# QuKao Learning & Assessment Platform

QuKao adalah platform manajemen ujian, kuis, formulir, dan sistem pembelajaran terintegrasi dengan kecerdasan buatan (QuKao AI) yang dirancang untuk mendukung interaksi berkualitas antara guru dan siswa.

Platform ini menggunakan sistem otentikasi aman tanpa kata sandi (Passwordless OTP) dengan metode **Satu Kali Lihat (One-Time View Token Link)** untuk memastikan keamanan maksimal kode verifikasi Anda.

---

## 🚀 Panduan Deploy ke GitHub & Vercel / Cloud Run

Aplikasi ini dapat langsung didiluncurkan (deploy) ke **Vercel** atau platform hosting lainnya langsung dari repositori GitHub Anda. Ikuti langkah-langkah mudah di bawah ini:

### 1. Ekspor Proyek ke GitHub
* Klik ikon **Settings** (roda gigi) di kanan atas editor Google AI Studio Build Anda.
* Pilih opsi **Export to GitHub** untuk membuat repositori baru langsung di akun GitHub Anda atau mengunduhnya sebagai file ZIP untuk diunggah manual ke GitHub.

### 2. Hubungkan ke Vercel (Rekomendasi Utama)
* Masuk ke dashboard [Vercel](https://vercel.com).
* Klik **Add New** -> **Project**.
* Pilih repositori GitHub `qukao` yang baru saja Anda ekspor.
* Di bagian **Framework Preset**, pastikan terpilih **Next.js**.
* Tambahkan **Environment Variables** (lihat daftar di bawah) sebelum memulai deployment.
* Klik **Deploy**! Selesai dalam waktu kurang dari 2 menit.

---

## 🛠️ Konfigurasi Environment Variables

Untuk menjalankan semua fitur aplikasi dengan lancar (termasuk verifikasi OTP dan AI generator), siapkan variabel lingkungan berikut di panel pengaturan Vercel / file `.env.local` Anda:

| Nama Variabel | Deskripsi | Status | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `RESEND_API_KEY` | Kunci API Resend untuk mengirim surel verifikasi OTP secara real-time. | **Sangat Direkomendasikan** | `re_123456789...` |
| `OPENROUTER_API_KEYS` | Kunci API OpenRouter bawaan untuk menggerakkan AI Generator & Asisten Belajar. | **Sangat Direkomendasikan** | `sk-or-v1-...` |
| `NEXT_PUBLIC_APP_URL` | URL absolut domain Anda. Digunakan sebagai dasar tautan OTP Sekali Pakai. | **Wajib** | `https://qukao.vercel.app` atau `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL database Supabase jika Anda ingin menghubungkan database terpisah. | *Opsional* | `https://your-proj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kunci anonim Supabase untuk interaksi client-side database. | *Opsional* | `eyJhbGciOi...` |
| `IMGBB_API_KEY_1` | Kunci API ImgBB untuk menangani upload gambar dalam tugas. | *Opsional* | `abcdef12345...` |

---

## 💻 Pengembangan Lokal (Local Development)

Jika Anda ingin menjalankan atau mengembangkan aplikasi ini secara lokal di komputer Anda sendiri:

1. Clone repositori dari GitHub:
   ```bash
   git clone <url-repositori-anda>
   cd qukao
   ```

2. Instal seluruh dependensi:
   ```bash
   npm install
   ```

3. Duplikat berkas konfigurasi env:
   ```bash
   cp .env.example .env.local
   ```
   *Buka `.env.local` dan isi nilai-kunci API sesuai kebutuhan Anda.*

4. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   *Buka [http://localhost:3000](http://localhost:3000) di peramban Anda.*

5. Untuk build produksi secara lokal:
   ```bash
   npm run build
   npm run start
   ```

---

## 🎨 Keunggulan Struktur Aplikasi

* **Next.js 15+ App Router**: Struktur folder modular untuk performa optimal dan SEO-friendly.
* **Seamless OTP Flow**: Desain UI OTP dengan skema keamanan tingkat tinggi (One-Time View) dan visual biru premium QuKao yang responsif dan anti-spam.
* **AI Integration**: AI Generator cerdas yang terintegrasi untuk menyusun soal evaluasi berbasis dokumen yang diunggah secara aman dan transparan secara real-time.
* **Tailwind CSS & Motion**: Tampilan antarmuka super mulus, bersih, dan modern dengan pergerakan mikro-interaksi yang elegan.
