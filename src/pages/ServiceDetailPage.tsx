import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
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
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { getServiceBySlug, servicesData } from '@/data/services';
import { getServiceWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { JsonLd, generateServiceSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd';

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

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  useEffect(() => {
    if (service) {
      document.title = `${service.title} - Jasa Joki Terpercaya & Cepat | JokiTugasKu`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${service.longDesc.slice(0, 155)}...`);
      }

      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://jokitugasku.id/layanan/${service.slug}`);
      }

      window.scrollTo(0, 0);
    }
  }, [service]);

  if (!service) {
    return <Navigate to="/#layanan" replace />;
  }

  const Icon = iconMap[service.iconName] || FileText;

  const breadcrumbs = [
    { name: 'Beranda', url: 'https://jokitugasku.id/' },
    { name: 'Layanan', url: 'https://jokitugasku.id/#layanan' },
    { name: service.title, url: `https://jokitugasku.id/layanan/${service.slug}` },
  ];

  const serviceSchema = generateServiceSchema({
    title: service.title,
    description: service.shortDesc,
    slug: service.slug,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <main className="py-10 bg-surface-mist min-h-[80vh]">
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/#layanan" className="hover:text-brand-600 transition-colors">Layanan</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  {service.badge && <Badge variant="brand" className="mb-1">{service.badge}</Badge>}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
                    {service.title}
                  </h1>
                </div>
              </div>

              <p className="text-base text-ink-secondary leading-relaxed pt-2">
                {service.longDesc}
              </p>

              {/* Meta Quick Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <div>
                    <span className="text-ink-muted block text-[11px]">Estimasi Waktu</span>
                    <span className="font-semibold text-ink-primary">{service.estimatedTime}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <div>
                    <span className="text-ink-muted block text-[11px]">Sasaran</span>
                    <span className="font-semibold text-ink-primary truncate">{service.targetAudience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope & Examples */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-4">
              <h2 className="text-xl font-bold text-ink-primary">
                Cakupan Materi & Contoh Penugasan
              </h2>
              <p className="text-sm text-ink-secondary">
                Layanan ini mencakup pengerjaan dan bimbingan untuk berbagai jenis tugas di bawah ini:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {service.scopeExamples.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/70 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-ink-primary font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-4">
              <h2 className="text-xl font-bold text-ink-primary">
                Apa yang Anda Dapatkan (Deliverables)
              </h2>
              <ul className="space-y-3 pt-1">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-ink-secondary">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Sidebar CTA Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* WhatsApp Booking Card */}
            <div className="bg-white rounded-2xl border border-brand-200 shadow-card p-6 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Konsultasi Langsung
                </span>
                <h3 className="text-lg font-bold text-ink-primary">
                  Pesan {service.title}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Hubungi WhatsApp kami dengan menyertakan instruksi soal, batas waktu, dan kebutuhan format tugas Anda.
                </p>
              </div>

              <Button
                href={getServiceWhatsAppUrl(service.title)}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="w-full justify-center gap-2 shadow-brand-glow text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Konsultasi Layanan Ini</span>
              </Button>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-ink-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Kerahasiaan data terjamin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span>Respon cepat via WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Other Services List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Layanan Terkait Lainnya
              </h4>
              <div className="space-y-1.5">
                {servicesData
                  .filter((s) => s.id !== service.id)
                  .slice(0, 5)
                  .map((other) => (
                    <Link
                      key={other.id}
                      to={`/layanan/${other.slug}`}
                      className="block p-2.5 rounded-lg text-xs font-medium text-ink-secondary hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      {other.title}
                    </Link>
                  ))}
              </div>
            </div>

            <Link
              to="/#layanan"
              className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-brand-600 font-semibold pl-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Semua Layanan</span>
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}
