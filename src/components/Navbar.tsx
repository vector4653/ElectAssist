import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, profile, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navBg = scrolled || !isLanding
    ? 'rgba(15, 23, 42, 0.95)'
    : 'transparent';

  const navLinks = [
    { to: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: '📊' },
    { to: '/assistant', label: t('nav.assistant', 'AI Assistant'), icon: '🤖' },
    { to: '/roadmap', label: t('nav.roadmap', 'Voting Roadmap'), icon: '🗺️' },
  ];

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
        zIndex: 1100,
        padding: isMobile ? '0 16px' : '0 24px',
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
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <span style={{ fontSize: '1.6rem' }}>🗳️</span>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: isMobile ? '1.2rem' : '1.4rem',
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

      {/* Desktop Navigation Links */}
      {!isMobile && user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  background: isActive ? 'rgba(232, 98, 28, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(232, 98, 28, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LanguageSelector />

        {user ? (
          <>
            <button
              id="profile-btn"
              onClick={() => setShowProfileModal(true)}
              aria-label="Profile"
              title={profile?.fullName || 'Profile'}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                flexShrink: 0,
              }}
            >
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--gradient-saffron)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '0.95rem',
                }}>
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : '👤'}
                </div>
              )}
            </button>

            {/* Hamburger button on mobile when logged in */}
            {isMobile && (
              <button
                id="hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </>
                  )}
                </svg>
              </button>
            )}
          </>
        ) : (
          <>
            {!isMobile && (
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

            {/* Hamburger button on mobile when logged out */}
            {isMobile && (
              <button
                id="hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </>
                  )}
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </motion.nav>

    {/* Mobile Navigation Drawer & Backdrop */}
    <AnimatePresence>
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 1140,
            }}
          />

          {/* Drawer container */}
          <motion.div
            key="nav-drawer"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              zIndex: 1150,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              maxHeight: 'calc(100vh - 72px)',
              overflowY: 'auto',
            }}
          >
            {user ? (
              <>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        color: isActive ? 'var(--color-primary-light)' : '#f8fafc',
                        background: isActive ? 'rgba(232, 98, 28, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isActive ? '1px solid rgba(232, 98, 28, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
                >
                  ✏️ {t('edit_profile.title', 'Edit Profile')}
                </button>

                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                  }}
                  className="btn-outline"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: '0.95rem',
                    color: '#ef4444',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.05)',
                  }}
                >
                  🚪 {t('nav.logout', 'Logout')}
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <div style={{
                    color: location.pathname === '/' ? 'var(--color-primary-light)' : '#f8fafc',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span>🏠</span>
                    <span>Home</span>
                  </div>
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    {t('nav.login')}
                  </button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    {t('nav.register')}
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {showProfileModal && <EditProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
}
