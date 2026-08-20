import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  FileText, 
  LogOut, 
  Link as LinkIcon, 
  ExternalLink, 
  AlertCircle, 
  PlayCircle,
  FileCheck,
  RefreshCw,
  FolderOpen,
  Search,
  Filter,
  Copy,
  ChevronDown,
  ChevronUp,
  FileUp,
  X,
  Send,
  Sparkles,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { TaskEntity } from '@/types/database';
import { LiveClockBadge } from '@/components/ui/LiveClockBadge';

export function WorkerPortalPage() {
  const { user, logout } = useAuth();
  const { getTasksForWorker, submitWork, updateTaskStatus } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Portal Worker & Penjoki - JokiTugasKu';
  }, []);

  // Filter & Search states
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'REVIEW' | 'REVISION' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBriefs, setExpandedBriefs] = useState<Record<string, boolean>>({});

  // Submission Form states per task
  const [submissionNotes, setSubmissionNotes] = useState<Record<string, string>>({});
  const [submissionLinks, setSubmissionLinks] = useState<Record<string, string>>({});
  const [submissionFiles, setSubmissionFiles] = useState<Record<string, string>>({});
  const [selectedFileObj, setSelectedFileObj] = useState<Record<string, { name: string; size: string }>>({});
  
  // Feedback toast & status
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get tasks assigned to this worker (or all tasks if Super Admin is previewing)
  const allAssignedTasks = user?.role === 'SUPER_ADMIN' 
    ? getTasksForWorker() 
    : getTasksForWorker(user?.email);

  // Filter tasks
  const filteredTasks = allAssignedTasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.task_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.service_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.brief.toLowerCase().includes(searchQuery.toLowerCase());

    let matchTab = true;
    if (filterTab === 'ACTIVE') {
      matchTab = ['ASSIGNED', 'IN_PROGRESS'].includes(t.status);
    } else if (filterTab === 'REVIEW') {
      matchTab = t.status === 'REVIEW';
    } else if (filterTab === 'REVISION') {
      matchTab = t.status === 'REVISION';
    } else if (filterTab === 'COMPLETED') {
      matchTab = ['APPROVED', 'COMPLETED'].includes(t.status);
    }

    return matchSearch && matchTab;
  });

  // Calculate Worker Stats
  const countActive = allAssignedTasks.filter(t => ['ASSIGNED', 'IN_PROGRESS'].includes(t.status)).length;
  const countReview = allAssignedTasks.filter(t => t.status === 'REVIEW').length;
  const countRevision = allAssignedTasks.filter(t => t.status === 'REVISION').length;
  const countCompleted = allAssignedTasks.filter(t => ['APPROVED', 'COMPLETED'].includes(t.status)).length;

  const toggleBrief = (taskId: string) => {
    setExpandedBriefs(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleCopyBrief = (t: TaskEntity) => {
    const text = `[Brief Tugas ${t.task_code} - ${t.title}]\nLayanan: ${t.service_title}\nDeadline: ${t.deadline}\n\nInstruksi:\n${t.brief}`;
    navigator.clipboard.writeText(text);
    setCopiedTaskId(t.id);
    showToast('success', `Brief tugas ${t.task_code} berhasil disalin ke clipboard.`);
    setTimeout(() => setCopiedTaskId(null), 2500);
  };

  const handleStartTask = (taskId: string) => {
    updateTaskStatus(taskId, 'IN_PROGRESS');
    showToast('success', 'Status diubah ke IN_PROGRESS. Selamat mengerjakan!');
  };

  const handleFilePick = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setSelectedFileObj(prev => ({ ...prev, [taskId]: { name: file.name, size: `${sizeMB} MB` } }));
      setSubmissionFiles(prev => ({ ...prev, [taskId]: file.name }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent, taskId: string) => {
    e.preventDefault();
    const notes = submissionNotes[taskId] || '';
    const link = submissionLinks[taskId] || '';
    const file = selectedFileObj[taskId]?.name || submissionFiles[taskId] || '';
    const size = selectedFileObj[taskId]?.size || (file ? '5.6 MB' : undefined);

    if (!notes.trim() && !link.trim() && !file) {
      showToast('error', 'Mohon isi minimal catatan hasil pengerjaan atau link Google Drive/file.');
      return;
    }

    const res = submitWork(taskId, {
      notes: notes.trim() || 'Hasil pengerjaan telah dilampirkan via link / berkas dokumen.',
      driveLink: link.trim() || undefined,
      fileName: file || undefined,
      fileSize: size,
      submittedBy: user?.email || 'Worker'
    });

    if (res.success) {
      showToast('success', 'Hasil tugas berhasil diserahkan ke Super Admin! Status otomatis menjadi REVIEW.');
    } else {
      showToast('error', res.error || 'Gagal menyerahkan tugas.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-ink-primary font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-3 ${
          toastMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          {user?.role !== 'WORKER' && (
            <Link to="/" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="Logo JokiTugasKu"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base leading-none flex items-center gap-2">
                <span>Portal Worker / Penjoki</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30">
                  {user?.name || 'Worker'}
                </span>
              </h1>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Clock Badge in Worker Header */}
          <LiveClockBadge className="hidden md:inline-flex" />

          {user?.role !== 'WORKER' && (
            <Link to="/" className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors">
              Kembali ke Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold transition-colors border border-rose-800/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Welcome & Info Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Workspace Terenkripsi &amp; Real-Time</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Halo, {user?.name || 'Worker'} 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Seluruh hasil pengerjaan, draft Google Drive, dan lampiran file yang Anda serahkan akan langsung terkoneksi ke Super Admin Panel.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 text-xs space-y-1 self-start md:self-auto">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Keahlian Terdaftar</span>
            <span className="font-bold text-white block">{user?.specialization || 'Umum & Semua Tugas'}</span>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 space-y-1 border-l-4 border-l-blue-500">
            <span className="text-xs text-ink-muted font-medium block">Tugas Perlu Dikerjakan</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-blue-600">{countActive}</span>
              <span className="text-[10px] text-ink-light font-semibold">Assigned / In Progress</span>
            </div>
          </Card>

          <Card className="p-4 space-y-1 border-l-4 border-l-amber-500">
            <span className="text-xs text-ink-muted font-medium block">Menunggu Review Admin</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-amber-600">{countReview}</span>
              <span className="text-[10px] text-amber-700 font-semibold">Pemeriksaan</span>
            </div>
          </Card>

          <Card className="p-4 space-y-1 border-l-4 border-l-rose-500">
            <span className="text-xs text-ink-muted font-medium block">Perlu Revisi Segera</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-rose-600">{countRevision}</span>
              <span className="text-[10px] text-rose-700 font-semibold">Prioritas</span>
            </div>
          </Card>

          <Card className="p-4 space-y-1 border-l-4 border-l-emerald-500">
            <span className="text-xs text-ink-muted font-medium block">Tugas Selesai / Disetujui</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-emerald-600">{countCompleted}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Approved</span>
            </div>
          </Card>
        </div>

        {/* Filter Tabs & Search Bar */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode tugas, judul, materi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-ink-primary focus:border-brand-500 bg-white"
              />
            </div>

            <div className="text-xs font-bold text-ink-muted">
              Menampilkan {filteredTasks.length} dari {allAssignedTasks.length} Tugas
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
            {[
              { id: 'ALL', label: `Semua (${allAssignedTasks.length})` },
              { id: 'ACTIVE', label: `Perlu Dikerjakan (${countActive})` },
              { id: 'REVIEW', label: `Menunggu Review (${countReview})` },
              { id: 'REVISION', label: `Perlu Revisi (${countRevision})` },
              { id: 'COMPLETED', label: `Selesai (${countCompleted})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  filterTab === tab.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Task Cards Feed */}
        <div className="space-y-6">
          {filteredTasks.length === 0 ? (
            <Card className="p-12 text-center space-y-3">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-ink-primary text-base">Tidak Ada Tugas Ditemukan</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                {searchQuery ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada tugas pada kategori filter ini.'}
              </p>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const isBriefExpanded = expandedBriefs[task.id] !== false; // default expanded
              const hasExistingSubmission = !!task.submission;
              const isRevision = task.status === 'REVISION';
              const isReview = task.status === 'REVIEW';
              const isCompleted = ['APPROVED', 'COMPLETED'].includes(task.status);
              const selectedFile = selectedFileObj[task.id];

              return (
                <Card key={task.id} className="p-6 sm:p-8 space-y-6 border-slate-200 shadow-card bg-white">
                  
                  {/* Task Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-base text-brand-700">{task.task_code}</span>
                        <Badge variant={task.priority === 'URGENT' ? 'brand' : task.priority === 'HIGH' ? 'neutral' : 'outline'}>
                          {task.priority}
                        </Badge>
                        <Badge variant="brand">{task.service_title}</Badge>
                        
                        {/* Status Pill */}
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          task.status === 'NEW' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          task.status === 'ASSIGNED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          task.status === 'REVIEW' ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold' :
                          task.status === 'REVISION' ? 'bg-rose-100 text-rose-800 border border-rose-300 font-extrabold' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold'
                        }`}>
                          Status: {task.status}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-ink-primary tracking-tight">
                        {task.title}
                      </h3>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5 flex-shrink-0">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200/80">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>Deadline: {task.deadline}</span>
                      </div>
                      <span className="text-[11px] text-ink-muted">Imbalan / Biaya: <strong className="text-ink-primary font-mono">{task.price}</strong></span>
                    </div>
                  </div>

                  {/* Progress Timeline Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      <div className={`p-2 rounded-xl border ${['ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'REVISION', 'APPROVED', 'COMPLETED'].includes(task.status) ? 'bg-brand-50 border-brand-300 text-brand-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        1. Ditugaskan
                      </div>
                      <div className={`p-2 rounded-xl border ${['IN_PROGRESS', 'REVIEW', 'REVISION', 'APPROVED', 'COMPLETED'].includes(task.status) ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        2. Dikerjakan
                      </div>
                      <div className={`p-2 rounded-xl border ${['REVIEW', 'REVISION', 'APPROVED', 'COMPLETED'].includes(task.status) ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        3. Review Admin
                      </div>
                      <div className={`p-2 rounded-xl border ${['APPROVED', 'COMPLETED'].includes(task.status) ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        4. Selesai
                      </div>
                    </div>
                  </div>

                  {/* Brief & Panduan Soal (Collapsible) */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden">
                    <div 
                      onClick={() => toggleBrief(task.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-ink-primary">
                        <FileText className="w-4 h-4 text-brand-600" />
                        <span>Brief &amp; Instruksi Pengerjaan Tugas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyBrief(task);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-ink-secondary hover:text-brand-600 transition-colors flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedTaskId === task.id ? 'Tersalin!' : 'Salin Brief'}</span>
                        </button>
                        {isBriefExpanded ? <ChevronUp className="w-4 h-4 text-ink-muted" /> : <ChevronDown className="w-4 h-4 text-ink-muted" />}
                      </div>
                    </div>

                    {isBriefExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-200 text-xs text-ink-secondary leading-relaxed whitespace-pre-wrap font-sans">
                        {task.brief}
                      </div>
                    )}
                  </div>

                  {/* Admin Revision Feedback Notice (if in revision) */}
                  {isRevision && task.admin_feedback && (
                    <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-950 space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2 font-extrabold text-rose-700 text-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        <span>Instruksi Revisi dari Super Admin (Revisi #{task.revision_count}):</span>
                      </div>
                      <p className="p-3 bg-white rounded-xl border border-rose-200 font-medium text-xs leading-relaxed">
                        {task.admin_feedback}
                      </p>
                      <span className="text-[11px] text-rose-700 block font-semibold">
                        Mohon perbaiki instruksi di atas dan kirimkan ulang file / link terbaru melalui formulir di bawah.
                      </span>
                    </div>
                  )}

                  {/* Existing Submitted Result (if any) */}
                  {hasExistingSubmission && (
                    <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs space-y-2.5">
                      <div className="flex items-center justify-between text-emerald-900 font-bold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Hasil Pengerjaan Terakhir yang Diserahkan</span>
                        </span>
                        <span className="text-[11px] font-medium text-emerald-700">Waktu: {task.submission?.submittedAt}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-ink-secondary space-y-1.5">
                        <span className="font-semibold text-ink-primary block text-[11px] uppercase tracking-wider text-ink-muted">Catatan Worker:</span>
                        <p className="leading-relaxed">{task.submission?.notes}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {task.submission?.driveLink && (
                          <a
                            href={task.submission.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-brand-700 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-brand-500" />
                            <span>Buka Link Drive / Draft</span>
                            <ExternalLink className="w-3 h-3 text-ink-light" />
                          </a>
                        )}

                        {task.submission?.fileName && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-slate-700 font-mono text-[11px]">
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>{task.submission.fileName}</span>
                            {task.submission.fileSize && <span className="text-slate-400">({task.submission.fileSize})</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action / Deliverable Submission Form */}
                  {task.status === 'ASSIGNED' ? (
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-xs text-purple-900 block">Tugas baru telah ditugaskan kepada Anda</span>
                        <span className="text-[11px] text-purple-700">Klik tombol di samping untuk mengonfirmasi mulai pengerjaan.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartTask(task.id)}
                        className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-brand-glow transition-all"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Mulai Kerjakan Tugas Ini</span>
                      </button>
                    </div>
                  ) : isCompleted ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Tugas telah disetujui &amp; selesai. Terima kasih atas kerja samanya!</span>
                      </div>
                      <Badge variant="success">COMPLETED</Badge>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleFormSubmit(e, task.id)} className="space-y-4 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-xs text-ink-primary flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-brand-600" />
                          <span>{isRevision ? 'Upload Hasil Perbaikan Revisi:' : 'Upload & Serahkan Hasil Pengerjaan:'}</span>
                        </label>
                        <Badge variant="brand" className="text-[10px]">Terkoneksi ke Super Admin</Badge>
                      </div>

                      {/* Notes Input */}
                      <div className="space-y-1.5 text-xs">
                        <label className="font-semibold text-ink-primary block">
                          Catatan &amp; Penjelasan Hasil Pengerjaan:
                        </label>
                        <textarea
                          rows={3}
                          value={submissionNotes[task.id] || ''}
                          onChange={(e) => setSubmissionNotes(prev => ({ ...prev, [task.id]: e.target.value }))}
                          placeholder="Jelaskan bagian tugas yang telah tuntas, daftar referensi yang digunakan, atau catatan penting untuk admin..."
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-brand-500 text-ink-primary bg-white"
                          required
                        />
                      </div>

                      {/* Links & File Attachments */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        
                        {/* Link Drive input */}
                        <div className="space-y-1.5">
                          <label className="font-semibold text-ink-primary flex items-center gap-1">
                            <LinkIcon className="w-3.5 h-3.5 text-brand-500" />
                            <span>Tautan Google Drive / OneDrive / GitHub:</span>
                          </label>
                          <input
                            type="url"
                            value={submissionLinks[task.id] || ''}
                            onChange={(e) => setSubmissionLinks(prev => ({ ...prev, [task.id]: e.target.value }))}
                            placeholder="https://drive.google.com/drive/folders/..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-500 text-ink-primary bg-white font-mono"
                          />
                        </div>

                        {/* File Attachment Upload */}
                        <div className="space-y-1.5">
                          <label className="font-semibold text-ink-primary flex items-center gap-1">
                            <FileUp className="w-3.5 h-3.5 text-brand-500" />
                            <span>Lampiran Dokumen (.docx, .pptx, .xlsx, .zip, .pdf):</span>
                          </label>
                          
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-ink-secondary text-xs font-semibold border border-slate-200 transition-colors inline-flex items-center gap-1.5 flex-shrink-0">
                              <FileUp className="w-3.5 h-3.5" />
                              <span>Pilih File</span>
                              <input
                                type="file"
                                onChange={(e) => handleFilePick(task.id, e)}
                                className="hidden"
                              />
                            </label>

                            <input
                              type="text"
                              value={selectedFile ? `${selectedFile.name} (${selectedFile.size})` : submissionFiles[task.id] || ''}
                              onChange={(e) => setSubmissionFiles(prev => ({ ...prev, [task.id]: e.target.value }))}
                              placeholder="Nama file lampiran..."
                              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-500 text-ink-primary bg-white font-mono"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Submit Action */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-[11px] text-ink-muted flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Status akan otomatis berubah ke <strong>REVIEW</strong> setelah diserahkan.</span>
                        </div>

                        <Button type="submit" variant="primary" size="sm" className="gap-2 shadow-brand-glow font-bold">
                          <Send className="w-3.5 h-3.5" />
                          <span>{isRevision ? 'Kirim Hasil Revisi ke Admin' : 'Serahkan Hasil Tugas ke Admin'}</span>
                        </Button>
                      </div>
                    </form>
                  )}

                </Card>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
