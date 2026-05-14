import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import PlanBadge from './PlanBadge';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000)     return 'Ahora';
  if (diff < 3600000)   return `${Math.floor(diff/60000)}m`;
  if (diff < 86400000)  return `${Math.floor(diff/3600000)}h`;
  return `${Math.floor(diff/86400000)}d`;
}

const API = (import.meta.env.VITE_API_URL || '');
function artUrl(url) {
  if (!url) return null;
  if (url.includes('spotifycdn.com')) return `${API}/api/imgproxy?url=${encodeURIComponent(url)}`;
  return url;
}

export default function FeedCard({ event, onAuthRequired }) {
  const { user } = useAuth();
  const [likes,   setLikes]   = useState(event.likes);
  const [shares,  setShares]  = useState(event.shares);
  const [liked,   setLiked]   = useState(event.isLiked);
  const [copied,  setCopied]  = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!user) return onAuthRequired();
    if (loading) return;
    setLoading(true);
    try {
      const r = await api.likeEvent(event.id);
      setLiked(r.liked); setLikes(r.likes);
    } catch {} finally { setLoading(false); }
  }

  async function handleShare() {
    if (!user) return onAuthRequired();
    try {
      const r = await api.shareEvent(event.id);
      setShares(r.shares);
      await navigator.clipboard.writeText(r.shareUrl).catch(() => {});
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const typeLabel = {
    playing:   '🎵 Está escuchando',
    liked:     '♥ Le gusta',
    shared:    '↗ Compartió',
    milestone: '🏆 Logro',
  }[event.type] || '🎵';

  return (
    <div style={{
      background: '#111118', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 20, overflow: 'hidden', marginBottom: 16,
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(147,51,234,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      {/* Track info row */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px 0' }}>
        {event.albumArt
          ? <img src={artUrl(event.albumArt)} alt={event.trackName}
              style={{ width:64, height:64, borderRadius:10, objectFit:'cover', flexShrink:0 }} />
          : <div style={{ width:64, height:64, borderRadius:10, flexShrink:0,
              background:'linear-gradient(135deg,#1a0a2e,#0d0d18)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>🎵</div>
        }
        <div style={{ flex:1, minWidth:0 }}>
          {event.viralScore > 0.3 && (
            <span style={{
              background:'rgba(239,68,68,0.9)', color:'#fff',
              fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:20, marginBottom:4, display:'inline-block',
            }}>🔥 Viral</span>
          )}
          <p style={{ margin:0, fontSize:16, fontWeight:800, color:'#f1f5f9', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{event.trackName}</p>
          <p style={{ margin:'2px 0 0', fontSize:13, color:'rgba(255,255,255,0.55)' }}>{event.artistName}</p>
        </div>
      </div>

      <div style={{ padding:'14px 16px' }}>
        {/* Author row */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{
            width:36, height:36, borderRadius:'50%', flexShrink:0,
            background:'linear-gradient(135deg,#9333ea,#ec4899)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
          }}>
            {event.userAvatar}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{event.userName}</span>
              <PlanBadge plan={event.userPlan} />
            </div>
            <div style={{ display:'flex', gap:8, marginTop:1 }}>
              <span style={{ fontSize:11, color:'#9333ea' }}>{typeLabel}</span>
              <span style={{ fontSize:11, color:'#4b5563' }}>📍 {event.userCity}</span>
              <span style={{ fontSize:11, color:'#4b5563' }}>{timeAgo(event.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={handleLike} style={{
            display:'flex', alignItems:'center', gap:5,
            background: liked ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
            border: liked ? '1px solid rgba(236,72,153,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: liked ? '#f9a8d4' : '#9ca3af',
            borderRadius:20, padding:'6px 14px', fontSize:13, fontWeight:700,
            cursor:'pointer', transition:'all 0.2s',
          }}>
            {liked ? '♥' : '♡'} {likes}
          </button>

          <button onClick={handleShare} style={{
            display:'flex', alignItems:'center', gap:5,
            background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
            border: copied ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: copied ? '#34d399' : '#9ca3af',
            borderRadius:20, padding:'6px 14px', fontSize:13, fontWeight:700,
            cursor:'pointer', transition:'all 0.2s',
          }}>
            {copied ? '✓ Copiado' : `↗ ${shares}`}
          </button>

          {event.spotifyUrl && (
            <a href={event.spotifyUrl} target="_blank" rel="noreferrer" style={{
              display:'flex', alignItems:'center', gap:5,
              background:'rgba(29,185,84,0.15)', border:'1px solid rgba(29,185,84,0.3)',
              color:'#1db954', borderRadius:20, padding:'6px 14px',
              fontSize:13, fontWeight:700, textDecoration:'none',
              marginLeft:'auto',
            }}>
              ▶ Spotify
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
