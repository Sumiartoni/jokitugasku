import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  KeyRound, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as any)?.from?.pathname || (user.role === 'WORKER' ? '/worker' : '/');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Login gagal. Periksa kembali email dan password.');
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo JokiTugasKu"
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            JokiTugas<span className="text-brand-400">Ku</span>
          </span>
        </div>

        <a
          href={import.meta.env.VITE_PUBLIC_URL || '/'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Website Publik</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-ink-primary space-y-6">
          
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-subtle">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-ink-primary tracking-tight">
              Portal Internal & CRM
            </h1>
            <p className="text-xs text-ink-secondary">
              Masuk untuk mengelola SEO, leads WhatsApp, dan tugas.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-bold text-ink-primary block text-xs">Email Pengguna</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jokitugasku.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-ink-primary block text-xs">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-ink-primary text-xs sm:text-sm focus:border-brand-500 bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full justify-center gap-2 mt-2 shadow-brand-glow text-sm font-bold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Test Buttons — Only visible in demo mode (VITE_DEMO_MODE=true) */}
          {import.meta.env.VITE_DEMO_MODE === 'true' && (
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                  Akun Uji Coba (Klik Cepat):
                </span>
                <Badge variant="brand" className="text-[10px]">Demo Mode</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@jokitugasku.id', 'Admin@JT2026!')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-ink-secondary text-center transition-colors font-medium"
                >
                  <span className="block font-bold text-ink-primary">Super Admin</span>
                  <span className="text-[10px] text-ink-muted">Akses Penuh</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('operator@jokitugasku.id', 'Operator@JT2026!')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-ink-secondary text-center transition-colors font-medium"
                >
                  <span className="block font-bold text-ink-primary">CS Operator</span>
                  <span className="text-[10px] text-ink-muted">CRM & Task</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('worker@jokitugasku.id', 'Worker@JT2026!')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-ink-secondary text-center transition-colors font-medium"
                >
                  <span className="block font-bold text-ink-primary">Penjoki</span>
                  <span className="text-[10px] text-ink-muted">Tugas Khusus</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Security Microcopy */}
        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sesi terenkripsi & dilindungi proteksi brute-force otomatis.</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400">
        © {new Date().getFullYear()} JokiTugasKu.id • Internal Security Portal
      </div>

    </div>
  );
}
