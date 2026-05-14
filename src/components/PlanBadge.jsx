export default function PlanBadge({ plan, size = 'sm' }) {
  const config = {
    free:    { label: 'Free',    bg: 'rgba(255,255,255,0.1)', color: '#9ca3af', border: '#374151' },
    pro:     { label: 'PRO',     bg: 'rgba(147,51,234,0.2)',  color: '#c084fc', border: '#7c3aed' },
    creator: { label: 'Creator', bg: 'rgba(236,72,153,0.2)',  color: '#f9a8d4', border: '#be185d' },
  };
  const c = config[plan] || config.free;
  const fs = size === 'sm' ? '9px' : '11px';
  const px = size === 'sm' ? '6px' : '10px';
  const py = size === 'sm' ? '2px' : '4px';
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 20, fontSize: fs, fontWeight: 700,
      padding: `${py} ${px}`, letterSpacing: '0.05em',
    }}>
      {c.label}
    </span>
  );
}
