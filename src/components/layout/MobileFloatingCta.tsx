import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';
import { getWhatsAppUrl } from '@/config/site';

export function MobileFloatingCta() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-white/90 backdrop-blur-md border-t border-slate-200/80 shadow-elevated">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-col pl-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Admin Siap Respon</span>
          </div>
          <span className="text-xs font-bold text-ink-primary">Butuh bantuan tugas?</span>
        </div>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold text-sm shadow-brand-glow transition-all"
          id="mobile-bottom-whatsapp-cta"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span>Chat WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
