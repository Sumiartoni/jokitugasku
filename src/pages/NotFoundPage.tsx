import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Halaman Tidak Ditemukan — JokiTugasKu';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-surface-mist py-20 px-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Decorative 404 Number */}
        <div className="relative">
          <span className="text-[10rem] sm:text-[14rem] font-extrabold leading-none tracking-tighter text-brand-100 select-none pointer-events-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-500/10 backdrop-blur-sm flex items-center justify-center">
              <Search className="w-10 h-10 text-brand-500" />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-3 -mt-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
            Silakan kembali ke beranda atau hubungi kami via WhatsApp.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            href="/"
            variant="primary"
            size="lg"
            className="gap-2 shadow-brand-glow w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Button>

          <Button
            href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya butuh bantuan menemukan halaman yang saya cari.')}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="lg"
            className="gap-2 w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 text-brand-500" />
            <span>Chat WhatsApp</span>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-6 border-t border-slate-200/60">
          <p className="text-xs text-ink-muted mb-3 font-semibold">Atau kunjungi halaman populer:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Layanan', href: '/#layanan' },
              { label: 'Cara Order', href: '/cara-order' },
              { label: 'Harga', href: '/harga' },
              { label: 'Blog', href: '/blog' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Kontak', href: '/kontak' },
            ].map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-ink-secondary hover:text-brand-600 hover:border-brand-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
