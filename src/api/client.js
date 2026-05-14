const BASE = '/api';

function token() { return localStorage.getItem('drop_token'); }

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...opts.headers,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data });
  return data;
}

export const api = {
  // auth
  register: (body)    => req('/auth/register',     { method: 'POST', body }),
  login:    (body)    => req('/auth/login',         { method: 'POST', body }),
  me:       ()        => req('/auth/me'),
  spotifyConnect: ()  => { window.location.href = `${BASE}/auth/spotify`; },

  // feed
  getFeed:     (cursor) => req(`/feed${cursor ? `?cursor=${cursor}` : ''}`),
  likeEvent:   (id)     => req(`/feed/${id}/like`,  { method: 'POST' }),
  shareEvent:  (id)     => req(`/feed/${id}/share`, { method: 'POST' }),

  // spotify
  nowPlaying:     ()    => req('/spotify/now-playing'),
  recentlyPlayed: ()    => req('/spotify/recently-played'),

  // users
  getUser:    (id) => req(`/users/${id}`),
  follow:     (id) => req(`/users/${id}/follow`, { method: 'POST' }),
  myInvite:   ()   => req('/users/me/invite'),
  myStats:    ()   => req('/users/me/stats'),

  // trending
  trendingTracks: () => req('/trending/tracks'),
  trendingCities: () => req('/trending/cities'),
  trendingUsers:  () => req('/trending/users'),

  // share preview
  sharePreview: (id) => req(`/s/${id}`),

  // admin
  adminStats:      ()           => req('/admin/stats'),
  adminUsers:      (page = 1)   => req(`/admin/users?page=${page}`),
  adminBan:        (id)         => req(`/admin/users/${id}/ban`,  { method: 'POST' }),
  adminPlan:       (id, plan)   => req(`/admin/users/${id}/plan`, { method: 'POST', body: { plan } }),
  adminRole:       (id, role)   => req(`/admin/users/${id}/role`, { method: 'POST', body: { role } }),
  adminDeleteEvent:(id)         => req(`/admin/events/${id}`,     { method: 'DELETE' }),
};
