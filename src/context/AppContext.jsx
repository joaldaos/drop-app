import { createContext, useContext, useState } from 'react';

// ── Mock demo user ────────────────────────────────────────────────────────────
// NOTE: Real auth requires Firebase/Supabase — NOT IMPLEMENTED
const DEMO_USER = {
  id: 'demo-1',
  name: 'Jordi',
  handle: '@jordi',
  avatar: '🎧',
  plan: 'free',       // 'free' | 'pro' | 'creator'
  followers: 0,
  following: 0,
  memberSince: '2025',
};

// ── Mock demo playlists ───────────────────────────────────────────────────────
// NOTE: Real data requires backend — these are example placeholders
const DEMO_COMMUNITY = [
  { id: 'c1', title: 'Indie Vibes 2025',       description: 'Lo mejor del indie actual',           color: '#7c3aed', tracks: 24, likes: 342, plays: 1820, author: 'Marina',   authorPlan: 'pro',     isPublic: true, isTrending: true,  tags: ['indie','alternativo'] },
  { id: 'c2', title: 'Tarde de verano',         description: 'Para tardes con buena energía',       color: '#f97316', tracks: 18, likes: 215, plays: 940,  author: 'Alex',     authorPlan: 'creator', isPublic: true, isTrending: true,  tags: ['pop','verano'] },
  { id: 'c3', title: 'Estudio & Focus',         description: 'Concentración máxima',                color: '#0ea5e9', tracks: 31, likes: 189, plays: 2100, author: 'Sara',     authorPlan: 'pro',     isPublic: true, isTrending: false, tags: ['lofi','estudio'] },
  { id: 'c4', title: 'Noche del viernes',       description: 'Empieza el finde con todo',           color: '#ec4899', tracks: 22, likes: 401, plays: 3200, author: 'Leo',      authorPlan: 'creator', isPublic: true, isTrending: true,  tags: ['fiesta','pop'] },
  { id: 'c5', title: 'Rap Nacional',            description: 'Lo mejor del rap en español',         color: '#10b981', tracks: 27, likes: 290, plays: 1650, author: 'Diego',    authorPlan: 'free',    isPublic: true, isTrending: false, tags: ['rap','hip-hop'] },
  { id: 'c6', title: 'Jazz & Café',             description: 'Suave y sofisticado',                 color: '#d97706', tracks: 15, likes: 128, plays: 780,  author: 'Claudia',  authorPlan: 'pro',     isPublic: true, isTrending: false, tags: ['jazz','relax'] },
  { id: 'c7', title: 'Hits del momento',        description: 'Lo más escuchado esta semana',        color: '#ef4444', tracks: 20, likes: 512, plays: 4100, author: 'DROP',     authorPlan: 'creator', isPublic: true, isTrending: true,  tags: ['hits','pop'] },
  { id: 'c8', title: 'Gym & Motivación',        description: 'Para dar el máximo en el gym',        color: '#6366f1', tracks: 33, likes: 376, plays: 2900, author: 'Carlos',   authorPlan: 'pro',     isPublic: true, isTrending: false, tags: ['gym','energía'] },
];

const FREE_PLAYLIST_LIMIT = 3;

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(DEMO_USER);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [communityPlaylists] = useState(DEMO_COMMUNITY);
  const [likedIds, setLikedIds] = useState(new Set());
  const [notification, setNotification] = useState(null);

  function canCreatePlaylist() {
    if (user.plan !== 'free') return true;
    return myPlaylists.length < FREE_PLAYLIST_LIMIT;
  }

  function createPlaylist({ title, description, isPublic, color }) {
    if (!canCreatePlaylist()) return false;
    const newPl = {
      id: `my-${Date.now()}`,
      title,
      description,
      color: color || '#9333ea',
      tracks: 0,
      likes: 0,
      plays: 0,
      author: user.name,
      authorPlan: user.plan,
      isPublic,
      isTrending: false,
      tags: [],
      createdAt: new Date().toLocaleDateString('es-ES'),
    };
    setMyPlaylists(prev => [newPl, ...prev]);
    return true;
  }

  function deletePlaylist(id) {
    setMyPlaylists(prev => prev.filter(p => p.id !== id));
  }

  function toggleLike(id) {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // NOTE: Real plan upgrade requires Stripe — NOT IMPLEMENTED
  function upgradePlan(plan) {
    setUser(prev => ({ ...prev, plan }));
    showNotification(`Plan actualizado a ${plan.toUpperCase()}`, 'success');
  }

  function showNotification(msg, type = 'info') {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  return (
    <AppContext.Provider value={{
      user, setUser,
      myPlaylists, communityPlaylists,
      likedIds, toggleLike,
      canCreatePlaylist, createPlaylist, deletePlaylist,
      upgradePlan,
      notification, showNotification,
      FREE_PLAYLIST_LIMIT,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
