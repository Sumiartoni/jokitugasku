import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  tags: string[];
  contentMarkdown: string;
  faqs?: Array<{ question: string; answer: string }>;
  status: 'PUBLISHED' | 'DRAFT';
}

export const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'art-001',
    slug: 'panduan-format-makalah-apa-style',
    title: 'Panduan Praktis Format Sitasi APA Style 7th Edition untuk Makalah Kuliah',
    excerpt: 'Pelajari aturan penulisan sitasi kutipan langsung, tidak langsung, dan daftar pustaka jurnal ilmiah sesuai standar internasional APA edisi ke-7.',
    category: 'Panduan Makalah',
    readTime: '4 menit baca',
    date: '15 Agustus 2026',
    tags: ['APA 7th Edition', 'Karya Tulis Ilmiah', 'Makalah Kuliah', 'Daftar Pustaka'],
    contentMarkdown: `## Pengantar Sitasi APA Style Edisi ke-7

Format sitasi *American Psychological Association* (APA) edisi ke-7 merupakan standar paling luas yang digunakan di perguruan tinggi Indonesia untuk penulisan karya ilmiah, makalah, tesis, dan skripsi di rumpun ilmu sosial, humaniora, manajemen, dan pendidikan.

---

## 1. Format Kutipan dalam Teks (In-Text Citation)

Dalam APA Style 7th Edition, sitasi dalam teks menggunakan format **Penulis-Tahun**:

- **Kutipan Tidak Langsung (Parafrase):**
  > Menurut Raharjo (2024), penerapan tata kelola berbasis digital meningkatkan efisiensi operasional hingga 35%.

- **Kutipan dengan Dua Penulis:**
  > (Santoso & Hidayat, 2023)

- **Kutipan dengan Tiga atau Lebih Penulis:**
  > Gunakan nama penulis pertama diikuti *et al.* sejak penyebutan pertama: (Prasetyo et al., 2024).

---

## 2. Aturan Penyusunan Daftar Pustaka

Setiap sumber yang disitasi dalam tubuh teks wajib dicantumkan dalam daftar pustaka dengan format gantung (*hanging indent* 0.5 inci):

### Contoh Jurnal Ilmiah dengan DOI:
Prasetyo, B., Utami, D. R., & Wibowo, A. (2024). *Analisis dampak kecerdasan buatan terhadap efektivitas pembelajaran mahasiswa*. Jurnal Pendidikan Tinggi Indonesia, 12(2), 145–158. https://doi.org/10.1234/jpti.v12i2.567

---

## Kesimpulan

Kerapian sitasi dan daftar pustaka menjadi poin krusial dalam penilaian akademis. Tim **JokiTugasKu** menyediakan asistensi perapian sitasi menggunakan software otomatis seperti Mendeley dan Zotero.`,
    faqs: [
      {
        question: 'Apakah JokiTugasKu mendukung format sitasi selain APA Style?',
        answer: 'Ya, kami mendukung seluruh format sitasi akademik termasuk IEEE, Harvard, Chicago/Turabian, dan Vancouver.'
      }
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'art-002',
    slug: 'cara-menyusun-laporan-pkl-yang-rapi',
    title: 'Struktur Baku Penyusunan Laporan PKL & Magang MBKM agar Cepat Disetujui Dosen',
    excerpt: 'Rangkuman kerangka Bab I profil instansi hingga Bab IV penutup, termasuk penulisan logbook aktivitas harian yang sistematis.',
    category: 'Laporan PKL',
    readTime: '6 menit baca',
    date: '10 Agustus 2026',
    tags: ['Laporan PKL', 'Magang MBKM', 'Kerja Praktik', 'Format Laporan'],
    contentMarkdown: `## Menuntaskan Laporan PKL & Magang Tepat Waktu

Laporan Praktik Kerja Lapangan (PKL) atau Magang Bersertifikat Kampus Merdeka (MBKM) adalah dokumen pertanggungjawaban akademis yang merekam seluruh kontribusi dan pembelajaran Anda di dunia industri.

---

## Kerangka Sistematika Bab Laporan PKL

1. **Bagian Awal**: Halaman Judul, Lembar Pengesahan Pembimbing Lapangan & Dosen, Kata Pengantar, Daftar Isi.
2. **BAB I Pendahuluan**: Latar belakang pemilihan tempat PKL, tujuan magang, dan manfaat bagi mahasiswa serta instansi.
3. **BAB II Gambaran Umum Perusahaan**: Sejarah singkat, visi misi, struktur organisasi, dan deskripsi divisi kerja.
4. **BAB III Pelaksanaan Praktik Kerja**: Deskripsi proyek utama, analisis kendala teknis, dan solusi inovatif yang diimplementasikan.
5. **BAB IV Penutup**: Kesimpulan capaian kompetensi dan saran konstruktif untuk instansi.`,
    status: 'PUBLISHED'
  },
  {
    id: 'art-003',
    slug: 'tips-presentasi-sidang-skripsi-anti-gugup',
    title: '7 Tips Mendesain Slide Presentasi Sidang Skripsi yang Bersih dan Terfokus',
    excerpt: 'Cara meringkas naskah tebal skripsi ke dalam 20 slide efektif dengan teknik visual storytelling dan penempatan poin penting.',
    category: 'Presentasi & PPT',
    readTime: '5 menit baca',
    date: '05 Agustus 2026',
    tags: ['PPT Sidang', 'Skripsi', 'Slide Presentasi', 'Desain PPT'],
    contentMarkdown: `## Membuat Slide Sidang Skripsi yang Memikat Penguji

Banyak mahasiswa melakukan kesalahan dengan menumpuk paragraf panjang ke dalam slide PowerPoint. Kunci kelulusan presentasi sidang adalah **kejelasan visual dan penguasaan materi**.

---

## 7 Aturan Utama Desain PPT Sidang
1. **Satu Ide per Slide**: Jangan campur latar belakang dengan metodologi dalam satu halaman.
2. **Prinsip 6x6**: Maksimal 6 baris teks per slide, dan maksimal 6 kata per baris.
3. **Visualisasi Data**: Gunakan grafik batang atau diagram alur untuk menggantikan tabel data mentah.
4. **Warna Kontras Profesional**: Gunakan palet 2-3 warna (misal: Navy Blue, Deep Violet, Putih).
5. **Animasi Minimalis**: Hindari transisi berlebihan yang memperlambat perpindahan slide.
6. **Sertakan Speaker Notes**: Catat poin penting yang akan diucapkan secara lisan.
7. **Siapkan Backup Slide**: Buat 3-5 slide lampiran untuk menjawab potensi pertanyaan teknis dosen.`,
    status: 'PUBLISHED'
  }
];

let _cachedArticles: ArticleItem[] = DEFAULT_ARTICLES;

function mapSupabaseRow(row: any): ArticleItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    readTime: row.read_time || '5 menit baca',
    date: row.date || new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    tags: Array.isArray(row.tags) ? row.tags : [],
    contentMarkdown: row.content_markdown,
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    status: row.status || 'PUBLISHED'
  };
}

/**
 * Fetch published articles directly from Supabase
 */
export async function fetchPublishedArticles(): Promise<ArticleItem[]> {
  try {
    if (!isSupabaseConfigured || !supabase) return _cachedArticles;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return _cachedArticles;
    }

    _cachedArticles = data.map(mapSupabaseRow);
    return _cachedArticles;
  } catch {
    return _cachedArticles;
  }
}

export function getAllArticles(): ArticleItem[] {
  return _cachedArticles;
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleItem | undefined> {
  // 1. Check in-memory cache
  const foundInCache = _cachedArticles.find(a => a.slug === slug || a.id === slug);
  if (foundInCache) return foundInCache;

  // 2. Fetch from Supabase
  try {
    if (!isSupabaseConfigured || !supabase) return foundInCache;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return foundInCache;

    const item = mapSupabaseRow(data);
    _cachedArticles = [item, ..._cachedArticles.filter(a => a.slug !== item.slug)];
    return item;
  } catch {
    return foundInCache;
  }
}

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return _cachedArticles.find(a => a.slug === slug || a.id === slug);
}
