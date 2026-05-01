import React, { Component, Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { STATE_POLITICAL_DATA, PARTY_LOGOS } from '../data/politicalData';
import OnboardingModal from '../components/OnboardingModal';
import NewsWidget from '../components/Dashboard/NewsWidget';
import { AssistantPanel } from './Assistant';

const IndiaGlobe = lazy(() => import('../components/IndiaGlobe/IndiaGlobe'));

/** Catches any render error in NewsWidget so it doesn't crash the whole page */
class NewsErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: unknown) { console.error('NewsWidget error:', err); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '16px', color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>
          📰 News unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

function GlobeLoader() {
  const { t } = useTranslation();
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#ff9933', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{t('dashboard.initializing_globe')}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<string | undefined>(undefined);
  const [isAssistantMaximized, setIsAssistantMaximized] = useState(false);

  const politicalData = selectedState ? STATE_POLITICAL_DATA[selectedState] : null;
  const partyLogo = politicalData ? PARTY_LOGOS[politicalData.rulingParty] : null;

  const displayName = profile?.fullName || user?.displayName;
  const greeting = displayName
    ? t('dashboard.welcome_name', { name: displayName })
    : t('dashboard.welcome');

  const needsOnboarding = profile && !profile.hasCompletedOnboarding;

  const openAssistant = (message?: string) => {
    setAssistantMessage(message);
    setIsAssistantOpen(true);
  };

  return (
    <>
      {needsOnboarding && <OnboardingModal />}
      <div
        style={{
          height: '100vh',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {!isAssistantMaximized && (
          <>
            <div className="bg-dots" />
            <div className="orb orb-saffron" style={{ width: 600, height: 600, top: '-10%', right: '-5%', opacity: 0.1 }} />
            <div className="orb orb-blue" style={{ width: 500, height: 500, bottom: '-5%', left: '-5%', opacity: 0.1 }} />
          </>
        )}

        <div
          className={isAssistantMaximized ? '' : 'container'}
          style={{
            paddingTop: isAssistantMaximized ? 0 : '80px',
            paddingBottom: isAssistantMaximized ? 0 : '20px',
            position: 'relative',
            zIndex: isAssistantMaximized ? 10000 : 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          {/* Header */}
          {!isAssistantMaximized && !selectedState && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '4px', background: 'linear-gradient(135deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {greeting}
                  </h1>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    {t('dashboard.explore_globe')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button onClick={() => openAssistant()} className="btn-outline" style={{ padding: '8px 20px', background: 'rgba(59, 130, 246, 0.05)', fontSize: '0.85rem' }}>
                    <span>🤖</span> {t('dashboard.ai_assistant')}
                  </button>
                  {profile?.state && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', background: 'rgba(255,153,51,0.1)', border: '1px solid rgba(255,153,51,0.2)', borderRadius: '14px', backdropFilter: 'blur(10px)' }}>
                      <span style={{ fontSize: '1.1rem' }}>📍</span>
                      <div>
                        <p style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.your_state')}</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ff9933' }}>{profile.state}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Main row: assistant sidebar + globe */}
          <div style={{
            display: 'flex',
            gap: '24px',
            flex: 1,
            minHeight: 0,
            position: 'relative',
          }}>
            {/* Assistant Sidebar */}
            <AnimatePresence>
              {isAssistantOpen && (
                <motion.div
                  key="assistant-panel"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    width: isAssistantMaximized ? '100%' : '400px',
                    height: '100%',
                    position: isAssistantMaximized ? 'fixed' : 'relative',
                    top: isAssistantMaximized ? 0 : 'auto',
                    left: isAssistantMaximized ? 0 : 'auto',
                    zIndex: isAssistantMaximized ? 1000 : 100,
                  }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: isAssistantMaximized ? 0 : '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <AssistantPanel
                    isPanel
                    onClose={() => { setIsAssistantOpen(false); setIsAssistantMaximized(false); }}
                    initialMessage={assistantMessage}
                    isMaximized={isAssistantMaximized}
                    onToggleMaximize={() => setIsAssistantMaximized(!isAssistantMaximized)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Globe — shrinks to 55% width when a state is active (2D view takes over inside) */}
            {!isAssistantMaximized && (
              <motion.div
                layout
                style={{
                  flex: 1,
                  borderRadius: selectedState ? '0' : '24px',
                  overflow: 'hidden',
                  position: selectedState ? 'fixed' : 'relative',
                  top: selectedState ? 0 : 'auto',
                  left: selectedState ? 0 : 'auto',
                  width: selectedState ? '55%' : undefined,
                  height: selectedState ? '100vh' : '100%',
                  background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
                  border: selectedState ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  zIndex: selectedState ? 50 : 10,
                  transition: 'all 0.5s ease-in-out',
                }}
              >
                <Suspense fallback={<GlobeLoader />}>
                  <IndiaGlobe
                    userState={profile?.state}
                    selectedState={selectedState}
                    onStateSelect={setSelectedState}
                  />
                </Suspense>
              </motion.div>
            )}
          </div>

          {/* User info cards — shown below the globe when no state is selected */}
          <AnimatePresence>
            {!selectedState && !isAssistantMaximized && profile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginTop: '16px',
                }}
              >
                {[
                  { icon: '✉️', label: t('dashboard.email'), value: user?.email ?? '—' },
                  { icon: '🗳️', label: t('dashboard.voter_id'), value: profile.voterId || t('dashboard.not_provided') },
                  { icon: '🌐', label: t('dashboard.language'), value: profile.language?.toUpperCase() ?? 'EN' },
                  { icon: '🎂', label: t('dashboard.age'), value: profile.age ? t('dashboard.years', { count: profile.age }) : '—' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="card"
                    style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: '12px',
                      background: 'rgba(232, 98, 28, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed right-side state detail drawer */}
        <AnimatePresence>
          {selectedState && !isAssistantMaximized && (
            <motion.div
              key={`drawer-${selectedState}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '45%',
                height: '100vh',
                background: 'rgba(15, 23, 42, 0.98)',
                borderLeft: '1px solid rgba(241,245,249,0.08)',
                padding: '100px 40px 60px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                zIndex: 50,
                boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>{selectedState}</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => openAssistant(t('assistant.initial_state_query', { state: selectedState }))}
                    style={{
                      padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px',
                      color: '#60a5fa', display: 'flex', alignItems: 'center',
                      gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                    }}
                  >
                    <span>🤖</span> {t('dashboard.ai_insights')}
                  </button>
                  <button
                    onClick={() => setSelectedState(null)}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#94a3b8', width: '36px', height: '36px', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      fontSize: '1.2rem',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div style={{ width: '60px', height: '4px', background: '#3b82f6', borderRadius: '2px', marginBottom: '28px' }} />

              <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}
                dangerouslySetInnerHTML={{ __html: t('dashboard.analytics_desc', { state: selectedState }) }}
              />

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                {[
                  { label: t('dashboard.chief_minister'), value: politicalData?.chiefMinister || '—', icon: '👤' },
                  {
                    label: t('dashboard.ruling_party'),
                    value: politicalData?.rulingParty || '—',
                    icon: '🏛️',
                    logo: partyLogo,
                  },
                  { label: t('dashboard.assembly_seats'), value: String(politicalData?.assemblySeats || '—'), icon: '🗳️' },
                  { label: t('dashboard.lok_sabha_seats'), value: String(politicalData?.lokSabhaSeats || '—'), icon: '🇮🇳' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {stat.logo ? (
                        <div style={{ background: '#fff', borderRadius: '50%', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={stat.logo} alt="" style={{ width: '26px', height: '26px', objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.2rem' }}>{stat.icon}</span>
                      )}
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* News */}
              <div style={{ marginBottom: '28px' }}>
                <NewsErrorBoundary>
                  <NewsWidget />
                </NewsErrorBoundary>
              </div>

              {/* Upcoming features teaser */}
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', marginTop: 'auto' }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '10px', fontSize: '1rem', fontWeight: 600 }}>{t('dashboard.upcoming_features')}</h3>
                <ul style={{ color: '#94a3b8', paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>
                  <li>{t('dashboard.feature_live')}</li>
                  <li>{t('dashboard.feature_demo')}</li>
                  <li>{t('dashboard.feature_trends')}</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating AI button */}
        {!isAssistantOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openAssistant()}
            style={{
              position: 'fixed',
              bottom: selectedState ? '90px' : '32px',
              right: selectedState ? 'calc(45% + 32px)' : '32px',
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--gradient-saffron)',
              color: 'white',
              fontSize: '1.8rem',
              boxShadow: '0 10px 30px rgba(232, 98, 28, 0.4)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'right 0.45s ease-out, bottom 0.45s ease-out',
            }}
          >
            🤖
          </motion.button>
        )}
      </div>
    </>
  );
}
