import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollSection from '../components/ScrollSection';

const FEATURE_ICONS = ['🌐', '🤖', '⚡', '🛡️'];

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background dots */}
      <div className="bg-dots" />

      {/* Decorative orbs */}
      <div className="orb orb-saffron" style={{ width: 500, height: 500, top: '-10%', right: '-10%' }} />
      <div className="orb orb-blue" style={{ width: 400, height: 400, bottom: '20%', left: '-8%' }} />
      <div className="orb orb-saffron" style={{ width: 300, height: 300, bottom: '-5%', right: '20%' }} />

      {/* ===== HERO SECTION ===== */}
      <section className="section" id="hero-section" style={{ minHeight: '100vh', paddingTop: '120px' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                background: 'rgba(232, 98, 28, 0.1)',
                border: '1px solid rgba(232, 98, 28, 0.2)',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                color: 'var(--color-primary-light)',
                marginBottom: '24px',
              }}
            >
              🇮🇳 {t('footer.hackathon')}
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '24px',
              }}
            >
              <span style={{
                background: 'var(--gradient-saffron)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t('hero.title')}
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'var(--color-text-muted)',
                maxWidth: '640px',
                margin: '0 auto 40px',
                lineHeight: 1.7,
              }}
            >
              {t('hero.subtitle')}
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register">
                <button id="hero-cta-btn" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
                  {t('hero.cta')} →
                </button>
              </Link>
              <a href="#how-it-works">
                <button id="hero-learn-btn" className="btn-outline" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
                  {t('hero.learn_more')}
                </button>
              </a>
            </div>
          </motion.div>

          {/* Hero visual — Animated floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            style={{
              marginTop: '60px',
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: '📋', label: 'Candidate Info' },
              { icon: '📍', label: 'Booth Finder' },
              { icon: '🗓️', label: 'Reminders' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                className="card"
                style={{
                  padding: '24px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '12px' }}>
                {t('how_it_works.title')}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                {t('how_it_works.subtitle')}
              </p>
            </div>
          </ScrollSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { icon: '🔍', key: 'step1', dir: 'left' as const },
              { icon: '📍', key: 'step2', dir: 'up' as const },
              { icon: '✅', key: 'step3', dir: 'right' as const },
            ].map((step, i) => (
              <ScrollSection key={step.key} direction={step.dir} delay={i * 0.15}>
                <div className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
                  {/* Step number ring */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'var(--gradient-saffron)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      margin: '0 auto 20px',
                      boxShadow: '0 0 30px rgba(232,98,28,0.3)',
                    }}
                  >
                    {step.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>
                    {t(`how_it_works.${step.key}_title`)}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                    {t(`how_it_works.${step.key}_desc`)}
                  </p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" id="features-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '12px' }}>
                {t('features.title')}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                {t('features.subtitle')}
              </p>
            </div>
          </ScrollSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {[
              { key: 'multilingual' },
              { key: 'ai_powered' },
              { key: 'realtime' },
              { key: 'privacy' },
            ].map((feat, i) => (
              <ScrollSection key={feat.key} direction="up" delay={i * 0.1}>
                <div className="card" style={{ padding: '36px 28px' }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(232,98,28,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginBottom: '18px',
                    }}
                  >
                    {FEATURE_ICONS[i]}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '10px' }}>
                    {t(`features.${feat.key}`)}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {t(`features.${feat.key}_desc`)}
                  </p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section" id="cta-section" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollSection direction="up">
            <div
              style={{
                textAlign: 'center',
                padding: '60px 40px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--gradient-card)',
                border: '1px solid var(--glass-border)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow behind CTA */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  height: 400,
                  borderRadius: '50%',
                  background: 'rgba(232,98,28,0.08)',
                  filter: 'blur(80px)',
                  pointerEvents: 'none',
                }}
              />

              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  fontWeight: 700,
                  marginBottom: '16px',
                  position: 'relative',
                }}
              >
                {t('cta_section.title')}
              </h2>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '1.1rem',
                  marginBottom: '36px',
                  maxWidth: 500,
                  margin: '0 auto 36px',
                  position: 'relative',
                }}
              >
                {t('cta_section.subtitle')}
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <Link to="/register">
                  <button id="cta-register-btn" className="btn-primary" style={{ fontSize: '1.05rem', padding: '14px 36px' }}>
                    {t('cta_section.register')}
                  </button>
                </Link>
                <Link to="/login">
                  <button id="cta-login-btn" className="btn-outline" style={{ fontSize: '1.05rem', padding: '14px 36px' }}>
                    {t('cta_section.login')}
                  </button>
                </Link>
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        id="footer"
        style={{
          textAlign: 'center',
          padding: '32px 24px',
          borderTop: '1px solid var(--glass-border)',
          color: 'var(--color-text-dim)',
          fontSize: '0.9rem',
        }}
      >
        {t('footer.made_with')} • {t('footer.hackathon')}
      </footer>
    </div>
  );
}
