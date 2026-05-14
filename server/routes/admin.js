import { Router } from 'express';
import { users, events, trackStats } from '../store/memory.js';
import { requireAdmin } from '../middleware/auth.js';

export const adminRouter = Router();

// All routes require admin role
adminRouter.use(requireAdmin);

// ── Dashboard stats ───────────────────────────────────────────────────────
adminRouter.get('/stats', (req, res) => {
  const now = Date.now();
  const usersArr = [...users.values()];
  res.json({
    totalUsers:   usersArr.length,
    activeToday:  usersArr.filter(u => now - u.lastActive < 86400000).length,
    activeWeek:   usersArr.filter(u => now - u.lastActive < 604800000).length,
    byPlan: {
      free:    usersArr.filter(u => u.plan === 'free').length,
      pro:     usersArr.filter(u => u.plan === 'pro').length,
      creator: usersArr.filter(u => u.plan === 'creator').length,
    },
    spotifyConnected: usersArr.filter(u => u.spotifyConnected).length,
    totalEvents:  events.size,
    totalTracks:  trackStats.size,
    bannedUsers:  usersArr.filter(u => u.banned).length,
  });
});

// ── List users ────────────────────────────────────────────────────────────
adminRouter.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const all = [...users.values()]
    .sort((a, b) => b.joinedAt - a.joinedAt)
    .slice((page - 1) * limit, page * limit)
    .map(u => ({
      id: u.id, name: u.name, email: u.email, handle: u.handle,
      city: u.city, plan: u.plan, role: u.role, banned: u.banned,
      xp: u.xp, level: u.level, followers: u.followers.length,
      spotifyConnected: u.spotifyConnected, joinedAt: u.joinedAt, lastActive: u.lastActive,
    }));
  res.json({ users: all, total: users.size, page, pages: Math.ceil(users.size / limit) });
});

// ── Ban / unban ───────────────────────────────────────────────────────────
adminRouter.post('/users/:id/ban', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ error: 'Cannot ban admin' });
  user.banned = !user.banned;
  res.json({ banned: user.banned, userId: user.id });
});

// ── Change plan ───────────────────────────────────────────────────────────
adminRouter.post('/users/:id/plan', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { plan } = req.body;
  if (!['free', 'pro', 'creator'].includes(plan)) return res.status(400).json({ error: 'Invalid plan' });
  user.plan = plan;
  res.json({ plan: user.plan, userId: user.id });
});

// ── Change role ───────────────────────────────────────────────────────────
adminRouter.post('/users/:id/role', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.id === req.user.id) return res.status(400).json({ error: 'Cannot change own role' });
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  user.role = role;
  res.json({ role: user.role, userId: user.id });
});

// ── Delete event ──────────────────────────────────────────────────────────
adminRouter.delete('/events/:id', (req, res) => {
  if (!events.has(req.params.id)) return res.status(404).json({ error: 'Not found' });
  events.delete(req.params.id);
  res.json({ deleted: true });
});
