import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { users, inviteCodes } from '../store/memory.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { addXP, getLevelFromXP } from '../engine/gamification.js';

export const authRouter = Router();

// ── Register ──────────────────────────────────────────────────────────────
authRouter.post('/register', async (req, res) => {
  const { email, password, name, city, inviteCode } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  if ([...users.values()].find(u => u.email === email))
    return res.status(409).json({ error: 'Email already registered' });

  let plan = 'free';
  if (inviteCode) {
    const code = inviteCodes.get(inviteCode);
    if (code && code.uses < code.maxUses) { plan = code.plan; code.uses++; }
  }

  const id = `usr-${Date.now()}`;
  const user = {
    id, email, name,
    handle: `@${name.toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random() * 999)}`,
    avatar: ['🎧','🎵','🎤','🎸','🎹','🥁'][Math.floor(Math.random() * 6)],
    passwordHash: await bcrypt.hash(password, 10),
    city: city || 'Unknown', country: 'ES',
    plan, role: 'user',
    xp: 0, level: 1, badges: [],
    followers: [], following: [],
    spotifyConnected: false, spotifyTokens: null, spotifyId: null,
    history: [], likedEvents: new Set(), sharedEvents: new Set(),
    joinedAt: Date.now(), lastActive: Date.now(),
    inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    invitedBy: inviteCode || null, invites: 0,
    banned: false, totalEvents: 0, totalShares: 0, viralPicks: 0, loginStreak: 0,
  };
  users.set(id, user);
  addXP(user, 'play_shared');

  res.json({ token: signToken(id), user: publicUser(user) });
});

// ── Login ─────────────────────────────────────────────────────────────────
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = [...users.values()].find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ error: 'Invalid credentials' });
  if (user.banned) return res.status(403).json({ error: 'Account banned' });
  user.lastActive = Date.now();
  res.json({ token: signToken(user.id), user: publicUser(user) });
});

// ── Me ────────────────────────────────────────────────────────────────────
authRouter.get('/me', requireAuth, (req, res) => {
  res.json(publicUser(req.user));
});

// ── Spotify OAuth ─────────────────────────────────────────────────────────
// PKCE flow. Requires SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET in .env
authRouter.get('/spotify', requireAuth, (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) return res.status(501).json({ error: 'SPOTIFY_CLIENT_ID not configured — add to .env' });

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || `${process.env.APP_URL || 'http://localhost:3001'}/api/auth/spotify/callback`,
    scope: 'user-read-recently-played user-read-currently-playing user-top-read user-read-private',
    state: req.user.id,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

authRouter.get('/spotify/callback', async (req, res) => {
  const { code, state: userId, error } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (error) return res.redirect(`${frontendUrl}?spotify_error=${error}`);

  const user = users.get(userId);
  if (!user) return res.redirect(`${frontendUrl}?spotify_error=invalid_state`);

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code', code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI || `${process.env.APP_URL || 'http://localhost:3001'}/api/auth/spotify/callback`,
      }),
    });
    const tokens = await tokenRes.json();
    if (tokens.error) throw new Error(tokens.error);

    user.spotifyConnected = true;
    user.spotifyTokens = { access: tokens.access_token, refresh: tokens.refresh_token, expiresAt: Date.now() + tokens.expires_in * 1000 };

    // fetch Spotify profile
    const profileRes = await fetch('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    const profile = await profileRes.json();
    user.spotifyId = profile.id;
    if (profile.country) user.country = profile.country;

    res.redirect(`${frontendUrl}?spotify_ok=1`);
  } catch (e) {
    res.redirect(`${frontendUrl}?spotify_error=${e.message}`);
  }
});

// ── helpers ───────────────────────────────────────────────────────────────
function publicUser(u) {
  return {
    id: u.id, email: u.email, name: u.name, handle: u.handle, avatar: u.avatar,
    city: u.city, country: u.country, plan: u.plan, role: u.role,
    xp: u.xp, level: u.level, badges: u.badges,
    followers: u.followers.length, following: u.following.length,
    spotifyConnected: u.spotifyConnected, spotifyId: u.spotifyId,
    inviteCode: u.inviteCode, joinedAt: u.joinedAt,
    totalEvents: u.totalEvents, totalShares: u.totalShares,
  };
}
