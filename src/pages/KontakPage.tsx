import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Clock, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  Send,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { trackEvent } from '@/utils/analytics';

export function KontakPage() {
  useEffect(() => {
    document.title = 'Hubungi Kami - Konsultasi & Layanan JokiTugasKu';
    window.scrollTo(0, 0);
  }, []);

  const handleWaClick = () => {
    trackEvent('whatsapp_click', { source: 'kontak_page' });
  };

  return (
    <main className="py-12 bg-surface-mist min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">Kontak</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand">Saluran Komunikasi Resmi</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            Hubungi Tim JokiTugasKu
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Seluruh transaksi, konsultasi materi, pengiriman file, dan kesepakatan tugas dilayani langsung melalui WhatsApp Business resmi kami.
          </p>
        </div>

        {/* Primary Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Main WhatsApp Card */}
          <div className="bg-white rounded-3xl border-2 border-brand-300 shadow-elevated p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-brand-glow">
                <MessageCircle className="w-7 h-7" />
              </div>
              <Badge variant="success">Fast Response</Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-ink-primary">
                WhatsApp Business
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Kanal utama konsultasi dan pemesanan. Terhubung langsung dengan customer admin kami tanpa antrean tiket.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-mist border border-slate-200 text-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span>Nomor Resmi:</span>
                <span className="font-bold text-ink-primary text-sm">{siteConfig.whatsappDisplay}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span>Jam Operasional:</span>
                <span className="font-medium text-ink-primary">{siteConfig.operatingHours}</span>
              </div>
            </div>

            <Button
              href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin konsultasi tugas.')}
              onClick={handleWaClick}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2.5 shadow-brand-glow text-base"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>Buka Chat WhatsApp Sekarang</span>
            </Button>
          </div>

          {/* Secondary Info Card */}
          <div className="space-y-6">
            <Card className="bg-white p-6 space-y-4">
              <div className="flex items-center gap-3 text-ink-primary font-bold text-base">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span>Waktu Pelayanan Terbaik</span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Pesan WhatsApp yang masuk di luar jam operasional (22.00 - 08.00 WIB) akan dibalas di urutan pertama saat jam operasional berikutnya dibuka.
              </p>
            </Card>

            <Card className="bg-white p-6 space-y-4">
              <div className="flex items-center gap-3 text-ink-primary font-bold text-base">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <span>Peringatan Keamanan Saluran</span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Pastikan Anda hanya bertransaksi melalui nomor WhatsApp resmi yang tercantum di website <strong>jokitugasku.id</strong> untuk menghindari penipuan oleh pihak tidak bertanggung jawab.
              </p>
            </Card>

            <Card className="bg-white p-6 space-y-4">
              <div className="flex items-center gap-3 text-ink-primary font-bold text-base">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span>Butuh Jawaban Cepat?</span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-2">
                Simak pertanyaan umum seputar penentuan harga, revisi, dan keamanan file di pusat bantuan kami.
              </p>
              <Link
                to="/faq"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
              >
                <span>Buka Tanya Jawab (FAQ)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          </div>

        </div>

      </div>
    </main>
  );
}
