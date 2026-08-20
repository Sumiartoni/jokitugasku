import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PortfolioSection } from '@/components/home/PortfolioSection';
import { CtaBannerSection } from '@/components/home/CtaBannerSection';
import { Badge } from '@/components/ui/Badge';

export function PortofolioPage() {
  useEffect(() => {
    document.title = 'Portofolio & Format Naskah - JokiTugasKu';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-surface-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-primary font-medium">Portofolio</span>
        </nav>
      </div>

      <PortfolioSection />
      <CtaBannerSection />
    </main>
  );
}
