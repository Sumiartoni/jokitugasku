import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Key, 
  Mail, 
  Phone, 
  CheckCircle2, 
  X, 
  Trash2, 
  Edit3, 
  Briefcase,
  Copy,
  Send,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth, UserRole, UserAccount } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { sendEmailNotification } from '@/utils/settings';

export function UsersManagementPage() {
  const { usersList, addUser, updateUser, deleteUser, resetUserPassword, user: currentUser } = useAuth();

  useEffect(() => {
    document.title = 'Manajemen User & Worker - JokiTugasKu Super Admin';
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserAccount | null>(null);

  // Form State for Add User
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('WORKER');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  // Form State for Reset Password
  const [newPassword, setNewPassword] = useState('');

  // Notification / Toast
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `JT-${res}`;
  };

  const handleOpenAddModal = () => {
    setName('');
    setEmail('');
    setPassword(generateRandomPassword());
    setRole('WORKER');
    setPhone('');
    setSpecialization('');
    setSendWelcomeEmail(true);
    setAddModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('error', 'Nama, Email, dan Password wajib diisi.');
      return;
    }

    const result = addUser({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      phone: phone.trim() || undefined,
      specialization: role === 'WORKER' ? specialization.trim() || 'Semua Jenis Tugas' : undefined,
      status: 'ACTIVE'
    });

    if (!result.success) {
      showToast('error', result.error || 'Gagal menambahkan user baru.');
      return;
    }

    // If welcome email is enabled, trigger email notification via Brevo/Resend
    if (sendWelcomeEmail) {
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <!-- Header with Brand Gradient & Logo -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%); padding: 32px 24px; text-align: center;">
            <div style="display: inline-block; background-color: #ffffff; padding: 10px 20px; border-radius: 12px; margin-bottom: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <span style="font-size: 20px; font-weight: 900; color: #4f46e5; letter-spacing: -0.5px;">JokiTugasKu<span style="color: #9333ea;">.id</span></span>
            </div>
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px;">
              Selamat Bergabung di Tim JokiTugasKu!
            </h1>
            <p style="color: #e0e7ff; font-size: 13px; margin: 0;">
              Platform Layanan Asistensi Akademik &amp; Pembuatan Tugas Terpercaya
            </p>
          </div>

          <!-- Body Content -->
          <div style="padding: 28px 24px; color: #1e293b;">
            <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
              Halo <strong>${name}</strong>,
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Selamat! Anda telah resmi didaftarkan sebagai <strong>${role === 'WORKER' ? 'Penjoki / Academic Worker' : role === 'ADMIN_OPERATOR' ? 'CS & Operasional Operator' : 'Administrator'}</strong> di sistem internal <strong>JokiTugasKu.id</strong>.
            </p>

            <!-- Credentials Card -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #4f46e5; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px 0;">
                🔑 Kredensial Akses Akun Anda:
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Portal Login:</strong></td>
                  <td style="padding: 6px 0; font-weight: 600;"><a href="https://admin.jokitugasku.id/login" style="color: #4f46e5; text-decoration: none;">https://admin.jokitugasku.id/login</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Email / Username:</strong></td>
                  <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${email.toLowerCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Password Akun:</strong></td>
                  <td style="padding: 6px 0; font-weight: 700; color: #7c3aed; font-family: monospace; font-size: 15px;">${password}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Peran / Role:</strong></td>
                  <td style="padding: 6px 0; font-weight: 600; color: #059669;">${role === 'WORKER' ? 'Worker (Penjoki)' : role === 'ADMIN_OPERATOR' ? 'CS Operator' : 'Super Admin'}</td>
                </tr>
                ${specialization ? `
                <tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Keahlian:</strong></td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${specialization}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Login Action Button -->
            <div style="text-align: center; margin: 28px 0 20px 0;">
              <a href="https://admin.jokitugasku.id/login" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);">
                Masuk ke Portal Dashboard &rarr;
              </a>
            </div>

            <!-- Security Instructions -->
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-top: 24px;">
              <p style="font-size: 12px; color: #1e40af; margin: 0; line-height: 1.5;">
                🔒 <strong>Keamanan &amp; Privasi Data:</strong> Jaga kerahasiaan kredensial ini. Jangan bagikan email dan password kepada siapapun.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0 0 4px 0;">&copy; ${new Date().getFullYear()} <strong>JokiTugasKu.id</strong>. Hak Cipta Dilindungi.</p>
            <p style="margin: 0;">Layanan Bantuan &amp; Konsultasi: <a href="https://wa.me/62895320603421" style="color: #4f46e5; text-decoration: none;">+62 895-3206-03421</a></p>
          </div>
        </div>
      `;

      sendEmailNotification({
        toEmail: email.trim(),
        toName: name.trim(),
        subject: `🎉 Selamat Bergabung di JokiTugasKu — Kredensial Akun ${role === 'WORKER' ? 'Worker' : 'Admin'}`,
        htmlContent: emailHtml
      }).then(res => {
        if (!res.success) {
          console.warn('[Email Warning]', res.message);
        }
      });
    }

    setAddModalOpen(false);
    showToast('success', `User ${name} (${email}) berhasil ditambahkan sebagai ${role}!`);
  };

  const handleToggleStatus = (target: UserAccount) => {
    if (target.id === currentUser?.id) {
      showToast('error', 'Anda tidak dapat menonaktifkan akun sendiri.');
      return;
    }
    const newStatus = target.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const res = updateUser(target.id, { status: newStatus });
    if (res.success) {
      showToast('success', `Status ${target.name} diubah menjadi ${newStatus === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}.`);
    }
  };

  const handleDelete = (target: UserAccount) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${target.name} (${target.email})?`)) return;
    const res = deleteUser(target.id);
    if (res.success) {
      showToast('success', `Akun ${target.name} berhasil dihapus.`);
    } else {
      showToast('error', res.error || 'Gagal menghapus user.');
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !newPassword.trim()) return;

    const res = resetUserPassword(targetUser.id, newPassword.trim());
    if (res.success) {
      showToast('success', `Password untuk ${targetUser.name} berhasil diubah.`);
      setResetModalOpen(false);
      setTargetUser(null);
    } else {
      showToast('error', res.error || 'Gagal mereset password.');
    }
  };

  const copyCredentials = (u: UserAccount) => {
    const text = `Kredensial Login JokiTugasKu:\nEmail: ${u.email}\nPassword: ${u.password || 'Tersimpan aman'}\nURL: http://localhost:3001/login`;
    navigator.clipboard.writeText(text);
    setCopiedId(u.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered list
  const filteredUsers = usersList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (u.specialization && u.specialization.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const countSuperAdmin = usersList.filter(u => u.role === 'SUPER_ADMIN').length;
  const countOperator = usersList.filter(u => u.role === 'ADMIN_OPERATOR').length;
  const countWorker = usersList.filter(u => u.role === 'WORKER').length;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-3 ${
          toastMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
              Manajemen User & Worker
            </h1>
            <Badge variant="brand" className="text-[10px]">Super Admin</Badge>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Daftarkan user, CS operator, dan worker/penjoki baru dengan email custom milik mereka.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAddModal}
          className="gap-2 self-start sm:self-auto shadow-brand-glow"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah User / Worker Baru</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-xs text-ink-muted block font-medium">Total Akun Terdaftar</span>
          <span className="text-2xl font-extrabold text-ink-primary">{usersList.length}</span>
        </Card>
        <Card className="p-4 space-y-1 border-l-4 border-l-brand-500">
          <span className="text-xs text-ink-muted block font-medium">Super Admin</span>
          <span className="text-2xl font-extrabold text-brand-600">{countSuperAdmin}</span>
        </Card>
        <Card className="p-4 space-y-1 border-l-4 border-l-blue-500">
          <span className="text-xs text-ink-muted block font-medium">CS Operator</span>
          <span className="text-2xl font-extrabold text-blue-600">{countOperator}</span>
        </Card>
        <Card className="p-4 space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-xs text-ink-muted block font-medium">Worker / Penjoki</span>
          <span className="text-2xl font-extrabold text-emerald-600">{countWorker}</span>
        </Card>
      </div>

      {/* Search and Role Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, atau keahlian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-ink-primary focus:border-brand-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          {[
            { label: 'Semua Role', value: 'ALL' },
            { label: `Super Admin (${countSuperAdmin})`, value: 'SUPER_ADMIN' },
            { label: `Operator (${countOperator})`, value: 'ADMIN_OPERATOR' },
            { label: `Worker (${countWorker})`, value: 'WORKER' }
          ].map(r => (
            <button
              key={r.value}
              onClick={() => setFilterRole(r.value)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filterRole === r.value ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-ink-muted font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Nama Lengkap & Kontak</th>
                <th className="p-4">Email Custom (Username Login)</th>
                <th className="p-4">Peran (Role)</th>
                <th className="p-4">Spesialisasi / Catatan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-ink-secondary">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-ink-primary text-sm">{u.name}</div>
                    {u.phone && (
                      <div className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{u.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-ink-primary font-medium">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-500" />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      u.role === 'SUPER_ADMIN' ? 'bg-brand-50 text-brand-700 border border-brand-200' :
                      u.role === 'ADMIN_OPERATOR' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {u.role === 'SUPER_ADMIN' ? 'Super Admin' : u.role === 'ADMIN_OPERATOR' ? 'CS Operator' : 'Worker / Penjoki'}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs truncate text-[11px]">
                    {u.specialization || (u.role === 'SUPER_ADMIN' ? 'Kontrol Penuh Sistem' : 'Layanan Pelanggan')}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700'
                          : 'bg-rose-50 text-rose-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                      title="Klik untuk toggle status"
                    >
                      {u.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Copy credentials button */}
                      <button
                        onClick={() => copyCredentials(u)}
                        title="Salin Kredensial Login"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        {copiedId === u.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Reset password button */}
                      <button
                        onClick={() => {
                          setTargetUser(u);
                          setNewPassword(generateRandomPassword());
                          setResetModalOpen(true);
                        }}
                        title="Reset Password"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete button (except self) */}
                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(u)}
                          title="Hapus Akun"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---- Modal Tambah User / Worker Baru ---- */}
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
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-600" />
                <h2 className="text-lg font-bold text-ink-primary">Daftarkan User / Worker Baru</h2>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                Masukkan email pribadi user agar dapat login langsung ke portal.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-ink-primary block">Email Milik Pengguna (Custom Email)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: budi.worker@gmail.com atau budi@kampus.ac.id"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Peran (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
                  >
                    <option value="WORKER">Worker / Penjoki</option>
                    <option value="ADMIN_OPERATOR">CS Operator</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Nomor WhatsApp (Opsional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
                  />
                </div>
              </div>

              {role === 'WORKER' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-ink-primary block">Spesialisasi Keahlian Penjoki</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Contoh: Olah Data SPSS & Bimbingan Skripsi S1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-ink-primary block">Password Akun</label>
                  <button
                    type="button"
                    onClick={() => setPassword(generateRandomPassword())}
                    className="text-[11px] text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Acak</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white font-mono"
                  required
                />
              </div>

              {/* Email Send Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-ink-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendWelcomeEmail}
                    onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                    className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span>Kirim kredensial login via email ke <strong>{email || 'user baru'}</strong> (Brevo / Resend)</span>
                </label>
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
                  <UserPlus className="w-4 h-4" />
                  <span>Simpan & Daftarkan User</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Modal Reset Password ---- */}
      {resetModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => { setResetModalOpen(false); setTargetUser(null); }}
              className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-ink-primary">Reset Password User</h2>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                Atur kata sandi baru untuk <strong>{targetUser.name}</strong> ({targetUser.email}).
              </p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-ink-primary block">Password Baru</label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[11px] text-brand-600 font-bold hover:underline"
                  >
                    Generate Acak
                  </button>
                </div>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setResetModalOpen(false); setTargetUser(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <Button type="submit" variant="primary" size="sm" className="gap-2">
                  <Key className="w-4 h-4" />
                  <span>Simpan Password Baru</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
