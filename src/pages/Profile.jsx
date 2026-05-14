import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';
import PlanBadge from '../components/PlanBadge';

export default function Profile() {
  const { t } = useTranslation();
  const { user, myPlaylists, likedIds, communityPlaylists } = useApp();

  const likedPlaylists = communityPlaylists.filter(p => likedIds.has(p.id));
  const totalPlays = myPlaylists.reduce((s, p) => s + p.plays, 0);
  const totalLikes = myPlaylists.reduce((s, p) => s + p.likes, 0);

  const planColors = {
    free:    { bg:'rgba(107,114,128,0.15)', border:'#374151', color:'#9ca3af' },
    pro:     { bg:'rgba(147,51,234,0.15)', border:'#7c3aed', color:'#c084fc' },
    creator: { bg:'rgba(236,72,153,0.15)', border:'#be185d', color:'#f9a8d4' },
  };
  const pc = planColors[user.plan];

  return (
    <div style={{ paddingTop: 90, maxWidth: 900, margin: '0 auto', padding: '90px 24px 60px' }}>

      {/* Backend notice */}
      <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:10, padding:'10px 16px', marginBottom:28, fontSize:13, color:'#fbbf24' }}>
        {t('profile.backend_note')}
      </div>

      {/* Profile card */}
      <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:28, marginBottom:28 }}>
        <div style={{ display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
          {/* Avatar */}
          <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#9333ea,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, flexShrink:0 }}>
            {user.avatar}
          </div>
          {/* Info */}
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:'#f1f5f9' }}>{user.name}</h1>
              <PlanBadge plan={user.plan} size="md" />
            </div>
            <p style={{ margin:'0 0 12px', fontSize:14, color:'#6b7280' }}>{user.handle}</p>
            <div style={{ display:'flex', gap:24 }}>
              {[
                [myPlaylists.length, t('profile.playlists_count')],
                [user.followers, t('profile.followers')],
                [user.following, t('profile.following')],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <span style={{ fontSize:18, fontWeight:800, color:'#f1f5f9' }}>{val}</span>
                  <span style={{ fontSize:12, color:'#6b7280', marginLeft:6 }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plan info */}
      <div style={{ background: pc.bg, border:`1px solid ${pc.border}`, borderRadius:16, padding:'20px 24px', marginBottom:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div>
            <p style={{ margin:'0 0 4px', fontSize:12, color:'#6b7280', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t('profile.plan')}</p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:22, fontWeight:900, color: pc.color }}>
                {user.plan === 'free' ? 'Free' : user.plan === 'pro' ? 'PRO' : 'Creator'}
              </span>
              {user.plan === 'free' && (
                <span style={{ fontSize:12, color:'#6b7280' }}>— {myPlaylists.length}/{3} playlists</span>
              )}
            </div>
          </div>
          {user.plan !== 'creator' && (
            <Link to="/pricing" style={{
              background:'linear-gradient(135deg,#9333ea,#ec4899)',
              textDecoration:'none', color:'#fff', borderRadius:10,
              padding:'9px 18px', fontWeight:700, fontSize:13,
            }}>
              ↑ {t('profile.upgrade')}
            </Link>
          )}
        </div>
      </div>

      {/* Stats — PRO only */}
      {user.plan !== 'free' ? (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
          {[[totalPlays.toLocaleString(), t('profile.total_plays'), '▶'], [totalLikes.toLocaleString(), t('profile.total_likes'), '♥']].map(([val, lbl, icon]) => (
            <div key={lbl} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'18px 20px' }}>
              <p style={{ margin:'0 0 4px', fontSize:12, color:'#6b7280' }}>{icon} {lbl}</p>
              <p style={{ margin:0, fontSize:24, fontWeight:800, color:'#f1f5f9' }}>{val}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background:'rgba(147,51,234,0.06)', border:'1px solid rgba(147,51,234,0.15)', borderRadius:14, padding:'16px 20px', marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:600, color:'#c084fc' }}>📊 {t('profile.stats')}</p>
            <p style={{ margin:0, fontSize:12, color:'#6b7280' }}>{t('profile.stats_note')}</p>
          </div>
          <Link to="/pricing" style={{ fontSize:12, color:'#9333ea', textDecoration:'none', fontWeight:700 }}>PRO →</Link>
        </div>
      )}

      {/* My playlists */}
      <h2 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9', marginBottom:16 }}>{t('profile.my_playlists')}</h2>
      {myPlaylists.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px 0', color:'#4b5563' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🎵</div>
          <p style={{ fontSize:14 }}>{t('playlists.empty')}</p>
          <Link to="/playlists" style={{ color:'#9333ea', textDecoration:'none', fontSize:13, fontWeight:600 }}>
            + {t('playlists.create_first')} →
          </Link>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14, marginBottom:40 }}>
          {myPlaylists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
        </div>
      )}

      {/* Liked playlists */}
      {likedPlaylists.length > 0 && (
        <>
          <h2 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9', marginBottom:16 }}>♥ {t('profile.liked')}</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
            {likedPlaylists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
