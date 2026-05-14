import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import AuthModal from './AuthModal';
import PlanBadge from './PlanBadge';
import { api } from '../api/client';

export default function Navbar() {
  const { t }          = useTranslation();
  const { user, logout } = useAuth();
  const location       = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal]   = useState(false);
  const [userMenu, setUserMenu]     = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location.pathname]);

  const links = [
    { to: '/',          label: 'Feed',           icon: '🏠' },
    { to: '/trending',  label: 'Trending 🔥',    icon: '🔥' },
    { to: '/discover',  label: t('playlists.discover_title'), icon: '✨' },
    { to: '/playlists', label: t('nav.playlists'), icon: '🎵' },
    { to: '/pricing',   label: t('nav.pricing'),   icon: '💎' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: '👑' }] : []),
  ];

  const isActive = p => location.pathname === p;

  return (
    <>
      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}

      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        background: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(147,51,234,0.15)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', gap:24 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration:'none', flexShrink:0 }}>
            <span style={{ fontSize:22, fontWeight:900, background:'linear-gradient(135deg,#9333ea,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>DROP</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display:'flex', gap:2, flex:1 }} className="hide-mobile">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                textDecoration:'none', padding:'6px 12px', borderRadius:20,
                fontSize:13, fontWeight: isActive(l.to) ? 600 : 400,
                color: isActive(l.to) ? '#e2e8f0' : '#6b7280',
                background: isActive(l.to) ? 'rgba(147,51,234,0.15)' : 'transparent',
                transition:'all 0.2s',
              }}>{l.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto' }}>
            <Link to="/search" style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'6px 12px', color:'#6b7280', textDecoration:'none', fontSize:13 }} className="hide-mobile">🔍</Link>
            <LanguageSelector compact />

            {user ? (
              <div style={{ position:'relative' }}>
                <button onClick={() => setUserMenu(o => !o)} style={{
                  display:'flex', alignItems:'center', gap:8,
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:20, padding:'6px 12px', cursor:'pointer', transition:'all 0.2s',
                }}>
                  <span style={{ fontSize:16 }}>{user.avatar}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#e2e8f0' }} className="hide-mobile">{user.name}</span>
                  <PlanBadge plan={user.plan} />
                </button>
                {userMenu && (
                  <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'#111118', border:'1px solid rgba(147,51,234,0.2)', borderRadius:14, padding:'8px', minWidth:200, zIndex:200 }}>
                    <Link to="/profile" style={{ display:'block', padding:'8px 12px', color:'#d1d5db', textDecoration:'none', borderRadius:8, fontSize:14 }}>👤 {t('nav.profile')}</Link>
                    {!user.spotifyConnected && (
                      <button onClick={() => api.spotifyConnect()} style={{ display:'block', width:'100%', textAlign:'left', padding:'8px 12px', color:'#1db954', background:'none', border:'none', borderRadius:8, fontSize:14, cursor:'pointer' }}>🎵 Conectar Spotify</button>
                    )}
                    <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'4px 0' }} />
                    <button onClick={logout} style={{ display:'block', width:'100%', textAlign:'left', padding:'8px 12px', color:'#f87171', background:'none', border:'none', borderRadius:8, fontSize:14, cursor:'pointer' }}>Cerrar sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthModal(true)} style={{
                background:'linear-gradient(135deg,#9333ea,#ec4899)',
                border:'none', color:'#fff', borderRadius:20, padding:'7px 16px',
                fontWeight:700, fontSize:13, cursor:'pointer',
              }}>
                Entrar
              </button>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(o => !o)} style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:18 }} className="show-mobile">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background:'#0d0d18', borderTop:'1px solid rgba(147,51,234,0.15)', padding:'12px 24px', display:'flex', flexDirection:'column', gap:4 }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{ textDecoration:'none', padding:'10px 14px', borderRadius:10, fontSize:15, color: isActive(l.to) ? '#c084fc' : '#9ca3af', background: isActive(l.to) ? 'rgba(147,51,234,0.1)' : 'transparent' }}>
                {l.icon} {l.label}
              </Link>
            ))}
            <Link to="/search" style={{ textDecoration:'none', padding:'10px 14px', borderRadius:10, fontSize:15, color:'#9ca3af' }}>🔍 Buscar</Link>
          </div>
        )}
      </nav>
    </>
  );
}
