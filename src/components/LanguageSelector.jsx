import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'ca', label: 'CA', full: 'Català'  },
  { code: 'en', label: 'EN', full: 'English' },
];

export default function LanguageSelector({ compact = false }) {
  const { i18n } = useTranslation();

  function change(code) {
    i18n.changeLanguage(code);
    localStorage.setItem('drop_lang', code);
  }

  return (
    <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 3 }}>
      {LANGS.map(l => {
        const active = i18n.language === l.code;
        return (
          <button
            key={l.code}
            onClick={() => change(l.code)}
            style={{
              background: active ? 'rgba(147,51,234,0.4)' : 'transparent',
              border: active ? '1px solid rgba(147,51,234,0.6)' : '1px solid transparent',
              color: active ? '#c084fc' : '#6b7280',
              borderRadius: 16, padding: compact ? '3px 8px' : '4px 10px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
