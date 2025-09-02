# EventSika – Platform Informasi Event Kampus

Sebuah platform informasi event berbasis web yang dirancang untuk mahasiswa UNSIKA. Dibangun dengan Next.js dan Supabase, aplikasi ini bertujuan untuk menjadi pusat informasi terpadu untuk semua kegiatan kampus, dengan fitur personalisasi berdasarkan minat pengguna.

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Struktur Teknologi](#struktur-teknologi)
- [Panduan Instalasi Lokal](#panduan-instalasi-lokal)
  - [Prasyarat](#prasyarat)
  - [Langkah-langkah Instalasi](#langkah-langkah-instalasi)
- [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
- [Struktur Database](#struktur-database)
- [Proses Deployment](#proses-deployment)
- [Rencana Pengembangan Selanjutnya](#rencana-pengembangan-selanjutnya)

## Tentang Proyek

EventSika lahir dari kebutuhan mahasiswa untuk mendapatkan informasi event kampus yang seringkali tersebar di berbagai platform media sosial. Proyek ini bertujuan untuk:

- **Sentralisasi Informasi:** Mengumpulkan semua event kampus dalam satu platform yang mudah diakses.
- **Personalisasi:** Memberikan rekomendasi event yang relevan sesuai dengan jurusan dan minat mahasiswa.
- **Kemudahan Akses:** Menyediakan antarmuka yang bersih, modern, dan mobile-first.
- **Kontribusi Mudah:** Memungkinkan panitia event untuk mempublikasikan acara mereka melalui formulir sederhana.

## Fitur Utama

- ✅ **Tampilan Event (Feed):** Menampilkan daftar semua event kampus terbaru.
- ✅ **Personalisasi Feed:** Feed utama akan beradaptasi menampilkan event yang cocok dengan minat pengguna yang telah login.
- ✅ **Pencarian & Filter:** Pengguna dapat mencari event berdasarkan nama dan memfilter berdasarkan kategori.
- ✅ **Halaman Detail Event:** Halaman dinamis yang menampilkan semua informasi lengkap tentang satu event.
- ✅ **Autentikasi Pengguna:** Sistem pendaftaran, login, dan logout yang aman menggunakan Supabase Auth.
- ✅ **Halaman Profil Pengguna:** Pengguna dapat mengatur jurusan dan minat mereka untuk personalisasi.
- ✅ **Formulir Submission Event:** Formulir publik sederhana bagi panitia untuk mengirimkan event baru.
- ✅ **Desain Responsif:** Tampilan yang optimal di berbagai perangkat, dari desktop hingga mobile.

## Struktur Teknologi

Proyek ini dibangun menggunakan teknologi modern dan ekosistem JavaScript.

- **Frontend:**
  - [Next.js](https://nextjs.org/) (React Framework)
  - [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS Framework)
  - [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database:**
  - [Supabase](https://supabase.io/) (PostgreSQL Database, Authentication, RLS)
- **Deployment:**
  - [Vercel](https://vercel.com/)

## Panduan Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda.

### Prasyarat

- Node.js (v18.x atau lebih tinggi)
- npm / yarn / pnpm

### Langkah-langkah Instalasi

1.  **Clone Repositori**

    ```bash
    git clone [https://github.com/USERNAME/NAMA_REPO.git](https://github.com/USERNAME/NAMA_REPO.git)
    cd NAMA_REPO
    ```

2.  **Instal Dependensi Proyek**

    ```bash
    npm install
    ```

3.  **Setup Proyek Supabase**

    - Buka [supabase.com](https://supabase.com), buat akun dan proyek baru.
    - Simpan **Project URL** dan **`anon` public key** Anda.
    - Buka **SQL Editor** di dashboard Supabase dan jalankan skema di bawah untuk membuat tabel `events`. (Lihat bagian [Struktur Database](#struktur-database)).

4.  **Konfigurasi Environment Variables**

    - Buat file baru bernama `.env.local` di direktori utama proyek.
    - Salin isi dari `.env.example` (jika ada) atau gunakan format di bawah ini.
    - Lihat bagian [Konfigurasi Environment Variables](#konfigurasi-environment-variables) untuk detailnya.

5.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Konfigurasi Environment Variables

File `.env.local` diperlukan untuk menghubungkan aplikasi Next.js dengan Supabase. Pastikan file ini tidak pernah Anda push ke repositori publik.
NEXT_PUBLIC_SUPABASE_URL=URL_PROYEK_SUPABASE_ANDA
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY_PROYEK_ANDA

## Struktur Database

Proyek ini menggunakan satu tabel utama di database PostgreSQL Supabase.

**Tabel: `events`**

Gunakan skrip SQL berikut di Supabase SQL Editor untuk membuat tabel ini.

```sql
CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text,
    event_date timestamp with time zone NOT NULL,
    location text,
    organizer text,
    category text,
    registration_link text
);

-- Jangan lupa aktifkan Row Level Security (RLS) dan buat policies
-- untuk SELECT (public) dan INSERT (authenticated users).
```
