import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase.js';
import prisma from '../utils/prisma.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Fetch Profile to get User Type / Role
    const profile = await prisma.profile.findUnique({
      where: { id: data.user.id }
    });

    (req as any).user = {
      id: data.user.id,
      email: data.user.email,
      type: profile?.type,
      role: profile?.type === 'Admin' ? 'admin' : 'user'
    };
    
    next();
  } catch (error) {
    console.error('CRITICAL AUTH ERROR:', error);
    return res.status(401).json({ error: 'Error en autenticación' });
  }
};
