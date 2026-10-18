import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
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

  // Close account menu when route changes
  useEffect(() => {
    setAccountMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const navBg = scrolled || !isLanding
    ? 'rgba(15, 23, 42, 0.95)'
    : 'transparent';

  const displayName = profile?.fullName || user?.displayName || 'User';

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

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        <LanguageSelector />

        {user ? (
          <button
            id="hamburger-btn"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            aria-label="Account details & menu"
            title="Account Menu"
            style={{
              background: accountMenuOpen ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#f8fafc',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {accountMenuOpen ? (
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
        ) : (
          <>
            <Link to="/login">
              <button
                id="nav-login-btn"
                className="btn-outline"
                style={{ padding: isMobile ? '6px 14px' : '8px 20px', fontSize: isMobile ? '0.85rem' : '0.9rem' }}
              >
                {t('nav.login')}
              </button>
            </Link>
            <Link to="/register">
              <button
                id="nav-register-btn"
                className="btn-primary"
                style={{ padding: isMobile ? '6px 14px' : '8px 20px', fontSize: isMobile ? '0.85rem' : '0.9rem' }}
              >
                {t('nav.register')}
              </button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>

    {/* Account Details & Logout Dropdown Menu */}
    <AnimatePresence>
      {user && accountMenuOpen && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <motion.div
            key="account-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setAccountMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1140,
            }}
          />

          {/* Account Details Panel */}
          <motion.div
            key="account-menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '76px',
              right: isMobile ? '16px' : '24px',
              width: isMobile ? 'calc(100% - 32px)' : '340px',
              maxWidth: '380px',
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(20px)',
              padding: '22px 20px',
              zIndex: 1150,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* User Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--gradient-saffron)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  color: '#fff',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(232, 98, 28, 0.3)',
                }}
              >
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    margin: '2px 0 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.email || '—'}
                </p>
              </div>
            </div>

            {/* Account Details Box */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📍</span> {t('dashboard.your_state', 'State')}
                </span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                  {profile?.state || '—'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🗳️</span> {t('dashboard.voter_id', 'Voter ID')}
                </span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                  {profile?.voterId || '—'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎂</span> {t('dashboard.age', 'Age')}
                </span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                  {profile?.age ? `${profile.age} yrs` : '—'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                id="edit-profile-action-btn"
                onClick={() => {
                  setAccountMenuOpen(false);
                  setShowProfileModal(true);
                }}
                className="btn-outline"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px',
                  fontSize: '0.9rem',
                  borderRadius: '12px',
                }}
              >
                ✏️ {t('edit_profile.title', 'Edit Profile')}
              </button>

              <button
                id="logout-action-btn"
                onClick={handleLogout}
                className="btn-outline"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px',
                  fontSize: '0.9rem',
                  borderRadius: '12px',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.06)',
                }}
              >
                🚪 {t('nav.logout', 'Logout')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {showProfileModal && <EditProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
}
