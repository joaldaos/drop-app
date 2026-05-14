import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

const PLANS = [
  {
    key: 'free',
    nameKey: 'pricing.free_name',
    priceKey: 'pricing.free_price',
    featuresKey: 'pricing.free_features',
    ctaKey: 'pricing.cta_free',
    color: '#6b7280',
    border: '#374151',
    popular: false,
  },
  {
    key: 'pro',
    nameKey: 'pricing.pro_name',
    priceKey: 'pricing.pro_price',
    featuresKey: 'pricing.pro_features',
    ctaKey: 'pricing.cta_pro',
    color: '#9333ea',
    border: '#7c3aed',
    popular: true,
  },
  {
    key: 'creator',
    nameKey: 'pricing.creator_name',
    priceKey: 'pricing.creator_price',
    featuresKey: 'pricing.creator_features',
    ctaKey: 'pricing.cta_creator',
    color: '#ec4899',
    border: '#be185d',
    popular: false,
  },
];

const FAQS = [
  { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. Puedes cancelar cuando quieras. No hay permanencia.' },
  { q: '¿El pago es real?', a: 'No en esta demo. La integración con Stripe está preparada pero requiere backend.' },
  { q: '¿Qué pasa con mis playlists si bajo de plan?', a: 'Se conservan pero no podrás crear nuevas hasta estar dentro del límite.' },
  { q: '¿Hay descuento anual?', a: 'Próximamente. La estructura está lista para soportar planes anuales.' },
];

export default function Pricing() {
  const { t } = useTranslation();
  const { user, upgradePlan } = useApp();

  return (
    <div style={{ paddingTop: 90, maxWidth: 1000, margin: '0 auto', padding: '90px 24px 60px' }}>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <h1 style={{ margin:'0 0 8px', fontSize:36, fontWeight:900, color:'#f1f5f9' }}>{t('pricing.title')}</h1>
        <p style={{ margin:'0 0 20px', fontSize:16, color:'#6b7280' }}>{t('pricing.subtitle')}</p>
        {/* Stripe notice */}
        <div style={{ display:'inline-block', background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:10, padding:'8px 16px', fontSize:13, color:'#fbbf24' }}>
          {t('pricing.stripe_note')}
        </div>
      </div>

      {/* Plans grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20, marginBottom:60 }}>
        {PLANS.map(plan => {
          const isCurrent = user.plan === plan.key;
          const features = t(plan.featuresKey, { returnObjects: true });
          return (
            <div key={plan.key} style={{
              background: plan.popular ? 'linear-gradient(135deg,rgba(147,51,234,0.12),rgba(236,72,153,0.06))' : '#111118',
              border: `1px solid ${plan.border}`,
              borderRadius: 20, padding: '28px 24px',
              position: 'relative',
              boxShadow: plan.popular ? '0 0 40px rgba(147,51,234,0.15)' : 'none',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {plan.popular && (
                <div style={{
                  position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)',
                  background:'linear-gradient(135deg,#9333ea,#ec4899)',
                  color:'#fff', fontSize:11, fontWeight:800, padding:'4px 16px', borderRadius:20,
                  whiteSpace:'nowrap',
                }}>
                  ⭐ {t('pricing.most_popular')}
                </div>
              )}

              {/* Plan name */}
              <h2 style={{ margin:'0 0 4px', fontSize:20, fontWeight:800, color: plan.color }}>{t(plan.nameKey)}</h2>

              {/* Price */}
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:20 }}>
                <span style={{ fontSize:36, fontWeight:900, color:'#f1f5f9' }}>{t(plan.priceKey)}</span>
                {plan.key !== 'free' && (
                  <span style={{ fontSize:14, color:'#6b7280' }}>/ {t('pricing.monthly')}</span>
                )}
              </div>

              {/* Features */}
              <ul style={{ margin:'0 0 24px', padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                {(Array.isArray(features) ? features : []).map((f, i) => (
                  <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:14, color:'#d1d5db' }}>
                    <span style={{ color: plan.color, flexShrink:0, marginTop:1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'11px', textAlign:'center', fontSize:14, fontWeight:700, color:'#6b7280' }}>
                  ✓ {t('pricing.current_plan')}
                </div>
              ) : (
                <button onClick={() => upgradePlan(plan.key)} style={{
                  width:'100%', border:'none', borderRadius:12, padding:'12px',
                  background: plan.popular
                    ? 'linear-gradient(135deg,#9333ea,#ec4899)'
                    : plan.key === 'creator' ? 'linear-gradient(135deg,#be185d,#f97316)' : 'rgba(255,255,255,0.08)',
                  color: plan.key === 'free' ? '#9ca3af' : '#fff',
                  fontWeight:700, fontSize:14, cursor:'pointer',
                  transition:'all 0.2s',
                }}>
                  {t(plan.ctaKey)}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden', marginBottom:60 }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'#f1f5f9' }}>Comparativa de planes</h3>
        </div>
        {[
          ['Playlists',           '3',         'Ilimitadas', 'Ilimitadas'],
          ['Playlists públicas',  '✓',         '✓',          '✓'],
          ['Sin anuncios',        '✗',         '✓',          '✓'],
          ['Estadísticas',        '✗',         '✓',          '✓ Avanzado'],
          ['Monetización',        '✗',         '✗',          '✓'],
          ['Badge Creador',       '✗',         '✗',          '✓'],
          ['Playlist destacada',  '✗',         '✗',          '✓'],
        ].map(([feat, f, p, c], i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'12px 24px', borderBottom:'1px solid rgba(255,255,255,0.04)', background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize:13, color:'#9ca3af' }}>{feat}</span>
            {[f, p, c].map((val, j) => (
              <span key={j} style={{ fontSize:13, textAlign:'center', color: val === '✗' ? '#374151' : val === '✓' || val === '3' ? '#4ade80' : '#c084fc', fontWeight: val !== '✗' ? 600 : 400 }}>{val}</span>
            ))}
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'12px 24px' }}>
          <span style={{ fontSize:12, color:'#4b5563' }}>Precio/mes</span>
          {['0€','4,99€','9,99€'].map((p, i) => (
            <span key={i} style={{ fontSize:13, textAlign:'center', fontWeight:700, color:'#f1f5f9' }}>{p}</span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <h2 style={{ fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:20 }}>{t('pricing.faq_title')}</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 20px' }}>
            <p style={{ margin:'0 0 6px', fontSize:14, fontWeight:700, color:'#e2e8f0' }}>{faq.q}</p>
            <p style={{ margin:0, fontSize:13, color:'#6b7280', lineHeight:1.5 }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
