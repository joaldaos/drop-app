// XP values per action
const XP = {
  play_shared:   10,
  like_given:     2,
  like_received: 5,
  share:         15,
  follow:         8,
  followed:      10,
  playlist_created: 20,
  login_streak:  5,
};

// Level thresholds
const LEVELS = [0, 50, 150, 350, 700, 1200, 2000, 3500, 6000, 10000, 20000];

export function getLevelFromXP(xp) {
  let level = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i]) level = i + 1;
  }
  return Math.min(level, LEVELS.length);
}

export function xpToNextLevel(xp) {
  const level = getLevelFromXP(xp);
  return level < LEVELS.length ? LEVELS[level] - xp : 0;
}

// Badge definitions
const BADGE_RULES = [
  { id: 'first_drop',     label: 'First Drop',     icon: '🎵', check: u => u.totalEvents >= 1 },
  { id: 'music_addict',   label: 'Music Addict',   icon: '🎧', check: u => u.totalEvents >= 50 },
  { id: 'trend_hunter',   label: 'Trend Hunter',   icon: '🔥', check: u => u.viralPicks >= 5 },
  { id: 'top_creator',    label: 'Top Creator',    icon: '👑', check: u => u.plan === 'creator' },
  { id: 'social_star',    label: 'Social Star',    icon: '⭐', check: u => u.followers?.length >= 10 },
  { id: 'week_streak',    label: 'Week Streak',    icon: '🗓️', check: u => u.loginStreak >= 7 },
  { id: 'viral_master',   label: 'Viral Master',   icon: '🚀', check: u => u.totalShares >= 20 },
  { id: 'early_adopter',  label: 'Early Adopter',  icon: '🌱', check: u => u.joinedAt < Date.now() - 86400000 },
];

export function computeBadges(userStats) {
  return BADGE_RULES
    .filter(b => b.check(userStats))
    .map(({ id, label, icon }) => ({ id, label, icon }));
}

export function addXP(user, action) {
  const gain = XP[action] || 0;
  user.xp = (user.xp || 0) + gain;
  user.level = getLevelFromXP(user.xp);
  return gain;
}

export function buildUserStats(user) {
  return {
    xp: user.xp,
    level: user.level,
    xpToNext: xpToNextLevel(user.xp),
    badges: computeBadges({
      ...user,
      totalEvents:  user.totalEvents  || 0,
      viralPicks:   user.viralPicks   || 0,
      totalShares:  user.totalShares  || 0,
      loginStreak:  user.loginStreak  || 0,
      followers:    user.followers    || [],
    }),
  };
}
