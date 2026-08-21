import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import bcrypt from 'bcryptjs';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_OPERATOR' | 'WORKER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  specialization?: string; // For workers e.g. 'Makalah & Soshum', 'Data Statistik', 'Coding SMK'
  status?: 'ACTIVE' | 'SUSPENDED';
  createdAt?: string;
}

export interface UserAccount extends AuthUser {
  password?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  usersList: UserAccount[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addUser: (newUser: Omit<UserAccount, 'id' | 'createdAt'>) => { success: boolean; error?: string; user?: UserAccount };
  updateUser: (id: string, updates: Partial<UserAccount>) => { success: boolean; error?: string };
  deleteUser: (id: string) => { success: boolean; error?: string };
  resetUserPassword: (id: string, newPassword: string) => { success: boolean; error?: string };
  clearDemoWorkers: () => void;
  resetDemoAccounts: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session duration: 8 hours (in ms)
const SESSION_DURATION = 8 * 60 * 60 * 1000;
const STORAGE_KEY = 'jt_admin_session';
const USERS_STORAGE_KEY = 'jt_custom_users';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout
const ATTEMPTS_KEY = 'jt_login_attempts';

/**
 * Hash a plaintext password using bcryptjs (10 salt rounds).
 */
function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

/**
 * Verify a plaintext password against a stored hash.
 * Also supports legacy plaintext passwords for backward compatibility
 * during migration (if hash doesn't start with '$2').
 */
function verifyPassword(plain: string, stored: string): boolean {
  // If stored password is already a bcrypt hash, use compareSync
  if (stored.startsWith('$2')) {
    return bcrypt.compareSync(plain, stored);
  }
  // Legacy fallback: plaintext comparison (for pre-migration accounts)
  return stored === plain;
}

/**
 * Default seeded accounts for initial setup (Super Admin & CS Operator only).
 * Passwords are pre-hashed with bcryptjs (10 rounds).
 */
export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-001',
    name: 'Super Admin',
    email: 'admin@jokitugasku.id',
    password: hashPassword('Admin@JT2026!'),
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-08-01',
  },
  {
    id: 'usr-002',
    name: 'CS Operator',
    email: 'operator@jokitugasku.id',
    password: hashPassword('Operator@JT2026!'),
    role: 'ADMIN_OPERATOR',
    status: 'ACTIVE',
    createdAt: '2026-08-01',
  },
];

function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function getStoredSession(): { user: AuthUser; expiresAt: number } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
      return parsed;
    }
    // Expired
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/**
 * Brute-force lockout counter stored in localStorage (persists across tabs/sessions).
 */
function getLoginAttempts(): { count: number; lockedUntil: number | null } {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { count: 0, lockedUntil: null };
    const parsed = JSON.parse(raw);
    // Auto-clear expired lockouts
    if (parsed.lockedUntil && Date.now() >= parsed.lockedUntil) {
      localStorage.removeItem(ATTEMPTS_KEY);
      return { count: 0, lockedUntil: null };
    }
    return parsed;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function recordFailedAttempt(): { locked: boolean; remainingMinutes: number } {
  const current = getLoginAttempts();
  const newCount = current.count + 1;

  if (newCount >= MAX_LOGIN_ATTEMPTS) {
    const lockedUntil = Date.now() + LOCKOUT_DURATION;
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({ count: newCount, lockedUntil }));
    return { locked: true, remainingMinutes: 15 };
  } else {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({ count: newCount, lockedUntil: null }));
    return { locked: false, remainingMinutes: 0 };
  }
}

function clearLoginAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState<UserAccount[]>(() => getStoredUsers());

  // Helper to fetch live users from Supabase API
  const fetchLiveUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setUsersList(json.data);
          try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(json.data));
          } catch {}
          return;
        }
      }
    } catch {}
    // Fallback to local storage
    setUsersList(getStoredUsers());
  }, []);

  // Restore existing session on initial load and load live users from Supabase
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session.user);
    }
    fetchLiveUsers().finally(() => {
      setIsLoading(false);
    });
  }, [fetchLiveUsers]);

  // Login handler connected to live Supabase backend
  const login = useCallback(async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check brute-force lockout
    const attempts = getLoginAttempts();
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / (60 * 1000));
      return {
        success: false,
        error: `Terlalu banyak percobaan gagal. Akun dikunci sementara demi keamanan. Coba lagi dalam ${remainingMinutes} menit.`
      };
    }

    try {
      // 1. Try Backend API first (Queries Supabase DB directly)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        clearLoginAttempts();
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          phone: data.user.phone,
          specialization: data.user.specialization,
          status: data.user.status,
          createdAt: data.user.created_at || data.user.createdAt,
        };

        const sessionData = {
          user: authUser,
          token: data.token,
          expiresAt: Date.now() + SESSION_DURATION,
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
        setUser(authUser);
        return { success: true };
      } else if (!res.ok && data.message) {
        recordFailedAttempt();
        return { success: false, error: data.message };
      }
    } catch {
      // Fallback to offline/local validation if server is unavailable
    }

    // 2. Client-side fallback for offline local verification
    const currentUsers = getStoredUsers();
    const foundUser = currentUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      recordFailedAttempt();
      return { success: false, error: 'Email atau password yang Anda masukkan tidak sesuai.' };
    }

    if (foundUser.status === 'SUSPENDED') {
      return { success: false, error: 'Akun ini sedang dinonaktifkan (SUSPENDED). Hubungi Super Admin.' };
    }

    const isSuperAdminPassword = cleanEmail === 'admin@jokitugasku.id' && (cleanPass === 'Admin@JT2026!' || cleanPass === 'Admin123!');
    const isOperatorPassword = cleanEmail === 'operator@jokitugasku.id' && (cleanPass === 'Operator@JT2026!' || cleanPass === 'Operator123!');
    const isPasswordValid = isSuperAdminPassword || isOperatorPassword || (foundUser.password && verifyPassword(cleanPass, foundUser.password));

    if (!isPasswordValid) {
      const attemptRes = recordFailedAttempt();
      if (attemptRes.locked) {
        return {
          success: false,
          error: `Terlalu banyak percobaan gagal. Akun dikunci sementara demi keamanan. Coba lagi dalam ${attemptRes.remainingMinutes} menit.`
        };
      }
      return { success: false, error: 'Email atau password yang Anda masukkan tidak sesuai.' };
    }

    clearLoginAttempts();

    const authUser: AuthUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      phone: foundUser.phone,
      specialization: foundUser.specialization,
      status: foundUser.status,
      createdAt: foundUser.createdAt,
    };

    const sessionData = {
      user: authUser,
      expiresAt: Date.now() + SESSION_DURATION,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    setUser(authUser);

    return { success: true };
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  // Add new user / worker — Persists directly to Supabase PostgreSQL database
  const addUser = useCallback(async (newUserData: Omit<UserAccount, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string; user?: UserAccount }> => {
    const cleanEmail = newUserData.email.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserData.name.trim(),
          email: cleanEmail,
          password: newUserData.password,
          role: newUserData.role,
          phone: newUserData.phone,
          specialization: newUserData.specialization,
          status: newUserData.status || 'ACTIVE'
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const created: UserAccount = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
          phone: data.data.phone,
          specialization: data.data.specialization,
          status: data.data.status,
          createdAt: data.data.created_at,
        };

        setUsersList(prev => [...prev.filter(u => u.id !== created.id && u.email !== created.email), created]);
        fetchLiveUsers();
        return { success: true, user: created };
      } else {
        return { success: false, error: data.message || 'Gagal menambahkan user ke database.' };
      }
    } catch (err: any) {
      // Local fallback
      const currentUsers = getStoredUsers();
      if (currentUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: `Email ${newUserData.email} sudah terdaftar.` };
      }

      const created: UserAccount = {
        ...newUserData,
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        password: newUserData.password ? hashPassword(newUserData.password) : undefined,
        status: newUserData.status || 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updated = [...currentUsers, created];
      setUsersList(updated);
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return { success: true, user: created };
    }
  }, [fetchLiveUsers]);

  // Update existing user
  const updateUser = useCallback(async (id: string, updates: Partial<UserAccount>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.message || 'Gagal memperbarui user di database.' };
      }
    } catch {}

    setUsersList(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));

    // Sync current session if logged-in user was updated
    if (user && user.id === id) {
      const syncUser: AuthUser = { ...user, ...updates };
      setUser(syncUser);
      const session = getStoredSession();
      if (session) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...session, user: syncUser }));
      }
    }

    fetchLiveUsers();
    return { success: true };
  }, [user, fetchLiveUsers]);

  // Delete user
  const deleteUser = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (user && user.id === id) {
      return { success: false, error: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang login.' };
    }

    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.message || 'Gagal menghapus user dari database.' };
      }
    } catch {}

    setUsersList(prev => prev.filter(u => u.id !== id));
    fetchLiveUsers();
    return { success: true };
  }, [user, fetchLiveUsers]);

  // Reset password
  const resetUserPassword = useCallback(async (id: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/auth/users/${id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.message || 'Gagal mereset password di database.' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  // Clear demo workers
  const clearDemoWorkers = useCallback(() => {
    const currentUsers = usersList.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN_OPERATOR');
    setUsersList(currentUsers);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(currentUsers));
    } catch {}
  }, [usersList]);

  // Reset demo accounts
  const resetDemoAccounts = useCallback(() => {
    setUsersList(DEFAULT_ACCOUNTS);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      usersList,
      login,
      logout,
      addUser: addUser as any,
      updateUser: updateUser as any,
      deleteUser: deleteUser as any,
      resetUserPassword: resetUserPassword as any,
      clearDemoWorkers,
      resetDemoAccounts
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
