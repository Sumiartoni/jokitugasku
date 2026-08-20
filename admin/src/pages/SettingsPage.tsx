import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  MessageCircle, 
  ShieldCheck, 
  Mail, 
  Globe, 
  Sparkles, 
  Send, 
  Key, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Server, 
  AlertCircle,
  Zap,
  HelpCircle,
  Trash2,
  Database,
  Users,
  Layers,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  getAppSettings, 
  saveAppSettings, 
  AppSettings, 
  sendEmailNotification 
} from '@/utils/settings';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';

export function SettingsPage() {
  const { tasks, clearAllTasks, resetSampleTasks } = useTasks();
  const { usersList, clearDemoWorkers, resetDemoAccounts } = useAuth();

  useEffect(() => {
    document.title = 'Settings & Integrasi API - JokiTugasKu Admin';
  }, []);

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'groq' | 'email' | 'data'>('whatsapp');
  const [formData, setFormData] = useState<AppSettings>(getAppSettings());
  
  // Show / Hide Secret Toggles
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showResendKey, setShowResendKey] = useState(false);
  const [showBrevoKey, setShowBrevoKey] = useState(false);
  const [showBrevoSmtpKey, setShowBrevoSmtpKey] = useState(false);

  // Status feedback
  const [saveToast, setSaveToast] = useState(false);
  const [dataToast, setDataToast] = useState<string | null>(null);
  const [testGroqStatus, setTestGroqStatus] = useState<{ loading: boolean; msg: string; type: 'success' | 'error' | 'idle' }>({ loading: false, msg: '', type: 'idle' });
  const [testEmailStatus, setTestEmailStatus] = useState<{ loading: boolean; msg: string; type: 'success' | 'error' | 'idle' }>({ loading: false, msg: '', type: 'idle' });
  const [testRecipient, setTestRecipient] = useState('');

  // Leads count from storage
  const [leadsCount, setLeadsCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('jt_crm_leads');
      return raw ? JSON.parse(raw).length : 0;
    } catch {
      return 0;
    }
  });

  // Articles count from storage
  const [articlesCount, setArticlesCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('jt_articles_cms');
      return raw ? JSON.parse(raw).length : 3;
    } catch {
      return 3;
    }
  });

  const showDataAlert = (msg: string) => {
    setDataToast(msg);
    setTimeout(() => setDataToast(null), 4000);
  };

  const handleChange = (field: keyof AppSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppSettings(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const handleTestGroq = async () => {
    const key = formData.groqApiKey.trim();
    if (!key) {
      setTestGroqStatus({
        loading: false,
        msg: 'Silakan masukkan Groq API Key terlebih dahulu.',
        type: 'error'
      });
      return;
    }

    setTestGroqStatus({ loading: true, msg: 'Menghubungkan ke Groq API...', type: 'idle' });

    try {
      const selectedModel = formData.groqDefaultModel || 'llama-3.1-8b-instant';
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: 'Ping: JokiTugasKu AI check. Jawab dengan 1 kata: Aktif.' }],
          max_tokens: 10
        })
      });

      if (response.ok) {
        setTestGroqStatus({
          loading: false,
          msg: 'Koneksi Berhasil! API Key Groq valid dan siap meng-generate artikel blog.',
          type: 'success'
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTestGroqStatus({
          loading: false,
          msg: `Koneksi Gagal: ${errorData.error?.message || 'API Key tidak valid atau kuota habis.'}`,
          type: 'error'
        });
      }
    } catch (e: any) {
      setTestGroqStatus({
        loading: false,
        msg: `Error jaringan: ${e.message || 'Tidak dapat terhubung ke Groq'}`,
        type: 'error'
      });
    }
  };

  const handleTestEmail = async () => {
    if (!testRecipient.trim()) {
      setTestEmailStatus({
        loading: false,
        msg: 'Mohon isi email tujuan uji coba.',
        type: 'error'
      });
      return;
    }

    setTestEmailStatus({ loading: true, msg: 'Mengirim email uji coba...', type: 'idle' });

    const res = await sendEmailNotification({
      toEmail: testRecipient.trim(),
      toName: 'Tester JokiTugasKu',
      subject: 'Uji Coba Integrasi Email - JokiTugasKu',
      htmlContent: `
        <h2>Halo dari JokiTugasKu!</h2>
        <p>Email ini dikirim untuk memverifikasi konfigurasi provider <strong>${formData.emailProvider}</strong> Anda.</p>
        <p>Waktu kirim: ${new Date().toLocaleString('id-ID')}</p>
      `
    });

    if (res.success) {
      setTestEmailStatus({
        loading: false,
        msg: `${res.message}`,
        type: 'success'
      });
    } else {
      setTestEmailStatus({
        loading: false,
        msg: `${res.message}`,
        type: 'error'
      });
    }
  };

  // --- Handlers Pembersihan Data Demo ---
  const handleClearTasksOnly = () => {
    if (!confirm('Apakah Anda yakin ingin mengosongkan seluruh antrean tugas (Task Pipeline)?')) return;
    clearAllTasks();
    showDataAlert('Seluruh data tugas demo berhasil dibersihkan! Task pipeline sekarang 0 tugas.');
  };

  const handleClearLeadsOnly = () => {
    if (!confirm('Apakah Anda yakin ingin menghapus semua daftar Leads CRM?')) return;
    localStorage.setItem('jt_crm_leads', JSON.stringify([]));
    setLeadsCount(0);
    showDataAlert('Seluruh data leads WhatsApp demo berhasil dibersihkan!');
  };

  const handleClearWorkersOnly = () => {
    if (!confirm('Apakah Anda yakin ingin menghapus worker demo dan hanya menyisakan akun Super Admin asli?')) return;
    clearDemoWorkers();
    showDataAlert('Worker demo berhasil dibersihkan! Hanya akun Admin utama yang aktif.');
  };

  const handleMasterClearAllDemo = () => {
    if (!confirm('PERHATIAN: Apakah Anda yakin ingin MEMBERSIHKAN SEMUA DATA DEMO (Tugas, Leads CRM, dan Worker Demo) agar sistem siap untuk LIVE TESTING nyata?')) return;
    
    // Clear Tasks
    clearAllTasks();
    
    // Clear Leads
    localStorage.setItem('jt_crm_leads', JSON.stringify([]));
    setLeadsCount(0);
    
    // Clear Workers (Keep Super Admin only)
    clearDemoWorkers();

    showDataAlert('🎉 SEMUA DATA DEMO BERHASIL DIBERSIHKAN! Sistem kini 100% bersih dan siap untuk live testing dengan klien & tugas nyata.');
  };

  const handleRestoreSampleData = () => {
    if (!confirm('Apakah Anda ingin memuat kembali data sampel demo?')) return;
    resetSampleTasks();
    resetDemoAccounts();
    localStorage.removeItem('jt_crm_leads'); // Will auto-seed on next CRM visit
    setLeadsCount(5);
    showDataAlert('Data sampel demo berhasil dimuat ulang.');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto font-sans">
      
      {/* Toast Save */}
      {saveToast && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan dan kunci integrasi berhasil disimpan!</span>
        </div>
      )}

      {/* Toast Data Action */}
      {dataToast && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>{dataToast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
          Pengaturan Global, Integrasi &amp; Manajemen Data
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
          Konfigurasi WhatsApp Business, Provider AI (Groq), Email SMTP/API, dan pembersihan data demo sebelum live testing.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'whatsapp' ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp & Kontak Bisnis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('groq')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'groq' ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Groq AI (Blog Writer)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'email' ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Transaksional (Brevo / Resend)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'data' ? 'bg-rose-600 text-white shadow-sm font-extrabold' : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Bersihkan Data Demo (Live Readiness)</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* TAB 1: WHATSAPP CONFIG */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-in fade-in">
            <Card className="p-6 sm:p-8 space-y-6 border-slate-200 shadow-card">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-ink-primary">Nomor WhatsApp &amp; Jam Operasional Resmi</h2>
                  <p className="text-xs text-ink-secondary">Nomor ini menjadi tujuan utama saat calon klien mengklik tombol order di landing page.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">
                    Nomor WhatsApp Penerima (Format Internasional):
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Contoh: 6281234567890"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white font-mono"
                    required
                  />
                  <span className="text-[11px] text-ink-muted block">Format angka tanpa tanda plus (+) atau spasi. Contoh: 6281234567890</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">
                    Teks Tampilan Nomor WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappDisplay}
                    onChange={(e) => handleChange('whatsappDisplay', e.target.value)}
                    placeholder="Contoh: +62 812-3456-7890"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">
                    Email Kontak CS Resmi:
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="halo@jokitugasku.id"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">
                    Jam Operasional Layanan:
                  </label>
                  <input
                    type="text"
                    value={formData.operatingHours}
                    onChange={(e) => handleChange('operatingHours', e.target.value)}
                    placeholder="Setiap Hari: 08.00 - 22.00 WIB (Fast Response)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white"
                    required
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: GROQ AI CONFIG */}
        {activeTab === 'groq' && (
          <div className="space-y-6 animate-in fade-in">
            <Card className="p-6 sm:p-8 space-y-6 border-slate-200 shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-ink-primary">Groq Cloud AI Integration</h2>
                    <p className="text-xs text-ink-secondary">Digunakan oleh menu AI Blog Writer untuk mengenerate naskah artikel blog berkualitas tinggi.</p>
                  </div>
                </div>
                <Badge variant="brand">High Speed AI</Badge>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-ink-primary">Groq API Key (gsk_...):</label>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 text-xs font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Dapatkan API Key Gratis di Groq Console</span>
                      <Zap className="w-3 h-3 text-amber-500" />
                    </a>
                  </div>

                  <div className="relative">
                    <input
                      type={showGroqKey ? 'text' : 'password'}
                      value={formData.groqApiKey}
                      onChange={(e) => handleChange('groqApiKey', e.target.value)}
                      placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGroqKey(!showGroqKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="font-bold text-ink-primary block">Default AI Model:</label>
                    <select
                      value={formData.groqDefaultModel}
                      onChange={(e) => handleChange('groqDefaultModel', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white font-mono"
                    >
                      <option value="llama-3.1-70b-versatile">llama-3.1-70b-versatile (Llama 3.1 70B - Kualitas Tinggi)</option>
                      <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Llama 3.1 8B - Super Cepat)</option>
                      <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (Konteks Panjang 32k)</option>
                      <option value="llama3-70b-8192">llama3-70b-8192 (Llama 3 70B Standar)</option>
                      <option value="gemma2-9b-it">gemma2-9b-it (Google Gemma 2 9B)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-ink-primary block">Max Token Output:</label>
                    <input
                      type="number"
                      value={formData.groqMaxTokens}
                      onChange={(e) => handleChange('groqMaxTokens', parseInt(e.target.value) || 2048)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Test Connection Button */}
                <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestGroq}
                    disabled={testGroqStatus.loading}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testGroqStatus.loading ? 'animate-spin' : ''}`} />
                    <span>{testGroqStatus.loading ? 'Menguji API...' : 'Uji Koneksi Groq API'}</span>
                  </button>

                  {testGroqStatus.msg && (
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                      testGroqStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {testGroqStatus.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                      <span>{testGroqStatus.msg}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: EMAIL SMTP & RESEND CONFIG */}
        {activeTab === 'email' && (
          <div className="space-y-6 animate-in fade-in">
            <Card className="p-6 sm:p-8 space-y-6 border-slate-200 shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-ink-primary">Provider Email Notifikasi</h2>
                    <p className="text-xs text-ink-secondary">Pilih antara Resend API atau Brevo (Sendinblue) SMTP untuk pengiriman notifikasi otomatis.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Pilih Provider Aktif:</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between ${
                      formData.emailProvider === 'resend' ? 'bg-brand-50/50 border-brand-500 text-brand-900' : 'bg-white border-slate-200 text-ink-secondary'
                    }`}>
                      <div>
                        <span className="font-bold block">Resend API</span>
                        <span className="text-[11px] text-ink-muted">Modern REST API Email Service</span>
                      </div>
                      <input
                        type="radio"
                        name="provider"
                        checked={formData.emailProvider === 'resend'}
                        onChange={() => handleChange('emailProvider', 'resend')}
                        className="accent-brand-500"
                      />
                    </label>

                    <label className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between ${
                      formData.emailProvider.startsWith('brevo') ? 'bg-brand-50/50 border-brand-500 text-brand-900' : 'bg-white border-slate-200 text-ink-secondary'
                    }`}>
                      <div>
                        <span className="font-bold block">Brevo (Sendinblue)</span>
                        <span className="text-[11px] text-ink-muted">SMTP Relay &amp; Marketing API</span>
                      </div>
                      <input
                        type="radio"
                        name="provider"
                        checked={formData.emailProvider.startsWith('brevo')}
                        onChange={() => handleChange('emailProvider', 'brevo_api')}
                        className="accent-brand-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Resend Settings */}
                {formData.emailProvider === 'resend' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-1.5">
                      <label className="font-bold text-ink-primary block">Resend API Key (re_...):</label>
                      <div className="relative">
                        <input
                          type={showResendKey ? 'text' : 'password'}
                          value={formData.resendApiKey}
                          onChange={(e) => handleChange('resendApiKey', e.target.value)}
                          placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowResendKey(!showResendKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showResendKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-ink-primary block">Sender Email Terverifikasi:</label>
                        <input
                          type="email"
                          value={formData.resendSenderEmail}
                          onChange={(e) => handleChange('resendSenderEmail', e.target.value)}
                          placeholder="notifikasi@jokitugasku.id"
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-ink-primary block">Sender Name:</label>
                        <input
                          type="text"
                          value={formData.resendSenderName}
                          onChange={(e) => handleChange('resendSenderName', e.target.value)}
                          placeholder="JokiTugasKu Notifikasi"
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Brevo Settings */}
                {formData.emailProvider.startsWith('brevo') && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-1.5">
                      <label className="font-bold text-ink-primary block">Brevo API Key (xkeysib-...):</label>
                      <div className="relative">
                        <input
                          type={showBrevoKey ? 'text' : 'password'}
                          value={formData.brevoApiKey}
                          onChange={(e) => handleChange('brevoApiKey', e.target.value)}
                          placeholder="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 text-xs sm:text-sm text-ink-primary bg-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowBrevoKey(!showBrevoKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showBrevoKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Test Email Card */}
            <Card className="p-6 space-y-4 border-slate-200">
              <h3 className="font-bold text-sm text-ink-primary flex items-center gap-2">
                <Send className="w-4 h-4 text-brand-600" />
                <span>Uji Coba Pengiriman Email Notifikasi</span>
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  placeholder="Masukkan email penerima uji coba..."
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-ink-primary bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testEmailStatus.loading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {testEmailStatus.loading ? 'Mengirim...' : 'Kirim Email Test'}
                </button>
              </div>

              {testEmailStatus.msg && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  testEmailStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}>
                  {testEmailStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{testEmailStatus.msg}</span>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 4: DATA & PEMBERSIHAN DEMO (LIVE READINESS) */}
        {activeTab === 'data' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Database Status Card */}
            <Card className="p-6 sm:p-8 space-y-6 border-slate-200 shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-ink-primary">Status Database &amp; Kesiapan Live Testing</h2>
                    <p className="text-xs text-ink-secondary">Pantau jumlah data yang tersimpan dan bersihkan data simulasi/demo sebelum pengujian nyata.</p>
                  </div>
                </div>
                <Badge variant={tasks.length === 0 ? 'success' : 'neutral'}>
                  {tasks.length === 0 ? 'Clean (0 Task)' : `${tasks.length} Tugas Tersimpan`}
                </Badge>
              </div>

              {/* 4 Stat Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-500" />
                    <span>Tugas di Pipeline</span>
                  </span>
                  <span className="text-2xl font-extrabold text-ink-primary">{tasks.length}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Leads WhatsApp</span>
                  </span>
                  <span className="text-2xl font-extrabold text-ink-primary">{leadsCount}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>User &amp; Penjoki</span>
                  </span>
                  <span className="text-2xl font-extrabold text-ink-primary">{usersList.length}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    <span>Artikel Blog</span>
                  </span>
                  <span className="text-2xl font-extrabold text-ink-primary">{articlesCount}</span>
                </div>
              </div>
            </Card>

            {/* Master Action: Clear All Demo Data */}
            <Card className="p-6 sm:p-8 space-y-4 border-2 border-rose-200 bg-rose-50/50 shadow-card">
              <div className="flex items-center gap-3">
                <Trash2 className="w-6 h-6 text-rose-600 flex-shrink-0" />
                <div>
                  <h3 className="font-extrabold text-base text-rose-950">
                    Bersihkan Seluruh Data Demo (Siap Live Testing 100%)
                  </h3>
                  <p className="text-xs text-rose-800 leading-relaxed mt-0.5">
                    Menghapus seluruh tugas simulasi (menjadi 0 tugas), mengosongkan leads CRM simulasi (menjadi 0 leads), dan menghapus penjoki demo (hanya menyisakan akun Super Admin asli).
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleMasterClearAllDemo}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>BERSIHKAN SEMUA DATA DEMO SEKARANG</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestoreSampleData}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-2 border border-slate-300 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                  <span>Muat Ulang Data Sampel / Demo</span>
                </button>
              </div>
            </Card>

            {/* Granular Cleaning Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              
              <Card className="p-5 space-y-3 border-slate-200">
                <div>
                  <span className="font-bold text-ink-primary block text-sm">Antrean Tugas (Task Board)</span>
                  <span className="text-ink-muted text-[11px]">Kosongkan antrean tugas untuk input tugas riil dari klien.</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearTasksOnly}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 font-bold border border-slate-200 hover:border-rose-200 transition-colors"
                >
                  Kosongkan Tugas ({tasks.length})
                </button>
              </Card>

              <Card className="p-5 space-y-3 border-slate-200">
                <div>
                  <span className="font-bold text-ink-primary block text-sm">Leads CRM WhatsApp</span>
                  <span className="text-ink-muted text-[11px]">Kosongkan database chat WhatsApp masuk.</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearLeadsOnly}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 font-bold border border-slate-200 hover:border-rose-200 transition-colors"
                >
                  Kosongkan Leads ({leadsCount})
                </button>
              </Card>

              <Card className="p-5 space-y-3 border-slate-200">
                <div>
                  <span className="font-bold text-ink-primary block text-sm">Daftar Worker Demo</span>
                  <span className="text-ink-muted text-[11px]">Hapus akun penjoki sampel (sisakan Super Admin).</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearWorkersOnly}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 font-bold border border-slate-200 hover:border-rose-200 transition-colors"
                >
                  Hapus Worker Demo
                </button>
              </Card>

            </div>

          </div>
        )}

        {/* Global Save Button (only on config tabs) */}
        {activeTab !== 'data' && (
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" size="lg" className="gap-2 shadow-brand-glow">
              <Save className="w-4 h-4" />
              <span>Simpan Seluruh Pengaturan</span>
            </Button>
          </div>
        )}

      </form>

    </div>
  );
}
