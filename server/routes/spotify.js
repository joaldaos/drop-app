import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createEvent } from '../store/memory.js';
import { registerPlay, registerCityActivity } from '../store/memory.js';
import { addXP } from '../engine/gamification.js';

export const spotifyRouter = Router();

// ── Refresh Spotify token if expired ─────────────────────────────────────
async function getValidToken(user) {
  if (!user.spotifyTokens) return null;
  if (Date.now() < user.spotifyTokens.expiresAt - 60000) return user.spotifyTokens.access;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: user.spotifyTokens.refresh }),
  });
  const tokens = await res.json();
  if (tokens.error) { user.spotifyConnected = false; return null; }
  user.spotifyTokens.access = tokens.access_token;
  user.spotifyTokens.expiresAt = Date.now() + tokens.expires_in * 1000;
  return tokens.access_token;
}

// ── Currently playing ─────────────────────────────────────────────────────
// LIMITATION: Spotify requires Premium for currently-playing on some accounts
spotifyRouter.get('/now-playing', requireAuth, async (req, res) => {
  if (!req.user.spotifyConnected) return res.json({ playing: false, limitacion: 'Spotify not connected' });
  const token = await getValidToken(req.user);
  if (!token) return res.json({ playing: false, limitacion: 'Token expired' });

  const r = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (r.status === 204) return res.json({ playing: false });
  if (!r.ok) return res.json({ playing: false, limitacion: `Spotify error ${r.status}` });

  const data = await r.json();
  if (!data?.item) return res.json({ playing: false });

  const track = {
    trackId:    data.item.id,
    trackName:  data.item.name,
    artistName: data.item.artists.map(a => a.name).join(', '),
    albumArt:   data.item.album.images[0]?.url || null,
    spotifyUrl: data.item.external_urls.spotify,
    previewUrl: data.item.preview_url,
    progress:   data.progress_ms,
    duration:   data.item.duration_ms,
  };

  // Create social event
  const event = createEvent({
    type: 'playing',
    userId: req.user.id, userName: req.user.name,
    userHandle: req.user.handle, userAvatar: req.user.avatar,
    userCity: req.user.city, userPlan: req.user.plan,
    ...track,
  });

  registerPlay(track.trackId, track.trackName, track.artistName, track.albumArt, track.spotifyUrl, req.user.city);
  registerCityActivity(req.user.city, track.trackId);
  req.user.totalEvents = (req.user.totalEvents || 0) + 1;
  req.user.history = [track.trackId, ...(req.user.history || [])].slice(0, 50);
  addXP(req.user, 'play_shared');

  res.json({ playing: true, track, eventId: event.id });
});

// ── Recently played ───────────────────────────────────────────────────────
spotifyRouter.get('/recently-played', requireAuth, async (req, res) => {
  if (!req.user.spotifyConnected)
    return res.json({ tracks: [], limitacion: 'Connect Spotify to see recently played' });

  const token = await getValidToken(req.user);
  if (!token) return res.json({ tracks: [], limitacion: 'Token expired — reconnect Spotify' });

  const r = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return res.json({ tracks: [], limitacion: `Spotify error ${r.status}` });

  const data = await r.json();
  const tracks = (data.items || []).map(i => ({
    trackId:    i.track.id,
    trackName:  i.track.name,
    artistName: i.track.artists.map(a => a.name).join(', '),
    albumArt:   i.track.album.images[0]?.url || null,
    spotifyUrl: i.track.external_urls.spotify,
    previewUrl: i.track.preview_url,
    playedAt:   i.played_at,
  }));

  // update user history
  req.user.history = [...new Set(tracks.map(t => t.trackId))].slice(0, 50);

  // bulk-create events for recent plays (de-duped by trackId in last 24h)
  const existing24h = new Set(
    [...events.values()]
      .filter(e => e.userId === req.user.id && Date.now() - e.timestamp < 86400000)
      .map(e => e.trackId)
  );
  for (const t of tracks.slice(0, 5)) {
    if (!existing24h.has(t.trackId)) {
      createEvent({ type: 'playing', userId: req.user.id, userName: req.user.name,
        userHandle: req.user.handle, userAvatar: req.user.avatar,
        userCity: req.user.city, userPlan: req.user.plan, ...t,
        timestamp: new Date(t.playedAt).getTime(),
      });
      registerPlay(t.trackId, t.trackName, t.artistName, t.albumArt, t.spotifyUrl, req.user.city);
    }
  }

  res.json({ tracks });
});
