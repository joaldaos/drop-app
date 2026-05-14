import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, defaultTab = 'login' }) {
  const { login, register } = useAuth();
  const [tab, setTab]     = useState(defaultTab);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm]   = useState({ name: '', email: '', password: '', city: '', inviteCode: '' });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (tab === 'login') await login(form.email, form.password);
      else await register(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '10px 14px', color: '#f1f5f9', fontSize: 14,
    outline: 'none', marginBottom: 12, boxSizing: 'border-box',
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#111118', border:'1px solid rgba(147,51,234,0.3)', borderRadius:20, padding:28, width:'100%', maxWidth:380 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <span style={{ fontSize:22, fontWeight:900, background:'linear-gradient(135deg,#9333ea,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>DROP</span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#6b7280', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>

        <div style={{ display:'flex', gap:0, marginBottom:24, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:3 }}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, border:'none', borderRadius:8, padding:'8px',
              background: tab === t ? 'rgba(147,51,234,0.3)' : 'transparent',
              color: tab === t ? '#c084fc' : '#6b7280',
              fontWeight:700, fontSize:13, cursor:'pointer',
            }}>
              {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          {tab === 'register' && (
            <>
              <input value={form.name}     onChange={set('name')}     placeholder="Nombre" required style={inputStyle} />
              <input value={form.city}     onChange={set('city')}     placeholder="Ciudad (opcional)" style={inputStyle} />
              <input value={form.inviteCode} onChange={set('inviteCode')} placeholder="Código de invitación (opcional)" style={inputStyle} />
            </>
          )}
          <input value={form.email}    onChange={set('email')}    type="email"    placeholder="Email" required style={inputStyle} />
          <input value={form.password} onChange={set('password')} type="password" placeholder="Contraseña" required style={inputStyle} />

          {error && <p style={{ color:'#f87171', fontSize:13, marginBottom:12 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width:'100%', background:'linear-gradient(135deg,#9333ea,#ec4899)',
            border:'none', color:'#fff', borderRadius:10, padding:'12px',
            fontWeight:700, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? '...' : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
