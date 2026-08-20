import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Menu, X, ArrowUpRight } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '@/config/site';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="JokiTugasKu - Beranda"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Logo JokiTugasKu"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(122,53,255,0.3)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-ink-primary tracking-tight leading-none group-hover:text-brand-600 transition-colors">
                JokiTugas<span className="text-brand-500">Ku</span>
              </span>
              <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mt-0.5">
                Solusi Akademik
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Navigasi Utama">
            {siteConfig.navigation.map((item) => {
              const isAnchor = item.href.startsWith('/#');
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-600 bg-brand-50 font-semibold'
                      : 'text-ink-secondary hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop WhatsApp CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              className="gap-2 shadow-brand-glow"
              id="header-whatsapp-cta"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Chat WhatsApp</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="sm"
              className="py-1.5 px-3 text-xs"
              id="header-mobile-whatsapp-cta"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WA</span>
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Backdrop Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="lg:hidden fixed inset-x-0 top-[57px] bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 z-50">
            <div className="flex flex-col space-y-1">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-4 py-3 rounded-xl text-base font-medium text-ink-primary hover:bg-brand-50 hover:text-brand-600 transition-colors flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-ink-light" />
                </Link>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <div className="text-xs text-ink-muted px-4 mb-1">
                Konsultasi langsung tanpa bot:
              </div>
              <Button
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="w-full justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat WhatsApp Sekarang</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
