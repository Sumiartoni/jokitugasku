import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ShieldCheck, 
  Target, 
  Users, 
  MessageCircle,
  Sparkles,
  Award
} from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function TentangPage() {
  useEffect(() => {
    document.title = 'Tentang Kami - Mengenal JokiTugasKu.id';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="py-12 bg-surface-mist min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">Tentang Kami</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand">Profil & Prinsip</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            Mengenal Layanan JokiTugasKu
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Platform asistensi akademik dan penyelesaian tugas terstruktur yang mengedepankan proses komunikasi transparan, ketepatan waktu, dan kerapian naskah.
          </p>
        </div>

        {/* Core Narrative */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-subtle space-y-6 text-sm sm:text-base text-ink-secondary leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Dedikasi untuk Membantu Kelancaran Studi Anda
          </h2>
          <p>
            Beban akademik yang padat, jadwal praktikum bertumpuk, tuntutan magang, dan tenggat waktu sidang sering kali menjadi tantangan berat bagi para pelajar dan mahasiswa di Indonesia. <strong>JokiTugasKu</strong> hadir sebagai solusi pendamping praktis untuk membantu Anda mengelola tugas secara efisien.
          </p>
          <p>
            Kami menerapkan standar kerja yang berfokus pada pemahaman rubrik penilaian, penulisan sitasi yang benar (APA, IEEE, Harvard), kerapian tata letak dokumen (formatting), dan privasi data mutlak bagi setiap klien.
          </p>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-ink-primary">Ketepatan Instruksi</h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Setiap pengerjaan mengacu langsung pada pedoman, lembar tugas, dan standar format yang Anda berikan di awal.
            </p>
          </Card>

          <Card className="bg-white p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-ink-primary">Keamanan & Privasi</h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Kami tidak mempublikasikan identitas, asal institusi, maupun naskah tugas Anda kepada pihak ketiga mana pun.
            </p>
          </Card>

          <Card className="bg-white p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-ink-primary">Pelayanan Komunikatif</h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Komunikasi langsung melalui WhatsApp memudahkan Anda memberikan catatan tambahan dan memantau status pengerjaan.
            </p>
          </Card>
        </div>

        {/* CTA Card */}
        <div className="p-8 rounded-3xl bg-brand-500 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold">
            Ingin Berdiskusi Seputar Kebutuhan Tugas Anda?
          </h2>
          <p className="text-sm text-brand-100 max-w-lg mx-auto">
            Hubungi kami sekarang untuk konsultasi awal gratis via WhatsApp resmi.
          </p>
          <div className="pt-2">
            <Button
              href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin tanya seputar layanan dan konsultasi.')}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              className="gap-2 font-bold"
            >
              <MessageCircle className="w-5 h-5 text-brand-600" />
              <span>Chat WhatsApp Admin</span>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
