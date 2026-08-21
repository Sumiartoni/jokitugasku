import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'jokitugasku_jwt_fallback_secret';

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token otentikasi tidak ditemukan.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak valid atau sudah kedaluwarsa.'
    });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN_OPERATOR') {
      return res.status(403).json({
        success: false,
        message: 'Akses terbatas hanya untuk Super Admin atau Admin Operator.'
      });
    }
    next();
  });
}
