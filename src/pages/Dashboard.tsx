import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';

const IndiaGlobe = lazy(() => import('../components/IndiaGlobe/IndiaGlobe'));

function GlobeLoader() {
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
        Initializing 3D Globe…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();

  const greeting = profile?.fullName
    ? `Welcome, ${profile.fullName}`
    : 'Welcome!';

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
                Explore India's states on the interactive globe below
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
                    Your State
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

        {/* Globe section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            width: '100%',
            height: 'clamp(400px, 65vh, 700px)',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)',
            border: '1px solid rgba(241, 245, 249, 0.06)',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            position: 'relative',
          }}
        >
          <Suspense fallback={<GlobeLoader />}>
            <IndiaGlobe userState={profile?.state} />
          </Suspense>
        </motion.div>

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
                label: 'Email',
                value: user?.email ?? '—',
              },
              {
                icon: '🗳️',
                label: 'Voter ID',
                value: profile.voterId || 'Not provided',
              },
              {
                icon: '🌐',
                label: 'Language',
                value: profile.language?.toUpperCase() ?? 'EN',
              },
              {
                icon: '🎂',
                label: 'Age',
                value: profile.age ? `${profile.age} years` : '—',
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
