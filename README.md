# PESIAR SANTRI — Sistem Informasi Perizinan & Kunjungan Santri

Aplikasi web modern, aman, responsif, dan siap produksi untuk mengelola seluruh kegiatan refreshing (pesiar) santri dan kunjungan keluarga di lingkungan pondok pesantren.

---

## 1. Fitur Utama & Keunggulan

- **Jadwal Pesiar Dinamis**: Dikelola secara fleksibel melalui database (kegiatan rutin bulanan pada hari Jumat, jam operasional standar 08.00 – 17.00 WIB).
- **2 Jenis Aktivitas Refreshing**:
  1. *Pesiar Keluar Bersama Keluarga*: Santri dijemput untuk berlibur keluar area pondok.
  2. *Kunjungan Keluarga di Pesantren*: Silaturahmi keluarga di area kunjungan kampus pesantren.
- **Tiket Perizinan Digital (QR Code)**: Kartu izin digital dengan QR Code terenkripsi yang dapat ditampilkan di smartphone atau dicetak resmi.
- **Terminal Pos Gerbang Super Cepat**: Pemindaian kamera QR Code dan pencarian kode izin secara instan dengan umpan balik audio synthesizer (chime / buzzer).
- **Monitoring Keterlambatan Otomatis**: Mendeteksi santri yang belum kembali melewati pukul 17.00 WIB dan menghitung durasi keterlambatan secara real-time.
- **Verifikasi Hubungan Wali-Santri**: Mencegah penjemputan oleh pihak yang tidak berhak.
- **Pembuatan Izin Manual oleh Admin**: Membantu wali santri yang belum memiliki smartphone untuk mengajukan izin.
- **Laporan & Rekapitulasi Resmi**: Format cetak laporan dengan kop surat resmi pesantren dan tanda tangan pimpinan & musyrif.
- **6 Tingkat Hak Akses (RBAC)**: Super Admin, Admin, Pengurus Asrama, Wali Santri, Petugas Gerbang, dan Pimpinan (Mudir).

---

## 2. Stack Teknologi

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend & API**: Next.js Server Components, Server Actions, Route Handlers, Zod Validation
- **Database & Auth**: PostgreSQL via Supabase, Supabase Auth, Row Level Security (RLS)
- **Kamera & QR**: `@supabase/ssr`, `qrcode.react`, `html5-qrcode`
- **Audio Feedback**: Web Audio API Synthesizer (Zero-dependency chime/buzzer)
- **Deployment**: Vercel & Supabase Cloud

---

## 3. Akun Demo untuk Pengujian Cepat

Anda dapat menguji seluruh 6 peran secara langsung menggunakan pemilih peran 1-klik di halaman login atau menggunakan kredensial berikut:

| Peran | Email Demo | Password Demo | Halaman Dashboard |
|---|---|---|---|
| **Super Admin** | `superadmin@pesiarsantri.id` | `Admin123!` | `/dashboard/super-admin` |
| **Admin Pesantren** | `admin@pesiarsantri.id` | `Admin123!` | `/dashboard/admin` |
| **Pengurus Asrama** | `pengurus@pesiarsantri.id` | `Pengurus123!` | `/dashboard/pengurus` |
| **Wali Santri** | `wali@pesiarsantri.id` | `Wali123!` | `/dashboard/guardian` |
| **Petugas Gerbang** | `gerbang@pesiarsantri.id` | `Gerbang123!` | `/dashboard/gate` |
| **Pimpinan / Mudir** | `pimpinan@pesiarsantri.id` | `Pimpinan123!` | `/dashboard/leader` |

---

## 4. Panduan Menghubungkan ke GitHub, Supabase, dan Vercel

### A. Menghubungkan ke GitHub
Repository Git lokal telah diinisialisasi (`main` branch). Untuk menyambungkan ke GitHub:

1. Buat repository baru di GitHub (misal: `pesiar-santri`).
2. Jalankan perintah berikut di terminal:
   ```bash
   git remote add origin https://github.com/USERNAME/pesiar-santri.git
   git add .
   git commit -m "feat: initial production-ready release of Pesiar Santri"
   git push -u origin main
   ```

---

### B. Menghubungkan ke Supabase Cloud

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat project baru.
2. Masuk ke menu **SQL Editor**, buka file:
   - `supabase/migrations/20261112_init_pesiar_santri.sql`
   - Salin dan jalankan seluruh query untuk membuat Enums, Tabel, RLS Policies, Triggers, dan Storage Buckets.
3. Jalankan file `supabase/seed.sql` untuk mengisi data awal santri, jadwal pesiar, dan profil demo.
4. Buka menu **Project Settings -> API** di Supabase, lalu salin:
   - `Project URL`
   - `anon public key`
   - `service_role secret` (opsional untuk backend cron)
5. Masukkan ke file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_DEMO_MODE=false
   ```

---

### C. Menghubungkan & Deploy ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com) dan klik **Add New Project**.
2. Pilih repository GitHub `pesiar-santri` yang telah Anda push.
3. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = (URL Supabase Anda)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon Key Supabase Anda)
   - `NEXT_PUBLIC_SITE_URL` = (Domain Vercel Anda, misal: `https://pesiarsantri.vercel.app`)
   - `NEXT_PUBLIC_PESANTREN_NAME` = `"Pondok Pesantren Darul Huffazh"`
   - `NEXT_PUBLIC_DEFAULT_TIMEZONE` = `Asia/Jakarta`
   - `NEXT_PUBLIC_DEMO_MODE` = `false` (atau `true` untuk mode demo fleksibel)
4. Klik **Deploy**. Vercel akan otomatis melakukan proses build Next.js dan aplikasi siap online secara global.

---

## 5. Menjalankan di Lingkungan Lokal

```bash
# Pasang dependensi (jika baru di-clone)
npm install

# Jalankan server pengembangan
npm run dev

# Buka aplikasi di browser
http://localhost:3000
```

---

## 6. Lisensi & Hak Cipta

Dikembangkan untuk digitalisasi operasional pondok pesantren di Indonesia dengan standar keamanan tinggi dan kemudahan pemakaian bagi wali santri dan asatidzah.
