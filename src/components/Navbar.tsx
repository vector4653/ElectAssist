import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navBg = scrolled || !isLanding
    ? 'rgba(15, 23, 42, 0.85)'
    : 'transparent';

  return (
    <>
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
        padding: isMobile ? '0 12px' : '0 24px',
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
            fontSize: isMobile ? '1.1rem' : '1.4rem',
            fontWeight: 700,
            background: 'var(--gradient-saffron)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: isMobile && window.innerWidth < 380 ? 'none' : 'block'
          }}
        >
          {t('app_name')}
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px' }}>
        <LanguageSelector />

        {user ? (
          <button
            id="profile-btn"
            onClick={() => setShowProfileModal(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              padding: 0
            }}
          >
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        ) : (
          <>
            <Link to="/login">
              <button
                id="nav-login-btn"
                className="btn-outline"
                style={{ padding: isMobile ? '6px 12px' : '8px 20px', fontSize: isMobile ? '0.8rem' : '0.9rem' }}
              >
                {t('nav.login')}
              </button>
            </Link>
            <Link to="/register">
              <button
                id="nav-register-btn"
                className="btn-primary"
                style={{ padding: isMobile ? '6px 12px' : '8px 20px', fontSize: isMobile ? '0.8rem' : '0.9rem' }}
              >
                {t('nav.register')}
              </button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>

    {showProfileModal && <EditProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
}
