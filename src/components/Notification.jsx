import { useApp } from '../context/AppContext';

export default function Notification() {
  const { notification } = useApp();
  if (!notification) return null;

  const colors = {
    success: { bg: '#052e16', border: '#16a34a', text: '#4ade80' },
    error:   { bg: '#2d0a0a', border: '#dc2626', text: '#f87171' },
    info:    { bg: '#0d0a1a', border: '#7c3aed', text: '#c084fc' },
  };
  const c = colors[notification.type] || colors.info;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      borderRadius: 12, padding: '12px 20px',
      fontSize: 14, fontWeight: 600,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'fadeUp 0.3s ease',
    }}>
      {notification.msg}
    </div>
  );
}
