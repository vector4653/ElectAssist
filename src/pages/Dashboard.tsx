import { Suspense, lazy, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { STATE_POLITICAL_DATA, PARTY_LOGOS } from '../data/politicalData';
import OnboardingModal from '../components/OnboardingModal';

import { AssistantPanel } from './Assistant';
import { COMPARISON_DATA, ISSUE_CATEGORIES } from '../data/comparisonData';

const IndiaGlobe = lazy(() => import('../components/IndiaGlobe/IndiaGlobe'));



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
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState<string | undefined>(undefined);
  const [isAssistantMaximized, setIsAssistantMaximized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const politicalData = selectedState ? STATE_POLITICAL_DATA[selectedState] : null;
  const partyLogo = politicalData ? PARTY_LOGOS[politicalData.rulingParty] : null;

  const displayName = profile?.fullName || user?.displayName;
  const greeting = displayName
    ? t('dashboard.welcome_name', { name: displayName })
    : t('dashboard.welcome');

  const needsOnboarding = profile && !profile.hasCompletedOnboarding;

  const [activeTab, setActiveTab] = useState<'issue' | 'candidate'>('issue');
  const [activeIssueCategory, setActiveIssueCategory] = useState('Agriculture');

  const comparisonData = (selectedState && COMPARISON_DATA[selectedState]) || COMPARISON_DATA['Default'];
  const currentIssue = comparisonData.issues.find(i => i.category === activeIssueCategory) || comparisonData.issues[0];

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
                  <button onClick={() => navigate('/roadmap')} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}>
                    <span>🗺️</span> View Roadmap
                  </button>
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
                  width: isAssistantMaximized ? '100%' : (isMobile ? '100%' : '400px'),
                  height: isAssistantMaximized ? '100%' : (isMobile ? '80vh' : '100%'),
                  position: (isAssistantMaximized || isMobile) ? 'fixed' : 'relative',
                  top: isAssistantMaximized ? 0 : (isMobile ? 'auto' : 'auto'),
                  bottom: (isMobile && !isAssistantMaximized) ? 0 : 'auto',
                  left: isAssistantMaximized ? 0 : (isMobile ? 0 : 'auto'),
                  zIndex: (isAssistantMaximized || isMobile) ? 1000 : 100,
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
                  width: selectedState ? (isMobile ? '100%' : '55%') : undefined,
                  height: selectedState ? (isMobile ? '35vh' : '100vh') : '100%',
                  background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
                  border: selectedState ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  zIndex: selectedState ? (isMobile ? 1 : 50) : 10,
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
              initial={{ opacity: 0, y: isMobile ? 100 : 0, x: isMobile ? 0 : 60 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: isMobile ? 100 : 0, x: isMobile ? 0 : 60 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: isMobile ? 'auto' : 0,
                bottom: 0,
                right: 0,
                width: isMobile ? '100%' : '45%',
                height: isMobile ? '68vh' : '100vh',
                background: 'rgba(15, 23, 42, 0.98)',
                borderLeft: isMobile ? 'none' : '1px solid rgba(241,245,249,0.08)',
                borderTop: isMobile ? '1px solid rgba(241,245,249,0.15)' : 'none',
                padding: isMobile ? '16px 20px 40px' : '60px 40px 60px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: isMobile ? '0 -10px 40px rgba(0,0,0,0.5)' : '-10px 0 40px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)',
                borderRadius: isMobile ? '32px 32px 0 0' : '0',
              }}
            >
              {/* Mobile Drag Handle */}
              {isMobile && (
                <div style={{
                  width: '40px',
                  height: '4px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  margin: '12px auto 20px',
                  flexShrink: 0
                }} />
              )}
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? '20px' : '8px' }}>
                <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>{selectedState}</h2>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
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

              {/* Compare & Decide Section */}
              <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', marginBottom: '24px' }}>Compare & Decide</h3>
                
                {/* Tabs */}
                <div style={{ 
                  display: 'flex', 
                  background: 'rgba(15, 23, 42, 0.4)', 
                  padding: '4px', 
                  borderRadius: '12px', 
                  marginBottom: '32px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <button 
                    onClick={() => setActiveTab('issue')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontSize: '0.9rem', fontWeight: 600,
                      background: activeTab === 'issue' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: activeTab === 'issue' ? '#818cf8' : '#94a3b8',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Issue Comparison
                  </button>
                  <button 
                    onClick={() => setActiveTab('candidate')}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontSize: '0.9rem', fontWeight: 600,
                      background: activeTab === 'candidate' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: activeTab === 'candidate' ? '#818cf8' : '#94a3b8',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Candidate Background
                  </button>
                </div>

                {activeTab === 'issue' ? (
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
                    {/* Issue Filter */}
                    <div style={{ width: isMobile ? '100%' : '140px', flexShrink: 0 }}>
                      {isMobile ? (
                        <select 
                          value={activeIssueCategory}
                          onChange={(e) => setActiveIssueCategory(e.target.value)}
                          style={{
                            width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '0.9rem'
                          }}
                        >
                          {ISSUE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {ISSUE_CATEGORIES.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setActiveIssueCategory(cat)}
                              style={{
                                textAlign: 'left', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontSize: '0.85rem',
                                background: activeIssueCategory === cat ? 'rgba(255,255,255,0.05)' : 'transparent',
                                color: activeIssueCategory === cat ? '#f8fafc' : '#64748b',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Comparison Grid */}
                    <div style={{ flex: 1 }}>
                      {currentIssue ? (
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                          {[currentIssue.partyA, currentIssue.partyB].map((p, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{ 
                                background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: '20px', 
                                border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px'
                              }}
                            >
                              <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase' }}>{p.name}</div>
                              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{p.stance}</p>
                              <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                                <a href="#" style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', fontStyle: 'italic' }}>
                                  Source: {p.source}
                                </a>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '40px' }}>No specific data for this category.</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                    {comparisonData.candidates.map((c, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ 
                          background: 'rgba(30, 41, 59, 0.3)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)',
                          overflow: 'hidden', display: 'flex', flexDirection: 'column'
                        }}
                      >
                        <div style={{ padding: '24px', background: 'rgba(99, 102, 241, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{c.name}</h4>
                          <div style={{ fontSize: '0.8rem', color: '#818cf8', marginTop: '4px' }}>{c.party}</div>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {[
                            { icon: '🎓', label: 'Education', value: c.education },
                            { icon: '💼', label: 'Experience', value: c.experience },
                            { icon: '🛡️', label: 'Criminal Cases', value: c.criminalCases, isWarning: c.criminalCases > 0 },
                            { icon: '💰', label: 'Assets', value: c.assets },
                          ].map((stat, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                                <span>{stat.icon}</span>
                                <span>{stat.label}</span>
                              </div>
                              <div style={{ flex: 1, borderBottom: '1px dotted rgba(255,255,255,0.1)', margin: '0 8px', alignSelf: 'flex-end', marginBottom: '4px' }} />
                              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: stat.isWarning ? '#f87171' : '#cbd5e1', textAlign: 'right' }}>
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
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
              bottom: selectedState ? (isMobile ? '68vh' : '80px') : '32px',
              right: selectedState ? (isMobile ? '24px' : 'calc(45% + 32px)') : '32px',
              width: isMobile ? '56px' : '64px',
              height: isMobile ? '56px' : '64px',
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
