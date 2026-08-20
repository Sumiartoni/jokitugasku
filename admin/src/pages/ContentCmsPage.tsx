import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  X,
  Save,
  Trash2,
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ServiceContent {
  title: string;
  slug: string;
  target: string;
  status: 'PUBLISHED' | 'DRAFT';
}

interface ArticleContent {
  title: string;
  category: string;
  date: string;
  status: 'PUBLISHED' | 'DRAFT';
}

interface FaqContent {
  question: string;
  answer: string;
  category: string;
}

export function ContentCmsPage() {
  useEffect(() => {
    document.title = 'Content CMS & Page Editor - JokiTugasKu Admin';
  }, []);

  const [activeTab, setActiveTab] = useState<'services' | 'blog' | 'faq'>('services');

  // ---- Modal state ----
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'service' | 'article' | 'faq'; index: number } | null>(null);
  
  // Edit Form Fields
  const [editTitle, setEditTitle] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editStatus, setEditStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [services, setServices] = useState<ServiceContent[]>([
    { title: 'Joki Tugas Umum', slug: 'joki-tugas', target: 'Siswa SMP, SMA & Mahasiswa Awal', status: 'PUBLISHED' },
    { title: 'Joki Tugas Kuliah', slug: 'joki-tugas-kuliah', target: 'Mahasiswa D3, D4, & S1', status: 'PUBLISHED' },
    { title: 'Joki Tugas SMK', slug: 'joki-tugas-smk', target: 'Siswa SMK Semua Jurusan', status: 'PUBLISHED' },
    { title: 'Joki Tugas SMA', slug: 'joki-tugas-sma', target: 'Siswa SMA IPA & IPS', status: 'PUBLISHED' },
    { title: 'Joki Makalah', slug: 'joki-makalah', target: 'Mahasiswa & Pelajar', status: 'PUBLISHED' },
    { title: 'Joki Laporan Praktikum', slug: 'joki-laporan', target: 'Mahasiswa Sains & Teknik', status: 'PUBLISHED' },
    { title: 'Joki Laporan PKL', slug: 'joki-laporan-pkl', target: 'Siswa SMK & Mahasiswa Magang', status: 'PUBLISHED' },
    { title: 'Joki Proposal', slug: 'joki-proposal', target: 'Mahasiswa Skripsi & Organisasi', status: 'PUBLISHED' },
    { title: 'Joki PPT', slug: 'joki-ppt', target: 'Presenter & Mahasiswa Sidang', status: 'PUBLISHED' },
    { title: 'Joki Skripsi', slug: 'joki-skripsi', target: 'Mahasiswa Tingkat Akhir', status: 'PUBLISHED' },
  ]);

  const [articles, setArticles] = useState<ArticleContent[]>([
    { title: 'Panduan Praktis Format Sitasi APA Style 7th Edition untuk Makalah Kuliah', category: 'Panduan Makalah', date: '15 Agt 2026', status: 'PUBLISHED' },
    { title: 'Struktur Baku Penyusunan Laporan PKL & Magang MBKM agar Cepat Disetujui Dosen', category: 'Laporan PKL', date: '10 Agt 2026', status: 'PUBLISHED' },
    { title: '7 Tips Mendesain Slide Presentasi Sidang Skripsi yang Bersih dan Terfokus', category: 'Presentasi & PPT', date: '05 Agt 2026', status: 'PUBLISHED' },
  ]);

  const [faqs, setFaqs] = useState<FaqContent[]>([
    { question: 'Bagaimana cara memesan joki tugas di JokiTugasKu?', answer: 'Cukup klik tombol Chat WhatsApp, kirimkan instruksi soal/modul tugas dan deadline Anda. Admin kami akan langsung memberikan estimasi biaya dan waktu pengerjaan.', category: 'Pemesanan' },
    { question: 'Apakah kerahasiaan identitas dan data saya terjamin?', answer: '100% aman dan rahasia. Kami menerapkan isolasi data ketat sehingga penjoki hanya menerima materi teknis tanpa akses ke kontak pribadi Anda.', category: 'Keamanan' },
    { question: 'Apakah ada garansi revisi jika tugas belum sesuai?', answer: 'Ya, kami menyediakan garansi revisi gratis sesuai dengan brief dan instruksi awal yang telah disepakati.', category: 'Garansi' },
    { question: 'Metode pembayaran apa saja yang didukung?', answer: 'Pembayaran dapat dilakukan melalui transfer bank (BCA, Mandiri, BNI, BRI) serta e-wallet (QRIS, GoPay, OVO, DANA, ShopeePay).', category: 'Pembayaran' },
  ]);

  // ---- Handlers ----
  const openEditService = (idx: number) => {
    const s = services[idx];
    setEditingItem({ type: 'service', index: idx });
    setEditTitle(s.title);
    setEditTarget(s.target);
    setEditStatus(s.status);
    setEditModalOpen(true);
    setSaveSuccess(false);
  };

  const openEditArticle = (idx: number) => {
    const a = articles[idx];
    setEditingItem({ type: 'article', index: idx });
    setEditTitle(a.title);
    setEditCategory(a.category);
    setEditStatus(a.status);
    setEditModalOpen(true);
    setSaveSuccess(false);
  };

  const openEditFaq = (idx: number) => {
    const f = faqs[idx];
    setEditingItem({ type: 'faq', index: idx });
    setEditTitle(f.question);
    setEditAnswer(f.answer);
    setEditCategory(f.category);
    setEditModalOpen(true);
    setSaveSuccess(false);
  };

  const openAddNew = () => {
    if (activeTab === 'services') {
      setEditingItem({ type: 'service', index: -1 });
      setEditTitle('');
      setEditTarget('');
      setEditStatus('DRAFT');
    } else if (activeTab === 'blog') {
      setEditingItem({ type: 'article', index: -1 });
      setEditTitle('');
      setEditCategory('Panduan Akademik');
      setEditStatus('DRAFT');
    } else {
      setEditingItem({ type: 'faq', index: -1 });
      setEditTitle('');
      setEditAnswer('');
      setEditCategory('Umum');
    }
    setEditModalOpen(true);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    if (!editingItem || !editTitle.trim()) return;

    if (editingItem.type === 'service') {
      if (editingItem.index === -1) {
        const slug = editTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        setServices(prev => [...prev, { title: editTitle, slug, target: editTarget || 'Umum', status: editStatus }]);
      } else {
        setServices(prev => prev.map((s, i) => i === editingItem.index ? { ...s, title: editTitle, target: editTarget, status: editStatus } : s));
      }
    } else if (editingItem.type === 'article') {
      if (editingItem.index === -1) {
        const today = new Date();
        const dateStr = `${today.getDate().toString().padStart(2, '0')} Agt ${today.getFullYear()}`;
        setArticles(prev => [...prev, { title: editTitle, category: editCategory || 'Umum', date: dateStr, status: editStatus }]);
      } else {
        setArticles(prev => prev.map((a, i) => i === editingItem.index ? { ...a, title: editTitle, category: editCategory, status: editStatus } : a));
      }
    } else if (editingItem.type === 'faq') {
      if (editingItem.index === -1) {
        setFaqs(prev => [...prev, { question: editTitle, answer: editAnswer, category: editCategory || 'Umum' }]);
      } else {
        setFaqs(prev => prev.map((f, i) => i === editingItem.index ? { ...f, question: editTitle, answer: editAnswer, category: editCategory } : f));
      }
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setEditModalOpen(false);
      setEditingItem(null);
      setSaveSuccess(false);
    }, 1000);
  };

  const handleDelete = () => {
    if (!editingItem || editingItem.index === -1) return;
    if (!confirm('Apakah Anda yakin ingin menghapus konten ini?')) return;

    if (editingItem.type === 'service') {
      setServices(prev => prev.filter((_, i) => i !== editingItem.index));
    } else if (editingItem.type === 'article') {
      setArticles(prev => prev.filter((_, i) => i !== editingItem.index));
    } else if (editingItem.type === 'faq') {
      setFaqs(prev => prev.filter((_, i) => i !== editingItem.index));
    }
    setEditModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
              Content CMS (Layanan, Blog, &amp; FAQ)
            </h1>
            <Badge variant="brand" className="text-[10px]">CMS Editor</Badge>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Kelola katalog layanan, postingan blog edukasi, dan tanya-jawab yang tampil di website publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" className="gap-1.5 self-start sm:self-auto shadow-brand-glow" onClick={openAddNew}>
            <Plus className="w-4 h-4" />
            <span>Tambah Konten Baru</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'services' ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Katalog Layanan ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blog')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'blog' ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Artikel Blog ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'faq' ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tanya Jawab FAQ ({faqs.length})</span>
        </button>
      </div>

      {/* Content Table */}
      <Card className="overflow-hidden border-slate-200">
        
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-ink-muted font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Nama Layanan</th>
                  <th className="p-4">Slug URL</th>
                  <th className="p-4">Target Pengguna</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-ink-secondary">
                {services.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-ink-primary text-sm">{s.title}</td>
                    <td className="p-4 font-mono text-[11px] text-brand-700 font-medium">/layanan/{s.slug}</td>
                    <td className="p-4 text-ink-secondary">{s.target}</td>
                    <td className="p-4">
                      <Badge variant={s.status === 'PUBLISHED' ? 'success' : 'warning'}>{s.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditService(idx)}
                        className="text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-brand-50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-ink-muted font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Judul Artikel</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Tanggal Publikasi</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-ink-secondary">
                {articles.map((art, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-ink-primary text-sm max-w-md">{art.title}</td>
                    <td className="p-4"><Badge variant="brand">{art.category}</Badge></td>
                    <td className="p-4 text-ink-muted">{art.date}</td>
                    <td className="p-4">
                      <Badge variant={art.status === 'PUBLISHED' ? 'success' : 'warning'}>{art.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditArticle(idx)}
                        className="text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-brand-50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-ink-muted font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Pertanyaan FAQ</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Jawaban Singkat</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-ink-secondary">
                {faqs.map((faq, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-ink-primary text-sm max-w-xs">{faq.question}</td>
                    <td className="p-4"><Badge variant="neutral">{faq.category}</Badge></td>
                    <td className="p-4 text-ink-muted text-[11px] max-w-md truncate">{faq.answer}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditFaq(idx)}
                        className="text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-brand-50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </Card>

      {/* ---- Edit / Add Modal Overlay ---- */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => { setEditModalOpen(false); setEditingItem(null); }}
              className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-ink-primary">
                {editingItem?.index === -1 ? 'Tambah Konten Baru' : 'Edit Konten'}
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                {editingItem?.type === 'service' ? 'Katalog Layanan' : editingItem?.type === 'article' ? 'Artikel Blog' : 'Tanya Jawab FAQ'}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">
                  {editingItem?.type === 'service' ? 'Nama Layanan' : editingItem?.type === 'article' ? 'Judul Artikel' : 'Pertanyaan FAQ'}
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Masukkan judul atau pertanyaan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-ink-primary text-xs sm:text-sm"
                  required
                />
              </div>

              {editingItem?.type === 'service' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Target Pengguna</label>
                  <input
                    type="text"
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    placeholder="Contoh: Mahasiswa D3 &amp; S1 Semua Jurusan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-ink-primary text-xs sm:text-sm"
                  />
                </div>
              )}

              {editingItem?.type === 'article' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Kategori Artikel</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Contoh: Panduan Makalah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-ink-primary text-xs sm:text-sm"
                  />
                </div>
              )}

              {editingItem?.type === 'faq' && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-bold text-ink-primary block">Kategori FAQ</label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Contoh: Pemesanan / Garansi / Keamanan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-ink-primary text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-ink-primary block">Jawaban FAQ</label>
                    <textarea
                      rows={4}
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      placeholder="Tuliskan jawaban yang jelas dan informatif..."
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-ink-primary text-xs sm:text-sm"
                    />
                  </div>
                </>
              )}

              {editingItem?.type !== 'faq' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Status Publikasi</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'PUBLISHED' | 'DRAFT')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-ink-primary text-xs sm:text-sm font-semibold text-brand-700"
                  >
                    <option value="PUBLISHED">PUBLISHED (Dipublikasikan)</option>
                    <option value="DRAFT">DRAFT (Draf)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                {editingItem?.index !== -1 && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {saveSuccess ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Tersimpan!
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => { setEditModalOpen(false); setEditingItem(null); }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-slate-100 transition-colors"
                    >
                      Batal
                    </button>
                    <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Konten</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
