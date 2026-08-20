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
  FolderOpen
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { LiveClockBadge } from '@/components/ui/LiveClockBadge';

export function DashboardPage() {
  const { tasks } = useTasks();
  const { usersList } = useAuth();

  useEffect(() => {
    document.title = 'Dashboard Super Admin - JokiTugasKu';
  }, []);

  const [leads, setLeads] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('jt_crm_leads');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const activeTasksCount = tasks.filter(t => ['IN_PROGRESS', 'REVIEW', 'REVISION', 'ASSIGNED'].includes(t.status)).length;
  const reviewTasksCount = tasks.filter(t => t.status === 'REVIEW').length;
  const completedTasksCount = tasks.filter(t => ['APPROVED', 'COMPLETED'].includes(t.status)).length;

  const kpis = [
    { 
      label: 'Organic Traffic Google', 
      value: '6,207', 
      change: 'Impresi Organik', 
      icon: TrendingUp, 
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
