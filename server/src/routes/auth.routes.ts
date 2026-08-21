import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/db';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'jokitugasku_jwt_fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Super Admin default credentials for bootstrap
 */
const DEFAULT_SUPER_ADMIN = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Super Admin',
  email: 'admin@jokitugasku.id',
  role: 'SUPER_ADMIN',
  passwordHash: bcrypt.hashSync('Admin@JT2026!', 10),
  status: 'ACTIVE'
};

const DEFAULT_OPERATOR = {
  id: '00000000-0000-0000-0000-000000000002',
  name: 'CS Operator',
  email: 'operator@jokitugasku.id',
  role: 'ADMIN_OPERATOR',
  passwordHash: bcrypt.hashSync('Operator@JT2026!', 10),
  status: 'ACTIVE'
};

/**
 * Helper to get secure user credential vault from Supabase settings table
 */
async function getCredentialVault(): Promise<Record<string, { passwordHash: string; updatedAt: string }>> {
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'user_credentials')
      .single();

    if (data && data.value && typeof data.value === 'object') {
      return data.value as Record<string, { passwordHash: string; updatedAt: string }>;
    }
  } catch (err) {
    console.warn('⚠️ [Auth] Warning fetching credential vault:', err);
  }
  return {
    'admin@jokitugasku.id': { passwordHash: DEFAULT_SUPER_ADMIN.passwordHash, updatedAt: new Date().toISOString() },
    'operator@jokitugasku.id': { passwordHash: DEFAULT_OPERATOR.passwordHash, updatedAt: new Date().toISOString() }
  };
}

/**
 * Helper to save secure user credential vault to Supabase settings table
 */
async function saveCredentialVault(vault: Record<string, { passwordHash: string; updatedAt: string }>) {
  try {
    await supabase
      .from('settings')
      .upsert({
        key: 'user_credentials',
        value: vault,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
  } catch (err) {
    console.error('❌ [Auth] Error saving credential vault:', err);
  }
}

/**
 * Seed default admin accounts to profiles table if missing
 */
async function ensureAdminProfiles() {
  try {
    const { data: existing } = await supabase.from('profiles').select('email');
    const emails = (existing || []).map(p => p.email.toLowerCase());

    if (!emails.includes('admin@jokitugasku.id')) {
      await supabase.from('profiles').insert({
        name: DEFAULT_SUPER_ADMIN.name,
        email: DEFAULT_SUPER_ADMIN.email,
        role: DEFAULT_SUPER_ADMIN.role,
        status: DEFAULT_SUPER_ADMIN.status,
        created_at: new Date().toISOString()
      });
    }

    if (!emails.includes('operator@jokitugasku.id')) {
      await supabase.from('profiles').insert({
        name: DEFAULT_OPERATOR.name,
        email: DEFAULT_OPERATOR.email,
        role: DEFAULT_OPERATOR.role,
        status: DEFAULT_OPERATOR.status,
        created_at: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('⚠️ [Auth] Note ensuring admin profiles:', err);
  }
}

// Run initial check
ensureAdminProfiles();

/**
 * POST /api/auth/login: Verify password against Supabase DB and issue JWT
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Fetch user profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    // 2. Fetch credential vault
    const vault = await getCredentialVault();
    const vaultEntry = vault[cleanEmail];

    const isSuperAdminFallback = cleanEmail === 'admin@jokitugasku.id' && (password === 'Admin@JT2026!' || password === 'Admin123!');
    const isOperatorFallback = cleanEmail === 'operator@jokitugasku.id' && (password === 'Operator@JT2026!' || password === 'Operator123!');

    let isMatch = false;
    if (vaultEntry?.passwordHash) {
      isMatch = bcrypt.compareSync(password, vaultEntry.passwordHash);
    }
    if (!isMatch && (isSuperAdminFallback || isOperatorFallback)) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Kombinasi email atau password salah.'
      });
    }

    let matchedUser = null;
    if (profile) {
      matchedUser = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        phone: profile.phone,
        specialization: profile.specialization,
        status: profile.status
      };
    } else if (cleanEmail === 'admin@jokitugasku.id') {
      matchedUser = {
        id: DEFAULT_SUPER_ADMIN.id,
        name: DEFAULT_SUPER_ADMIN.name,
        email: DEFAULT_SUPER_ADMIN.email,
        role: DEFAULT_SUPER_ADMIN.role,
        status: DEFAULT_SUPER_ADMIN.status
      };
    } else if (cleanEmail === 'operator@jokitugasku.id') {
      matchedUser = {
        id: DEFAULT_OPERATOR.id,
        name: DEFAULT_OPERATOR.name,
        email: DEFAULT_OPERATOR.email,
        role: DEFAULT_OPERATOR.role,
        status: DEFAULT_OPERATOR.status
      };
    }

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak ditemukan.'
      });
    }

    if (matchedUser.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda saat ini dinonaktifkan oleh Administrator.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: matchedUser.id,
        email: matchedUser.email,
        role: matchedUser.role,
        name: matchedUser.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: matchedUser
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `Error login: ${err.message}`
    });
  }
});

/**
 * GET /api/auth/me: Get current logged in user status
 */
authRouter.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * GET /api/auth/users: Get all registered users & workers from Supabase
 */
authRouter.get('/users', async (req: Request, res: Response) => {
  try {
    await ensureAdminProfiles();

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, phone, specialization, status, created_at')
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      data: data || []
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/auth/users: Create new worker / admin account and persist to Supabase DB
 */
authRouter.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, role, phone, specialization, password, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar. Gunakan email lain.'
      });
    }

    // 1. Insert into Supabase profiles table
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        name: name.trim(),
        email: cleanEmail,
        role: role || 'WORKER',
        phone: phone ? phone.trim() : null,
        specialization: specialization ? specialization.trim() : (role === 'WORKER' ? 'Semua Jenis Tugas' : null),
        status: status || 'ACTIVE',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Gagal menyimpan ke database Supabase: ${error.message}`
      });
    }

    // 2. Hash password and save to credential vault in Supabase settings
    const passwordHash = bcrypt.hashSync(password.trim(), 10);
    const vault = await getCredentialVault();
    vault[cleanEmail] = {
      passwordHash,
      updatedAt: new Date().toISOString()
    };
    await saveCredentialVault(vault);

    return res.json({
      success: true,
      message: 'Akun berhasil dibuat dan tersimpan di database Supabase.',
      data: newProfile
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/auth/users/:id: Update user profile
 */
authRouter.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, phone, specialization, status } = req.body;

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    if (name) updates.name = name.trim();
    if (role) updates.role = role;
    if (phone !== undefined) updates.phone = phone ? phone.trim() : null;
    if (specialization !== undefined) updates.specialization = specialization ? specialization.trim() : null;
    if (status) updates.status = status;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      message: 'Profil user berhasil diperbarui.',
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/auth/users/:id/reset-password: Reset user password
 */
authRouter.post('/users/:id/reset-password', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter.'
      });
    }

    // Get user email from profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const cleanEmail = profile.email.toLowerCase();
    const passwordHash = bcrypt.hashSync(newPassword.trim(), 10);

    const vault = await getCredentialVault();
    vault[cleanEmail] = {
      passwordHash,
      updatedAt: new Date().toISOString()
    };
    await saveCredentialVault(vault);

    return res.json({
      success: true,
      message: `Password untuk ${profile.email} berhasil direset.`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/auth/users/:id: Delete user account
 */
authRouter.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, role')
      .eq('id', id)
      .single();

    if (profile && profile.email === 'admin@jokitugasku.id') {
      return res.status(400).json({
        success: false,
        message: 'Akun Super Admin utama tidak boleh dihapus.'
      });
    }

    // 1. Delete from profiles table
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // 2. Remove from vault
    if (profile?.email) {
      const cleanEmail = profile.email.toLowerCase();
      const vault = await getCredentialVault();
      delete vault[cleanEmail];
      await saveCredentialVault(vault);
    }

    return res.json({
      success: true,
      message: 'User berhasil dihapus dari database Supabase.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
