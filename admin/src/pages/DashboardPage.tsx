import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Users, 
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FolderOpen,
  FileText,
  Search,
  Globe,
  FileCode,
  Compass,
  ArrowRight,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { LiveClockBadge } from '@/components/ui/LiveClockBadge';

export function DashboardPage() {
  const { tasks } = useTasks();
  const { usersList } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'Dashboard Super Admin - JokiTugasKu';

    // Fetch real articles count and list
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setArticles(data.data);
        }
      })
      .catch(() => {});

    // Fetch real CRM leads
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setLeads(data.data);
        } else {
          try {
            const raw = localStorage.getItem('jt_crm_leads');
            if (raw) setLeads(JSON.parse(raw));
          } catch {}
        }
      })
      .catch(() => {
        try {
          const raw = localStorage.getItem('jt_crm_leads');
          if (raw) setLeads(JSON.parse(raw));
        } catch {}
      });
  }, []);

  const publishedArticles = articles.filter(a => a.status === 'PUBLISHED');
  const activeTasksCount = tasks.filter(t => ['IN_PROGRESS', 'REVIEW', 'REVISION', 'ASSIGNED'].includes(t.status)).length;
  const reviewTasksCount = tasks.filter(t => t.status === 'REVIEW').length;

  const kpis = [
    { 
      label: 'Artikel Blog SEO (Live)', 
      value: `${publishedArticles.length}`, 
      change: publishedArticles.length > 0 ? `${publishedArticles.length} Artikel Terbit` : '0 Terpublikasi', 
      icon: FileText, 
      color: 'text-brand-600', 
      bg: 'bg-brand-50' 
    },
    { 
      label: 'Total WhatsApp Leads', 
      value: `${leads.length}`, 
      change: `${leads.filter(l => l.status === 'NEW').length} Lead Baru`, 
      icon: MessageCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Tugas Aktif Pipeline', 
      value: `${activeTasksCount}`, 
      change: `${reviewTasksCount} Siap Diperiksa`, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Tim User & Worker', 
      value: `${usersList.length}`, 
      change: `${usersList.filter(u => u.role === 'WORKER').length} Penjoki Aktif`, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
  ];

  const targetKeywords = [
    { keyword: 'joki tugas kuliah', page: '/layanan/joki-tugas-kuliah', volume: 'Tinggi (High Intent)', status: 'Index Ready' },
    { keyword: 'jasa pembuatan makalah', page: '/layanan/joki-makalah', volume: 'Tinggi (High Intent)', status: 'Index Ready' },
    { keyword: 'joki laporan pkl magang', page: '/layanan/joki-laporan-pkl', volume: 'Sedang (Commercial)', status: 'Index Ready' },
    { keyword: 'joki skripsi terpercaya', page: '/layanan/joki-skripsi', volume: 'Sangat Tinggi (Priority)', status: 'Index Ready' },
    { keyword: 'jasa ppt sidang skripsi', page: '/layanan/joki-ppt', volume: 'Sedang (Transactional)', status: 'Index Ready' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
              Dashboard Super Admin
            </h1>
            <Badge variant="brand" className="text-[10px]">Real-Time</Badge>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Ringkasan performa akuisisi SEO, konversi leads WhatsApp, dan sinkronisasi pengerjaan tugas worker.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/ai-blog" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Blog Writer</span>
          </Link>
          <Link to="/tasks" className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-brand-glow transition-all">
            Buka Task Pipeline →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="p-5 space-y-3 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-muted">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-ink-primary">{kpi.value}</span>
                <span className="text-xs font-semibold text-emerald-600">{kpi.change}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* SECTION: SEO & SEARCH ENGINE ANALYTICS */}
      <Card className="p-6 sm:p-7 border-slate-200 bg-gradient-to-br from-white to-slate-50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-ink-primary">Analitik SEO &amp; Mesin Pencari Google</h2>
                <Badge variant="brand" className="text-[10px]">Real-Time Health</Badge>
              </div>
              <p className="text-xs text-ink-muted">Pemantauan kesehatan indexing Google, sitemap dinamis, dan keyword target.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="https://jokitugasku.id/sitemap.xml" 
              target="_blank" 
              rel="noreferrer" 
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-ink-primary inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Sitemap.xml</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <Link 
              to="/seo" 
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>SEO Center</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 3 Pillar SEO Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Status Indexing</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-extrabold text-ink-primary">100% Crawlable</div>
            <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block font-medium">
              ✓ Canonical &amp; Meta Tag Aktif
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Structured Schema</span>
              <FileCode className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-lg font-extrabold text-ink-primary">Schema.org Valid</div>
            <p className="text-[11px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md inline-block font-medium">
              ✓ Organization, Service, FAQ, Breadcrumb
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Artikel SEO Live</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-extrabold text-ink-primary">{publishedArticles.length} Terpublikasi</div>
            <p className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block font-medium">
              {publishedArticles.length > 0 ? '✓ Auto-synced ke Sitemap' : 'Siap untuk menerbitkan artikel'}
            </p>
          </div>
        </div>

        {/* 2 Sub-Columns: Target Keywords & Recent Published Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* Target SEO Keywords Table */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Pilar Kata Kunci Utama Google</span>
              </h3>
              <span className="text-[11px] text-ink-muted">High Search Volume</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
              <div className="divide-y divide-slate-100 text-xs">
                {targetKeywords.map((tk, i) => (
                  <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="font-bold text-ink-primary block">{tk.keyword}</span>
                      <span className="text-[11px] text-ink-muted font-mono">{tk.page}</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 block">
                        {tk.status}
                      </span>
                      <span className="text-[10px] text-ink-muted block mt-0.5">{tk.volume}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Published Blog Stream */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Artikel Blog Terbit Terbaru ({publishedArticles.length})</span>
              </h3>
              <Link to="/articles" className="text-[11px] font-bold text-brand-600 hover:underline">
                Kelola Semua →
              </Link>
            </div>

            {publishedArticles.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-white text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-ink-muted">Belum ada artikel yang dipublikasikan.</p>
                <Link 
                  to="/ai-blog" 
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Generate Artikel dengan AI Blog Writer</span>
                </Link>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100 text-xs">
                  {publishedArticles.slice(0, 4).map((art, i) => (
                    <div key={art.id || i} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="max-w-[280px]">
                        <span className="font-bold text-ink-primary block truncate">{art.title}</span>
                        <span className="text-[11px] text-ink-muted">{art.category} • {art.read_time || art.readTime || '5 menit baca'}</span>
                      </div>
                      <a 
                        href={`https://jokitugasku.id/blog/${art.slug}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Lihat</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </Card>

      {/* 2 Columns: Leads & Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent WhatsApp Leads */}
        <Card className="lg:col-span-6 p-6 space-y-4 border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-base text-ink-primary">WhatsApp Leads ({leads.length})</h2>
            </div>
            <Link to="/crm" className="text-xs font-bold text-brand-600 hover:underline">
              Buka CRM Leads →
            </Link>
          </div>

          {leads.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <MessageCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-ink-muted">Belum ada data leads. Siap menerima pesan baru.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {leads.slice(0, 4).map((lead, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-ink-primary block">+{lead.wa}</span>
                    <span className="text-ink-muted">{lead.name} • {lead.service}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      lead.status === 'NEW' ? 'bg-amber-50 text-amber-700' :
                      lead.status === 'QUALIFIED' ? 'bg-blue-50 text-blue-700' :
                      lead.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-ink-light block mt-0.5">{lead.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Tasks Overview (Live Real-Time from TaskContext) */}
        <Card className="lg:col-span-6 p-6 space-y-4 border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-base text-ink-primary">Pipeline Tugas Berjalan ({tasks.length})</h2>
            </div>
            <Link to="/tasks" className="text-xs font-bold text-brand-600 hover:underline">
              Buka Task Board →
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <FolderOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-ink-muted">Pipeline tugas kosong (0 Tugas). Siap untuk input tugas baru.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 4).map((t) => (
                <div key={t.id} className="py-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-brand-700">{t.task_code}</span>
                    <Badge variant={t.priority === 'URGENT' ? 'brand' : 'neutral'} className="text-[10px]">
                      {t.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-ink-secondary">
                    <span className="font-medium text-ink-primary truncate max-w-[200px]">{t.title}</span>
                    <span className="text-amber-700 font-semibold">{t.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between text-ink-muted text-[11px] pt-0.5">
                    <span>Penjoki: <strong>{t.worker_name || 'Belum di-assign'}</strong></span>
                    <span className={`font-bold uppercase px-2 py-0.5 rounded-full text-[10px] ${
                      t.status === 'REVIEW' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      t.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' :
                      t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>

    </div>
  );
}
