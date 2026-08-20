import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileFloatingCta } from '@/components/layout/MobileFloatingCta';
import { HomePage } from '@/pages/HomePage';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';
import { CaraOrderPage } from '@/pages/CaraOrderPage';
import { PortofolioPage } from '@/pages/PortofolioPage';
import { HargaPage } from '@/pages/HargaPage';
import { FaqPage } from '@/pages/FaqPage';
import { TentangPage } from '@/pages/TentangPage';
import { KontakPage } from '@/pages/KontakPage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogDetailPage } from '@/pages/BlogDetailPage';
import { LegalPage } from '@/pages/LegalPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Scroll restoration component
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-surface-mist text-ink-primary font-sans">
        <Header />
        <div className="flex-grow">
          <Routes>
            {/* Core Public SEO Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/layanan/:slug" element={<ServiceDetailPage />} />
            <Route path="/cara-order" element={<CaraOrderPage />} />
            <Route path="/portofolio" element={<PortofolioPage />} />
            <Route path="/harga" element={<HargaPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/tentang" element={<TentangPage />} />
            <Route path="/kontak" element={<KontakPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />

            {/* Legal & Policy Routes */}
            <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
            <Route path="/kebijakan-privasi" element={<LegalPage type="privacy" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/syarat-ketentuan" element={<LegalPage type="terms" />} />
            <Route path="/refund-policy" element={<LegalPage type="refund" />} />
            <Route path="/kebijakan-refund" element={<LegalPage type="refund" />} />
            <Route path="/kebijakan-revisi" element={<LegalPage type="revision" />} />
            <Route path="/revision-policy" element={<LegalPage type="revision" />} />
            <Route path="/cancellation-policy" element={<LegalPage type="cancellation" />} />
            <Route path="/kebijakan-pembatalan" element={<LegalPage type="cancellation" />} />
            <Route path="/payment-policy" element={<LegalPage type="payment" />} />
            <Route path="/kebijakan-pembayaran" element={<LegalPage type="payment" />} />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
        <MobileFloatingCta />
      </div>
    </BrowserRouter>
  );
}

export default App;
