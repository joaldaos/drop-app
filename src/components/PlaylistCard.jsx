import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import PlanBadge from './PlanBadge';

export default function PlaylistCard({ playlist, showActions = false, onDelete }) {
  const { t } = useTranslation();
  const { likedIds, toggleLike, showNotification } = useApp();
  const [copied, setCopied] = useState(false);

  const liked = likedIds.has(playlist.id);

  function handleShare() {
    navigator.clipboard.writeText(`https://dropapp.com/playlist/${playlist.id}`).catch(() => {});
    setCopied(true);
    showNotification(t('playlists.copied'), 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'all 0.25s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Cover */}
      <div style={{
        height: 120, background: `linear-gradient(135deg, ${playlist.color}cc, ${playlist.color}44)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: 40, opacity: 0.7 }}>🎵</span>
        {playlist.isTrending && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(239,68,68,0.9)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
          }}>
            {t('common.trending_badge')} 🔥
          </span>
        )}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: playlist.isPublic ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)',
          color: playlist.isPublic ? '#34d399' : '#9ca3af',
          border: `1px solid ${playlist.isPublic ? '#16a34a' : '#374151'}`,
          fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
        }}>
          {playlist.isPublic ? t('playlists.public') : t('playlists.private')}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>{playlist.title}</h3>
        </div>
        {playlist.description && (
          <p style={{ margin: '4px 0 8px', fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{playlist.description}</p>
        )}

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: '#6b7280' }}>{t('playlists.by')} {playlist.author}</span>
          <PlanBadge plan={playlist.authorPlan} />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: '#6b7280' }}>🎵 {playlist.tracks} {t('playlists.tracks')}</span>
          <span style={{ fontSize: 11, color: '#6b7280' }}>▶ {playlist.plays.toLocaleString()}</span>
        </div>

        {/* Tags */}
        {playlist.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
            {playlist.tags.map(tag => (
              <span key={tag} style={{
                background: 'rgba(147,51,234,0.1)', color: '#9333ea',
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                border: '1px solid rgba(147,51,234,0.2)',
              }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => toggleLike(playlist.id)} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: liked ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
            border: liked ? '1px solid rgba(236,72,153,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: liked ? '#f9a8d4' : '#9ca3af',
            borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {liked ? '♥' : '♡'} {playlist.likes + (liked ? 1 : 0)}
          </button>

          <button onClick={handleShare} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
            border: copied ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: copied ? '#34d399' : '#9ca3af',
            borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {copied ? '✓' : '↗'} {t('playlists.share')}
          </button>

          {showActions && onDelete && (
            <button onClick={() => onDelete(playlist.id)} style={{
              marginLeft: 'auto',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', borderRadius: 20, padding: '5px 12px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {t('playlists.delete')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
