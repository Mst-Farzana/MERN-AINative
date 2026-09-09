import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId?: string; role?: string };
    if (!payload.userId || !payload.role)
      return res.status(401).json({ message: 'Invalid authentication token' });
    req.user = { userId: payload.userId, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
};
