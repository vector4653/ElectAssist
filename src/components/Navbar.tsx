import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBg = scrolled || !isLanding
    ? 'rgba(15, 23, 42, 0.85)'
    : 'transparent';

  return (
    <motion.nav
      id="main-navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: navBg,
        backdropFilter: scrolled || !isLanding ? 'blur(20px)' : 'none',
        borderBottom: scrolled || !isLanding ? '1px solid rgba(241,245,249,0.06)' : '1px solid transparent',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-bottom 0.4s',
      }}
    >
      {/* Logo / Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.6rem' }}>🗳️</span>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 700,
            background: 'var(--gradient-saffron)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('app_name')}
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LanguageSelector />

        {user ? (
          <button
            id="logout-btn"
            onClick={logout}
            className="btn-outline"
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
          >
            {t('nav.logout')}
          </button>
        ) : (
          <>
            <Link to="/login">
              <button
                id="nav-login-btn"
                className="btn-outline"
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              >
                {t('nav.login')}
              </button>
            </Link>
            <Link to="/register">
              <button
                id="nav-register-btn"
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              >
                {t('nav.register')}
              </button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
