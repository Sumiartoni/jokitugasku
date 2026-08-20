import React, { useState } from 'react';
import { FileText, CheckCircle2, MessageCircle, Info } from 'lucide-react';
import { portfolioData, portfolioCategories } from '@/data/portfolio';
import { getWhatsAppUrl } from '@/config/site';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredItems = activeCategory === 'Semua'
    ? portfolioData
    : portfolioData.filter((item) => item.category === activeCategory);

  return (
    <section className="py-20 bg-surface-mist border-t border-slate-200/60" id="portofolio-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="brand" className="mb-3">Showcase & Format</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            Contoh Output & Format Pengerjaan
          </h2>
          <p className="mt-3 text-base text-ink-secondary">
            Berikut adalah gambaran format dokumen, telaah literatur, dan susunan naskah yang kami kerjakan untuk berbagai bidang studi.
          </p>
        </div>

        {/* Disclaimer banner */}
        <div className="max-w-3xl mx-auto mb-8 p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-ink-secondary flex items-start gap-2.5 shadow-xs">
          <Info className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Catatan:</strong> Seluruh judul dan rincian di bawah ini merupakan ilustrasi contoh format penulisan akademik yang telah disamarkan demi menjaga privasi klien.
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {portfolioCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white text-ink-secondary hover:text-ink-primary border border-slate-200 hover:border-slate-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              hoverable
              className="bg-white flex flex-col justify-between h-full border-slate-200/80 p-6"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="brand">{item.category}</Badge>
                  <span className="text-[11px] font-medium text-ink-muted">
                    {item.discipline}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-ink-primary mb-3 line-clamp-2">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Key highlights */}
                <div className="space-y-1.5 mb-5 pt-3 border-t border-slate-100">
                  {item.keyHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-ink-primary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom deliverable format & CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-ink-muted">
                  <FileText className="w-3.5 h-3.5 text-brand-500" />
                  <span className="truncate max-w-[150px] sm:max-w-[180px]">
                    {item.formatDeliverable}
                  </span>
                </div>

                <a
                  href={getWhatsAppUrl(`Halo Admin JokiTugasKu, saya tertarik dengan contoh format untuk ${item.category} (${item.title}). Apakah bisa konsultasi serupa?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Tanya Format</span>
                  <MessageCircle className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
