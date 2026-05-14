import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#9333ea','#ec4899','#f97316','#0ea5e9','#10b981','#ef4444','#d97706','#6366f1'];

export default function CreatePlaylistModal({ onClose }) {
  const { t } = useTranslation();
  const { createPlaylist, canCreatePlaylist, FREE_PLAYLIST_LIMIT, user, showNotification } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [color, setColor] = useState(COLORS[0]);

  const atLimit = !canCreatePlaylist();

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const ok = createPlaylist({ title: title.trim(), description: desc.trim(), isPublic, color });
    if (ok) {
      showNotification('Playlist creada ✓', 'success');
      onClose();
      navigate('/playlists');
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#111118', border: '1px solid rgba(147,51,234,0.3)',
        borderRadius: 20, padding: 28, width: '100%', maxWidth: 440,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>{t('playlists.create_title')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        {atLimit ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
            <p style={{ color: '#f87171', marginBottom: 16, fontSize: 14 }}>{t('playlists.limit_free')}</p>
            <button onClick={() => { onClose(); navigate('/pricing'); }} style={{
              background: 'linear-gradient(135deg,#9333ea,#ec4899)',
              border: 'none', color: '#fff', borderRadius: 20,
              padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: 14,
            }}>
              {t('playlists.upgrade_pro')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {user.plan === 'free' && (
              <div style={{
                background: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.2)',
                borderRadius: 10, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#c084fc',
              }}>
                Plan Free: playlist {1} de {FREE_PLAYLIST_LIMIT}
              </div>
            )}

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 6 }}>
              {t('playlists.playlist_name')} *
            </label>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              maxLength={50} required
              style={{
                width: '100%', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 14px', color: '#f1f5f9', fontSize: 14,
                outline: 'none', marginBottom: 14, boxSizing: 'border-box',
              }}
            />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 6 }}>
              {t('playlists.playlist_desc')}
            </label>
            <textarea
              value={desc} onChange={e => setDesc(e.target.value)}
              maxLength={120} rows={2}
              style={{
                width: '100%', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '10px 14px', color: '#f1f5f9', fontSize: 14,
                outline: 'none', marginBottom: 14, resize: 'none', boxSizing: 'border-box',
              }}
            />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>Color</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c, border: 'none',
                  cursor: 'pointer', outline: color === c ? `2px solid #fff` : 'none',
                  outlineOffset: 2, transition: 'all 0.15s',
                }} />
              ))}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
              <div style={{
                width: 36, height: 20, borderRadius: 10,
                background: isPublic ? '#9333ea' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 2,
                  left: isPublic ? 18 : 2, transition: 'all 0.2s',
                }} />
              </div>
              <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} style={{ display: 'none' }} />
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{t('playlists.playlist_public')}</span>
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={onClose} style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af', borderRadius: 10, padding: '10px', fontWeight: 600, cursor: 'pointer', fontSize: 14,
              }}>
                {t('playlists.cancel')}
              </button>
              <button type="submit" disabled={!title.trim()} style={{
                flex: 2, background: title.trim() ? 'linear-gradient(135deg,#9333ea,#ec4899)' : 'rgba(147,51,234,0.3)',
                border: 'none', color: '#fff', borderRadius: 10, padding: '10px',
                fontWeight: 700, cursor: title.trim() ? 'pointer' : 'not-allowed', fontSize: 14,
              }}>
                {t('playlists.create_btn')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
