import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer style={{
      borderTop: '1px solid rgba(147,51,234,0.1)',
      padding: '32px 24px', marginTop: 80,
      background: '#0a0a0f',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg,#9333ea,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DROP</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['/', t('nav.home')], ['/playlists', t('nav.playlists')], ['/pricing', t('nav.pricing')]].map(([to, label]) => (
            <Link key={to} to={to} style={{ color: '#6b7280', fontSize: 13, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: '#374151', fontSize: 12, margin: 0 }}>© 2025 DROP</p>
      </div>
    </footer>
  );
}
