import { users, events, createEvent, trackStats, registerPlay, cityStats } from './memory.js';
import bcrypt from 'bcryptjs';

const OSCAR_NELL_TRACKS = [
  { id: 'on-nina',    name: 'La Niña',        albumArt: null, spotifyUrl: null },
  { id: 'on-enamo',  name: 'Enamorao',        albumArt: null, spotifyUrl: null },
  { id: 'on-quiza',  name: 'Quizá no sé amar', albumArt: null, spotifyUrl: null },
  { id: 'on-carme',  name: 'Carmesí',         albumArt: null, spotifyUrl: null },
];

const DEMO_USERS = [
  { id: 'demo-1', name: 'Marta Puig',    handle: '@marta',   avatar: '🎵', city: 'Barcelona', plan: 'pro' },
  { id: 'demo-2', name: 'Joan Ferrer',   handle: '@joan',    avatar: '🎸', city: 'Girona',    plan: 'free' },
  { id: 'demo-3', name: 'Laia Soler',    handle: '@laia',    avatar: '🎤', city: 'Tarragona', plan: 'creator' },
  { id: 'demo-4', name: 'Marc Vidal',    handle: '@marc',    avatar: '🥁', city: 'Lleida',    plan: 'free' },
  { id: 'demo-5', name: 'Núria Costa',   handle: '@nuria',   avatar: '🎹', city: 'Barcelona', plan: 'pro' },
];

export async function seedDemoData() {
  // Evitar re-seed si ya existe
  if (users.has('demo-1')) return;

  const hash = await bcrypt.hash('demo1234', 10);

  for (const u of DEMO_USERS) {
    users.set(u.id, {
      ...u,
      email: `${u.handle.slice(1)}@demo.drop`,
      passwordHash: hash,
      role: 'user',
      xp: Math.floor(Math.random() * 2000) + 100,
      level: Math.floor(Math.random() * 8) + 1,
      badges: ['early_adopter'],
      followers: [], following: [],
      spotifyConnected: false, spotifyTokens: null,
      history: [], likedEvents: new Set(), sharedEvents: new Set(),
      joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      lastActive: Date.now(),
      inviteCode: `DEMO${u.id.split('-')[1]}00`,
      invitedBy: null, invites: 0, banned: false,
    });
  }

  // Crear eventos escalonados en el tiempo (últimas 6 horas)
  const now = Date.now();
  const entries = [
    { user: DEMO_USERS[0], track: OSCAR_NELL_TRACKS[0], ago: 5   },
    { user: DEMO_USERS[1], track: OSCAR_NELL_TRACKS[1], ago: 20  },
    { user: DEMO_USERS[2], track: OSCAR_NELL_TRACKS[2], ago: 45  },
    { user: DEMO_USERS[4], track: OSCAR_NELL_TRACKS[3], ago: 70  },
    { user: DEMO_USERS[3], track: OSCAR_NELL_TRACKS[0], ago: 95  },
    { user: DEMO_USERS[0], track: OSCAR_NELL_TRACKS[2], ago: 130 },
    { user: DEMO_USERS[1], track: OSCAR_NELL_TRACKS[3], ago: 180 },
    { user: DEMO_USERS[2], track: OSCAR_NELL_TRACKS[1], ago: 240 },
    { user: DEMO_USERS[4], track: OSCAR_NELL_TRACKS[0], ago: 300 },
    { user: DEMO_USERS[3], track: OSCAR_NELL_TRACKS[2], ago: 360 },
  ];

  for (const { user, track, ago } of entries) {
    const evt = createEvent({
      type: 'playing',
      userId: user.id,
      userName: user.name,
      userHandle: user.handle,
      userAvatar: user.avatar,
      userCity: user.city,
      userPlan: user.plan,
      trackId: track.id,
      trackName: track.name,
      artistName: 'Oscar Nell',
      albumArt: track.albumArt,
      spotifyUrl: track.spotifyUrl,
      timestamp: now - ago * 60 * 1000,
    });
    evt.likes = Math.floor(Math.random() * 40);
    evt.shares = Math.floor(Math.random() * 10);
    evt.recentInteractions = Math.floor(Math.random() * 15);

    registerPlay(track.id, track.name, 'Oscar Nell', track.albumArt, track.spotifyUrl, user.city);

    const cs = cityStats.get(user.city) || { plays: 0, users: new Set(), trackCounts: new Map() };
    cs.plays++;
    cs.users.add(user.id);
    cs.trackCounts.set(track.id, (cs.trackCounts.get(track.id) || 0) + 1);
    cityStats.set(user.city, cs);
  }

  console.log('🌱 Demo data seeded — 5 users, 10 Oscar Nell events');
}
