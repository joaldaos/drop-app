import { Router } from 'express';
import { users } from '../store/memory.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { buildUserStats } from '../engine/gamification.js';

export const usersRouter = Router();

// ── Get public profile ────────────────────────────────────────────────────
usersRouter.get('/:id', optionalAuth, (req, res) => {
  const user = users.get(req.params.id);
  if (!user || user.banned) return res.status(404).json({ error: 'Not found' });
  res.json({
    id: user.id, name: user.name, handle: user.handle,
    avatar: user.avatar, city: user.city, plan: user.plan,
    xp: user.xp, level: user.level, badges: user.badges,
    followers: user.followers.length, following: user.following.length,
    totalEvents: user.totalEvents || 0,
    joinedAt: user.joinedAt,
    isFollowing: req.user ? req.user.following.includes(user.id) : false,
    stats: buildUserStats(user),
  });
});

// ── Follow / unfollow ─────────────────────────────────────────────────────
usersRouter.post('/:id/follow', requireAuth, (req, res) => {
  const target = users.get(req.params.id);
  if (!target) return res.status(404).json({ error: 'Not found' });
  if (target.id === req.user.id) return res.status(400).json({ error: 'Cannot follow yourself' });

  const alreadyFollowing = req.user.following.includes(target.id);
  if (alreadyFollowing) {
    req.user.following  = req.user.following.filter(id => id !== target.id);
    target.followers    = target.followers.filter(id => id !== req.user.id);
    res.json({ following: false, followers: target.followers.length });
  } else {
    req.user.following.push(target.id);
    target.followers.push(req.user.id);
    res.json({ following: true, followers: target.followers.length });
  }
});

// ── My viral invite link ──────────────────────────────────────────────────
usersRouter.get('/me/invite', requireAuth, (req, res) => {
  const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.json({
    code:   req.user.inviteCode,
    link:   `${appUrl}?ref=${req.user.inviteCode}`,
    uses:   req.user.invites || 0,
  });
});

// ── My gamification stats ─────────────────────────────────────────────────
usersRouter.get('/me/stats', requireAuth, (req, res) => {
  if (req.user.plan === 'free')
    return res.json({ limitacion: 'Stats require PRO plan', preview: { xp: req.user.xp, level: req.user.level } });
  res.json(buildUserStats(req.user));
});
