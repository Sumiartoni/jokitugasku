import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  FileText, 
  Plus, 
  AlertCircle, 
  X, 
  MessageCircle, 
  Send,
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { TaskEntity, TaskStatus } from '@/types/database';

export function TaskManagementPage() {
  const { tasks, updateTaskStatus, createTask, assignWorker } = useTasks();
  const { usersList } = useAuth();

  useEffect(() => {
    document.title = 'Task Pipeline & Worker Assignment - JokiTugasKu Admin';
  }, []);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [activeTaskForRevision, setActiveTaskForRevision] = useState<TaskEntity | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Create Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newService, setNewService] = useState('Bimbingan & Olah Data Skripsi');
  const [newPrice, setNewPrice] = useState('Rp 350.000');
  const [newDeadline, setNewDeadline] = useState('Besok, 18:00 WIB');
  const [newPriority, setNewPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [newBrief, setNewBrief] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  const workers = usersList.filter(u => u.role === 'WORKER');
  const allWorkersAndAdmins = usersList;

  const statuses = ['ALL', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'REVISION', 'APPROVED', 'COMPLETED', 'CANCELLED'];

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (newStatus === 'REVISION') {
      const t = tasks.find(item => item.id === taskId);
      if (t) {
        setActiveTaskForRevision(t);
        setRevisionNotes('');
        setRevisionModalOpen(true);
        return;
      }
    }
    updateTaskStatus(taskId, newStatus);
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskForRevision) return;
    updateTaskStatus(activeTaskForRevision.id, 'REVISION', revisionNotes);
    setRevisionModalOpen(false);
    setActiveTaskForRevision(null);
    setRevisionNotes('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCustomer.trim() || !newBrief.trim()) return;

    let workerName: string | undefined;
    let workerEmail: string | undefined;
    if (selectedWorkerId) {
      const w = usersList.find(u => u.id === selectedWorkerId);
      if (w) {
        workerName = w.name;
        workerEmail = w.email;
      }
    }

    createTask({
      title: newTitle.trim(),
      customer_name: newCustomer.trim(),
      service_title: newService,
      price: newPrice,
      deadline: newDeadline,
      priority: newPriority,
      brief: newBrief.trim(),
      status: selectedWorkerId ? 'ASSIGNED' : 'NEW',
      worker_id: selectedWorkerId || undefined,
      worker_name: workerName,
      worker_email: workerEmail,
    });

    setCreateModalOpen(false);
    setNewTitle('');
    setNewCustomer('');
    setNewBrief('');
    setSelectedWorkerId('');
  };

  const handleAssignWorker = (taskId: string, workerId: string) => {
    const w = usersList.find(u => u.id === workerId);
    if (w) {
      assignWorker(taskId, w.id, w.name, w.email);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.task_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (t.worker_name && t.worker_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
              Task Pipeline &amp; Worker Deliverables
            </h1>
            <Badge variant="brand" className="text-[10px]">Real-Time Sync</Badge>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Pantau alur pengerjaan tugas, periksa hasil upload / link dari worker, dan kelola revisi.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setCreateModalOpen(true)}
          className="gap-2 self-start sm:self-auto shadow-brand-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tugas Baru</span>
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode tugas, klien, worker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-ink-primary focus:border-brand-500 bg-white"
            />
          </div>

          <div className="text-xs font-bold text-ink-muted">
            Total {filteredTasks.length} Tugas
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                filterStatus === st ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'
              }`}
            >
              {st} {st !== 'ALL' && `(${tasks.filter(t => t.status === st).length})`}
            </button>
          ))}
        </div>
      </Card>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => {
          const hasSubmission = !!task.submission;

          return (
            <Card key={task.id} className="p-6 flex flex-col justify-between space-y-4 border-slate-200 shadow-subtle hover:shadow-card transition-shadow">
              
              <div className="space-y-3">
                
                {/* Header card */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-sm text-brand-700">{task.task_code}</span>
                  <Badge variant={task.priority === 'URGENT' ? 'brand' : task.priority === 'HIGH' ? 'neutral' : 'outline'} className="text-[10px]">
                    {task.priority}
                  </Badge>
                </div>

                <div>
                  <Badge variant="brand" className="text-[10px] mb-1">{task.service_title}</Badge>
                  <h3 className="font-bold text-base text-ink-primary line-clamp-2">{task.title}</h3>
                  <span className="text-xs text-ink-muted">{task.customer_name} • {task.price}</span>
                </div>

                {/* Deadline & Worker assigned */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Tenggat Waktu:</span>
                    <span className="font-semibold text-amber-700">{task.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted">Penjoki / Worker:</span>
                    <span className="font-bold text-ink-primary truncate max-w-[150px]">
                      {task.worker_name || <span className="text-rose-600 font-normal">Belum di-assign</span>}
                    </span>
                  </div>
                </div>

                {/* Worker Submission Box (Terkoneksi dari Worker Portal!) */}
                {hasSubmission && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Hasil Telah Diserahkan Worker</span>
                      </span>
                      <span className="text-[10px] text-emerald-700">{task.submission?.submittedAt}</span>
                    </div>

                    <p className="text-ink-secondary bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] leading-relaxed">
                      {task.submission?.notes}
                    </p>

                    {task.submission?.driveLink && (
                      <div className="pt-1">
                        <a
                          href={task.submission.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:underline bg-white px-2.5 py-1 rounded-md border border-brand-200"
                        >
                          <LinkIcon className="w-3 h-3" />
                          <span>Buka Link Drive / File</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Revision notice (if in revision) */}
                {task.status === 'REVISION' && task.admin_feedback && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-0.5">
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-rose-700">
                      Instruksi Revisi ke Worker (#{task.revision_count}):
                    </span>
                    <p className="text-[11px] leading-relaxed">{task.admin_feedback}</p>
                  </div>
                )}

              </div>

              {/* Action and Status Controller */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                
                {/* Worker Assignment Dropdown if unassigned */}
                {!task.worker_id && (
                  <div className="space-y-1">
                    <label className="font-semibold text-ink-muted block text-[11px]">Tugaskan ke Worker:</label>
                    <select
                      onChange={(e) => handleAssignWorker(task.id, e.target.value)}
                      defaultValue=""
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-semibold text-ink-primary bg-white"
                    >
                      <option value="" disabled>Pilih Penjoki...</option>
                      {workers.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({w.email})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status Selector */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-ink-muted block text-[11px]">Ubah Status Alur:</label>
                    <span className="font-bold text-[10px] text-brand-600 uppercase">{task.status}</span>
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold text-brand-700 bg-white"
                  >
                    <option value="NEW">NEW (Baru)</option>
                    <option value="ASSIGNED">ASSIGNED (Ditugaskan)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Pengerjaan)</option>
                    <option value="REVIEW">REVIEW (Pemeriksaan Hasil)</option>
                    <option value="REVISION">REVISION (Minta Perbaikan)</option>
                    <option value="APPROVED">APPROVED (Disetujui Admin)</option>
                    <option value="COMPLETED">COMPLETED (Selesai)</option>
                    <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                  </select>
                </div>

              </div>

            </Card>
          );
        })}
      </div>

      {/* ---- Modal Buat Tugas Baru ---- */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-ink-primary">Buat Tugas Baru &amp; Tugaskan Worker</h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Tugas akan otomatis muncul di portal worker yang ditugaskan.
              </p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Judul Tugas</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Makalah Manajemen SDM 20 Halaman"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Nama / Kampus Klien</label>
                  <input
                    type="text"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    placeholder="Contoh: Rian (Unpad)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm bg-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Jenis Layanan</label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm bg-white"
                  >
                    <option value="Joki Tugas Umum">Joki Tugas Umum</option>
                    <option value="Joki Tugas Kuliah">Joki Tugas Kuliah</option>
                    <option value="Joki Tugas SMK">Joki Tugas SMK</option>
                    <option value="Joki Tugas SMA">Joki Tugas SMA</option>
                    <option value="Joki Makalah">Joki Makalah</option>
                    <option value="Joki Laporan Praktikum">Joki Laporan Praktikum</option>
                    <option value="Joki Laporan PKL">Joki Laporan PKL</option>
                    <option value="Joki Proposal">Joki Proposal</option>
                    <option value="Joki PPT">Joki PPT</option>
                    <option value="Bimbingan & Olah Data Skripsi">Bimbingan &amp; Olah Data Skripsi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Biaya / Harga</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Tenggat Waktu</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Prioritas</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm bg-white"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Tugaskan ke Worker / Penjoki</label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm bg-white font-semibold"
                >
                  <option value="">-- Belum Ditugaskan (Status: NEW) --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.email}) - {w.specialization || 'Umum'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Brief &amp; Panduan Pengerjaan</label>
                <textarea
                  rows={4}
                  value={newBrief}
                  onChange={(e) => setNewBrief(e.target.value)}
                  placeholder="Masukkan detail instruksi, format naskah, ketentuan sitasi, atau link bahan soal..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-ink-primary bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <Button type="submit" variant="primary" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Simpan &amp; Buat Tugas</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Modal Minta Revisi ke Worker ---- */}
      {revisionModalOpen && activeTaskForRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => { setRevisionModalOpen(false); setActiveTaskForRevision(null); }}
              className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-bold text-ink-primary">Minta Revisi ke Worker</h2>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                Tuliskan bagian yang perlu diperbaiki oleh <strong>{activeTaskForRevision.worker_name || 'Worker'}</strong> untuk tugas <strong>{activeTaskForRevision.task_code}</strong>.
              </p>
            </div>

            <form onSubmit={handleRevisionSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Catatan &amp; Instruksi Revisi</label>
                <textarea
                  rows={4}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Contoh: Tolong tambahkan 3 referensi jurnal internasional 2024 pada Bab II dan perbaiki margin kiri 4cm..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-ink-primary bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setRevisionModalOpen(false); setActiveTaskForRevision(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <Button type="submit" variant="danger" size="sm" className="gap-2">
                  <Send className="w-4 h-4" />
                  <span>Kirim Permintaan Revisi</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
