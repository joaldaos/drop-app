import { Router } from 'express';
import { events, users } from '../store/memory.js';

export const shareRouter = Router();

// ── Public share preview (no auth needed) ────────────────────────────────
// This is the viral link: /s/:eventId
// Returns a JSON preview; the frontend renders a public OG card
shareRouter.get('/:id', (req, res) => {
  const event = events.get(req.params.id);
  if (!event) return res.status(404).json({ error: 'Content not found or expired' });

  const author = users.get(event.userId);
  const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  res.json({
    id:          event.id,
    type:        event.type,
    trackName:   event.trackName,
    artistName:  event.artistName,
    albumArt:    event.albumArt,
    spotifyUrl:  event.spotifyUrl,
    previewUrl:  event.previewUrl,
    author: {
      name:   event.userName,
      handle: event.userHandle,
      avatar: event.userAvatar,
      city:   event.userCity,
      plan:   event.userPlan,
    },
    stats: { likes: event.likes, shares: event.shares },
    timestamp: event.timestamp,
    // CTA data for the join card
    joinCta: {
      text: `Join ${event.userName} on DROP`,
      url: `${appUrl}?ref=share&event=${event.id}`,
    },
  });
});
