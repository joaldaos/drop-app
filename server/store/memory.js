// In-memory store — swap Map → Supabase/PostgreSQL with same interface

// ── users ─────────────────────────────────────────────────────────────────
export const users = new Map();

// Seed admin
users.set('admin-1', {
  id: 'admin-1', email: 'admin@drop.app', name: 'Admin',
  handle: '@admin', avatar: '👑', passwordHash: '',
  city: 'Barcelona', country: 'ES',
  plan: 'creator', role: 'admin',
  xp: 9999, level: 99, badges: ['admin'],
  followers: [], following: [],
  spotifyConnected: false, spotifyTokens: null,
  history: [], likedEvents: new Set(), sharedEvents: new Set(),
  joinedAt: Date.now(), lastActive: Date.now(),
  inviteCode: 'ADM001', invitedBy: null, invites: 0,
  banned: false,
});

// ── events (feed items) ───────────────────────────────────────────────────
// Schema: social activity generated when a user plays/likes/shares
export const events = new Map();
let eventSeq = 1;

export function createEvent(data) {
  const id = `evt-${Date.now()}-${eventSeq++}`;
  const event = {
    id,
    type: data.type,          // 'playing' | 'liked' | 'shared' | 'milestone'
    userId: data.userId,
    userName: data.userName,
    userHandle: data.userHandle,
    userAvatar: data.userAvatar,
    userCity: data.userCity,
    userPlan: data.userPlan,
    trackId: data.trackId,
    trackName: data.trackName,
    artistName: data.artistName,
    albumArt: data.albumArt || null,
    spotifyUrl: data.spotifyUrl || null,
    previewUrl: data.previewUrl || null,
    timestamp: data.timestamp || Date.now(),
    likes: 0,
    shares: 0,
    likedBy: new Set(),
    // analytics
    recentInteractions: 0,
    interactionLog: [],       // [{t: timestamp}] — last 60 min
    viralScore: 0,
  };
  events.set(id, event);
  return event;
}

// ── trending buckets ──────────────────────────────────────────────────────
// trackId → { trackName, artistName, albumArt, spotifyUrl, plays, likes, shares, cities: Map }
export const trackStats = new Map();

export function registerPlay(trackId, trackName, artistName, albumArt, spotifyUrl, city) {
  const existing = trackStats.get(trackId) || {
    trackId, trackName, artistName, albumArt, spotifyUrl,
    plays: 0, likes: 0, shares: 0,
    cities: new Map(), firstSeen: Date.now(), lastSeen: Date.now(),
  };
  existing.plays++;
  existing.lastSeen = Date.now();
  existing.cities.set(city, (existing.cities.get(city) || 0) + 1);
  trackStats.set(trackId, existing);
}

// ── invite codes ──────────────────────────────────────────────────────────
export const inviteCodes = new Map();
inviteCodes.set('BETA001', { uses: 0, maxUses: 100, plan: 'free' });
inviteCodes.set('PRO2025', { uses: 0, maxUses: 50,  plan: 'pro'  });

// ── city leaderboard ──────────────────────────────────────────────────────
export const cityStats = new Map(); // city → { plays, users, trending: [] }

export function registerCityActivity(city, trackId) {
  const s = cityStats.get(city) || { plays: 0, users: new Set(), trackCounts: new Map() };
  s.plays++;
  s.trackCounts.set(trackId, (s.trackCounts.get(trackId) || 0) + 1);
  cityStats.set(city, s);
}
