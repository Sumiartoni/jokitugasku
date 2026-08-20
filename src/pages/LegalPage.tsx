import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Shield, 
  FileText, 
  RefreshCw, 
  MessageCircle, 
  Ban, 
  CreditCard,
  RotateCcw
} from 'lucide-react';
import { getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';

export type PolicyType = 'privacy' | 'terms' | 'refund' | 'revision' | 'cancellation' | 'payment';

export function LegalPage({ type }: { type: PolicyType }) {
  const config = {
    privacy: {
      title: 'Kebijakan Privasi',
      subtitle: 'Komitmen kami dalam menjaga kerahasiaan identitas dan data tugas Anda.',
      icon: Shield,
    },
    terms: {
      title: 'Syarat & Ketentuan Layanan',
      subtitle: 'Ketentuan penggunaan layanan dan kesepakatan pemesanan di JokiTugasKu.',
      icon: FileText,
    },
    refund: {
      title: 'Kebijakan Pengembalian Dana (Refund)',
      subtitle: 'Ketentuan dan prosedur pengembalian dana apabila pesanan tidak dapat diselesaikan.',
      icon: RotateCcw,
    },
    revision: {
      title: 'Kebijakan Garansi Revisi',
      subtitle: 'Pedoman penyesuaian pengerjaan dan garansi revisi sesuai instruksi awal.',
      icon: RefreshCw,
    },
    cancellation: {
      title: 'Kebijakan Pembatalan Pesanan',
      subtitle: 'Ketentuan pembatalan pesanan sebelum atau selama proses pengerjaan berjalan.',
      icon: Ban,
    },
    payment: {
      title: 'Kebijakan Pembayaran & Biaya',
      subtitle: 'Ketentuan pembayaran, metode transfer resmi, dan transparansi kesepakatan biaya.',
      icon: CreditCard,
    }
  }[type];

  const Icon = config.icon;

  useEffect(() => {
    document.title = `${config.title} - JokiTugasKu`;
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <main className="py-12 bg-surface-mist min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">{config.title}</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-ink-primary tracking-tight">
            {config.title}
          </h1>
          <p className="text-base text-ink-secondary">
            {config.subtitle}
          </p>
        </div>

        {/* Tab Shortcuts */}
        <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-200/80 pb-4 text-xs font-medium">
          <Link to="/privacy-policy" className={`px-3 py-1.5 rounded-lg transition-colors ${type === 'privacy' ? 'bg-brand-500 text-white font-bold' : 'bg-white text-ink-secondary hover:text-ink-primary'}`}>
            Privasi
          </Link>
          <Link to="/terms" className={`px-3 py-1.5 rounded-lg transition-colors ${type === 'terms' ? 'bg-brand-500 text-white font-bold' : 'bg-white text-ink-secondary hover:text-ink-primary'}`}>
            Syarat & Ketentuan
          </Link>
          <Link to="/refund-policy" className={`px-3 py-1.5 rounded-lg transition-colors ${type === 'refund' ? 'bg-brand-500 text-white font-bold' : 'bg-white text-ink-secondary hover:text-ink-primary'}`}>
            Refund
          </Link>
          <Link to="/kebijakan-revisi" className={`px-3 py-1.5 rounded-lg transition-colors ${type === 'revision' ? 'bg-brand-500 text-white font-bold' : 'bg-white text-ink-secondary hover:text-ink-primary'}`}>
            Revisi
          </Link>
          <Link to="/cancellation-policy" className={`px-3 py-1.5 rounded-lg transition-colors ${type === 'cancellation' ? 'bg-brand-500 text-white font-bold' : 'bg-white text-ink-secondary hover:text-ink-primary'}`}>
            Pembatalan
          </Link>
          <Link to="/payment-policy" className={`px-3 py-1.5 rounded-lg transition-colors ${type === 'payment' ? 'bg-brand-500 text-white font-bold' : 'bg-white text-ink-secondary hover:text-ink-primary'}`}>
            Pembayaran
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-subtle space-y-6 text-sm text-ink-secondary leading-relaxed">
          {type === 'privacy' && (
            <>
              <h2 className="text-lg font-bold text-ink-primary">1. Pengumpulan Data & Lampiran</h2>
              <p>
                Informasi yang Anda kirimkan (seperti lembar tugas, silabus, template dokumen kampus, dan nomor WhatsApp) hanya dipergunakan oleh tim internal untuk menyelesaikan pesanan sesuai petunjuk Anda.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">2. Jaminan Kerahasiaan Identitas</h2>
              <p>
                Kami menerapkan prinsip kerahasiaan mutlak. Nama pengguna, asal kampus/sekolah, maupun file karya naskah tidak akan diunggah secara publik atau disebarluaskan kepada pihak ketiga.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">3. Akses Terbatas untuk Worker</h2>
              <p>
                Sesuai standar operasional kami, worker hanya menerima materi teknis yang diperlukan untuk pengerjaan tugas tanpa memiliki akses ke data personal customer.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h2 className="text-lg font-bold text-ink-primary">1. Batasan Layanan Akademik</h2>
              <p>
                JokiTugasKu menyediakan jasa asistensi penulisan, perapian format, bimbingan analisis data, dan telaah literatur ilmiah yang ditujukan sebagai bahan referensi dan pemahaman studi.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">2. Kesepakatan Lingkup Pengerjaan</h2>
              <p>
                Seluruh detail instruksi, format naskah, batas waktu (deadline), dan biaya pengerjaan disepakati secara tertulis via chat WhatsApp resmi sebelum proses dimulai.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">3. Saluran Transaksi Resmi</h2>
              <p>
                Segala bentuk komunikasi dan konfirmasi pembayaran hanya diakui sah jika dilakukan melalui nomor WhatsApp resmi yang terdaftar di website <strong>jokitugasku.id</strong>.
              </p>
            </>
          )}

          {type === 'refund' && (
            <>
              <h2 className="text-lg font-bold text-ink-primary">1. Syarat Klaim Pengembalian Dana</h2>
              <p>
                Pengembalian dana (refund) penuh dapat diajukan jika pihak JokiTugasKu tidak dapat menyelesaikan pesanan yang telah disepakati atau terjadi keterlambatan fatal yang disebabkan sepenuhnya oleh kelalaian internal kami.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">2. Batasan Refund</h2>
              <p>
                Refund tidak berlaku jika kegagalan atau kendala disebabkan oleh perubahan instruksi mendadak dari pihak klien setelah pengerjaan selesai lebih dari 70%, atau keterlambatan pengiriman materi pendukung dari klien.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">3. Prosedur Pengembalian Dana</h2>
              <p>
                Pengajuan refund diproses melalui WhatsApp dengan menyertakan bukti kendala. Dana yang disetujui akan ditransfer kembali dalam waktu 1x24 jam kerja.
              </p>
            </>
          )}

          {type === 'revision' && (
            <>
              <h2 className="text-lg font-bold text-ink-primary">1. Ruang Lingkup Garansi Revisi</h2>
              <p>
                Klien berhak mengajukan revisi gratis apabila terdapat poin penugasan yang belum sesuai dengan panduan atau instruksi awal yang disepakati.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">2. Batas Waktu Pengajuan Revisi</h2>
              <p>
                Pengajuan revisi berlaku wajar hingga 7 hari kalender sejak naskah pertama diserahkan (atau menyesuaikan siklus bimbingan dosen khusus untuk laporan PKL/skripsi).
              </p>
              <h2 className="text-lg font-bold text-ink-primary">3. Perubahan Di Luar Kesepakatan Awal</h2>
              <p>
                Pergantian total topik tugas atau penambahan bab baru di luar kesepakatan awal akan dianggap sebagai pekerjaan tambahan dengan biaya proporsional.
              </p>
            </>
          )}

          {type === 'cancellation' && (
            <>
              <h2 className="text-lg font-bold text-ink-primary">1. Pembatalan Sebelum Pengerjaan Dimulai</h2>
              <p>
                Klien dapat membatalkan pesanan tanpa dikenakan biaya potongan jika proses pengerjaan oleh worker belum dimulai.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">2. Pembatalan Saat Pengerjaan Berjalan</h2>
              <p>
                Jika pembatalan diajukan saat pengerjaan telah berlangsung sebagian, biaya akan dihitung secara proporsional sesuai progres pengerjaan yang telah diselesaikan oleh tim.
              </p>
            </>
          )}

          {type === 'payment' && (
            <>
              <h2 className="text-lg font-bold text-ink-primary">1. Transparansi Kesepakatan Biaya</h2>
              <p>
                Biaya ditentukan di awal berdasarkan kompleksitas jurusan, jumlah lembar/slide, dan tenggat waktu. Tidak ada biaya siluman di tengah proses pengerjaan.
              </p>
              <h2 className="text-lg font-bold text-ink-primary">2. Metode Pembayaran Resmi</h2>
              <p>
                Pembayaran dilakukan melalui transfer bank nasional atau dompet digital (E-Wallet) resmi yang diinstruksikan oleh admin via chat WhatsApp resmi JokiTugasKu.
              </p>
            </>
          )}

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ink-muted">
              Punya pertanyaan seputar kebijakan di atas?
            </p>
            <Button
              href={getWhatsAppUrl(`Halo Admin JokiTugasKu, saya ingin bertanya tentang ${config.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-brand-600" />
              <span>Tanya Admin via WhatsApp</span>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
