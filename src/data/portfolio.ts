export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  discipline: string;
  summary: string;
  formatDeliverable: string;
  keyHighlights: string[];
}

export const portfolioData: PortfolioItem[] = [
  {
    id: 'sample-1',
    title: 'Paper Telaah Literatur: Dampak AI Terhadap Manajemen Rantai Pasok',
    category: 'Makalah & Paper',
    discipline: 'Manajemen / Bisnis',
    summary: 'Penulisan paper analitis 18 halaman dengan 22 referensi jurnal internasional Scopus/Sinta, sitasi APA 7th edition, dan matriks komparasi studi kasus.',
    formatDeliverable: 'DOCX + PDF + Reference Library',
    keyHighlights: ['Format APA Style', '20+ Sitasi Jurnal', 'Plagiarism-safe structure']
  },
  {
    id: 'sample-2',
    title: 'Slide Presentasi Sidang Skripsi: Model Klasifikasi Random Forest',
    category: 'Presentasi PPT',
    discipline: 'Teknik Informatika',
    summary: 'Desain deck 24 slide dengan tema visual modern Signal Dark & Violet, visualisasi diagram arsitektur data, dan ringkasan metrik akurasi confusion matrix.',
    formatDeliverable: 'PPTX Editable + PDF Handout',
    keyHighlights: ['Clean Data Visualization', 'Desain Modern Non-template', 'Speaker Notes']
  },
  {
    id: 'sample-3',
    title: 'Laporan Praktikum: Analisis Kinetika Enzim Katalase',
    category: 'Laporan Praktikum',
    discipline: 'Biokimia / Farmasi',
    summary: 'Penyusunan laporan lengkap dengan input kurva kalibrasi spektrofotometer, tabel regresi linier di Excel, dan pembahasan mendalam terkait pengaruh pH dan temperatur.',
    formatDeliverable: 'DOCX + Spreadsheet Raw Data',
    keyHighlights: ['Tabel Perhitungan Lengkap', 'Grafik Terkalibrasi', 'Pembahasan Ilmiah']
  },
  {
    id: 'sample-4',
    title: 'Proposal Penelitian: Strategi Komunikasi Pemasaran Digital Brand Lokal',
    category: 'Proposal Skripsi',
    discipline: 'Ilmu Komunikasi',
    summary: 'Penyusunan BAB 1 sampai BAB 3 dengan kerangka teori AIDDA, rancangan instrumen wawancara mendalam kualitatif, serta pedoman observasi lapangan.',
    formatDeliverable: 'DOCX + Rancangan Pedoman Wawancara',
    keyHighlights: ['BAB 1-3 Komprehensif', 'Kerangka Pemikiran Jelas', 'Pedoman Wawancara']
  },
  {
    id: 'sample-5',
    title: 'Laporan PKL Magang: Analisis Efisiensi Sistem Pembukuan Kas',
    category: 'Laporan PKL',
    discipline: 'Akuntansi & Perpajakan',
    summary: 'Laporan akhir praktik kerja lapangan 45 halaman dengan logbook harian 60 hari kerja, alur rekonsiliasi bank, dan rekomendasi perbaikan SOP kantor.',
    formatDeliverable: 'DOCX Sesuai Buku Pedoman Kampus',
    keyHighlights: ['Format Resmi Institusi', 'Logbook Terverifikasi', 'Lampiran Lengkap']
  },
  {
    id: 'sample-6',
    title: 'Olah Data Statistik & Output Analisis Regresi Berganda SPSS',
    category: 'Olah Data & Skripsi',
    discipline: 'Ekonomi Pembangunan',
    summary: 'Pengujian uji asumsi klasik (normalitas, multikolinearitas, heteroskedastisitas, autokorelasi) beserta interpretasi uji F, uji t, dan koefisien determinasi R-Square.',
    formatDeliverable: 'SPSS Output (.spv) + DOCX Interpretasi',
    keyHighlights: ['Uji Asumsi Lengkap', 'Interpretasi Rinci', 'File Output Terlampir']
  }
];

export const portfolioCategories = [
  'Semua',
  'Makalah & Paper',
  'Presentasi PPT',
  'Laporan Praktikum',
  'Proposal Skripsi',
  'Laporan PKL',
  'Olah Data & Skripsi'
];
