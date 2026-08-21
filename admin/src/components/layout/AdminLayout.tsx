import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Search, 
  Layers, 
  FileText, 
  Settings, 
  Briefcase, 
  ExternalLink,
  MessageCircle,
  Menu,
  X,
  LogOut,
  Users,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LiveClockBadge } from '@/components/ui/LiveClockBadge';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard KPI', href: '/', icon: BarChart3 },
    { name: 'Manajemen User & Worker', href: '/users', icon: Users, badge: 'Super Admin', superAdminOnly: true },
    { name: 'AI Blog Writer (Groq)', href: '/ai-blog', icon: Sparkles, badge: 'AI' },
    { name: 'Kelola Artikel Blog', href: '/articles', icon: FileText, badge: 'Blog' },
    { name: 'SEO Center', href: '/seo', icon: Search, badge: 'SEO' },
    { name: 'CRM WhatsApp Leads', href: '/crm', icon: MessageCircle, badge: 'CRM' },
    { name: 'Task Pipeline', href: '/tasks', icon: Layers, badge: 'Pipeline' },
    { name: 'Content CMS', href: '/content', icon: FileText },
    { name: 'Settings & Integrasi', href: '/settings', icon: Settings },
  ];

  // Filter out Super Admin only items if operator
  const visibleNavItems = navItems.filter(item => {
    if (item.superAdminOnly && user?.role !== 'SUPER_ADMIN') {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-ink-primary font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="Logo JokiTugasKu"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block leading-none">
                JokiTugas<span className="text-brand-400">Ku</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                Admin & CRM Hub
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-brand-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card, Worker Portal & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {user && (
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-white block truncate">{user.name}</span>
                  <span className="text-[10px] text-brand-400 font-semibold uppercase">{user.role}</span>
                </div>
              </div>
            </div>
          )}

          <Link
            to="/worker"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
          >
            <Briefcase className="w-4 h-4 text-brand-400" />
            <span>Portal Worker / Penjoki</span>
          </Link>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors"
          >
            <span>Buka Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold transition-colors border border-rose-900/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo JokiTugasKu"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-sm">JokiTugasKu <span className="text-brand-400">Admin</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 rounded-lg bg-slate-800 text-rose-400"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 p-4 space-y-1">
          {user && (
            <div className="px-3 py-2 text-xs border-b border-slate-800 mb-2">
              <span className="font-bold text-white block">{user.name}</span>
              <span className="text-[10px] text-brand-400 font-semibold uppercase">{user.role}</span>
            </div>
          )}
          {visibleNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <span>{item.name}</span>
            </Link>
          ))}
          <Link
            to="/worker"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-brand-300 hover:bg-slate-800"
          >
            <Briefcase className="w-4 h-4" />
            <span>Portal Worker</span>
          </Link>
          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-slate-800 flex items-center gap-2 mt-2 pt-2 border-t border-slate-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top Live Bar for Desktop Viewport */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200/90 shadow-subtle">
          <div className="flex items-center gap-2 text-xs text-ink-muted font-medium">
            <span>Sistem Operasional Real-Time</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sinkronisasi Aktif
            </span>
          </div>

          <LiveClockBadge />
        </div>

        {children}
      </main>

    </div>
  );
}
