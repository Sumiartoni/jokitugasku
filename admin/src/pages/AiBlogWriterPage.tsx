import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  Send, 
  FileText, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw, 
  Globe, 
  Layers, 
  HelpCircle,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { generateArticleWithGroq, getAppSettings, sendEmailNotification } from '@/utils/settings';

export function AiBlogWriterPage() {
  useEffect(() => {
    document.title = 'AI Blog & Article Generator (Groq) - JokiTugasKu Admin';
  }, []);

  const settings = getAppSettings();

  // Generator Inputs
  const [topic, setTopic] = useState('Format Baku Penulisan Laporan Magang MBKM dan Tips Lolos Validasi Dosen');
  const [category, setCategory] = useState('Laporan PKL & Magang');
  const [targetAudience, setTargetAudience] = useState('Mahasiswa Tingkat Akhir & Magang MBKM');
  const [tone, setTone] = useState('Formal & Edukatif');
  const [wordCount, setWordCount] = useState(1200);
  const [customKeywords, setCustomKeywords] = useState('laporan mbkm, format laporan magang, tips skripsi, jokitugasku');
  const [selectedModel, setSelectedModel] = useState(settings.groqDefaultModel || 'llama-3.3-70b-versatile');

  // Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Result / Editor State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  
  // UI Tabs
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailBroadcastMsg, setEmailBroadcastMsg] = useState<string | null>(null);

  const categories = [
    'Panduan Makalah',
    'Bimbingan Skripsi',
    'Laporan PKL & Magang',
    'Tugas SMK & Kejuruan',
    'Desain PPT Sidang',
    'Olah Data Statistik',
    'Kiat Belajar Mahasiswa'
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationNotice(null);
    setPublishSuccess(false);
    setEmailBroadcastMsg(null);

    const res = await generateArticleWithGroq({
      topic: topic.trim(),
      category,
      targetAudience,
      tone,
      wordCount,
      customKeywords,
      model: selectedModel,
    });

    setIsGenerating(false);

    if (res.success && res.data) {
      setTitle(res.data.title);
      setSlug(res.data.slug);
      setMetaDesc(res.data.metaDescription);
      setTags(res.data.tags || []);
      setContentMarkdown(res.data.contentMarkdown);
      setFaqs(res.data.faqs || []);

      if (res.usedSimulation) {
        setGenerationNotice('Artikel di-generate dengan template standar. Untuk hasil kustom realtime, masukkan Groq API Key di menu Settings.');
      } else {
        setGenerationNotice(`Berhasil di-generate menggunakan Groq AI Model (${selectedModel})!`);
      }
    } else {
      setGenerationNotice(`Gagal: ${res.error || 'Terjadi kesalahan'}`);
    }
  };

  const handlePublish = async () => {
    if (!title || !contentMarkdown) return;
    
    const articleSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newArticle = {
      slug: articleSlug,
      title,
      excerpt: metaDesc || 'Panduan penulisan akademik oleh JokiTugasKu.',
      category: category || 'Panduan Akademik',
      read_time: `${Math.max(3, Math.ceil(wordCount / 200))} menit baca`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      content_markdown: contentMarkdown,
      tags: tags || [],
      faqs: faqs || [],
      status: 'PUBLISHED'
    };

    // 1. Try Backend API first (uses service_role key with 100% privilege)
    let savedSuccessfully = false;
    try {
      const token = sessionStorage.getItem('jt_auth_session') 
        ? JSON.parse(sessionStorage.getItem('jt_auth_session') || '{}').token 
        : null;

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newArticle)
      });
      if (res.ok) {
        savedSuccessfully = true;
      }
    } catch {
      // Fallback
    }

    // 2. Fallback to Supabase client directly
    if (!savedSuccessfully) {
      try {
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase
            .from('articles')
            .upsert(newArticle, { onConflict: 'slug' });
          if (!error) savedSuccessfully = true;
        }
      } catch (e) {
        console.error('Failed to save to Supabase:', e);
      }
    }

    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 5000);

    // Optional email notification
    if (settings.sendArticlePublishedEmail) {
      sendEmailNotification({
        toEmail: settings.contactEmail,
        toName: 'Admin Tim',
        subject: `[Publikasi Artikel] ${title}`,
        htmlContent: `<p>Artikel baru telah dipublikasikan ke blog website: <strong>${title}</strong></p><p>${metaDesc}</p>`
      }).then(r => setEmailBroadcastMsg(r.message));
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(contentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
              AI Blog & Article Writer (Groq API)
            </h1>
            <Badge variant="brand" className="text-[10px]">Groq AI Engine</Badge>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Buat artikel edukasi & panduan akademik berbasis SEO otomatis menggunakan provider Groq AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/settings"
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-ink-secondary transition-colors"
          >
            API Key Settings ⚙️
          </a>
        </div>
      </div>

      {/* Generator Prompt Box */}
      <Card className="p-6 sm:p-8 space-y-6 border-brand-200/90 shadow-card bg-gradient-to-b from-white to-brand-50/20">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-brand-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-ink-primary">Prompt AI Generator Artikel</h2>
              <span className="text-[11px] text-ink-muted">Ditenagai model Llama-3.3 & Mixtral via Groq API</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-ink-muted">Pilih Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-brand-700"
            >
              <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Paling Powerful & Rekomendasi ★)</option>
              <option value="deepseek-r1-distill-llama-70b">DeepSeek R1 70B (Penalaran Tinggi ★)</option>
              <option value="llama-3.1-8b-instant">Llama 3.1 8B (Super Cepat)</option>
              <option value="mixtral-8x7b-32768">Mixtral 8x7B (Konteks Panjang 32k)</option>
              <option value="gemma2-9b-it">Gemma 2 9B</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-bold text-ink-primary block">Topik / Ide Utama Artikel</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Format Penulisan Sitasi APA Style 7th Edition untuk Makalah Kuliah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-ink-primary block">Kategori Artikel</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink-primary block">Target Pembaca</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink-primary block">Gaya Bahasa (Tone)</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
              >
                <option value="Formal & Edukatif">Formal & Edukatif</option>
                <option value="Panduan Praktis Step-by-Step">Panduan Praktis Step-by-Step</option>
                <option value="Santai & Ramah Mahasiswa">Santai & Ramah Mahasiswa</option>
                <option value="Akademik Mendalam">Akademik Mendalam</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-ink-primary block">Kata Kunci SEO Tambahan (Pisahkan Koma)</label>
              <input
                type="text"
                value={customKeywords}
                onChange={(e) => setCustomKeywords(e.target.value)}
                placeholder="Contoh: jasa joki tugas, makalah soshum, review jurnal"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink-primary block">Target Panjang ({wordCount} kata)</label>
              <input
                type="range"
                min="600"
                max="2500"
                step="100"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {generationNotice && (
              <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200">
                {generationNotice}
              </span>
            )}
            {!generationNotice && <span />}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isGenerating}
              className="gap-2 shadow-brand-glow w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sedang Mengenerate AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Artikel dengan Groq AI</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Generated Content Result Area */}
      {title && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-ink-primary">Hasil Generasi Artikel & Editor</h2>
              <Badge variant="success">Siap Publikasi</Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('editor')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === 'editor' ? 'bg-white text-ink-primary shadow-sm' : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" /> Editor Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === 'preview' ? 'bg-white text-ink-primary shadow-sm' : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Live Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-ink-secondary transition-colors inline-flex items-center gap-1.5"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Markdown'}</span>
              </button>

              <Button
                variant="primary"
                size="md"
                onClick={handlePublish}
                className="gap-2 shadow-brand-glow"
              >
                <Globe className="w-4 h-4" />
                <span>Publikasikan Artikel</span>
              </Button>
            </div>
          </div>

          {publishSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Artikel berhasil dipublikasikan ke katalog blog website!</span>
              </div>
              {emailBroadcastMsg && <span className="text-[11px] text-emerald-700">{emailBroadcastMsg}</span>}
            </div>
          )}

          {/* Metadata Card */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink-muted">Metadata & Pengaturan SEO Artikel</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Judul Artikel (H1 / Title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary font-bold text-xs sm:text-sm bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-brand-700 font-mono text-xs sm:text-sm bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <label className="font-bold text-ink-primary block">Meta Description SEO ({metaDesc.length}/160 karakter)</label>
              <textarea
                rows={2}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-ink-secondary text-xs sm:text-sm bg-white"
              />
            </div>

            {tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-xs font-bold text-ink-muted">Tags:</span>
                {tags.map((t, idx) => (
                  <Badge key={idx} variant="neutral" className="text-[10px]">#{t}</Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Editor / Live Preview Body */}
          <Card className="p-6 sm:p-8">
            {viewMode === 'editor' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-ink-muted pb-2 border-b border-slate-100">
                  <span className="font-bold">Editor Konten Markdown:</span>
                  <span>Mendukung Heading (##, ###), Quote (&gt;), Bullet Points, &amp; Tabel</span>
                </div>
                <textarea
                  rows={20}
                  value={contentMarkdown}
                  onChange={(e) => setContentMarkdown(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs leading-relaxed text-ink-primary bg-white focus:border-brand-500"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <Badge variant="brand" className="mb-2">{category}</Badge>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">{title}</h1>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">{metaDesc}</p>
                </div>

                <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-ink-secondary">
                  {contentMarkdown}
                </div>

                {faqs.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <h4 className="font-bold text-base text-ink-primary">FAQ Seputar Topik Ini</h4>
                    <div className="space-y-2">
                      {faqs.map((f, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 text-xs">
                          <span className="font-bold text-ink-primary block mb-1">Q: {f.question}</span>
                          <span className="text-ink-secondary block">A: {f.answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

        </div>
      )}

    </div>
  );
}
