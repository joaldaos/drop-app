import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import { authRouter }     from './routes/auth.js';
import { feedRouter }     from './routes/feed.js';
import { spotifyRouter }  from './routes/spotify.js';
import { usersRouter }    from './routes/users.js';
import { trendingRouter } from './routes/trending.js';
import { adminRouter }    from './routes/admin.js';
import { shareRouter }    from './routes/share.js';

const app  = express();
const PORT = process.env.PORT || 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
    ].filter(Boolean);
    if (!origin || allowed.some(o => origin.startsWith(o)) || /\.vercel\.app$/.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',     authRouter);
app.use('/api/feed',     feedRouter);
app.use('/api/spotify',  spotifyRouter);
app.use('/api/users',    usersRouter);
app.use('/api/trending', trendingRouter);
app.use('/api/admin',    adminRouter);
app.use('/s',            shareRouter);   // viral share previews

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true, version: '1.0.0', env: process.env.NODE_ENV }));

// ── Serve Vite build in production ────────────────────────────────────────
const distPath = join(__dirname, '../dist');
if (existsSync(distPath)) {
  const { default: sirv } = await import('sirv').catch(() => ({ default: null }));
  if (sirv) {
    app.use(sirv(distPath, { single: true }));
  } else {
    app.use(express.static(distPath));
    app.get('*', (_, res) => res.sendFile(join(distPath, 'index.html')));
  }
}

app.listen(PORT, () => {
  console.log(`\n🎵 DROP API  →  http://localhost:${PORT}/api/health`);
  console.log(`   Spotify OAuth: ${process.env.SPOTIFY_CLIENT_ID ? '✓ configured' : '⚠ SPOTIFY_CLIENT_ID missing'}\n`);
});
