# EventSika V2.0 – Platform Pusat Informasi Kegiatan Kemahasiswaan UNSIKA

[![Next.js Version](https://img.shields.io/badge/Next.js-16.1.6-black?logo=nextdotjs)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev/)
[![Supabase Version](https://img.shields.io/badge/Supabase-v2.56.1-emerald?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Package Manager](https://img.shields.io/badge/pnpm-Wajib-orange?logo=pnpm)](https://pnpm.io/)

EventSika adalah platform pusat informasi kegiatan kemahasiswaan (event) terpadu yang dirancang khusus untuk civitas akademika **Universitas Singaperbangsa Karawang (UNSIKA)**. Platform ini mengintegrasikan **Sistem Rekomendasi Hibrida berbasis Artificial Intelligence (AI)** untuk mencocokkan profil akademik (Program Studi) dan preferensi minat mahasiswa dengan metadata event guna menghasilkan rekomendasi kegiatan yang personal dan relevan.

Aplikasi telah direfaktor sepenuhnya (V2.0) dari basis kode MVP menjadi struktur modular berbasis domain (_Domain-Driven layout_) dengan keamanan ketat berbasis _Row Level Security (RLS)_ di PostgreSQL Supabase, integrasi model NLP Hugging Face 768-dimensi, dan fungsionalitas pengujian algoritma rekomendasi.

---

## Daftar Isi

1. [Tentang Proyek](#tentang-proyek)
2. [Fitur Utama](#fitur-utama)
3. [Arsitektur & Tumpukan Teknologi](#arsitektur--tumpukan-teknologi)
4. [Struktur Direktori Proyek](#struktur-direktori-proyek)
5. [Sistem Rekomendasi Hybrid AI](#sistem-rekomendasi-hybrid-ai)
6. [Panduan Instalasi Lokal](#panduan-instalasi-lokal)
7. [Skema Database & RPC Supabase](#skema-database--rpc-supabase)
8. [Panduan Pengujian Algoritma](#panduan-pengujian-algoritma)

---

## Tentang Proyek

EventSika dikembangkan untuk mengatasi fragmentasi penyebaran informasi kegiatan mahasiswa di lingkungan kampus UNSIKA. Sebelumnya, informasi kegiatan kemahasiswaan tersebar di berbagai akun media sosial organisasi mahasiswa, menyulitkan mahasiswa dalam menemukan kegiatan yang relevan dengan minat mereka dan menyebabkan panitia kesulitan menjangkau target peserta yang tepat.

Dengan EventSika, semua kegiatan kemahasiswaan disatukan dalam satu wadah digital yang dinamis, dilengkapi dengan filter berbasis jurusan/fakultas, pencarian teks penuh, serta sistem feed pintar terpersonalisasi yang ditenagai oleh pencarian vektor kosinus.

---

## Fitur Utama

- **Feed Rekomendasi Terpersonalisasi**: Feed utama menampilkan daftar event yang dicocokkan secara pintar berdasarkan program studi dan topik minat yang dipilih pengguna saat onboarding.
- **Pencarian Cerdas & Filter Terstruktur**: Pencarian teks penuh (_full-text search_) di kolom judul, deskripsi, dan nama organizer, dikombinasikan dengan kategori event.
- **Autentikasi & Onboarding**: Registrasi aman menggunakan Supabase Auth terintegrasi cookie server, dilengkapi dengan alur onboarding pemilihan program studi UNSIKA dan topik minat (Teknologi, Bisnis, Seni, Olahraga, dll.).
- **Manajemen Event (Lifecycle)**:
  - _Organizer_: Mengajukan event baru dengan mengunggah banner poster, mendefinisikan detail tanggal mulai/selesai, target jurusan, kategori utama, dan tag spesifik. Status event bergerak melalui alur: `Draft` ➔ `Pending` ➔ `Published` (jika disetujui Admin) atau `Rejected`.
  - _Admin_: Menyetujui atau menolak event pengajuan serta memasukkan alasan penolakan.
- **Pengajuan Role Organizer**: Pengguna biasa dapat mengajukan permohonan menjadi Organizer dengan mengunggah bukti kelayakan. Aplikasi ditinjau langsung oleh Admin.
- **Bookmark Event**: Fitur penyimpanan event menarik (_Save Event_) untuk ditonton kembali di kemudian hari.
- **Panel Dashboard Khusus**:
  - _Admin Dashboard_: Menampilkan ringkasan statistik platform, peninjauan permohonan organizer, dan peninjauan event masuk.
  - _Organizer Dashboard_: Menyajikan statistik performa event buatan organizer (draft, pending, published, rejected) dan alat pembuatan event.
- **Suite Pengujian Algoritma Rekomendasi**: Panel eksperimen bagi pengembang untuk mengevaluasi metrik (Precision@K, Recall@K, F1@K, MAP) secara langsung dan melakukan ekspor CSV massal (_Bulk Export_) rekomendasi di bawah skenario pembobotan S1-S5.

---

## Arsitektur & Tumpukan Teknologi

Aplikasi ini menggunakan arsitektur **Serverless Fullstack** modern yang dioptimalkan untuk kecepatan muat (_RSC_) dan integrasi database vektor:

- **Framework**: [Next.js 16.1.6 (App Router)](https://nextjs.org/) & [React 19.2.4](https://react.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode, bebas `any`)
- **Desain & Gaya**: [Tailwind CSS 3.4.17](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) (Radix UI), [Framer Motion](https://www.framer.com/motion/) untuk mikro-animasi, dan [Sonner](https://github.com/emilkowalski/sonner) untuk notifikasi.
- **State Management & Caching**: [Zustand 5.0.8](https://github.com/pmndrs/zustand) dan [TanStack Query v5](https://tanstack.com/query) untuk caching data klien.
- **Formulir & Validasi**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) untuk validasi schema klien-server.
- **Backend & Database**: [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations), [Supabase SSR 0.7.0](https://supabase.com/docs/guides/auth/server-side/nextjs) untuk auth berbasis cookie server, PostgreSQL, dan ekstensi `pgvector` untuk database vektor.
- **AI NLP Model**: Hugging Face Inference API menggunakan model `sentence-transformers/paraphrase-multilingual-mpnet-base-v2`. Menghasilkan embedding vektor sebesar **768 dimensi**.
- **Package Manager**: `pnpm` (sangat direkomendasikan dan dikonfigurasi di repositori ini).

---

## Struktur Direktori Proyek

Aplikasi dirancang dengan struktur modular yang menempatkan fungsionalitas bisnis berdasarkan domain bisnis di dalam direktori `modules/` untuk skalabilitas yang baik:

```text
eventsika/
├── app/                  # App Router (Pages, Layouts, Routing)
│   ├── (auth)/           # Halaman login, register, onboarding
│   ├── (dashboard)/      # Dashboard admin & organizer (events, analytics, dll)
│   ├── (main)/           # Halaman publik (home, event detail, profile)
│   ├── (types)/          # Tipe data spesifik routing
│   ├── action.ts         # V2.0 Re-export Hub (backward compatibility)
│   ├── error.tsx         # Error Boundary global
│   └── layout.tsx        # Shell tata letak global & penyedia provider
├── components/           # Komponen UI global reusable (Shared, UI, Skeletons)
├── docs/                 # Dokumentasi proyek (PRD, DESIGN, ARCHITECTURE, PROJECT_CONTEXT)
├── lib/                  # Utilitas lintas-domain & konfigurasi global
│   ├── supabase/         # Inisialisasi client & server Supabase (client.ts, server.ts)
│   ├── embedding.ts      # Integrasi model AI Hugging Face (pembangkitan vektor 768-dim)
│   ├── taxonomy.ts       # Hierarki topik & logika taxonomy matching
│   ├── metrics.ts        # Kalkulasi metrik evaluasi rekomendasi (MAP, Precision@K)
│   └── queries.ts        # Global database queries (tanpa manipulasi/mutasi)
├── modules/              # Domain-specific modules (Modular Business Logic)
│   ├── admin/            # Logic & actions persetujuan admin (actions.ts)
│   ├── auth/             # Logic & actions otentikasi & onboarding (actions.ts)
│   ├── bookmark/         # Logic & actions bookmark event (actions.ts)
│   ├── events/           # Logic & actions manajemen & kueri event (actions.ts, queries.ts)
│   ├── profile/          # Logic & actions manajemen profil & interest (actions.ts)
│   └── recommendation/   # Logic & service sistem rekomendasi AI (ai-service.ts)
├── public/               # File statis (gambar, ikon, font)
├── types/                # Core domain types
│   └── index.ts          # Unified TypeScript interfaces (UserProfile, Event, dll)
```

---

## Sistem Rekomendasi Hybrid AI

Sistem rekomendasi EventSika mengadopsi pendekatan hibrida (_hybrid recommendation_) dengan arsitektur **4-Tier Fallback** guna memastikan toleransi kesalahan yang tinggi (_graceful degradation_):

1. **Tier 1 (AI Vector Search)**: Sistem mengambil minat kategori pengguna (_parent interests_), memperluasnya menggunakan taksonomi topik (_taxonomy expansion_) ke dalam tag spesifik (_child tags_), lalu mengirimkannya ke Hugging Face Inference API untuk membuat vektor representasi minat pengguna (_interest vector_ 768 dimensi). Vektor ini dicocokkan dengan vektor embedding event di database Supabase melalui Cosine Similarity (`<=>`) dikombinasikan dengan aturan kecocokan program studi (Bobot: 80% semantik, 20% program studi).
2. **Tier 2 (Category Match)**: Jika Hugging Face API mengalami kegagalan/timeout (misal karena _cold start_), sistem secara otomatis melakukan pemindaian konvensional berdasarkan kesesuaian kategori minat pengguna.
3. **Tier 3 (Latest Fallback)**: Jika data kategori event tidak memadai, sistem menyajikan daftar event terbitan terbaru secara kronologis.
4. **Tier 4 (Cold Start)**: Jika pengguna adalah mahasiswa baru yang belum mengisi data minat pada profilnya, sistem mengarahkan mereka untuk melengkapi profil sambil menyajikan feed event terpopuler/terbaru.

---

## Panduan Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan EventSika di mesin lokal Anda.

### Prasyarat

- **Node.js** (versi 18.x atau lebih tinggi)
- **pnpm** (direkomendasikan, versi 8.x atau lebih tinggi)

### Langkah-langkah Instalasi

1. **Clone Repositori**

   ```bash
   git clone https://github.com/zidankhainur2/eventsika.git
   cd eventsika
   ```

2. **Instal Dependensi**
   Gunakan `pnpm` untuk memasang semua modul proyek:

   ```bash
   pnpm install
   ```

3. **Konfigurasi Environment Variables**
   Buat file bernama `.env.local` di root direktori proyek Anda dan isi variabel berikut:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   HF_API_TOKEN=your-huggingface-api-token
   ```

4. **Jalankan Server Pengembangan**
   Jalankan server lokal Next.js dengan turbopack:
   ```bash
   pnpm dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat jalannya aplikasi.

---

## Skema Database & RPC Supabase

Jalankan skrip SQL berikut pada menu **SQL Editor** di dashboard Supabase Anda untuk menyiapkan tabel, relasi, tipe enum, ekstensi `pgvector`, serta fungsi database yang diperlukan.

```sql
-- 1. Aktifkan Ekstensi pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tipe Enum
CREATE TYPE user_role AS ENUM ('student', 'organizer', 'admin');
CREATE TYPE event_status AS ENUM ('draft', 'pending', 'published', 'rejected');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- 3. Tabel Profiles (User Profile)
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    avatar_url text,
    role user_role DEFAULT 'student'::user_role NOT NULL,
    student_id text, -- NIM
    faculty text,
    major text,
    academic_year text, -- Angkatan
    interests text, -- Minat kategori dipisahkan koma
    interest_vector vector(768), -- Vektor representasi minat semantik
    interests_updated_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. Tabel Events
CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    organizer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    organizer_name text NOT NULL,
    category text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    target_majors text[] DEFAULT '{}'::text[],
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    image_url text NOT NULL,
    status event_status DEFAULT 'draft'::event_status NOT NULL,
    rejection_reason text,
    embedding vector(768), -- Vektor semantik judul + deskripsi + tag
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- 5. Tabel Organizer Applications
CREATE TABLE public.organizer_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    organization_name text NOT NULL,
    contact_person text NOT NULL,
    phone text,
    description text,
    status application_status DEFAULT 'pending'::application_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- 6. Tabel Saved Events (Bookmarks)
CREATE TABLE public.saved_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_event_bookmark UNIQUE (user_id, event_id)
);

-- 7. Hidupkan Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;

-- 8. Tambahkan Indeks Pencarian & Vektor (HNSW)
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_end_date ON public.events(end_date);
CREATE INDEX idx_events_vector ON public.events USING hnsw (embedding vector_cosine_ops);

-- 9. RPC: Mengupdate Interest Vector Profil
CREATE OR REPLACE FUNCTION public.update_user_interest_vector(
    p_user_id uuid,
    p_interest_vec vector(768)
)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET
        interest_vector = p_interest_vec,
        interests_updated_at = now()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RPC: get_hybrid_recommendations
CREATE OR REPLACE FUNCTION public.get_hybrid_recommendations(
    query_embedding vector(768),
    p_user_id uuid DEFAULT NULL,
    p_user_major text DEFAULT '',
    p_user_interests text[] DEFAULT '{}'::text[],
    p_weight_semantic double precision DEFAULT 0.8,
    p_weight_rule double precision DEFAULT 0.2,
    p_threshold double precision DEFAULT 0.5,
    match_count integer DEFAULT 10
)
RETURNS TABLE(
    id uuid,
    title text,
    slug text,
    description text,
    organizer_id uuid,
    organizer_name text,
    category text,
    tags text[],
    target_majors text[],
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    image_url text,
    status event_status,
    created_at timestamp with time zone,
    vector_score double precision,
    major_score double precision,
    tag_score double precision,
    rule_score double precision,
    total_score double precision
) AS $$
BEGIN
    RETURN QUERY
    WITH scored_events AS (
        SELECT
            e.id AS ev_id,
            e.title AS ev_title,
            e.slug AS ev_slug,
            e.description AS ev_desc,
            e.organizer_id AS ev_org_id,
            e.organizer_name AS ev_org_name,
            e.category AS ev_cat,
            e.tags AS ev_tags,
            e.target_majors AS ev_majors,
            e.start_date AS ev_start,
            e.end_date AS ev_end,
            e.image_url AS ev_img,
            e.status AS ev_status,
            e.created_at AS ev_created,
            -- 1) Skor Vektor Semantik (Cosine Similarity)
            -- 1 - (embedding <=> query_embedding) mengubah cosine distance menjadi cosine similarity [0, 1]
            (1 - (e.embedding <=> query_embedding))::double precision AS v_score,

            -- 2) Skor Jurusan (Rule 1)
            -- Bernilai 1.0 jika major user ada di list target_majors, atau list target_majors berisi 'Umum', selain itu 0.0
            (CASE
                WHEN p_user_major = '' THEN 0.0
                WHEN 'Umum' = ANY(e.target_majors) THEN 1.0
                WHEN p_user_major = ANY(e.target_majors) THEN 1.0
                ELSE 0.0
             END)::double precision AS m_score,

            -- 3) Skor Tag (Rule 2)
            -- Menghitung irisan antara tags event dengan tag minat user (taxonomy child), di-normalisasi
            (CASE
                WHEN array_length(e.tags, 1) IS NULL OR array_length(p_user_interests, 1) IS NULL THEN 0.0
                ELSE LEAST(
                    (SELECT count(*)::double precision
                     FROM unnest(e.tags) x
                     WHERE x = ANY(p_user_interests)) / 3.0,
                    1.0
                )
             END)::double precision AS t_score
        FROM public.events e
        WHERE e.status = 'published'::event_status
          AND e.end_date >= now()
    )
    SELECT
        ev_id,
        ev_title,
        ev_slug,
        ev_desc,
        ev_org_id,
        ev_org_name,
        ev_cat,
        ev_tags,
        ev_majors,
        ev_start,
        ev_end,
        ev_img,
        ev_status,
        ev_created,
        v_score AS vector_score,
        m_score AS major_score,
        t_score AS tag_score,
        -- Rule Score merupakan rata-rata dari major_score dan tag_score
        (m_score * 0.5 + t_score * 0.5) AS rule_score,
        -- Total Score = (Semantic * Alpha) + (Rule * Beta)
        (v_score * p_weight_semantic + (m_score * 0.5 + t_score * 0.5) * p_weight_rule) AS total_score
    FROM scored_events
    WHERE v_score >= p_threshold
    ORDER BY total_score DESC, ev_created DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. RPC: evaluate_recommendations (Untuk Halaman Uji Algoritma)
-- Cara kerja mirip dengan get_hybrid_recommendations tetapi menonaktifkan threshold (threshold = 0.0)
-- dan mengambil data untuk evaluasi metrik Precision/Recall yang tidak terbatasi filter ketat.
CREATE OR REPLACE FUNCTION public.evaluate_recommendations(
    query_embedding vector(768),
    p_user_id uuid,
    p_user_major text,
    p_user_interests text[],
    p_weight_semantic double precision,
    p_weight_rule double precision,
    p_threshold double precision DEFAULT 0.0,
    match_count integer DEFAULT 50
)
RETURNS TABLE(
    id uuid,
    title text,
    category text,
    tags text[],
    target_majors text[],
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    vector_score double precision,
    major_score double precision,
    tag_score double precision,
    rule_score double precision,
    total_score double precision
) AS $$
BEGIN
    RETURN QUERY
    WITH scored_events AS (
        SELECT
            e.id AS ev_id,
            e.title AS ev_title,
            e.category AS ev_cat,
            e.tags AS ev_tags,
            e.target_majors AS ev_majors,
            e.start_date AS ev_start,
            e.end_date AS ev_end,
            (1 - (e.embedding <=> query_embedding))::double precision AS v_score,
            (CASE
                WHEN p_user_major = '' THEN 0.0
                WHEN 'Umum' = ANY(e.target_majors) THEN 1.0
                WHEN p_user_major = ANY(e.target_majors) THEN 1.0
                ELSE 0.0
             END)::double precision AS m_score,
            (CASE
                WHEN array_length(e.tags, 1) IS NULL OR array_length(p_user_interests, 1) IS NULL THEN 0.0
                ELSE LEAST(
                    (SELECT count(*)::double precision
                     FROM unnest(e.tags) x
                     WHERE x = ANY(p_user_interests)) / 3.0,
                    1.0
                )
             END)::double precision AS t_score
        FROM public.events e
        WHERE e.status = 'published'::event_status
          AND e.end_date >= now()
    )
    SELECT
        ev_id,
        ev_title,
        ev_cat,
        ev_tags,
        ev_majors,
        ev_start,
        ev_end,
        v_score AS vector_score,
        m_score AS major_score,
        t_score AS tag_score,
        (m_score * 0.5 + t_score * 0.5) AS rule_score,
        (v_score * p_weight_semantic + (m_score * 0.5 + t_score * 0.5) * p_weight_rule) AS total_score
    FROM scored_events
    WHERE v_score >= p_threshold
    ORDER BY total_score DESC, ev_start ASC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Panduan Pengujian Algoritma

EventSika menyertakan fungsionalitas pengujian internal untuk membantu pengembang dan akademisi mengevaluasi akurasi sistem rekomendasi hybrid.

### 1. Pengujian Langsung per Pengguna

Gunakan fungsi `runRecommendationTest(userId, alpha, beta)` di Server Action untuk mensimulasikan hasil rekomendasi bagi pengguna tertentu dengan parameter bobot khusus. Anda dapat memicu ini melalui UI panel Admin/Pengujian.

### 2. Ekspor Rekomendasi Massal (Bulk Export)

Panggil fungsi `bulkExportRecommendations()` untuk:

- Memindai seluruh profil mahasiswa aktif di sistem.
- Menghitung representasi vektor minat (_interest vector_) mereka menggunakan Hugging Face.
- Mengeksekusi pencarian rekomendasi hybrid untuk 5 skenario pembobotan (S1 hingga S5):
  - **S1 (Alpha 1.0 : Beta 0.0)**: Murni Semantik AI.
  - **S2 (Alpha 0.8 : Beta 0.2)**: Dominan Semantik AI.
  - **S3 (Alpha 0.5 : Beta 0.5)**: Seimbang (50% Semantik, 50% Aturan).
  - **S4 (Alpha 0.2 : Beta 0.8)**: Dominan Aturan Heuristik.
  - **S5 (Alpha 0.0 : Beta 1.0)**: Murni Aturan Heuristik (Tanpa AI).
- Menyusun baris rekomendasi ke format CSV terstruktur yang siap diunduh untuk kalkulasi metrik Precision, Recall, F1, dan MAP secara eksternal.
