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
  passwordHash: bcrypt.hashSync('Admin123!', 10),
  status: 'ACTIVE'
};

/**
 * Login endpoint: Verify password and issue JWT
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

    // 1. Check in Supabase profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    let matchedUser = null;

    const isSuperAdminPass = cleanEmail === 'admin@jokitugasku.id' && (password === 'Admin@JT2026!' || password === 'Admin123!');
    const isOperatorPass = cleanEmail === 'operator@jokitugasku.id' && (password === 'Operator@JT2026!' || password === 'Operator123!');

    if (profile) {
      // Check password
      const isMatch = profile.password_hash 
        ? bcrypt.compareSync(password, profile.password_hash)
        : (isSuperAdminPass || isOperatorPass);

      if (isMatch) {
        matchedUser = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          specialization: profile.specialization,
          status: profile.status
        };
      }
    } else if (isSuperAdminPass) {
      // Super admin bootstrap
      matchedUser = {
        id: DEFAULT_SUPER_ADMIN.id,
        name: DEFAULT_SUPER_ADMIN.name,
        email: DEFAULT_SUPER_ADMIN.email,
        role: DEFAULT_SUPER_ADMIN.role,
        status: DEFAULT_SUPER_ADMIN.status
      };
    } else if (isOperatorPass) {
      // Operator bootstrap
      matchedUser = {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'CS Operator',
        email: 'operator@jokitugasku.id',
        role: 'ADMIN_OPERATOR',
        status: 'ACTIVE'
      };
    }

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: 'Kombinasi email atau password salah.'
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
 * Get current logged in user status
 */
authRouter.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user
  });
});

/**
 * Get all team members / workers (Admin only)
 */
authRouter.get('/workers', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, phone, specialization, status, created_at')
      .order('created_at', { ascending: false });

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
 * Create new worker / admin account (Super Admin only)
 */
authRouter.post('/workers', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, email, role, phone, specialization, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = bcrypt.hashSync(password, 10);

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        name,
        email: cleanEmail,
        role: role || 'WORKER',
        phone: phone || '',
        specialization: specialization || 'Umum',
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Gagal menambahkan akun: ${error.message}`
      });
    }

    return res.json({
      success: true,
      message: 'Akun worker berhasil dibuat.',
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
