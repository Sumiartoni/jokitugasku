import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, BookOpen, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '@/config/site';
import { getAllArticles, ArticleItem } from '@/data/articles';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function BlogPage() {
  const [articles, setArticles] = useState<ArticleItem[]>(() => getAllArticles());

  useEffect(() => {
    document.title = 'Blog & Panduan Akademik - JokiTugasKu';
    window.scrollTo(0, 0);

    // Cross-window & storage sync listener
    const syncArticles = () => {
      setArticles(getAllArticles());
    };

    window.addEventListener('storage', syncArticles);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('jt_sync_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'ARTICLES_UPDATED') {
          setArticles(getAllArticles());
        }
      };
    } catch {
      // Ignored if unsupported
    }

    return () => {
      window.removeEventListener('storage', syncArticles);
      if (channel) channel.close();
    };
  }, []);

  return (
    <main className="py-12 bg-surface-mist min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">Blog &amp; Panduan</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artikel &amp; Panduan Akademik Terkini</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            Pusat Edukasi &amp; Panduan Penulisan Tugas
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Kumpulan artikel panduan teknis, tips sitasi, penulisan laporan ilmiah, dan strategi pengerjaan tugas kuliah terpercaya.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Card key={art.id} hoverable className="bg-white flex flex-col justify-between p-6 border-slate-200 shadow-card">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <Badge variant="brand">{art.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {art.readTime || '5 menit baca'}
                  </span>
                </div>

                <Link to={`/blog/${art.slug}`}>
                  <h2 className="font-bold text-lg text-ink-primary leading-snug hover:text-brand-600 transition-colors line-clamp-2">
                    {art.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-ink-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {art.date}
                </span>

                <Link
                  to={`/blog/${art.slug}`}
                  className="text-brand-600 font-bold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Baca Artikel</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Consultation Callout */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-card">
          <BookOpen className="w-10 h-10 text-brand-500 mx-auto" />
          <div className="space-y-1 max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-ink-primary">
              Butuh Bantuan Praktis Mengerjakan Topik Tugas Anda?
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Daripada pusing dengan format penulisan dan tenggat waktu yang menipis, diskusikan langsung materi tugas Anda dengan tim kami via WhatsApp.
            </p>
          </div>
          <div className="pt-2">
            <Button
              href={getWhatsAppUrl('Halo Admin JokiTugasKu, saya ingin tanya tugas setelah membaca artikel di blog.')}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
              className="gap-2 shadow-brand-glow font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp Sekarang</span>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
