import { Router } from 'express';
import { events } from '../store/memory.js';
import { buildFeed, bumpInteraction } from '../engine/recommendation.js';
import { addXP } from '../engine/gamification.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

export const feedRouter = Router();

// ── Get feed (infinite scroll) ────────────────────────────────────────────
feedRouter.get('/', optionalAuth, (req, res) => {
  const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
  const limit  = Math.min(parseInt(req.query.limit) || 15, 30);
  const result = buildFeed({ user: req.user, cursor, limit });
  res.json(result);
});

// ── Like event ────────────────────────────────────────────────────────────
feedRouter.post('/:id/like', requireAuth, (req, res) => {
  const event = events.get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Not found' });

  const userId = req.user.id;
  if (event.likedBy.has(userId)) {
    event.likedBy.delete(userId);
    event.likes = Math.max(0, event.likes - 1);
    res.json({ liked: false, likes: event.likes });
  } else {
    event.likedBy.add(userId);
    event.likes++;
    bumpInteraction(event.id);
    addXP(req.user, 'like_given');
    res.json({ liked: true, likes: event.likes });
  }
});

// ── Share event ───────────────────────────────────────────────────────────
feedRouter.post('/:id/share', requireAuth, (req, res) => {
  const event = events.get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Not found' });
  event.shares++;
  req.user.totalShares = (req.user.totalShares || 0) + 1;
  bumpInteraction(event.id);
  addXP(req.user, 'share');
  res.json({
    shares: event.shares,
    shareUrl: `${process.env.APP_URL || 'http://localhost:3001'}/s/${event.id}`,
  });
});
