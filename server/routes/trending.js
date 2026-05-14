import { Router } from 'express';
import { trackStats, cityStats, users, events } from '../store/memory.js';
import { optionalAuth } from '../middleware/auth.js';

export const trendingRouter = Router();

// ── Global trending tracks ────────────────────────────────────────────────
trendingRouter.get('/tracks', optionalAuth, (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const sorted = [...trackStats.values()]
    .sort((a, b) => {
      // viral score = plays + likes*2 + shares*5, recency-weighted
      const scoreA = a.plays + a.likes * 2 + a.shares * 5;
      const scoreB = b.plays + b.likes * 2 + b.shares * 5;
      return scoreB - scoreA;
    })
    .slice(0, limit)
    .map((t, i) => ({
      rank: i + 1,
      trackId: t.trackId, trackName: t.trackName,
      artistName: t.artistName, albumArt: t.albumArt,
      spotifyUrl: t.spotifyUrl,
      plays: t.plays, likes: t.likes, shares: t.shares,
      topCity: getTopCity(t.cities),
    }));
  res.json({ tracks: sorted, total: trackStats.size });
});

// ── City trending ─────────────────────────────────────────────────────────
trendingRouter.get('/cities', optionalAuth, (req, res) => {
  const sorted = [...cityStats.entries()]
    .sort((a, b) => b[1].plays - a[1].plays)
    .slice(0, 15)
    .map(([city, s]) => ({
      city, plays: s.plays,
      users: s.users?.size || 0,
      topTrack: getTopTrackFromCounts(s.trackCounts),
    }));
  res.json({ cities: sorted });
});

// ── Active users ──────────────────────────────────────────────────────────
trendingRouter.get('/users', optionalAuth, (req, res) => {
  const sorted = [...users.values()]
    .filter(u => u.role !== 'admin')
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, 20)
    .map((u, i) => ({
      rank: i + 1,
      id: u.id, name: u.name, handle: u.handle,
      avatar: u.avatar, city: u.city, plan: u.plan,
      xp: u.xp, level: u.level,
      followers: u.followers.length,
      totalEvents: u.totalEvents || 0,
    }));
  res.json({ users: sorted });
});

// ── helpers ───────────────────────────────────────────────────────────────
function getTopCity(citiesMap) {
  if (!citiesMap?.size) return null;
  return [...citiesMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function getTopTrackFromCounts(trackCounts) {
  if (!trackCounts?.size) return null;
  const topId = [...trackCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return topId ? (trackStats.get(topId)?.trackName || null) : null;
}
