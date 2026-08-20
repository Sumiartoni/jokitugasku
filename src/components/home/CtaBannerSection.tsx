import React from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { getWhatsAppUrl, siteConfig } from '@/config/site';

export function CtaBannerSection() {
  return (
    <section className="py-20 bg-surface-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Signal Violet Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-brand-500 text-white shadow-2xl px-6 py-12 sm:px-12 sm:py-16 text-center">
          
          {/* Subtle geometric circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Layanan Aktif • Fast Response Setiap Hari</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-balance">
              Deadline Tugas Makin Dekat? Jangan Ditunda Lagi.
            </h2>

            <p className="text-base sm:text-lg text-brand-100 leading-relaxed max-w-2xl mx-auto">
              Konsultasikan tugas kuliah, makalah, laporan PKL, atau naskah skripsi Anda sekarang. Dapatkan kejelasan estimasi biaya dan waktu pengerjaan dalam hitungan menit.
            </p>

            {/* Direct WhatsApp Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin pesan bantuan tugas sekarang. Mohon info lengkapnya.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-brand-700 font-extrabold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all"
                id="final-banner-whatsapp-cta"
              >
                <MessageCircle className="w-5 h-5 fill-brand-500/20 text-brand-600" />
                <span>Chat WhatsApp ({siteConfig.whatsappDisplay})</span>
              </a>

              <a
                href="/cara-order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-600/60 hover:bg-brand-600/80 text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                <span>Pelajari Cara Order</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Micro assurances */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-brand-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Privasi Terjaga</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Tepat Waktu Sesuai Deadline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>Tanpa Ribet Buat Akun</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
