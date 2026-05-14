import jwt from 'jsonwebtoken';
import { users } from '../store/memory.js';

const SECRET = process.env.JWT_SECRET || 'drop-dev-secret-change-in-prod';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: '30d' });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    const { sub } = jwt.verify(header.slice(7), SECRET);
    const user = users.get(sub);
    if (!user || user.banned) return res.status(401).json({ error: 'Invalid user' });
    user.lastActive = Date.now();
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token expired' });
  }
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  });
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const { sub } = jwt.verify(header.slice(7), SECRET);
    req.user = users.get(sub) || null;
  } catch {}
  next();
}
