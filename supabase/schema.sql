-- ==============================================================================
-- JokiTugasKu v2 — Complete Supabase PostgreSQL Database Schema
-- Run this script inside the Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN_OPERATOR', 'WORKER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM (
        'NEW',
        'ASSIGNED',
        'IN_PROGRESS',
        'REVIEW',
        'REVISION',
        'APPROVED',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. PROFILES / USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'WORKER',
    phone VARCHAR(50),
    specialization VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. TASKS MANAGEMENT TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    service_title VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    brief TEXT NOT NULL,
    deadline VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'NORMAL',
    status task_status NOT NULL DEFAULT 'NEW',
    price VARCHAR(100) NOT NULL DEFAULT 'Rp 0',
    worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    worker_name VARCHAR(255),
    worker_email VARCHAR(255),
    revision_count INTEGER NOT NULL DEFAULT 0,
    result_file_url TEXT,
    submission_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. TASK SUBMISSIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    worker_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. CRM WHATSAPP LEADS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wa VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    service VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL DEFAULT 'Website',
    status lead_status NOT NULL DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. BLOG & ACADEMIC ARTICLES (CMS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    read_time VARCHAR(50) NOT NULL DEFAULT '5 menit baca',
    date VARCHAR(50) NOT NULL,
    content_markdown TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. GLOBAL APP SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default Site Settings
INSERT INTO public.settings (key, value)
VALUES (
    'app_settings',
    '{
        "whatsappNumber": "62895320603421",
        "whatsappDisplay": "0895-3206-03421",
        "operatingHours": "Setiap Hari: 08.00 - 23.00 WIB (Fast Response)",
        "contactEmail": "halo@jokitugasku.id",
        "groqApiKey": "",
        "groqDefaultModel": "llama-3.3-70b-versatile",
        "groqTemperature": 0.7,
        "groqMaxTokens": 3500,
        "emailProvider": "resend",
        "resendApiKey": "",
        "resendSenderEmail": "notifikasi@jokitugasku.id",
        "resendSenderName": "JokiTugasKu Official",
        "brevoApiKey": "",
        "sendWelcomeWorkerEmail": true,
        "sendTaskAssignedEmail": true,
        "sendArticlePublishedEmail": false
    }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- 9. SEED INITIAL REAL ARTICLES
-- ==============================================================================
INSERT INTO public.articles (slug, title, excerpt, category, read_time, date, content_markdown, tags, faqs, status)
VALUES 
(
    'panduan-format-makalah-apa-style',
    'Panduan Praktis Format Sitasi APA Style 7th Edition untuk Makalah Kuliah',
    'Pelajari aturan penulisan sitasi kutipan langsung, tidak langsung, dan daftar pustaka jurnal ilmiah sesuai standar internasional APA edisi ke-7.',
    'Panduan Makalah',
    '4 menit baca',
    '15 Agustus 2026',
    '## Pengantar Sitasi APA Style Edisi ke-7\n\nFormat sitasi *American Psychological Association* (APA) edisi ke-7 merupakan standar paling luas yang digunakan di perguruan tinggi Indonesia untuk penulisan karya ilmiah, makalah, tesis, dan skripsi di rumpun ilmu sosial, humaniora, manajemen, dan pendidikan.\n\n---\n\n## 1. Format Kutipan dalam Teks (In-Text Citation)\n\nDalam APA Style 7th Edition, sitasi dalam teks menggunakan format **Penulis-Tahun**:\n\n- **Kutipan Tidak Langsung (Parafrase):**\n  > Menurut Raharjo (2024), penerapan tata kelola berbasis digital meningkatkan efisiensi operasional hingga 35%.\n\n- **Kutipan dengan Dua Penulis:**\n  > (Santoso & Hidayat, 2023)\n\n- **Kutipan dengan Tiga atau Lebih Penulis:**\n  > Gunakan nama penulis pertama diikuti *et al.* sejak penyebutan pertama: (Prasetyo et al., 2024).\n\n---\n\n## 2. Aturan Penyusunan Daftar Pustaka\n\nSetiap sumber yang disitasi dalam tubuh teks wajib dicantumkan dalam daftar pustaka dengan format gantung (*hanging indent* 0.5 inci):\n\n### Contoh Jurnal Ilmiah dengan DOI:\nPrasetyo, B., Utami, D. R., & Wibowo, A. (2024). *Analisis dampak kecerdasan buatan terhadap efektivitas pembelajaran mahasiswa*. Jurnal Pendidikan Tinggi Indonesia, 12(2), 145–158. https://doi.org/10.1234/jpti.v12i2.567\n\n---\n\n## Kesimpulan\n\nKerapian sitasi dan daftar pustaka menjadi poin krusial dalam penilaian akademis. Tim **JokiTugasKu** menyediakan asistensi perapian sitasi menggunakan software otomatis seperti Mendeley dan Zotero.',
    '["APA 7th Edition", "Karya Tulis Ilmiah", "Makalah Kuliah", "Daftar Pustaka"]'::jsonb,
    '[{"question": "Apakah JokiTugasKu mendukung format sitasi selain APA Style?", "answer": "Ya, kami mendukung seluruh format sitasi akademik termasuk IEEE, Harvard, Chicago/Turabian, dan Vancouver."}]'::jsonb,
    'PUBLISHED'
),
(
    'cara-menyusun-laporan-pkl-yang-rapi',
    'Struktur Baku Penyusunan Laporan PKL & Magang MBKM agar Cepat Disetujui Dosen',
    'Rangkuman kerangka Bab I profil instansi hingga Bab IV penutup, termasuk penulisan logbook aktivitas harian yang sistematis.',
    'Laporan PKL',
    '6 menit baca',
    '10 Agustus 2026',
    '## Menuntaskan Laporan PKL & Magang Tepat Waktu\n\nLaporan Praktik Kerja Lapangan (PKL) atau Magang Bersertifikat Kampus Merdeka (MBKM) adalah dokumen pertanggungjawaban akademis yang merekam seluruh kontribusi dan pembelajaran Anda di dunia industri.\n\n---\n\n## Kerangka Sistematika Bab Laporan PKL\n\n1. **Bagian Awal**: Halaman Judul, Lembar Pengesahan Pembimbing Lapangan & Dosen, Kata Pengantar, Daftar Isi.\n2. **BAB I Pendahuluan**: Latar belakang pemilihan tempat PKL, tujuan magang, dan manfaat bagi mahasiswa serta instansi.\n3. **BAB II Gambaran Umum Perusahaan**: Sejarah singkat, visi misi, struktur organisasi, dan deskripsi divisi kerja.\n4. **BAB III Pelaksanaan Praktik Kerja**: Deskripsi proyek utama, analisis kendala teknis, dan solusi inovatif yang diimplementasikan.\n5. **BAB IV Penutup**: Kesimpulan capaian kompetensi dan saran konstruktif untuk instansi.',
    '["Laporan PKL", "Magang MBKM", "Kerja Praktik", "Format Laporan"]'::jsonb,
    '[]'::jsonb,
    'PUBLISHED'
),
(
    'tips-presentasi-sidang-skripsi-anti-gugup',
    '7 Tips Mendesain Slide Presentasi Sidang Skripsi yang Bersih dan Terfokus',
    'Cara meringkas naskah tebal skripsi ke dalam 20 slide efektif dengan teknik visual storytelling dan penempatan poin penting.',
    'Presentasi & PPT',
    '5 menit baca',
    '05 Agustus 2026',
    '## Membuat Slide Sidang Skripsi yang Memikat Penguji\n\nBanyak mahasiswa melakukan kesalahan dengan menumpuk paragraf panjang ke dalam slide PowerPoint. Kunci kelulusan presentasi sidang adalah **kejelasan visual dan penguasaan materi**.\n\n---\n\n## 7 Aturan Utama Desain PPT Sidang\n1. **Satu Ide per Slide**: Jangan campur latar belakang dengan metodologi dalam satu halaman.\n2. **Prinsip 6x6**: Maksimal 6 baris teks per slide, dan maksimal 6 kata per baris.\n3. **Visualisasi Data**: Gunakan grafik batang atau diagram alur untuk menggantikan tabel data mentah.\n4. **Warna Kontras Profesional**: Gunakan palet 2-3 warna (misal: Navy Blue, Deep Violet, Putih).\n5. **Animasi Minimalis**: Hindari transisi berlebihan yang memperlambat perpindahan slide.\n6. **Sertakan Speaker Notes**: Catat poin penting yang akan diucapkan secara lisan.\n7. **Siapkan Backup Slide**: Buat 3-5 slide lampiran untuk menjawab potensi pertanyaan teknis dosen.',
    '["PPT Sidang", "Skripsi", "Slide Presentasi", "Desain PPT"]'::jsonb,
    '[]'::jsonb,
    'PUBLISHED'
)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view published articles" ON public.articles
    FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Public can view and manage app settings" ON public.settings
    FOR ALL USING (true) WITH CHECK (true);

-- Authenticated & Anon Access for Public Website Lead Submission
CREATE POLICY "Public can insert leads" ON public.crm_leads
    FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies (Authenticated & Anon for decoupled app access)
CREATE POLICY "Full access for authenticated users to profiles" ON public.profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access for authenticated users to tasks" ON public.tasks
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access for authenticated users to submissions" ON public.task_submissions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access for authenticated users to leads" ON public.crm_leads
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Full access for authenticated users to articles" ON public.articles
    FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 11. AUTOMATIC REALTIME PUBLICATION
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
