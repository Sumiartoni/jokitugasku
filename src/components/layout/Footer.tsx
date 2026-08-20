import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/config/site';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { servicesData } from '@/data/services';

export function Footer() {
  const siteConfig = useSiteConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo JokiTugasKu"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                JokiTugas<span className="text-brand-400">Ku</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Layanan asistensi dan bantuan pengerjaan tugas akademik, makalah, laporan praktikum, proposal, slide PPT, dan skripsi dengan komunikasi transparan langsung via WhatsApp.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>{siteConfig.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Kerahasiaan data & file tugas terjamin aman</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="hover:text-brand-300 transition-colors flex items-center gap-1"
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services Links for SEO */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Layanan Populer
            </h3>
            <ul className="space-y-2.5 text-sm">
              {servicesData.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/layanan/${service.slug}`}
                    className="hover:text-brand-300 transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct WhatsApp Contact & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Hubungi Kami
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Konsultasi gratis & respon cepat setiap hari:
            </p>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 text-sm font-medium transition-colors mb-4 group w-full justify-center sm:justify-start"
            >
              <MessageCircle className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
              <span>{siteConfig.whatsappDisplay}</span>
            </a>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Legal & Kebijakan
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <Link to="/privacy-policy" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="hover:text-white transition-colors">
                    Kebijakan Refund
                  </Link>
                </li>
                <li>
                  <Link to="/kebijakan-revisi" className="hover:text-white transition-colors">
                    Garansi Revisi
                  </Link>
                </li>
                <li>
                  <Link to="/cancellation-policy" className="hover:text-white transition-colors">
                    Kebijakan Pembatalan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} JokiTugasKu.id. Hak cipta dilindungi undang-undang.</p>
          <p className="text-slate-400 text-center md:text-right max-w-lg">
            Catatan: JokiTugasKu menyediakan layanan asistensi penulisan, riset literatur, dan bimbingan format pengerjaan untuk keperluan referensi dan pemahaman materi.
          </p>
        </div>
      </div>
    </footer>
  );
}
