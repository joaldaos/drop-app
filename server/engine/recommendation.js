import { events, trackStats } from '../store/memory.js';

// ── helpers ───────────────────────────────────────────────────────────────

function recencyBoost(timestamp) {
  const ageHours = (Date.now() - timestamp) / 3_600_000;
  return Math.max(0, 1 - ageHours / 48); // linear decay over 48h
}

function engagementWeight(event) {
  const raw = event.likes * 2 + event.shares * 5 + event.recentInteractions;
  return Math.min(1, Math.log1p(raw) / 8);
}

function cityAffinity(event, user) {
  if (!user?.city || !event.userCity) return 0;
  return event.userCity.toLowerCase() === user.city.toLowerCase() ? 0.35 : 0;
}

function userSimilarity(event, user) {
  if (!user?.history?.length) return 0;
  const history = new Set(user.history.map(h => h.toLowerCase()));
  if (history.has(event.trackId))          return 0.5;
  if (history.has(event.artistName?.toLowerCase())) return 0.3;
  return 0;
}

function viralVelocity(event) {
  const now = Date.now();
  const windowMs = 3_600_000; // 1h window
  const recent = event.interactionLog.filter(e => now - e.t < windowMs).length;
  return Math.min(0.5, recent / 20); // caps at 0.5 when 20+ interactions/hour
}

// ── score ─────────────────────────────────────────────────────────────────
// score = recency(0.25) + engagement(0.25) + city(0.15) + similarity(0.2) + velocity(0.15)

export function scoreEvent(event, user) {
  return (
    recencyBoost(event.timestamp)   * 0.25 +
    engagementWeight(event)         * 0.25 +
    cityAffinity(event, user)       * 0.15 +
    userSimilarity(event, user)     * 0.20 +
    viralVelocity(event)            * 0.15
  );
}

// ── feed generation ───────────────────────────────────────────────────────
// Returns paginated, scored feed items for a given user
// cursor = last event timestamp (for infinite scroll)

export function buildFeed({ user, cursor = null, limit = 15 }) {
  const all = Array.from(events.values());
  if (!all.length) return { items: [], nextCursor: null };

  // filter own events from feed (don't show user their own activity)
  const pool = all.filter(e => e.userId !== user?.id);

  // cursor pagination
  const pool2 = cursor
    ? pool.filter(e => e.timestamp < cursor)
    : pool;

  // score & sort
  const scored = pool2
    .map(e => ({ ...e, _score: scoreEvent(e, user) }))
    .sort((a, b) => b._score - a._score || b.timestamp - a.timestamp);

  const items = scored.slice(0, limit);
  const last  = items[items.length - 1];

  return {
    items: items.map(({ _score, ...e }) => ({
      ...e,
      likedBy: undefined,
      interactionLog: undefined,
      isLiked: user ? e.likedBy?.has(user.id) : false,
    })),
    nextCursor: items.length === limit && last ? last.timestamp - 1 : null,
    total: pool2.length,
  };
}

// ── bump interaction (call on like / share / click) ───────────────────────
export function bumpInteraction(eventId) {
  const ev = events.get(eventId);
  if (!ev) return;
  ev.recentInteractions++;
  ev.interactionLog.push({ t: Date.now() });
  // prune old entries > 2h
  const cutoff = Date.now() - 7_200_000;
  ev.interactionLog = ev.interactionLog.filter(e => e.t > cutoff);
  // update viral score on the track
  const track = trackStats.get(ev.trackId);
  if (track) {
    const velocity = ev.interactionLog.filter(e => Date.now() - e.t < 3_600_000).length;
    ev.viralScore = velocity / 20;
  }
}
