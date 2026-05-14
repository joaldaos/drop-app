import { useState, useEffect } from 'react';
import { api } from '../api/client';

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ margin:'0 0 16px', fontSize:20, fontWeight:800, color:'#f1f5f9' }}>{title}</h2>
      {children}
    </div>
  );
}

export default function Trending() {
  const [tracks,  setTracks]  = useState([]);
  const [cities,  setCities]  = useState([]);
  const [topUsers,setTopUsers]= useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('tracks');

  useEffect(() => {
    Promise.all([api.trendingTracks(), api.trendingCities(), api.trendingUsers()])
      .then(([t, c, u]) => { setTracks(t.tracks); setCities(c.cities); setTopUsers(u.users); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const TABS = [['tracks','🎵 Canciones'],['cities','🌍 Ciudades'],['users','👑 Usuarios']];

  return (
    <div style={{ paddingTop: 90, maxWidth: 900, margin: '0 auto', padding: '90px 24px 60px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin:'0 0 4px', fontSize:28, fontWeight:900, color:'#f1f5f9' }}>🔥 Trending</h1>
        <p style={{ margin:0, fontSize:14, color:'#6b7280' }}>Lo más escuchado en DROP ahora mismo</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', borderRadius:12, padding:4, marginBottom:28, width:'fit-content' }}>
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            background: tab === key ? 'rgba(147,51,234,0.3)' : 'transparent',
            border: tab === key ? '1px solid rgba(147,51,234,0.5)' : '1px solid transparent',
            color: tab === key ? '#c084fc' : '#6b7280',
            borderRadius:8, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer',
          }}>{label}</button>
        ))}
      </div>

      {loading && (
        <div style={{ display:'grid', gap:12 }}>
          {Array.from({length:8}).map((_,i) => (
            <div key={i} style={{ background:'#111118', borderRadius:14, height:64, opacity:0.4, animation:'pulse 1.5s infinite' }} />
          ))}
        </div>
      )}

      {/* Tracks */}
      {!loading && tab === 'tracks' && (
        tracks.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#4b5563' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
            <p>No hay datos todavía. Sé el primero en hacer un DROP.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {tracks.map(t => (
              <div key={t.trackId} style={{
                display:'flex', alignItems:'center', gap:14,
                background:'#111118', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14,
                padding:'12px 16px', transition:'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(147,51,234,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <span style={{ fontSize:18, fontWeight:900, color: t.rank <= 3 ? '#f97316' : '#4b5563', width:28, textAlign:'center' }}>
                  {t.rank <= 3 ? ['🥇','🥈','🥉'][t.rank-1] : t.rank}
                </span>
                {t.albumArt && <img src={t.albumArt} style={{ width:44, height:44, borderRadius:8, flexShrink:0 }} alt="" />}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:'#f1f5f9', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.trackName}</p>
                  <p style={{ margin:0, fontSize:12, color:'#6b7280' }}>{t.artistName} {t.topCity && `· 📍 ${t.topCity}`}</p>
                </div>
                <div style={{ display:'flex', gap:16, flexShrink:0 }}>
                  <span style={{ fontSize:12, color:'#9ca3af' }}>▶ {t.plays}</span>
                  <span style={{ fontSize:12, color:'#9ca3af' }}>♥ {t.likes}</span>
                </div>
                {t.spotifyUrl && (
                  <a href={t.spotifyUrl} target="_blank" rel="noreferrer" style={{
                    color:'#1db954', fontSize:11, fontWeight:700, textDecoration:'none',
                    background:'rgba(29,185,84,0.15)', border:'1px solid rgba(29,185,84,0.3)',
                    borderRadius:20, padding:'4px 10px',
                  }}>▶</a>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Cities */}
      {!loading && tab === 'cities' && (
        cities.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#4b5563' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🌍</div>
            <p>No hay datos de ciudades todavía.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
            {cities.map((c, i) => (
              <div key={c.city} style={{
                background:'#111118', border:'1px solid rgba(255,255,255,0.06)',
                borderRadius:14, padding:'16px 18px',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:20, fontWeight:900, color:'#f97316' }}>#{i+1}</span>
                  <span style={{ fontSize:11, color:'#9ca3af' }}>▶ {c.plays}</span>
                </div>
                <p style={{ margin:'0 0 4px', fontSize:16, fontWeight:800, color:'#f1f5f9' }}>📍 {c.city}</p>
                {c.topTrack && <p style={{ margin:0, fontSize:11, color:'#6b7280' }}>🎵 {c.topTrack}</p>}
              </div>
            ))}
          </div>
        )
      )}

      {/* Top users */}
      {!loading && tab === 'users' && (
        topUsers.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#4b5563' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👑</div>
            <p>No hay usuarios todavía. ¡Sé el primero!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {topUsers.map(u => (
              <div key={u.id} style={{
                display:'flex', alignItems:'center', gap:14,
                background:'#111118', border:'1px solid rgba(255,255,255,0.06)',
                borderRadius:14, padding:'12px 16px',
              }}>
                <span style={{ fontSize:16, fontWeight:900, color: u.rank <= 3 ? '#f97316' : '#4b5563', width:28, textAlign:'center' }}>
                  {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : u.rank}
                </span>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#9333ea,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{u.avatar}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{u.name}</span>
                    {u.plan !== 'free' && <span style={{ fontSize:10, fontWeight:700, color:'#c084fc', background:'rgba(147,51,234,0.2)', border:'1px solid #7c3aed', borderRadius:10, padding:'1px 6px' }}>{u.plan.toUpperCase()}</span>}
                  </div>
                  <span style={{ fontSize:12, color:'#6b7280' }}>📍 {u.city} · Nivel {u.level}</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ margin:0, fontSize:14, fontWeight:800, color:'#9333ea' }}>{u.xp} XP</p>
                  <p style={{ margin:0, fontSize:11, color:'#6b7280' }}>👥 {u.followers}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
