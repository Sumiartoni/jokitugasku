import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  ClipboardList, 
  Briefcase, 
  Lightbulb, 
  Presentation, 
  Award, 
  MessageCircle, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { servicesData } from '@/data/services';
import { getServiceWhatsAppUrl } from '@/config/site';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Map icon names to Lucide icons
const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  FileText,
  ClipboardList,
  Briefcase,
  Lightbulb,
  Presentation,
  Award,
};

export function ServicesSection() {
  return (
    <section id="layanan" className="py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="brand" className="mb-3">Katalog Layanan</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            Pilihan Layanan Bantuan Tugas & Akademik
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-secondary">
            Pilih kategori tugas yang sedang Anda hadapi. Setiap pengerjaan disesuaikan dengan instruksi, format naskah, dan tenggat waktu yang Anda butuhkan.
          </p>
        </div>

        {/* 8 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => {
            const Icon = iconMap[service.iconName] || FileText;

            return (
              <Card
                key={service.id}
                hoverable
                className="flex flex-col h-full bg-white border border-slate-200/90 hover:border-brand-300 p-6 group"
              >
                {/* Card Top / Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  {service.badge && (
                    <Badge variant="brand" className="text-[11px]">
                      {service.badge}
                    </Badge>
                  )}
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-bold text-ink-primary group-hover:text-brand-600 transition-colors mb-2">
                  <Link to={`/layanan/${service.slug}`} className="focus-visible:outline-none">
                    {service.title}
                  </Link>
                </h3>

                {/* Short Description */}
                <p className="text-sm text-ink-secondary leading-relaxed mb-4 flex-grow">
                  {service.shortDesc}
                </p>

                {/* Deliverables snippet */}
                <div className="space-y-1.5 mb-6 pt-3 border-t border-slate-100 text-xs text-ink-muted">
                  <div className="flex items-center gap-1.5 font-medium text-ink-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Est: {service.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-ink-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{service.targetAudience}</span>
                  </div>
                </div>

                {/* Actions: Detail link + Direct WhatsApp button */}
                <div className="space-y-2 pt-2">
                  <a
                    href={getServiceWhatsAppUrl(service.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm group-hover:shadow-brand-glow"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>Tanya via WhatsApp</span>
                  </a>

                  <Link
                    to={`/layanan/${service.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50/50 transition-colors"
                  >
                    <span>Detail Layanan & Ketentuan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
