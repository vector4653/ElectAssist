import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { translateText } from '../../services/translationService';

// Dummy live updates in English
const LIVE_UPDATES = [
  "Election Commission announces revised polling dates for Phase 3.",
  "Major infrastructure bill passed in the assembly session today.",
  "Voter registration deadline extended by two weeks in your district.",
  "New manifesto promises focus on healthcare and digital education.",
  "Security tightened across major polling booths for upcoming elections."
];

export default function NewsWidget() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function loadTranslatedNews() {
      setLoading(true);
      try {
        // We pass the array of strings and the user's current language code
        const translated = await translateText(LIVE_UPDATES, i18n.language);
        if (isMounted) {
          setNews(translated as string[]);
        }
      } catch (err) {
        console.error("News translation failed", err);
        if (isMounted) {
          setNews(LIVE_UPDATES); // fallback
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTranslatedNews();

    return () => {
      isMounted = false;
    };
  }, [i18n.language]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>📰</span>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
          Live Political Updates
        </h3>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '90%', height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                <div style={{ width: '60%', height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {news.slice(0, 3).map((headline, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                display: 'flex',
                gap: '12px',
                paddingBottom: idx < 2 ? '16px' : '0',
                borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}
            >
              <div style={{ 
                width: 40, height: 40, 
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.2))',
                color: '#60a5fa', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem'
              }}>
                {idx + 1}
              </div>
              <p style={{ 
                flex: 1, margin: 0, fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.4' 
              }}>
                {headline}
              </p>
            </motion.div>
          ))}
        </div>
      )}
      <style>{`@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
