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

  // Save users list to localStorage and state
  const saveUsers = (newUsers: UserAccount[]) => {
    setUsersList(newUsers);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  };

  // Restore existing session on initial load
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  // Login handler with bcrypt verification
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

    // Refresh users from storage
    const currentUsers = getStoredUsers();
    const foundUser = currentUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      recordFailedAttempt();
      return { success: false, error: 'Email atau password yang Anda masukkan tidak sesuai.' };
    }

    if (foundUser.status === 'SUSPENDED') {
      return { success: false, error: 'Akun ini sedang dinonaktifkan (SUSPENDED). Hubungi Super Admin.' };
    }

    // Validate password using bcrypt (with legacy plaintext fallback)
    if (!foundUser.password || !verifyPassword(cleanPass, foundUser.password)) {
      const attemptRes = recordFailedAttempt();
      if (attemptRes.locked) {
        return {
          success: false,
          error: `Terlalu banyak percobaan gagal. Sistem keamanan mengunci login selama 15 menit.`
        };
      }
      return { success: false, error: 'Email atau password yang Anda masukkan tidak sesuai.' };
    }

    // If the stored password was plaintext (legacy), auto-migrate to hash
    if (foundUser.password && !foundUser.password.startsWith('$2')) {
      const hashed = hashPassword(cleanPass);
      const migrated = currentUsers.map(u =>
        u.id === foundUser.id ? { ...u, password: hashed } : u
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(migrated));
    }

    // Login success
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

  // Add new user / worker (Super Admin only) — password is hashed before storage
  const addUser = useCallback((newUserData: Omit<UserAccount, 'id' | 'createdAt'>): { success: boolean; error?: string; user?: UserAccount } => {
    const currentUsers = getStoredUsers();
    const emailLower = newUserData.email.trim().toLowerCase();

    if (currentUsers.some(u => u.email.toLowerCase() === emailLower)) {
      return { success: false, error: `Email ${newUserData.email} sudah terdaftar dalam sistem.` };
    }

    const created: UserAccount = {
      ...newUserData,
      id: `usr-${Date.now()}`,
      email: emailLower,
      password: newUserData.password ? hashPassword(newUserData.password) : undefined,
      status: newUserData.status || 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...currentUsers, created];
    saveUsers(updated);
    return { success: true, user: created };
  }, []);

  // Update existing user
  const updateUser = useCallback((id: string, updates: Partial<UserAccount>): { success: boolean; error?: string } => {
    const currentUsers = getStoredUsers();

    if (updates.email) {
      const emailLower = updates.email.trim().toLowerCase();
      if (currentUsers.some(u => u.id !== id && u.email.toLowerCase() === emailLower)) {
        return { success: false, error: `Email ${updates.email} sudah digunakan user lain.` };
      }
    }

    const updated = currentUsers.map(u => (u.id === id ? { ...u, ...updates } : u));
    saveUsers(updated);

    // If current logged-in user was updated, sync session
    if (user && user.id === id) {
      const syncUser: AuthUser = {
        ...user,
        ...updates,
      };
      setUser(syncUser);
      const session = getStoredSession();
      if (session) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...session, user: syncUser }));
      }
    }

    return { success: true };
  }, [user]);

  // Delete user
  const deleteUser = useCallback((id: string): { success: boolean; error?: string } => {
    if (user && user.id === id) {
      return { success: false, error: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang login.' };
    }
    const currentUsers = getStoredUsers();
    const updated = currentUsers.filter(u => u.id !== id);
    saveUsers(updated);
    return { success: true };
  }, [user]);

  // Reset password — hash the new password before saving
  const resetUserPassword = useCallback((id: string, newPassword: string): { success: boolean; error?: string } => {
    return updateUser(id, { password: hashPassword(newPassword) });
  }, [updateUser]);

  // Clear demo workers (keep only Super Admin & Operator)
  const clearDemoWorkers = useCallback(() => {
    const currentUsers = getStoredUsers();
    const cleanList = currentUsers.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN_OPERATOR');
    saveUsers(cleanList);
  }, []);

  // Reset demo accounts
  const resetDemoAccounts = useCallback(() => {
    saveUsers(DEFAULT_ACCOUNTS);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      usersList,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      resetUserPassword,
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
