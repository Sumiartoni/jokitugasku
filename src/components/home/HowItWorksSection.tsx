import React from 'react';
import { 
  ListChecks, 
  MessageCircle, 
  FileSpreadsheet, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { orderStepsData } from '@/data/steps';
import { getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';

const iconMap: Record<string, React.ElementType> = {
  ListChecks,
  MessageCircle,
  FileSpreadsheet,
  CheckCircle2,
};

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-surface-mist relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
            Alur Pemesanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight mt-3">
            Cara Order di JokiTugasKu
          </h2>
          <p className="mt-3 text-base sm:text-lg text-ink-secondary">
            Semua proses konsultasi dan konfirmasi berlangsung langsung melalui WhatsApp resmi tanpa perlu pendaftaran akun.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {orderStepsData.map((step, index) => {
            const Icon = iconMap[step.iconName] || MessageCircle;

            return (
              <div
                key={step.stepNumber}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 flex flex-col justify-between relative group hover:border-brand-300 hover:shadow-card transition-all"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold text-brand-500/30 group-hover:text-brand-500 transition-colors font-mono">
                      {step.stepNumber}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-ink-primary mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Highlight Tag */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                  <span>{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action CTA */}
        <div className="mt-12 text-center">
          <Button
            href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin tanya langkah pemesanan tugas.')}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Mulai Konsultasi via WhatsApp</span>
          </Button>
          <p className="text-xs text-ink-muted mt-2.5">
            Admin kami siap membantu mengecek file tugas dan estimasi pengerjaan.
          </p>
        </div>

      </div>
    </section>
  );
}
