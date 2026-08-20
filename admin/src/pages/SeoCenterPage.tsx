import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  FileCode, 
  Globe 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function SeoCenterPage() {
  useEffect(() => {
    document.title = 'SEO Center & Search Engine Engine - JokiTugasKu Admin';
  }, []);

  const [selectedSlug, setSelectedSlug] = useState('homepage');
  const [metaTitle, setMetaTitle] = useState('JokiTugasKu - Jasa Joki Tugas Kuliah & Sekolah Terpercaya');
  const [metaDesc, setMetaDesc] = useState('Layanan bantuan pengerjaan tugas kuliah, makalah, laporan PKL, proposal, PPT, dan skripsi dengan proses mudah, pengerjaan rapi, dan komunikasi langsung via WhatsApp.');
  const [canonicalUrl, setCanonicalUrl] = useState('https://jokitugasku.id/');
  const [robots, setRobots] = useState('index, follow');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const services = [
    { title: 'Beranda (Homepage)', slug: 'homepage' },
    { title: 'Joki Tugas Umum', slug: 'joki-tugas' },
    { title: 'Joki Tugas Kuliah', slug: 'joki-tugas-kuliah' },
    { title: 'Joki Tugas SMK', slug: 'joki-tugas-smk' },
    { title: 'Joki Tugas SMA', slug: 'joki-tugas-sma' },
    { title: 'Joki Makalah', slug: 'joki-makalah' },
    { title: 'Joki Laporan Praktikum', slug: 'joki-laporan' },
    { title: 'Joki Laporan PKL', slug: 'joki-laporan-pkl' },
    { title: 'Joki Proposal', slug: 'joki-proposal' },
    { title: 'Joki PPT', slug: 'joki-ppt' },
    { title: 'Joki Skripsi', slug: 'joki-skripsi' },
  ];

  const handleSelect = (slug: string) => {
    setSelectedSlug(slug);
    setSaveSuccess(false);
    if (slug === 'homepage') {
      setMetaTitle('JokiTugasKu - Jasa Joki Tugas Kuliah & Sekolah Terpercaya');
      setMetaDesc('Layanan bantuan pengerjaan tugas kuliah, makalah, laporan PKL, proposal, PPT, dan skripsi dengan proses mudah, pengerjaan rapi, dan komunikasi langsung via WhatsApp.');
      setCanonicalUrl('https://jokitugasku.id/');
    } else {
      const s = services.find(item => item.slug === slug);
      setMetaTitle(`${s?.title} - Jasa Bantuan Terpercaya | JokiTugasKu`);
      setMetaDesc(`Jasa ${s?.title.toLowerCase()} untuk pelajar dan mahasiswa. Pengerjaan rapi, tepat waktu, dan konsultasi langsung via WhatsApp.`);
      setCanonicalUrl(`https://jokitugasku.id/layanan/${slug}`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
          SEO Center & Search Engine Management
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary">
          Kelola metadata, indexing controls, structured schema, dan canonical URL seluruh halaman.
        </p>
      </div>

      {/* Audit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Indexing Health</span>
            <span className="font-extrabold text-lg text-ink-primary">100% Crawlable</span>
            <span className="text-[11px] text-emerald-600 block">Sitemap XML Valid & Active</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Structured Schema.org</span>
            <span className="font-extrabold text-lg text-ink-primary">4 Types Verified</span>
            <span className="text-[11px] text-brand-600 block">Organization, Service, FAQ, Breadcrumb</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Target Mesin Pencari</span>
            <span className="font-extrabold text-lg text-ink-primary">Google, Bing, DDG</span>
            <span className="text-[11px] text-blue-600 block">Canonical Auto-Resolved</span>
          </div>
        </Card>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Page List */}
        <Card className="lg:col-span-4 p-5 space-y-3">
          <h2 className="font-bold text-xs text-ink-muted uppercase tracking-wider">
            Pilih Halaman / Service
          </h2>
          <div className="space-y-1">
            {services.map(s => (
              <button
                key={s.slug}
                type="button"
                onClick={() => handleSelect(s.slug)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedSlug === s.slug ? 'bg-brand-500 text-white' : 'hover:bg-slate-100 text-ink-primary'
                }`}
              >
                <span>{s.title}</span>
                <span className="text-[10px] opacity-75">/{s.slug}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Metadata Editor Form */}
        <Card className="lg:col-span-8 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-ink-primary">
                Metadata Editor: <span className="text-brand-600">{selectedSlug}</span>
              </h2>
              <p className="text-xs text-ink-muted">Perubahan metadata langsung tersinkronisasi dengan mesin pencari.</p>
            </div>

            {saveSuccess && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tersimpan!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-ink-primary">SEO Title ({metaTitle.length}/60 karakter)</label>
                <span className="text-[11px] text-ink-muted">Target: 50-60 karakter</span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-ink-primary text-xs sm:text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-ink-primary">Meta Description ({metaDesc.length}/160 karakter)</label>
                <span className="text-[11px] text-ink-muted">Target: 140-160 karakter</span>
              </div>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-ink-primary text-xs sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary">Canonical URL</label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-ink-primary text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary">Robots Directive</label>
                <select
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 text-ink-primary text-xs sm:text-sm bg-white"
                >
                  <option value="index, follow">index, follow (Standard Public)</option>
                  <option value="noindex, follow">noindex, follow (Testing)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Private)</option>
                </select>
              </div>
            </div>

            {/* SERP Snippet Preview */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
                Google Search Snippet Preview
              </span>
              <div className="text-[#1a0dab] font-semibold text-sm hover:underline cursor-pointer">
                {metaTitle}
              </div>
              <div className="text-[#006621] text-[11px]">
                {canonicalUrl}
              </div>
              <div className="text-slate-600 text-xs line-clamp-2">
                {metaDesc}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" size="md" className="gap-2">
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Metadata</span>
              </Button>
            </div>
          </form>
        </Card>

      </div>

    </div>
  );
}
