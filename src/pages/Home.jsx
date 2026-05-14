import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';
import CreatePlaylistModal from '../components/CreatePlaylistModal';

export default function Home() {
  const { t } = useTranslation();
  const { communityPlaylists } = useApp();
  const [showModal, setShowModal] = useState(false);

  const trending = communityPlaylists.filter(p => p.isTrending);
  const recent   = communityPlaylists.filter(p => !p.isTrending).slice(0, 4);

  return (
    <div style={{ paddingTop: 80 }}>
      {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} />}

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '60px 24px' }}>
        {/* Orbs */}
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(147,51,234,0.12)', filter:'blur(80px)', top:'-10%', left:'-5%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(236,72,153,0.08)', filter:'blur(80px)', bottom:0, right:'10%', pointerEvents:'none' }} />
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, opacity:0.04, backgroundImage:'linear-gradient(rgba(147,51,234,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(147,51,234,0.5) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', position: 'relative' }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(147,51,234,0.15)', border:'1px solid rgba(147,51,234,0.3)', borderRadius:20, padding:'6px 14px', fontSize:12, color:'#c084fc', marginBottom:20, fontWeight:600 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#1db954', boxShadow:'0 0 8px #1db954', display:'inline-block' }} />
              {t('common.demo_notice')}
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(40px,7vw,72px)', fontWeight: 900, lineHeight: 1.05, color: '#f1f5f9' }}>
              {t('home.hero_title')}
            </h1>
            <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(40px,7vw,72px)', fontWeight: 900, lineHeight: 1.05, background: 'linear-gradient(135deg,#9333ea,#ec4899,#f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              {t('home.hero_title2')}
            </h1>
            <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 32, lineHeight: 1.6, maxWidth: 480 }}>
              {t('home.hero_sub')}
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button onClick={() => setShowModal(true)} style={{
                background: 'linear-gradient(135deg,#9333ea,#ec4899)',
                border:'none', color:'#fff', borderRadius:12, padding:'13px 28px',
                fontWeight:700, fontSize:15, cursor:'pointer',
                boxShadow:'0 8px 24px rgba(147,51,234,0.3)',
              }}>
                + {t('home.cta_start')}
              </button>
              <Link to="/pricing" style={{
                display:'inline-block', textDecoration:'none',
                border:'1px solid rgba(147,51,234,0.4)', color:'#c084fc',
                borderRadius:12, padding:'13px 28px', fontWeight:700, fontSize:15,
                transition:'all 0.2s',
              }}>
                {t('home.cta_pricing')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Trending ── */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:20 }}>
            <div>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:'#f1f5f9' }}>🔥 {t('home.trending')}</h2>
              <p style={{ margin:'4px 0 0', fontSize:13, color:'#6b7280' }}>{t('home.trending_sub')}</p>
            </div>
            <Link to="/discover" style={{ fontSize:13, color:'#9333ea', textDecoration:'none', fontWeight:600 }}>{t('home.see_all')} →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
            {trending.map(p => <PlaylistCard key={p.id} playlist={p} />)}
          </div>
        </section>

        {/* ── Discover ── */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:20 }}>
            <div>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:'#f1f5f9' }}>✨ {t('home.discover')}</h2>
              <p style={{ margin:'4px 0 0', fontSize:13, color:'#6b7280' }}>{t('home.discover_sub')}</p>
            </div>
            <Link to="/discover" style={{ fontSize:13, color:'#9333ea', textDecoration:'none', fontWeight:600 }}>{t('home.see_all')} →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
            {recent.map(p => <PlaylistCard key={p.id} playlist={p} />)}
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section style={{ marginBottom: 60 }}>
          <div style={{
            background:'linear-gradient(135deg,rgba(147,51,234,0.15),rgba(236,72,153,0.1))',
            border:'1px solid rgba(147,51,234,0.2)', borderRadius:20,
            padding:'40px 32px', textAlign:'center',
          }}>
            <h2 style={{ margin:'0 0 8px', fontSize:28, fontWeight:800, color:'#f1f5f9' }}>
              ¿Listo para hacer un DROP? 🎵
            </h2>
            <p style={{ color:'#9ca3af', marginBottom:24, fontSize:15 }}>Crea tu primera playlist y compártela con el mundo.</p>
            <button onClick={() => setShowModal(true)} style={{
              background:'linear-gradient(135deg,#9333ea,#ec4899)',
              border:'none', color:'#fff', borderRadius:12, padding:'13px 32px',
              fontWeight:700, fontSize:15, cursor:'pointer',
            }}>
              + {t('nav.create')}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
