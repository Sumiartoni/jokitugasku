import React from 'react';
import { faqsData } from '@/data/faqs';
import { Accordion } from '@/components/ui/Accordion';
import { JsonLd, generateFaqSchema } from '@/components/seo/JsonLd';
import { getWhatsAppUrl } from '@/config/site';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FaqSection() {
  const faqSchema = generateFaqSchema(
    faqsData.map((f) => ({ question: f.question, answer: f.answer }))
  );

  return (
    <section id="faq" className="py-20 bg-white scroll-mt-16 border-t border-slate-200/60">
      {/* FAQ Schema for SEO */}
      <JsonLd data={faqSchema} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
            Tanya Jawab
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight mt-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-3 text-base text-ink-secondary">
            Semua hal mendasar mengenai proses order, penentuan biaya, privasi data, dan garansi revisi di JokiTugasKu.
          </p>
        </div>

        {/* Accordion Component */}
        <Accordion items={faqsData} defaultOpenId="faq-1" />

        {/* Extra FAQ Callout */}
        <div className="mt-10 p-6 rounded-2xl bg-surface-mist border border-slate-200 text-center space-y-3">
          <h3 className="text-base font-bold text-ink-primary">
            Masih ada pertanyaan spesifik tentang tugas Anda?
          </h3>
          <p className="text-xs sm:text-sm text-ink-secondary max-w-xl mx-auto">
            Tim kami siap menjawab pertanyaan seputar materi, format khusus, maupun tenggat waktu pengerjaan via WhatsApp.
          </p>
          <div className="pt-2">
            <Button
              href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin bertanya lebih lanjut seputar tugas saya.')}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              className="gap-2 bg-white"
            >
              <MessageCircle className="w-4 h-4 text-brand-600" />
              <span>Tanyakan Langsung ke Admin</span>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
