import React from 'react';
import { MessageCircle, ArrowRight, Shield, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-white via-surface-mist/50 to-surface-mist">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-semibold shadow-subtle animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>#1 Info Joki Tugas Kuliah, Laporan PKL &amp; Magang Terpercaya</span>
            </div>

            {/* Semantic H1 (Only 1 on the page) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-primary tracking-tight leading-[1.18] text-balance">
              Jasa Joki Tugas Kuliah, Makalah &amp;{' '}
              <span className="text-brand-500">Laporan PKL Terpercaya</span>
            </h1>

            {/* Value proposition paragraph */}
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Layanan jasa joki tugas kuliah, pengerjaan makalah, laporan PKL &amp; magang, proposal, slide PPT, hingga skripsi. Dikerjakan cepat, rapi sesuai rubrik dosen, bebas plagiarisme, dan bergaransi revisi.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin konsultasi tugas kuliah/sekolah. Apakah bisa dibantu?')}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base px-7 py-3.5 shadow-brand-glow"
                id="hero-primary-whatsapp-cta"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>Chat WhatsApp Sekarang</span>
              </Button>

              <a
                href="#layanan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-ink-primary font-semibold text-sm sm:text-base border border-slate-200 shadow-subtle hover:border-slate-300 transition-all"
              >
                <span>Lihat Layanan</span>
                <ArrowRight className="w-4 h-4 text-ink-muted" />
              </a>
            </div>

            {/* Trust Microcopy */}
            <div className="pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-ink-secondary">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Konsultasi Bebas Biaya</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Shield className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Privasi Data 100% Aman</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Opsi Deadline Fleksibel / Kilat</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Visual Showcase Mockup */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Showcase */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-elevated p-5 sm:p-6 space-y-4">
                
                {/* Header Mockup */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <img
                        src="/logo.png"
                        alt="Logo JokiTugasKu"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-ink-primary">Konsultasi Tugas Langsung</div>
                      <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Respon Cepat via WhatsApp
                      </div>
                    </div>
                  </div>
                  <Badge variant="brand">Step 1 to 4</Badge>
                </div>

                {/* Simulated Workflow Steps */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      1
                    </div>
                    <div>
                      <span className="font-semibold text-ink-primary block">Kirim Topik & Deadline</span>
                      <span className="text-ink-muted text-[11px]">Kirim berkas soal, modul, atau silabus tugas Anda.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      2
                    </div>
                    <div>
                      <span className="font-semibold text-ink-primary block">Sepakati Estimasi & Biaya</span>
                      <span className="text-ink-muted text-[11px]">Biaya transparan di awal tanpa biaya tersembunyi.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-50/70 border border-brand-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      3
                    </div>
                    <div>
                      <span className="font-semibold text-brand-900 block">Pengerjaan Rapi & Tuntas</span>
                      <span className="text-brand-700 text-[11px]">Dikerjakan bertahap dengan format standar kampus.</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Order Card Footer */}
                <div className="pt-2">
                  <a
                    href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin tanya estimasi tugas.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Mulai Konsultasi Tugas Sekarang</span>
                  </a>
                </div>

              </div>

              {/* Floating Mini Badge */}
              <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white rounded-xl border border-slate-200 shadow-card p-3 items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-ink-primary block">Revisi Sesuai Panduan</span>
                  <span className="text-[10px] text-ink-muted">Garansi penyesuaian instruksi</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
