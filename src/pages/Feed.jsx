import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import FeedCard from '../components/FeedCard';
import AuthModal from '../components/AuthModal';

export default function Feed() {
  const { user }  = useAuth();
  const [items,   setItems]   = useState([]);
  const [cursor,  setCursor]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [authModal, setAuthModal] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { items: newItems, nextCursor } = await api.getFeed(cursor);
      setItems(prev => {
        const ids = new Set(prev.map(i => i.id));
        return [...prev, ...newItems.filter(i => !ids.has(i.id))];
      });
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, hasMore]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  // Initial load
  useEffect(() => { loadMore(); }, []); // eslint-disable-line

  // Poll now-playing every 30s if user is connected
  useEffect(() => {
    if (!user?.spotifyConnected) return;
    const check = async () => {
      try {
        const r = await api.nowPlaying();
        setNowPlaying(r.playing ? r.track : null);
        if (r.playing) {
          // refresh feed top on new track
          const { items: fresh } = await api.getFeed(null);
          setItems(prev => {
            const ids = new Set(prev.map(i => i.id));
            return [...fresh.filter(i => !ids.has(i.id)), ...prev];
          });
        }
      } catch {}
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, [user?.spotifyConnected]);

  return (
    <div style={{ paddingTop: 80, maxWidth: 600, margin: '0 auto', padding: '80px 16px 60px' }}>
      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}

      {/* Now playing banner */}
      {nowPlaying && (
        <div style={{
          background: 'linear-gradient(135deg,rgba(29,185,84,0.15),rgba(29,185,84,0.05))',
          border: '1px solid rgba(29,185,84,0.3)', borderRadius: 16,
          padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#1db954', boxShadow:'0 0 8px #1db954', flexShrink:0, animation:'pulse 2s infinite' }} />
          {nowPlaying.albumArt && <img src={nowPlaying.albumArt} style={{ width:40, height:40, borderRadius:6, flexShrink:0 }} alt="" />}
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:'#f1f5f9', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{nowPlaying.trackName}</p>
            <p style={{ margin:0, fontSize:12, color:'#1db954' }}>{nowPlaying.artistName}</p>
          </div>
          <span style={{ fontSize:12, color:'#1db954', fontWeight:600 }}>En vivo</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎵</div>
          <h3 style={{ margin:'0 0 8px', fontSize:20, fontWeight:700, color:'#e2e8f0' }}>
            El feed está vacío
          </h3>
          <p style={{ color:'#6b7280', marginBottom:24, fontSize:14, lineHeight:1.6 }}>
            {user
              ? user.spotifyConnected
                ? 'Sé el primero en hacer un DROP. Pon una canción en Spotify.'
                : 'Conecta Spotify para ver y compartir actividad musical en tiempo real.'
              : 'Crea tu cuenta para ver qué están escuchando tus amigos.'}
          </p>
          {!user && (
            <button onClick={() => setAuthModal(true)} style={{
              background:'linear-gradient(135deg,#9333ea,#ec4899)',
              border:'none', color:'#fff', borderRadius:12,
              padding:'12px 28px', fontWeight:700, fontSize:15, cursor:'pointer',
            }}>Unirse a DROP</button>
          )}
          {user && !user.spotifyConnected && (
            <button onClick={() => api.spotifyConnect()} style={{
              background:'rgba(29,185,84,0.2)', border:'1px solid rgba(29,185,84,0.4)',
              color:'#1db954', borderRadius:12, padding:'12px 28px',
              fontWeight:700, fontSize:14, cursor:'pointer',
            }}>Conectar Spotify</button>
          )}
        </div>
      )}

      {/* Feed items */}
      {items.map(event => (
        <FeedCard key={event.id} event={event} onAuthRequired={() => setAuthModal(true)} />
      ))}

      {/* Loading skeleton */}
      {loading && Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{
          background:'#111118', border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:20, height:240, marginBottom:16,
          animation:'pulse 1.5s ease-in-out infinite',
          opacity: 0.5,
        }} />
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ height: 40 }} />

      {!hasMore && items.length > 0 && (
        <p style={{ textAlign:'center', color:'#374151', fontSize:13, padding:'20px 0' }}>
          Has llegado al final del feed 🎵
        </p>
      )}

      {/* Not logged-in CTA at bottom */}
      {!user && items.length > 0 && (
        <div style={{
          position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)',
          background:'linear-gradient(135deg,#9333ea,#ec4899)',
          borderRadius:20, padding:'12px 28px',
          display:'flex', alignItems:'center', gap:12,
          boxShadow:'0 8px 32px rgba(147,51,234,0.4)',
          cursor:'pointer', zIndex:50,
        }} onClick={() => setAuthModal(true)}>
          <span style={{ fontSize:14, fontWeight:800, color:'#fff' }}>Únete a DROP para interactuar 🎵</span>
        </div>
      )}
    </div>
  );
}
