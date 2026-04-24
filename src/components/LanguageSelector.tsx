import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="lang-selector" style={{ position: 'relative' }}>
      <button
        id="language-selector-btn"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '9999px',
          color: 'var(--color-text)',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
      >
        <span style={{ fontSize: '1rem' }}>🌐</span>
        <span>{currentLang.nativeName}</span>
        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            background: 'var(--color-surface-light)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 0',
            minWidth: '180px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            backdropFilter: 'blur(20px)',
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              id={`lang-option-${lang.code}`}
              onClick={() => handleSelect(lang.code)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '10px 16px',
                background: lang.code === i18n.language ? 'rgba(232, 98, 28, 0.15)' : 'transparent',
                border: 'none',
                color: lang.code === i18n.language ? 'var(--color-primary-light)' : 'var(--color-text)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (lang.code !== i18n.language) {
                  (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (lang.code !== i18n.language) {
                  (e.target as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              <span>{lang.nativeName}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
