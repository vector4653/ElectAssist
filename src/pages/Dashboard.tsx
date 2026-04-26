import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useState } from 'react';

const IndiaGlobe = lazy(() => import('../components/IndiaGlobe/IndiaGlobe'));

function GlobeLoader() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(255,153,51,0.2)',
          borderTopColor: '#ff9933',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
        {t('dashboard.initializing_globe')}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [activeState, setActiveState] = useState<string | null>(null);

  const greeting = profile?.fullName
    ? t('dashboard.welcome_name', { name: profile.fullName })
    : t('dashboard.welcome');

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '80px 24px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div className="bg-dots" />
      <div
        className="orb orb-saffron"
        style={{ width: 500, height: 500, top: '-10%', right: '-5%' }}
      />
      <div
        className="orb orb-blue"
        style={{ width: 400, height: 400, bottom: '-5%', left: '-5%' }}
      />

      <div
        className="container"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '24px' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  fontWeight: 700,
                  marginBottom: '6px',
                  background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {greeting}
              </h1>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.95rem',
                }}
              >
                {t('dashboard.explore_globe')}
              </p>
            </div>

            {/* User state badge */}
            {profile?.state && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 20px',
                  background:
                    'linear-gradient(135deg, rgba(255,153,51,0.15), rgba(245,158,11,0.1))',
                  border: '1px solid rgba(255,153,51,0.25)',
                  borderRadius: '14px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <div>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t('dashboard.your_state')}
                  </p>
                  <p
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#ff9933',
                    }}
                  >
                    {profile.state}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Container for Globe and Side Panel */}
        <div style={{ display: 'flex', width: '100%', height: activeState ? '100vh' : 'clamp(400px, 65vh, 700px)', transition: 'height 0.6s ease-in-out' }}>
          
          {/* Globe section */}
          <div
            style={{
              flex: activeState ? '0 0 55%' : '1',
              borderRadius: activeState ? '0px' : '24px',
              position: activeState ? 'fixed' : 'relative',
              top: activeState ? 0 : 'auto',
              left: activeState ? 0 : 'auto',
              width: activeState ? '55%' : '100%',
              height: activeState ? '100vh' : '100%',
              zIndex: activeState ? 50 : 1,
              border: activeState ? 'none' : '1px solid rgba(241, 245, 249, 0.06)',
              overflow: 'hidden',
              background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              transition: 'all 0.6s ease-in-out',
            }}
          >
            <Suspense fallback={<GlobeLoader />}>
              <IndiaGlobe userState={profile?.state} onStateSelect={setActiveState} />
            </Suspense>
          </div>

          {/* Right hand side content panel */}
          <AnimatePresence>
            {activeState && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  width: '45%',
                  height: '100vh',
                  background: 'rgba(15, 23, 42, 0.98)',
                  borderLeft: '1px solid rgba(241, 245, 249, 0.08)',
                  padding: '60px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  zIndex: 50,
                  boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
                }}
              >
                <h2 style={{ fontSize: '2.5rem', color: '#f8fafc', marginBottom: '8px' }}>{activeState}</h2>
                <div style={{ width: '60px', height: '4px', background: '#3b82f6', borderRadius: '2px', marginBottom: '32px' }} />
                
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '24px' }} 
                   dangerouslySetInnerHTML={{ __html: t('dashboard.analytics_desc', { state: activeState }) }} 
                />

                {/* Placeholder Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>{t('dashboard.total_constituencies')}</div>
                    <div style={{ fontSize: '1.8rem', color: '#f1f5f9', fontWeight: 600 }}>-</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>{t('dashboard.registered_voters')}</div>
                    <div style={{ fontSize: '1.8rem', color: '#f1f5f9', fontWeight: 600 }}>-</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <h3 style={{ color: '#60a5fa', marginBottom: '8px', fontSize: '1.1rem' }}>{t('dashboard.upcoming_features')}</h3>
                  <ul style={{ color: '#94a3b8', paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    <li>{t('dashboard.feature_live')}</li>
                    <li>{t('dashboard.feature_demo')}</li>
                    <li>{t('dashboard.feature_trends')}</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Info cards below globe */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            {[
              {
                icon: '✉️',
                label: t('dashboard.email'),
                value: user?.email ?? '—',
              },
              {
                icon: '🗳️',
                label: t('dashboard.voter_id'),
                value: profile.voterId || t('dashboard.not_provided'),
              },
              {
                icon: '🌐',
                label: t('dashboard.language'),
                value: profile.language?.toUpperCase() ?? 'EN',
              },
              {
                icon: '🎂',
                label: t('dashboard.age'),
                value: profile.age ? t('dashboard.years', { count: profile.age }) : '—',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="card"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '12px',
                    background: 'rgba(232, 98, 28, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-dim)',
                      marginBottom: '2px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
