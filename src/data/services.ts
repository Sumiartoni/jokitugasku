export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  badge?: string;
  targetAudience: string;
  estimatedTime: string;
  deliverables: string[];
  scopeExamples: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'joki-tugas',
    slug: 'joki-tugas',
    title: 'Joki Tugas Umum',
    shortDesc: 'Bantuan pengerjaan aneka tugas sekolah & mata pelajaran umum dengan format rapi dan tepat waktu.',
    longDesc: 'Layanan pengerjaan tugas umum untuk tingkat sekolah maupun tugas dasar. Kami membantu mengerjakan latihan soal, rangkuman, analisis studi kasus sederhana, hingga penulisan esai pendek sesuai instruksi guru atau pengajar.',
    iconName: 'BookOpen',
    badge: 'Populer',
    targetAudience: 'Siswa SMP, SMA/SMK, & Mahasiswa Tingkat Awal',
    estimatedTime: '6 - 24 Jam (fleksibel sesuai deadline)',
    deliverables: [
      'File format Word / PDF / Spreadsheet',
      'Pengerjaan bertahap sesuai petunjuk soal',
      'Format penulisan rapi & siap dikumpulkan',
      'Garansi revisi minor bila ada bagian terlewat'
    ],
    scopeExamples: [
      'Tugas esai & artikel analitis',
      'Pengerjaan studi kasus ringkas',
      'Rangkuman modul dan jurnal',
      'Latihan soal terstruktur & pembahasan'
    ]
  },
  {
    id: 'joki-tugas-kuliah',
    slug: 'joki-tugas-kuliah',
    title: 'Joki Tugas Kuliah',
    shortDesc: 'Penyelesaian tugas mata kuliah spesifik, telaah pustaka, analisis teori, dan paper akademik.',
    longDesc: 'Dukungan komprehensif untuk tugas mata kuliah berbagai jurusan, baik rumpun saintek, soshum, ekonomi, hukum, teknik, maupun kesehatan. Dikerjakan berdasarkan silabus, rubrik penilaian, dan referensi kredibel.',
    iconName: 'GraduationCap',
    badge: 'Prioritas Mahasiswa',
    targetAudience: 'Mahasiswa D3, D4, & S1 Semua Jurusan',
    estimatedTime: '1 - 3 Hari (Tersedia opsi kilat)',
    deliverables: [
      'Dokumen lengkap dengan sitasi standar (APA/IEEE/Harvard)',
      'Daftar pustaka dari jurnal ilmiah terindeks',
      'Kerapian tata bahasa sesuai PUEBI / Academic English',
      'Layanan revisi sesuai instruksi awal dosen'
    ],
    scopeExamples: [
      'Paper ilmiah & Critical Review Jurnal',
      'Analisis kasus manajemen & bisnis',
      'Tugas coding/pemrograman dasar & flowchart',
      'Tugas hukum, sosiologi, psikologi, dan komunikasi'
    ]
  },
  {
    id: 'joki-tugas-smk',
    slug: 'joki-tugas-smk',
    title: 'Joki Tugas SMK & Kejuruan',
    shortDesc: 'Bantuan tugas produktif kejuruan, laporan bengkel/lab, administrasi, coding, dan akuntansi SMK.',
    longDesc: 'Layanan khusus untuk siswa SMK berbagai jurusan: TKJ, RPL, Multimedia, Administrasi Perkantoran, Akuntansi, Otomotif, dan Tata Niaga. Membantu tugas teori kejuruan, pembuatan modul, laporan praktikum bengkel, dan tugas akhir sekolah.',
    iconName: 'Wrench',
    badge: 'Khusus SMK',
    targetAudience: 'Siswa SMK Kelas X, XI, & XII Semua Jurusan',
    estimatedTime: '6 - 24 Jam',
    deliverables: [
      'Format laporan teknis sesuai standar kejuruan',
      'Diagram alur / skema kerja terstruktur',
      'File Excel / Word / Source Code rapi',
      'Bimbingan pemahaman materi tugas'
    ],
    scopeExamples: [
      'Tugas pemrograman dasar & web HTML/PHP/Python',
      'Jurnal pembukuan & spreadsheet akuntansi SMK',
      'Laporan perawatan jaringan & konfigurasi dasar',
      'Modul korespondensi dan administrasi perkantoran'
    ]
  },
  {
    id: 'joki-tugas-sma',
    slug: 'joki-tugas-sma',
    title: 'Joki Tugas SMA (IPA / IPS)',
    shortDesc: 'Pengerjaan tugas mata pelajaran SMA: Matematika, Fisika, Kimia, Biologi, Sosiologi, Ekonomi, & Sejarah.',
    longDesc: 'Bantuan belajar dan penyelesaian tugas harian untuk siswa SMA jurusan IPA, IPS, maupun Kurikulum Merdeka. Meliputi pembahasan latihan soal, pembuatan karya tulis ilmiah remaja, rangkuman bab, hingga presentasi kelompok.',
    iconName: 'School',
    badge: 'Khusus SMA',
    targetAudience: 'Siswa SMA Kelas X, XI, & XII (IPA & IPS)',
    estimatedTime: '6 - 24 Jam',
    deliverables: [
      'Jawaban sistematis dengan langkah perhitungan lengkap',
      'Penjelasan runut pada setiap nomor soal',
      'Naskah esai/karya tulis berstandar sekolah',
      'File format DOCX / PDF siap cetak'
    ],
    scopeExamples: [
      'Latihan soal eksakta (Fisika, Kimia, Matematika)',
      'Esai analisis ekonomi, sosiologi, dan geografi',
      'Rangkuman materi persiapan ujian semester',
      'Karya Tulis Ilmiah (KTI) tingkat sekolah'
    ]
  },
  {
    id: 'joki-makalah',
    slug: 'joki-makalah',
    title: 'Joki Makalah',
    shortDesc: 'Penyusunan makalah akademik terstruktur lengkap: Bab 1 Pendahuluan hingga Bab 3/4 Penutup & Referensi.',
    longDesc: 'Penyusunan makalah lengkap dengan struktur standar karya tulis ilmiah. Mulai dari latar belakang, rumusan masalah, pembahasan berbasis teori mutakhir, kesimpulan, hingga sitasi jurnal nasional/internasional.',
    iconName: 'FileText',
    badge: 'Best Value',
    targetAudience: 'Mahasiswa & Pelajar',
    estimatedTime: '1 - 2 Hari',
    deliverables: [
      'File DOCX & PDF siap cetak',
      'Struktur Bab I sampai Bab III/IV lengkap',
      'Sitasi & Daftar Pustaka otomatis (Mendeley/Word Citations)',
      'Format margin, font, dan spasi sesuai pedoman kampus'
    ],
    scopeExamples: [
      'Makalah kelompok & individu',
      'Makalah tema Pendidikan Agama, Pancasila, & Kewarganegaraan',
      'Makalah studi literatur spesifik bidang ilmu',
      'Makalah komparasi kebijakan atau teknologi'
    ]
  },
  {
    id: 'joki-laporan',
    slug: 'joki-laporan',
    title: 'Joki Laporan Praktikum',
    shortDesc: 'Penyusunan laporan praktikum, laporan observasi, studi lapangan, dan laporan kegiatan resmi.',
    longDesc: 'Layanan olah data dan penulisan laporan praktikum laboratorium, laporan studi observasi, dan laporan kegiatan terstruktur. Disertai grafik, tabel data, interpretasi hasil, dan pembahasan mendalam.',
    iconName: 'ClipboardList',
    targetAudience: 'Mahasiswa Sains, Teknik, Farmasi, Komunikasi, dll.',
    estimatedTime: '1 - 2 Hari',
    deliverables: [
      'Laporan sistematis sesuai panduan praktikum/observasi',
      'Tabel hasil perhitungan, grafik, dan lampiran',
      'Pembahasan logis mengaitkan data dengan literatur rujukan',
      'File editable (.docx / .xlsx)'
    ],
    scopeExamples: [
      'Laporan praktikum fisika, kimia, biologi, komputasi',
      'Laporan studi lapangan & observasi UMKM',
      'Laporan project akhir semester mata kuliah',
      'Laporan evaluasi program kerja'
    ]
  },
  {
    id: 'joki-laporan-pkl',
    slug: 'joki-laporan-pkl',
    title: 'Joki Laporan PKL / Magang',
    shortDesc: 'Penyusunan laporan Praktik Kerja Lapangan (PKL), magang MBKM, dan kerja praktik sesuai template.',
    longDesc: 'Bantuan penyusunan laporan magang atau praktik kerja lapangan secara komprehensif. Meliputi profil instansi/perusahaan, deskripsi aktivitas mingguan, analisa kendala, perancangan solusi/project magang, dan rekomendasi penutup.',
    iconName: 'Briefcase',
    badge: 'Layanan Terlengkap',
    targetAudience: 'Siswa SMK & Mahasiswa Magang / MBKM',
    estimatedTime: '2 - 4 Hari',
    deliverables: [
      'Format laporan lengkap sesuai buku pedoman PKL kampus/sekolah',
      'Logbook & rangkuman kegiatan sistematis',
      'Studi kasus/project kerja yang diimplementasikan',
      'Lampiran dokumentasi dan berkas administratif'
    ],
    scopeExamples: [
      'Laporan Magang Bersertifikat Kampus Merdeka (MBKM)',
      'Laporan PKL SMK Administrasi Perkantoran, TKJ, RPL, Akuntansi',
      'Laporan Kerja Praktik (KP) Teknik & Sistem Informasi',
      'Laporan Magang Rumah Sakit / Instansi Pemerintahan'
    ]
  },
  {
    id: 'joki-proposal',
    slug: 'joki-proposal',
    title: 'Joki Proposal',
    shortDesc: 'Penyusunan proposal penelitian, proposal kegiatan, proposal program kreativitas mahasiswa (PKM).',
    longDesc: 'Penyusunan rancangan proposal sistematis dengan latar belakang berbobot, identifikasi masalah tajam, metodologi penelitian yang jelas, serta rencana anggaran biaya dan jadwal pelaksanaan terencana.',
    iconName: 'Lightbulb',
    targetAudience: 'Mahasiswa Skripsi Awal, Pengurus Organisasi, Peserta Hibah',
    estimatedTime: '2 - 4 Hari',
    deliverables: [
      'Proposal BAB 1 - 3 lengkap dengan metodologi',
      'Matriks kajian pustaka terdahulu yang relevan',
      'Instrumen pengumpulan data / kuesioner awal (bila dibutuhkan)',
      'Format proposal baku sesuai pedoman institusi'
    ],
    scopeExamples: [
      'Proposal Skripsi / Tugas Akhir (BAB I, II, III)',
      'Proposal Program Kreativitas Mahasiswa (PKM-RE, PKM-K, PKM-PM)',
      'Proposal Seminar dan Event Organisasi Mahasiswa',
      'Proposal Pengajuan Dana & Kerja Sama Sponsor'
    ]
  },
  {
    id: 'joki-ppt',
    slug: 'joki-ppt',
    title: 'Joki PPT & Slide Presentasi',
    shortDesc: 'Desain slide presentasi modern, visual menarik, ringkas, dan persuasif untuk sidang atau kuliah.',
    longDesc: 'Pembuatan materi slide presentasi yang estetis, tidak padat teks berlebihan, dan mudah dipresentasikan. Menggunakan visualisasi diagram, icon elegan, dan perataan tata letak profesional di PowerPoint atau Canva.',
    iconName: 'Presentation',
    badge: 'Desain Estetik',
    targetAudience: 'Mahasiswa Sidang, Presenter Kuliah, & Pemateri Seminar',
    estimatedTime: '6 - 24 Jam',
    deliverables: [
      'File master PPTX + PDF',
      'Desain custom dengan palet warna harmonis',
      'Penyusunan poin-poin intisari penting per slide',
      'Speaker notes ringkas untuk memudahkan presentasi (opsional)'
    ],
    scopeExamples: [
      'PPT Sidang Skripsi / Sempro / Seminar Hasil',
      'PPT Presentasi Kelompok Mata Kuliah',
      'Pitch Deck Ide Bisnis & Startup',
      'PPT Infografis Laporan PKL'
    ]
  },
  {
    id: 'joki-skripsi',
    slug: 'joki-skripsi',
    title: 'Bimbingan & Olah Data Skripsi',
    shortDesc: 'Pendampingan penulisan bab skripsi, olah data statistik (SPSS/SmartPLS), dan perapian format naskah.',
    longDesc: 'Layanan pendampingan dan asistensi teknis pengerjaan skripsi/tugas akhir. Kami membantu olah data kuantitatif/kualitatif, penelusuran referensi internasional, formatting layout skripsi sesuai buku panduan, dan pengecekan kerapian naskah.',
    iconName: 'Award',
    badge: 'Asistensi Intensif',
    targetAudience: 'Mahasiswa Tingkat Akhir S1 / D4',
    estimatedTime: 'Sesuai kesepakatan target bab & timeline',
    deliverables: [
      'Pendampingan penyusunan Bab per Bab terstruktur',
      'Output olah data statistik beserta interpretasi tabulasi',
      'Formatting otomatis daftar isi, daftar tabel, nomor halaman romawi/arab',
      'Konsultasi intensif via WhatsApp selama proses bimbingan'
    ],
    scopeExamples: [
      'Olah data statistik SPSS, SEM-PLS, SmartPLS, EViews',
      'Penyusunan bab pembahasan hasil temuan penelitian',
      'Perapian format buku skripsi siap uji dan cetak',
      'Penyusunan artikel jurnal berbasis skripsi'
    ]
  }
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return servicesData.find((s) => s.slug === slug);
}
