import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  X, 
  Save, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  read_time: string;
  date: string;
  content_markdown: string;
  tags: string[];
  status: 'PUBLISHED' | 'DRAFT';
  created_at?: string;
}

export function ArticlesManagementPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Panduan Makalah');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formStatus, setFormStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setArticles(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to fetch articles from Supabase', e);
    }

    // Fallback to local storage
    try {
      const raw = localStorage.getItem('jt_articles_cms');
      if (raw) {
        const parsed = JSON.parse(raw);
        setArticles(parsed.map((p: any) => ({
          id: p.id || p.slug,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          read_time: p.readTime || p.read_time || '5 menit baca',
          date: p.date,
          content_markdown: p.contentMarkdown || p.content_markdown || '',
          tags: p.tags || [],
          status: p.status || 'PUBLISHED'
        })));
      }
    } catch {
      // Ignored
    }
    setIsLoading(false);
  };

  useEffect(() => {
    document.title = 'Kelola Artikel Blog - JokiTugasKu Admin';
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Panduan Makalah');
    setFormExcerpt('');
    setFormContent('');
    setFormTags('');
    setFormStatus('PUBLISHED');
    setModalOpen(true);
  };

  const openEditModal = (article: ArticleItem) => {
    setIsEditing(true);
    setCurrentId(article.id);
    setFormTitle(article.title);
    setFormSlug(article.slug);
    setFormCategory(article.category);
    setFormExcerpt(article.excerpt);
    setFormContent(article.content_markdown);
    setFormTags((article.tags || []).join(', '));
    setFormStatus(article.status);
    setModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsSaving(true);
    const slug = formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean);

    const articleData = {
      slug,
      title: formTitle.trim(),
      excerpt: formExcerpt.trim() || 'Panduan penulisan akademik resmi oleh JokiTugasKu.',
      category: formCategory,
      read_time: '5 menit baca',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      content_markdown: formContent,
      tags: tagsArray,
      status: formStatus
    };

    let saved = false;

    // 1. Try Backend API
    try {
      const token = sessionStorage.getItem('jt_auth_session') 
        ? JSON.parse(sessionStorage.getItem('jt_auth_session') || '{}').token 
        : null;

      const url = isEditing && currentId ? `/api/articles/${currentId}` : '/api/articles';
      const method = isEditing && currentId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(articleData)
      });
      if (res.ok) saved = true;
    } catch {
      // Fallback
    }

    // 2. Fallback to Supabase client
    if (!saved) {
      try {
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
        if (isSupabaseConfigured && supabase) {
          if (isEditing && currentId) {
            await supabase
              .from('articles')
              .update({ ...articleData, updated_at: new Date().toISOString() })
              .eq('id', currentId);
          } else {
            await supabase
              .from('articles')
              .upsert(articleData, { onConflict: 'slug' });
          }
        }
      } catch (err) {
        console.error('Error saving article to Supabase', err);
      }
    }

    await loadArticles();
    setIsSaving(false);
    setModalOpen(false);
    showToast(isEditing ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil diterbitkan ke Blog!');
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return;

    // Try backend API first
    let deleted = false;
    try {
      const token = sessionStorage.getItem('jt_auth_session') 
        ? JSON.parse(sessionStorage.getItem('jt_auth_session') || '{}').token 
        : null;

      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) deleted = true;
    } catch {
      // Fallback
    }

    if (!deleted) {
      try {
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
        if (isSupabaseConfigured && supabase) {
          await supabase.from('articles').delete().eq('id', id);
        }
      } catch (e) {
        console.error('Failed to delete', e);
      }
    }

    setArticles(prev => prev.filter(a => a.id !== id));
    showToast('Artikel berhasil dihapus.');
  };

  const toggleStatus = async (article: ArticleItem) => {
    const newStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (isSupabaseConfigured && supabase) {
        await supabase
          .from('articles')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', article.id);
      }
    } catch (e) {
      console.error('Failed to toggle status', e);
    }

    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
    showToast(`Status artikel diubah menjadi ${newStatus}`);
  };

  const filteredArticles = articles.filter(a => {
    const matchQuery = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       a.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'Semua' || a.category === categoryFilter;
    return matchQuery && matchCategory;
  });

  const categories = ['Semua', 'Panduan Makalah', 'Laporan PKL', 'Presentasi & PPT', 'Skripsi', 'Tips Akademik', 'Panduan Belajar'];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
              Kelola Artikel Blog & Edukasi
            </h1>
            <Badge variant="brand" className="text-xs font-bold">
              {articles.length} Artikel
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Manajemen artikel blog resmi JokiTugasKu yang langsung tampil di halaman landing page /blog.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadArticles}
            disabled={isLoading}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <a href="/ai-blog">
            <Button variant="secondary" size="sm" className="text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-500" />
              <span>Generate AI</span>
            </Button>
          </a>

          <Button variant="primary" size="sm" onClick={openCreateModal} className="text-xs">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tulis Artikel Baru</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-subtle border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul artikel atau topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table / Cards */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-subtle space-y-3">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-ink-secondary">Memuat artikel dari database Supabase...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-subtle space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-ink-primary">Belum ada artikel ditemukan</h3>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto">
            Tidak ada artikel yang cocok dengan filter. Tulis artikel baru atau generate dengan AI Writer.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal} className="text-xs">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tulis Artikel Pertama</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <div 
              key={article.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
                    {article.category}
                  </span>
                  
                  <button
                    onClick={() => toggleStatus(article)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                      article.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {article.status === 'PUBLISHED' ? '● Live Terbit' : '○ Draft'}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-ink-primary leading-snug line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://jokitugasku.id/blog/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Lihat di Website Publik"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => openEditModal(article)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Edit Artikel"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteArticle(article.id, article.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-ink-primary">
                  {isEditing ? 'Edit Artikel Blog' : 'Tulis Artikel Blog Baru'}
                </h2>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Artikel akan langsung tersimpan di database Supabase dan tampil di landing page.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Panduan Lengkap Sitasi APA Style 7th Edition"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-primary mb-1">
                    Kategori Artikel
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                  >
                    <option value="Panduan Makalah">Panduan Makalah</option>
                    <option value="Laporan PKL">Laporan PKL</option>
                    <option value="Presentasi & PPT">Presentasi & PPT</option>
                    <option value="Skripsi">Skripsi</option>
                    <option value="Tips Akademik">Tips Akademik</option>
                    <option value="Panduan Belajar">Panduan Belajar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-primary mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                  >
                    <option value="PUBLISHED">PUBLISHED (Langsung Terbit)</option>
                    <option value="DRAFT">DRAFT (Simpan Sementara)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1">
                  Ringkasan / Excerpt (Meta Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan singkat isi artikel untuk tampilan preview kartu dan SEO..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1">
                  Isi Lengkap Artikel (Format Markdown) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Tuliskan konten artikel dengan format Markdown (## Heading 2, - Bullet point, **Bold**)..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1">
                  Tags (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Makalah, Format APA, Kuliah"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  className="text-xs"
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSaving}
                  className="text-xs"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan & Publikasikan'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
