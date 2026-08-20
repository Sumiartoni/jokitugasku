import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ListChecks, 
  MessageCircle, 
  FileSpreadsheet, 
  CheckCircle2, 
  ChevronRight, 
  Lightbulb, 
  HelpCircle,
  ShieldCheck 
} from 'lucide-react';
import { orderStepsData } from '@/data/steps';
import { getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function CaraOrderPage() {
  useEffect(() => {
    document.title = 'Cara Order - Panduan Langkah Pemesanan Tugas | JokiTugasKu';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="py-12 bg-surface-mist min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">Cara Order</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand">Panduan Pemesanan</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            Cara Mudah Pesan Bantuan Tugas di JokiTugasKu
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Tidak perlu proses checkout rumit atau registrasi akun. Seluruh interaksi, konsultasi instruksi, dan kesepakatan tugas dilakukan secara langsung melalui WhatsApp.
          </p>
        </div>

        {/* 4 Steps Detailed */}
        <div className="space-y-6">
          {orderStepsData.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-extrabold text-xl flex-shrink-0 shadow-brand-glow">
                {step.stepNumber}
              </div>
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-ink-primary">
                    {step.title}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
                    {step.highlight}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tips for Fast Processing */}
        <Card className="bg-white p-6 sm:p-8 space-y-4 border-slate-200">
          <div className="flex items-center gap-2.5 text-brand-700 font-bold text-lg">
            <Lightbulb className="w-5 h-5 text-brand-500" />
            <span>Tips Agar Tugas Anda Dapat Diproses Lebih Cepat:</span>
          </div>
          <ul className="space-y-2.5 text-sm text-ink-secondary pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Sertakan lembar soal/rubrik penilaian asli dari pengajar atau dosen.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Sebutkan batas waktu pengumpulan (deadline) yang jelas sejak awal chat.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Kirimkan contoh format atau template dokumen bila diwajibkan oleh kampus/sekolah Anda.</span>
            </li>
          </ul>
        </Card>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-brand-500 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Siap Memulai? Hubungi WhatsApp Kami Sekarang
          </h2>
          <p className="text-sm sm:text-base text-brand-100 max-w-xl mx-auto">
            Konsultasikan kebutuhan Anda gratis dan dapatkan respon cepat dari admin.
          </p>
          <div className="pt-2">
            <Button
              href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin konsultasi tugas.')}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              className="gap-2 font-bold"
            >
              <MessageCircle className="w-5 h-5 text-brand-600" />
              <span>Chat WhatsApp Sekarang</span>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
