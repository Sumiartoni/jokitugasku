import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBannerSection } from '@/components/home/CtaBannerSection';
import { JsonLd, generateFaqSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd';
import { faqsData } from '@/data/faqs';

export function FaqPage() {
  useEffect(() => {
    document.title = 'Tanya Jawab (FAQ) - Jasa Joki Tugas Kuliah & Sekolah | JokiTugasKu';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Pertanyaan umum seputar layanan joki tugas kuliah, jaminan kerahasiaan data, cara pemesanan, kebijakan revisi gratis, dan pembayaran via WhatsApp.'
      );
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://jokitugasku.id/faq');
    }

    window.scrollTo(0, 0);
  }, []);

  const breadcrumbs = [
    { name: 'Beranda', url: 'https://jokitugasku.id/' },
    { name: 'FAQ', url: 'https://jokitugasku.id/faq' },
  ];

  return (
    <main className="min-h-screen bg-surface-mist font-sans">
      <JsonLd data={generateFaqSchema(faqsData)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">FAQ</span>
        </nav>
      </div>

      <FaqSection />
      <CtaBannerSection />
    </main>
  );
}
