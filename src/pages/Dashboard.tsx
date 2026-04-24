import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '100px 24px 40px',
        position: 'relative',
      }}
    >
      <div className="bg-dots" />
      <div className="orb orb-saffron" style={{ width: 400, height: 400, top: '10%', right: '5%' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div
          className="glass"
          style={{
            padding: '48px',
            borderRadius: 'var(--radius-xl)',
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
            🎉 {profile?.fullName ? `${t('login.title')}, ${profile.fullName}!` : t('login.title') + '!'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>
            Your voter dashboard is coming soon. We're building something amazing for you.
          </p>

          {profile && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Email', value: user?.email },
                { label: 'State', value: profile.state },
                { label: 'Voter ID', value: profile.voterId || 'Not provided' },
                { label: 'Language', value: profile.language?.toUpperCase() },
              ].map((item) => (
                <div key={item.label} className="card" style={{ padding: '20px' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 600 }}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
