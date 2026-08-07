import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Pre-seeded preset accounts for Admin and Analysis Trial User
const users: any[] = [
  {
    id: 'admin-01',
    email: 'febricase@gmail.com',
    passwordRaw: 'S@gal4dukunSkr1psi',
    name: 'Febri (Admin Dukun Skripsi)',
    role: 'admin',
    plan: 'Admin',
    isPro: true
  },
  {
    id: 'user-analysis-01',
    email: 'analysis@dukunskripsi.id',
    passwordRaw: '@nalysis12345',
    name: 'User Uji Coba Analysis',
    role: 'user',
    plan: 'Trial 5 Jam',
    isPro: true
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = { id: Date.now().toString(), email, password: hashedPassword, name, role: 'user' };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(400).json({ error: 'Email atau password salah' });
    
    let isMatch = false;
    if (user.passwordRaw && user.passwordRaw === password) {
      isMatch = true;
    } else if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }
    
    if (!isMatch) return res.status(400).json({ error: 'Email atau password salah' });
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role || 'user', plan: user.plan || 'Free', isPro: user.isPro || false } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = (req: Request, res: Response) => {
  res.json({ user: (req as any).user });
};

