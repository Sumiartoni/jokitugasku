import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  MessageCircle, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { servicesData } from '@/data/services';
import { getWhatsAppUrl, getServiceWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function HargaPage() {
  useEffect(() => {
    document.title = 'Estimasi Harga & Biaya Layanan - JokiTugasKu';
    window.scrollTo(0, 0);
  }, []);

  const pricingFactors = [
    {
      title: 'Tingkat Kompleksitas & Jurusan',
      desc: 'Tugas yang membutuhkan analisis teoretis mendalam, olah data statistik khusus, atau rumpun sains/teknik disesuaikan dengan beban analisisnya.'
    },
    {
      title: 'Batas Waktu (Deadline)',
      desc: 'Tersedia pilihan pengerjaan reguler (standar) maupun opsi kilat/urgent (express) sesuai urgensi pengumpulan Anda.'
    },
    {
      title: 'Jumlah Halaman atau Slide',
      desc: 'Panjang naskah, jumlah kata, atau kuantitas slide presentasi menjadi tolok ukur penentuan estimasi yang proporsional.'
    },
    {
      title: 'Kebutuhan Referensi Khusus',
      desc: 'Kebutuhan sitasi jurnal internasional Scopus/Sinta, data lapangan, atau lampiran perhitungan spesifik.'
    }
  ];

  return (
    <main className="py-12 bg-surface-mist min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">Harga</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand">Transparansi Biaya</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            Estimasi Harga & Ketentuan Biaya Jasa
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Di JokiTugasKu, harga dihitung secara transparan berdasarkan detail tugas yang Anda kirimkan. Tanpa biaya terselubung dan disepakati sebelum pengerjaan dimulai.
          </p>
        </div>

        {/* Pricing Factors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center gap-2.5 text-ink-primary font-bold text-xl">
            <Calculator className="w-6 h-6 text-brand-500" />
            <h2>Bagaimana Biaya Dihitung?</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pricingFactors.map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-1.5">
                <h3 className="font-bold text-sm text-ink-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Estimate Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-ink-primary text-center">
            Pilihan Kategori & Estimasi Pengerjaan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {servicesData.map((s) => (
              <Card key={s.id} className="bg-white flex flex-col justify-between p-6">
                <div className="space-y-3">
                  <Badge variant="neutral" className="text-[10px]">{s.targetAudience}</Badge>
                  <h3 className="font-bold text-base text-ink-primary">{s.title}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                    {s.shortDesc}
                  </p>
                  <div className="pt-2 text-xs font-semibold text-brand-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est: {s.estimatedTime}</span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Button
                    href={getServiceWhatsAppUrl(s.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="sm"
                    className="w-full justify-center text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Cek Harga via WA</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Box */}
        <div className="p-8 rounded-2xl bg-white border border-brand-200 text-center space-y-4 shadow-card">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Dapatkan Penawaran Harga Pasti untuk Tugas Anda
          </h2>
          <p className="text-sm text-ink-secondary max-w-xl mx-auto">
            Kirimkan file soal atau lembar instruksi tugas ke WhatsApp kami. Admin kami akan langsung menghitung estimasi biaya tanpa komitmen.
          </p>
          <Button
            href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin minta estimasi harga untuk tugas saya.')}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat WhatsApp untuk Cek Harga</span>
          </Button>
        </div>

      </div>
    </main>
  );
}
