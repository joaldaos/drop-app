import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [page,  setPage]    = useState(1);
  const [pages, setPages]   = useState(1);
  const [tab,   setTab]     = useState('stats');
  const [msg,   setMsg]     = useState('');

  if (!user) return <div style={{ paddingTop:100, textAlign:'center', color:'#6b7280' }}>Acceso denegado</div>;
  if (user.role !== 'admin') return (
    <div style={{ paddingTop:100, textAlign:'center', color:'#f87171' }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🚫</div>
      <p>Solo admins pueden acceder a este panel.</p>
      <Link to="/" style={{ color:'#9333ea' }}>← Volver</Link>
    </div>
  );

  useEffect(() => {
    api.adminStats().then(setStats).catch(console.error);
  }, []);

  useEffect(() => {
    if (tab !== 'users') return;
    api.adminUsers(page).then(r => { setUsers(r.users); setPages(r.pages); }).catch(console.error);
  }, [tab, page]);

  async function action(fn, successMsg) {
    try { await fn(); setMsg(successMsg); setTimeout(() => setMsg(''), 3000); }
    catch (e) { setMsg(`Error: ${e.message}`); }
  }

  const statCard = (label, value, color = '#9333ea') => (
    <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'18px 20px' }}>
      <p style={{ margin:'0 0 4px', fontSize:12, color:'#6b7280' }}>{label}</p>
      <p style={{ margin:0, fontSize:28, fontWeight:900, color }}>{value ?? '—'}</p>
    </div>
  );

  return (
    <div style={{ paddingTop: 90, maxWidth: 1100, margin: '0 auto', padding: '90px 24px 60px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
        <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:'#f1f5f9' }}>👑 Admin Panel</h1>
        <span style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', color:'#f87171', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>ADMIN</span>
      </div>

      {msg && (
        <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:10, padding:'10px 16px', marginBottom:20, color:'#34d399', fontSize:13 }}>{msg}</div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:3, marginBottom:28, width:'fit-content' }}>
        {[['stats','📊 Stats'],['users','👥 Usuarios']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: tab===k ? 'rgba(147,51,234,0.3)' : 'transparent',
            border: tab===k ? '1px solid rgba(147,51,234,0.5)' : '1px solid transparent',
            color: tab===k ? '#c084fc' : '#6b7280',
            borderRadius:8, padding:'7px 16px', fontSize:13, fontWeight:700, cursor:'pointer',
          }}>{l}</button>
        ))}
      </div>

      {/* Stats tab */}
      {tab === 'stats' && stats && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:28 }}>
            {statCard('Total usuarios',    stats.totalUsers)}
            {statCard('Activos hoy',       stats.activeToday,          '#1db954')}
            {statCard('Esta semana',       stats.activeWeek,            '#0ea5e9')}
            {statCard('Spotify conectado', stats.spotifyConnected,     '#1db954')}
            {statCard('Eventos feed',      stats.totalEvents,          '#f97316')}
            {statCard('Canciones',         stats.totalTracks,          '#ec4899')}
            {statCard('Baneados',          stats.bannedUsers,          '#ef4444')}
          </div>
          <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'18px 20px' }}>
            <h3 style={{ margin:'0 0 14px', fontSize:15, fontWeight:700, color:'#f1f5f9' }}>Distribución de planes</h3>
            <div style={{ display:'flex', gap:20' }}>
              {[['Free', stats.byPlan.free,'#6b7280'],['PRO', stats.byPlan.pro,'#9333ea'],['Creator', stats.byPlan.creator,'#ec4899']].map(([p,v,c]) => (
                <div key={p} style={{ textAlign:'center' }}>
                  <p style={{ margin:0, fontSize:22, fontWeight:900, color:c }}>{v}</p>
                  <p style={{ margin:0, fontSize:12, color:'#6b7280' }}>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
            {users.map(u => (
              <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, background:'#111118', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 14px', flexWrap:'wrap' }}>
                <span style={{ fontSize:20 }}>{u.banned ? '🚫' : '👤'}</span>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <span style={{ fontSize:13, fontWeight:700, color: u.banned ? '#f87171' : '#f1f5f9' }}>{u.name}</span>
                    <span style={{ fontSize:10, color:'#6b7280' }}>{u.handle}</span>
                    {u.role === 'admin' && <span style={{ fontSize:9, background:'rgba(239,68,68,0.2)', color:'#f87171', borderRadius:10, padding:'1px 6px', fontWeight:700 }}>ADMIN</span>}
                  </div>
                  <span style={{ fontSize:11, color:'#6b7280' }}>{u.email} · {u.city} · Nivel {u.level}</span>
                </div>
                <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background:'rgba(147,51,234,0.15)', color:'#c084fc', fontWeight:700 }}>{u.plan}</span>
                <div style={{ display:'flex', gap:6 }}>
                  {['free','pro','creator'].map(p => (
                    <button key={p} onClick={() => action(() => api.adminPlan(u.id, p), `Plan → ${p}`)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#9ca3af', borderRadius:8, padding:'4px 8px', fontSize:11, cursor:'pointer' }}>{p}</button>
                  ))}
                  <button onClick={() => action(() => api.adminBan(u.id), u.banned ? 'Desbaneado' : 'Baneado')} style={{ background: u.banned ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${u.banned ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: u.banned ? '#34d399' : '#f87171', borderRadius:8, padding:'4px 10px', fontSize:11, cursor:'pointer', fontWeight:700 }}>
                    {u.banned ? 'Desbanear' : 'Banear'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {pages > 1 && (
            <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
              {Array.from({length:pages},(_,i) => (
                <button key={i} onClick={() => setPage(i+1)} style={{ background: page===i+1 ? 'rgba(147,51,234,0.3)' : 'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color: page===i+1 ? '#c084fc' : '#6b7280', borderRadius:8, padding:'6px 12px', fontSize:13, cursor:'pointer' }}>{i+1}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
