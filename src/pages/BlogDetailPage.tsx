import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Calendar, 
  Clock, 
  BookOpen, 
  MessageCircle, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleBySlug, getAllArticles } from '@/data/articles';
import { getWhatsAppUrl } from '@/config/site';
import { sanitizeJsonLd } from '@/utils/sanitize';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const allArticles = getAllArticles();
  const relatedArticles = allArticles.filter(a => a.slug !== slug).slice(0, 3);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} - JokiTugasKu Blog`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.excerpt || `Panduan lengkap mengenai ${article.title} oleh JokiTugasKu.`);
      }
    }
    window.scrollTo(0, 0);
  }, [article]);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // Generate Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "articleSection": article.category,
    "datePublished": "2026-08-15",
    "dateModified": new Date().toISOString().split('T')[0],
    "author": {
      "@type": "Organization",
      "name": "Tim Akademik JokiTugasKu",
      "url": "https://jokitugasku.id"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JokiTugasKu.id",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jokitugasku.id/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://jokitugasku.id/blog/${article.slug}`
    }
  };

  return (
    <main className="py-12 bg-surface-mist min-h-screen font-sans">
      
      {/* Article Schema JSON-LD (sanitized) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(articleSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/blog" className="hover:text-brand-600 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Back Link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Blog</span>
        </Link>

        {/* Main Article Header */}
        <header className="space-y-4 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="brand">{article.category}</Badge>
            <span className="text-xs text-ink-muted flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="text-xs text-ink-muted flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime || '5 menit baca'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-primary tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed pt-1 border-t border-slate-100">
            {article.excerpt}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-ink-muted">
            <span className="font-semibold text-brand-700">Oleh Tim Akademik JokiTugasKu</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Terverifikasi Standar Akademik</span>
            </div>
          </div>
        </header>

        {/* Article Body — Rendered as rich Markdown */}
        <article className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
          <div className="prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:leading-relaxed prose-p:text-ink-secondary prose-li:text-ink-secondary prose-blockquote:border-brand-400 prose-blockquote:bg-brand-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-xl prose-blockquote:not-italic prose-a:text-brand-600 prose-a:font-semibold prose-strong:text-ink-primary prose-hr:border-slate-200 font-sans">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.contentMarkdown || article.excerpt}
            </ReactMarkdown>
          </div>

          {/* Article FAQs if any */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-600" />
                <span>Pertanyaan Sering Diajukan (FAQ)</span>
              </h3>
              <div className="space-y-3">
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 text-xs space-y-1.5">
                    <span className="font-bold text-ink-primary block text-sm">Q: {faq.question}</span>
                    <span className="text-ink-secondary block leading-relaxed">A: {faq.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-ink-muted">Kata Kunci Terkait:</span>
              {article.tags.map((t, idx) => (
                <Badge key={idx} variant="neutral" className="text-[11px]">#{t}</Badge>
              ))}
            </div>
          )}
        </article>

        {/* Bottom CTA Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-xl font-extrabold tracking-tight">
              Butuh Bantuan Mengerjakan Tugas Serupa?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Konsultasikan judul makalah, tugas kuliah, atau skripsi Anda langsung dengan akademisi kami melalui WhatsApp resmi.
            </p>
          </div>

          <Button
            href={getWhatsAppUrl(`Halo Admin JokiTugasKu, saya baru membaca artikel "${article.title}" dan ingin konsultasi tugas.`)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="gap-2 shadow-brand-glow whitespace-nowrap self-start sm:self-auto font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konsultasi via WhatsApp</span>
          </Button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-extrabold text-ink-primary tracking-tight">Artikel Panduan Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 transition-all hover:shadow-md flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1.5">
                    <Badge variant="brand" className="text-[10px]">{rel.category}</Badge>
                    <h4 className="font-bold text-sm text-ink-primary line-clamp-2 leading-snug">{rel.title}</h4>
                  </div>
                  <span className="text-[11px] text-brand-600 font-semibold inline-flex items-center gap-1">
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
