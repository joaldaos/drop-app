import { useState } from 'react';
import { api } from '../api/client';
import PlanBadge from '../components/PlanBadge';

export default function Search() {
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      // Search is client-side across trending data (no dedicated search endpoint needed for MVP)
      const [t, u] = await Promise.all([api.trendingTracks(), api.trendingUsers()]);
      const q = query.toLowerCase();
      setResults({
        tracks: t.tracks.filter(tr =>
          tr.trackName?.toLowerCase().includes(q) || tr.artistName?.toLowerCase().includes(q)
        ),
        users: u.users.filter(us =>
          us.name?.toLowerCase().includes(q) || us.handle?.toLowerCase().includes(q) || us.city?.toLowerCase().includes(q)
        ),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ paddingTop: 90, maxWidth: 800, margin: '0 auto', padding: '90px 24px 60px' }}>
      <h1 style={{ margin:'0 0 24px', fontSize:28, fontWeight:900, color:'#f1f5f9' }}>🔍 Buscar</h1>

      <form onSubmit={handleSearch} style={{ display:'flex', gap:10, marginBottom:32 }}>
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Buscar canciones, artistas, usuarios, ciudades..."
          style={{
            flex:1, background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)', borderRadius:12,
            padding:'12px 16px', color:'#f1f5f9', fontSize:15, outline:'none',
          }}
        />
        <button type="submit" style={{
          background:'linear-gradient(135deg,#9333ea,#ec4899)',
          border:'none', color:'#fff', borderRadius:12,
          padding:'12px 24px', fontWeight:700, cursor:'pointer',
        }}>
          {loading ? '...' : 'Buscar'}
        </button>
      </form>

      {results && (
        <>
          {/* Tracks */}
          {results.tracks.length > 0 && (
            <div style={{ marginBottom:32 }}>
              <h2 style={{ margin:'0 0 14px', fontSize:18, fontWeight:700, color:'#f1f5f9' }}>🎵 Canciones ({results.tracks.length})</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {results.tracks.map(t => (
                  <div key={t.trackId} style={{ display:'flex', alignItems:'center', gap:12, background:'#111118', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 14px' }}>
                    {t.albumArt && <img src={t.albumArt} style={{ width:40, height:40, borderRadius:6 }} alt="" />}
                    <div style={{ flex:1 }}>
                      <p style={{ margin:0, fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{t.trackName}</p>
                      <p style={{ margin:0, fontSize:12, color:'#6b7280' }}>{t.artistName}</p>
                    </div>
                    <div style={{ display:'flex', gap:10, fontSize:12, color:'#6b7280' }}>
                      <span>▶ {t.plays}</span>
                      <span>♥ {t.likes}</span>
                    </div>
                    {t.spotifyUrl && (
                      <a href={t.spotifyUrl} target="_blank" rel="noreferrer" style={{ color:'#1db954', fontSize:11, fontWeight:700, textDecoration:'none', background:'rgba(29,185,84,0.15)', border:'1px solid rgba(29,185,84,0.3)', borderRadius:20, padding:'4px 10px' }}>▶</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {results.users.length > 0 && (
            <div>
              <h2 style={{ margin:'0 0 14px', fontSize:18, fontWeight:700, color:'#f1f5f9' }}>👤 Usuarios ({results.users.length})</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {results.users.map(u => (
                  <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, background:'#111118', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 14px' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#9333ea,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{u.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{u.name}</span>
                        <PlanBadge plan={u.plan} />
                      </div>
                      <span style={{ fontSize:12, color:'#6b7280' }}>📍 {u.city} · Nivel {u.level}</span>
                    </div>
                    <span style={{ fontSize:12, color:'#9333ea', fontWeight:700 }}>{u.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.tracks.length === 0 && results.users.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#6b7280' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <p>Sin resultados para "{query}"</p>
            </div>
          )}
        </>
      )}

      {!results && !loading && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#4b5563' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🎵</div>
          <p style={{ fontSize:15 }}>Busca canciones, usuarios o ciudades</p>
        </div>
      )}
    </div>
  );
}
