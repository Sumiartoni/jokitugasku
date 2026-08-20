export interface OrderStep {
  stepNumber: string;
  title: string;
  description: string;
  iconName: string;
  highlight: string;
}

export const orderStepsData: OrderStep[] = [
  {
    stepNumber: '01',
    title: 'Pilih Layanan & Kebutuhan',
    description: 'Tentukan jenis bantuan tugas yang Anda perlukan (tugas harian, makalah, laporan, PPT, proposal, atau skripsi).',
    iconName: 'ListChecks',
    highlight: 'Pilih kategori yang sesuai'
  },
  {
    stepNumber: '02',
    title: 'Hubungi WhatsApp Kami',
    description: 'Klik tombol WhatsApp di website untuk langsung terhubung dengan admin tanpa perlu registrasi akun berbelit.',
    iconName: 'MessageCircle',
    highlight: 'Chat langsung via WA'
  },
  {
    stepNumber: '03',
    title: 'Kirim Detail & Sepakati Ketentuan',
    description: 'Kirimkan instruksi tugas, file panduan/silabus, dan deadline. Admin akan mengonfirmasi estimasi biaya dan waktu.',
    iconName: 'FileSpreadsheet',
    highlight: 'Transparan sebelum mulai'
  },
  {
    stepNumber: '04',
    title: 'Pengerjaan & Pengiriman Hasil',
    description: 'Tugas dikerjakan secara cermat dan rapi. File hasil akhir dikirim tepat waktu via WhatsApp dengan opsi revisi sesuai kesepakatan.',
    iconName: 'CheckCircle2',
    highlight: 'Hasil rapi & tepat waktu'
  }
];
