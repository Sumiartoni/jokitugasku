import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageCircle, 
  Search, 
  Phone, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  X, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTasks } from '@/context/TaskContext';
import { formatShortDateTime } from '@/utils/date';

interface LeadItem {
  id: string;
  wa: string;
  name: string;
  institution: string;
  service: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  notes: string;
  date: string;
}

import { supabase } from '@/lib/supabase';

export function CrmLeadsPage() {
  const navigate = useNavigate();
  const { createTask } = useTasks();

  useEffect(() => {
    document.title = 'CRM WhatsApp Leads - JokiTugasKu Admin';
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [leads, setLeads] = useState<LeadItem[]>(() => {
    try {
      const saved = localStorage.getItem('jt_crm_leads');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Fetch real leads from Supabase on mount
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const fetchLeads = async () => {
      try {
        const { data, error } = await client
          .from('crm_leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted: LeadItem[] = data.map((d: any) => ({
            id: d.id,
            wa: d.wa,
            name: d.name,
            institution: d.institution || '',
            service: d.service,
            source: d.source || 'Website',
            status: d.status || 'NEW',
            notes: d.notes || '',
            date: formatShortDateTime(new Date(d.created_at || Date.now())),
          }));
          setLeads(formatted);
          localStorage.setItem('jt_crm_leads', JSON.stringify(formatted));
        }
      } catch (e) {
        console.error('Supabase fetch leads error', e);
      }
    };

    fetchLeads();

    // Subscribe to realtime leads
    const subscription = client
      .channel('crm_leads_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_leads' }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      client.removeChannel(subscription);
    };
  }, []);

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<LeadItem | null>(null);

  // Form States for Add Lead
  const [name, setName] = useState('');
  const [wa, setWa] = useState('');
  const [institution, setInstitution] = useState('');
  const [service, setService] = useState('Joki Makalah');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LeadItem['status']>('NEW');

  // Toast
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const saveLeadsToStorage = (updated: LeadItem[]) => {
    setLeads(updated);
    localStorage.setItem('jt_crm_leads', JSON.stringify(updated));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wa.trim()) {
      showToast('error', 'Nama dan Nomor WhatsApp wajib diisi.');
      return;
    }

    const cleanWa = wa.replace(/[^0-9]/g, '');
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      wa: cleanWa,
      institution: institution.trim() || 'Umum',
      service,
      source: 'Manual Input Admin',
      status,
      notes: notes.trim(),
      date: formatShortDateTime(new Date()),
    };

    saveLeadsToStorage([newLead, ...leads]);
    setAddModalOpen(false);
    showToast('success', `Lead ${newLead.name} berhasil ditambahkan!`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    const updated = leads.map(l => l.id === activeLead.id ? activeLead : l);
    saveLeadsToStorage(updated);
    setEditModalOpen(false);
    setActiveLead(null);
    showToast('success', `Data lead ${activeLead.name} berhasil diperbarui.`);
  };

  const handleDeleteLead = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lead ini?')) return;
    const updated = leads.filter(l => l.id !== id);
    saveLeadsToStorage(updated);
    showToast('success', 'Lead berhasil dihapus.');
  };

  const handleConvertToTask = (lead: LeadItem) => {
    createTask({
      title: `${lead.service} - ${lead.institution} (${lead.name})`,
      customer_name: `${lead.name} (${lead.institution})`,
      customer_phone: `+${lead.wa}`,
      service_title: lead.service,
      price: 'Rp 250.000',
      deadline: '2 Hari Kerja',
      priority: 'NORMAL',
      brief: `Catatan Permintaan Klien via WhatsApp:\n${lead.notes || 'Permintaan pengerjaan tugas dari lead WhatsApp.'}`,
      status: 'NEW',
    });

    // Update status lead to CONVERTED
    const updated = leads.map(l => l.id === lead.id ? { ...l, status: 'CONVERTED' as const } : l);
    saveLeadsToStorage(updated);

    showToast('success', `Tugas baru berhasil dibuat dari lead ${lead.name}! Mengalihkan ke Task Board...`);
    setTimeout(() => {
      navigate('/tasks');
    }, 1200);
  };

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.wa.includes(searchQuery) ||
                        l.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-3 ${
          toastMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
              CRM WhatsApp Leads &amp; Konsultasi
            </h1>
            <Badge variant="brand" className="text-[10px]">Database Interaktif</Badge>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Database percakapan, status konversi leads WhatsApp, dan konversi instan ke antrean tugas.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setName('');
            setWa('');
            setInstitution('');
            setNotes('');
            setStatus('NEW');
            setAddModalOpen(true);
          }}
          className="gap-2 self-start sm:self-auto shadow-brand-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lead Baru</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, WA, kampus, layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-500 text-ink-primary bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                filterStatus === st ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'
              }`}
            >
              {st} ({st === 'ALL' ? leads.length : leads.filter(l => l.status === st).length})
            </button>
          ))}
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-ink-muted font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Customer / WhatsApp</th>
                <th className="p-4">Kampus / Sekolah</th>
                <th className="p-4">Layanan</th>
                <th className="p-4">Waktu Masuk</th>
                <th className="p-4">Status</th>
                <th className="p-4">Catatan Klien</th>
                <th className="p-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-ink-secondary">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-ink-primary text-sm">{lead.name}</div>
                    <div className="text-emerald-700 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>+{lead.wa}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-ink-primary">
                    {lead.institution}
                  </td>
                  <td className="p-4">
                    <Badge variant="brand">{lead.service}</Badge>
                  </td>
                  <td className="p-4 text-ink-muted text-[11px] font-mono whitespace-nowrap">
                    {lead.date}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      lead.status === 'NEW' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      lead.status === 'QUALIFIED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      lead.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs truncate text-[11px]">
                    {lead.notes || '-'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Chat WA */}
                      <a
                        href={`https://wa.me/${lead.wa}?text=${encodeURIComponent(`Halo Kak ${lead.name}, saya dari Admin JokiTugasKu menindaklanjuti konsultasi layanan ${lead.service}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors"
                        title="Chat WhatsApp Klien"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chat WA</span>
                      </a>

                      {/* Convert to Task button */}
                      {lead.status !== 'CONVERTED' && (
                        <button
                          type="button"
                          onClick={() => handleConvertToTask(lead)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[11px] transition-colors"
                          title="Buat Task Tugas dari Lead Ini"
                        >
                          <Layers className="w-3 h-3" />
                          <span>Buat Task</span>
                        </button>
                      )}

                      {/* Edit Lead */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveLead(lead);
                          setEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                        title="Edit Data Lead"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Lead */}
                      <button
                        type="button"
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---- Modal Tambah Lead Baru ---- */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-ink-primary">Tambah Lead WhatsApp Baru</h2>
              <p className="text-xs text-ink-secondary mt-0.5">Catat calon klien yang menghubungi via WhatsApp atau media sosial.</p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Nama Customer</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rian Anggara"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Nomor WhatsApp (628...)</label>
                  <input
                    type="text"
                    value={wa}
                    onChange={(e) => setWa(e.target.value)}
                    placeholder="6281234567890"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Kampus / Sekolah</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Contoh: Unpad / SMK Telkom"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Layanan Diminati</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
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
                    <option value="Joki Skripsi">Joki Skripsi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Status Lead</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-bold text-brand-700"
                >
                  <option value="NEW">NEW (Baru Masuk)</option>
                  <option value="CONTACTED">CONTACTED (Sudah Dibalas)</option>
                  <option value="QUALIFIED">QUALIFIED (Deal Harga/Deadline)</option>
                  <option value="CONVERTED">CONVERTED (Sudah Bayar &amp; Jadi Task)</option>
                  <option value="LOST">LOST (Batal / Tidak Merespon)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Catatan Kebutuhan Tugas</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail judul makalah, estimasi deadline, harga yang disepakati..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <Button type="submit" variant="primary" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Simpan Lead</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Modal Edit Lead ---- */}
      {editModalOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => { setEditModalOpen(false); setActiveLead(null); }}
              className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-ink-primary">Edit Lead: {activeLead.name}</h2>
              <p className="text-xs text-ink-secondary mt-0.5">Perbarui status konversi dan catatan klien.</p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Nama Customer</label>
                  <input
                    type="text"
                    value={activeLead.name}
                    onChange={(e) => setActiveLead({ ...activeLead, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={activeLead.wa}
                    onChange={(e) => setActiveLead({ ...activeLead, wa: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Status Konversi</label>
                <select
                  value={activeLead.status}
                  onChange={(e) => setActiveLead({ ...activeLead, status: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-bold text-brand-700"
                >
                  <option value="NEW">NEW (Baru Masuk)</option>
                  <option value="CONTACTED">CONTACTED (Sudah Dibalas)</option>
                  <option value="QUALIFIED">QUALIFIED (Deal Harga/Deadline)</option>
                  <option value="CONVERTED">CONVERTED (Sudah Bayar &amp; Jadi Task)</option>
                  <option value="LOST">LOST (Batal / Tidak Merespon)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Catatan &amp; Riwayat Chat</label>
                <textarea
                  rows={4}
                  value={activeLead.notes}
                  onChange={(e) => setActiveLead({ ...activeLead, notes: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditModalOpen(false); setActiveLead(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <Button type="submit" variant="primary" size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
