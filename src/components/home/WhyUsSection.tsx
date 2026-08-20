import React from 'react';
import { ShieldCheck, MessageCircle, FileSpreadsheet, Lock, HelpCircle, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';

export function WhyUsSection() {
  const pillars = [
    {
      icon: MessageCircle,
      title: 'Respon Ramah & Komunikasi Terarah',
      description: 'Anda berbicara langsung dengan tim kami via WhatsApp. Tidak ada bot kaku, sehingga Anda bebas menjelaskan instruksi khusus dosen atau guru.'
    },
    {
      icon: ShieldCheck,
      title: 'Transparansi Lingkup & Biaya di Muka',
      description: 'Kami menelaah instruksi dan file sebelum menyepakati harga. Semua ketentuan jelas di awal tanpa pungutan biaya tak terduga di tengah jalan.'
    },
    {
      icon: Lock,
      title: 'Privasi & Keamanan Dokumen Terjamin',
      description: 'Seluruh berkas materi, data pribadi, dan hasil naskah tidak disebarluaskan ataupun digunakan ulang untuk pihak lain.'
    },
    {
      icon: FileSpreadsheet,
      title: 'Format Naskah Baku & Rapi',
      description: 'Mulai dari margin, spasi, penomoran halaman otomatis, hingga sitasi daftar pustaka disesuaikan dengan format resmi yang Anda kirimkan.'
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info box */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
              Mengapa JokiTugasKu
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight leading-tight">
              Fokus pada Kerapian, Ketepatan Waktu, dan Kenyamanan Anda
            </h2>

            <p className="text-base text-ink-secondary leading-relaxed">
              Kami memahami tekanan deadline dan standar ketat tugas akademik. JokiTugasKu hadir sebagai mitra terpercaya untuk membantu Anda menyelesaikan beban tugas secara terstruktur.
            </p>

            <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-brand-900">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Konsultasi Tanpa Syarat</span>
              </div>
              <p className="text-xs text-brand-800 leading-relaxed">
                Belum yakin dengan topik atau format tugas Anda? Tanyakan langsung materi rujukan atau kesiapan pengerjaan kepada admin kami via WhatsApp.
              </p>
            </div>

            <Button
              href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin tanya seputar ketentuan pengerjaan tugas.')}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              className="gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Tanya Ketentuan Layanan</span>
            </Button>
          </div>

          {/* Right: 4 Pillar Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-mist/80 rounded-2xl p-5 border border-slate-200/80 hover:bg-white hover:border-brand-300 hover:shadow-subtle transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-brand-600 flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-ink-primary mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
