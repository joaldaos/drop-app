import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';
import CreatePlaylistModal from '../components/CreatePlaylistModal';

export default function Playlists() {
  const { t } = useTranslation();
  const { myPlaylists, deletePlaylist, canCreatePlaylist, user, FREE_PLAYLIST_LIMIT } = useApp();
  const [showModal, setShowModal] = useState(false);

  const atLimit = !canCreatePlaylist();

  return (
    <div style={{ paddingTop: 90, maxWidth: 1100, margin: '0 auto', padding: '90px 24px 60px' }}>
      {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ margin:0, fontSize:28, fontWeight:900, color:'#f1f5f9' }}>{t('playlists.title')}</h1>
          {user.plan === 'free' && (
            <p style={{ margin:'6px 0 0', fontSize:13, color:'#6b7280' }}>
              {myPlaylists.length} / {FREE_PLAYLIST_LIMIT} playlists · Plan Free
            </p>
          )}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {atLimit ? (
            <Link to="/pricing" style={{
              background:'linear-gradient(135deg,#9333ea,#ec4899)',
              textDecoration:'none', color:'#fff', borderRadius:10,
              padding:'10px 20px', fontWeight:700, fontSize:14,
            }}>
              🔓 {t('playlists.upgrade_pro')}
            </Link>
          ) : (
            <button onClick={() => setShowModal(true)} style={{
              background:'linear-gradient(135deg,#9333ea,#ec4899)',
              border:'none', color:'#fff', borderRadius:10,
              padding:'10px 20px', fontWeight:700, fontSize:14, cursor:'pointer',
            }}>
              + {t('playlists.new')}
            </button>
          )}
        </div>
      </div>

      {/* Free plan limit bar */}
      {user.plan === 'free' && (
        <div style={{ background:'rgba(147,51,234,0.08)', border:'1px solid rgba(147,51,234,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:28, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:12, color:'#9ca3af' }}>
              <span>Playlists usadas</span><span>{myPlaylists.length}/{FREE_PLAYLIST_LIMIT}</span>
            </div>
            <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:4, height:6 }}>
              <div style={{ height:'100%', borderRadius:4, background:'linear-gradient(90deg,#9333ea,#ec4899)', width:`${(myPlaylists.length/FREE_PLAYLIST_LIMIT)*100}%`, transition:'width 0.4s' }} />
            </div>
          </div>
          <Link to="/pricing" style={{ fontSize:12, color:'#c084fc', textDecoration:'none', fontWeight:600, flexShrink:0 }}>
            {t('playlists.upgrade_pro')} →
          </Link>
        </div>
      )}

      {/* Empty state */}
      {myPlaylists.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎵</div>
          <h3 style={{ margin:'0 0 8px', fontSize:20, fontWeight:700, color:'#e2e8f0' }}>{t('playlists.empty')}</h3>
          <p style={{ color:'#6b7280', marginBottom:28, fontSize:14 }}>{t('playlists.empty_sub')}</p>
          <button onClick={() => setShowModal(true)} style={{
            background:'linear-gradient(135deg,#9333ea,#ec4899)',
            border:'none', color:'#fff', borderRadius:12,
            padding:'12px 28px', fontWeight:700, fontSize:15, cursor:'pointer',
          }}>
            + {t('playlists.create_first')}
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {myPlaylists.map(p => (
            <PlaylistCard key={p.id} playlist={p} showActions onDelete={deletePlaylist} />
          ))}
        </div>
      )}
    </div>
  );
}
