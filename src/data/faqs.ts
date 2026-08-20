export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'order' | 'pricing' | 'process' | 'security';
}

export const faqsData: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'order',
    question: 'Bagaimana cara memesan layanan di JokiTugasKu?',
    answer: 'Pemesanan sangat mudah dan langsung dilakukan melalui WhatsApp Business kami. Anda cukup memilih layanan yang dibutuhkan, mengklik tombol Chat WhatsApp, lalu mengirimkan file panduan tugas, petunjuk dosen/guru, dan deadline yang diinginkan.'
  },
  {
    id: 'faq-2',
    category: 'order',
    question: 'Apakah saya bisa berkonsultasi terlebih dahulu sebelum memesan?',
    answer: 'Tentu saja. Konsultasi awal melalui WhatsApp bersifat gratis dan tanpa komitmen. Anda bisa berdiskusi mengenai topik, tingkat kesulitan, ketersediaan bahan materi, serta estimasi waktu sebelum menyepakati pengerjaan.'
  },
  {
    id: 'faq-3',
    category: 'pricing',
    question: 'Berapa biaya / harga joki tugas kuliah, joki paper, dan tugas sekolah?',
    answer: 'Biaya joki tugas di JokiTugasKu sangat terjangkau mulai dari Rp 30.000 untuk tugas sekolah/rangkuman dasar, Rp 75.000 untuk paper & makalah kuliah, hingga Rp 150.000+ untuk laporan PKL/magang dan proposal. Harga final disepakati di awal secara transparan tanpa biaya tersembunyi.'
  },
  {
    id: 'faq-4',
    category: 'process',
    question: 'Apakah JokiTugasKu melayani pengerjaan joki laporan PKL dan laporan magang MBKM?',
    answer: 'Ya, kami melayani penyusunan joki laporan PKL (Praktik Kerja Lapangan), Kerja Praktik (KP), dan Laporan Magang MBKM lengkap dari Bab I Pendahuluan, profil instansi, rekap logbook harian/mingguan, hingga pembahasan proyek dan lembar pengesahan.'
  },
  {
    id: 'faq-5',
    category: 'process',
    question: 'Bagaimana ketentuan dan proses garansi revisi tugas?',
    answer: 'Kami menyediakan garansi revisi gratis sesuai dengan ruang lingkup dan instruksi awal yang telah disepakati bersama. Jika terdapat bagian yang belum sesuai dengan panduan awal tugas atau masukan dosen, Anda dapat mengajukan perbaikan melalui WhatsApp dengan menyertakan poin catatan revisi.'
  },
  {
    id: 'faq-6',
    category: 'process',
    question: 'Bagaimana cara mengirimkan materi atau file tugas?',
    answer: 'Semua file seperti berkas soal, modul, materi rujukan, pedoman format kampus, atau data mentah dapat dikirimkan langsung melalui lampiran chat WhatsApp (format Word, PDF, PPT, Excel, atau tautan Google Drive).'
  },
  {
    id: 'faq-7',
    category: 'process',
    question: 'Berapa lama estimasi waktu pengerjaan tugas?',
    answer: 'Estimasi waktu disesuaikan dengan jenis tugas: untuk tugas umum dan PPT berkisar antara 6 - 24 jam; untuk makalah, paper, laporan praktikum, dan proposal berkisar antara 1 - 3 hari; sedangkan untuk skripsi dan laporan PKL disesuaikan dengan jadwal bimbingan Anda. Kami juga melayani pengerjaan kilat/urgent.'
  },
  {
    id: 'faq-8',
    category: 'security',
    question: 'Apakah kerahasiaan identitas dan data tugas saya terjamin?',
    answer: 'Privasi klien adalah prioritas utama kami. Semua file, identitas personal, nama kampus/sekolah, dan hasil pengerjaan dijaga dengan standar kerahasiaan ketat dan tidak dipublikasikan ke pihak ketiga mana pun.'
  }
];
