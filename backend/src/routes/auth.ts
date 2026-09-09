// ✅ ১. এই ইম্পোর্টগুলো ফাইলের শুরুতে যোগ করুন
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { User } from '../models/user.js';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !normalizedEmail ||
      typeof password !== 'string' ||
      password.length < 6
    ) {
      return res
        .status(400)
        .json({ message: 'Name, valid email, and a 6-character password are required' });
    }

    if (role !== 'admin' && role !== 'delivery') {
      return res.status(400).json({ message: 'Invalid account role' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login should be rate-limited at the app or reverse-proxy layer to reduce brute-force attempts.
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Keep password excluded by default; select it only for this verification step.
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Use a generic response so callers cannot distinguish a missing user from a wrong password.
    if (!user || user.role !== role) {
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    // JWT_SECRET must come from a strong server-side environment variable and never from the client.
    const token = jwt.sign({ userId: user._id, role: user.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE as jwt.SignOptions['expiresIn'],
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    // Do not expose internal error details to clients; log them server-side in production.
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/profile/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.userId !== req.params.id)
      return res.status(403).json({ message: 'You can only access your own profile' });
    const user = await User.findById(req.params.id).select('name email phone role');
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    return res.json({ success: true, data: user });
  } catch (error: unknown) {
    console.error('Profile load error:', error);
    return res.status(500).json({ message: 'Unable to load profile' });
  }
});

router.patch('/profile/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.userId !== req.params.id)
      return res.status(403).json({ message: 'You can only update your own profile' });
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => ['name', 'email', 'phone'].includes(key))
    );
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('name email phone role');
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    return res.json({ success: true, data: user });
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Unable to update profile' });
  }
});

export default router;
