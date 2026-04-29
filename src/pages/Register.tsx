import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES, STATE_LANGUAGE_MAP, LANGUAGES } from '../i18n';

const VOTER_ID_REGEX = /^[A-Z]{3}\d{7}$/;

export default function Register() {
  const { t, i18n } = useTranslation();
  const { register, loginWithGoogle, saveProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [voterId, setVoterId] = useState('');
  const [state, setState] = useState('');

  // Step 3
  const [detectedLang, setDetectedLang] = useState('');

  const validateStep1 = () => {
    if (password.length < 6) { setError(t('register.password_weak')); return false; }
    if (password !== confirmPassword) { setError(t('register.password_mismatch')); return false; }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (parseInt(age) < 18) { setError(t('register.age_error')); return false; }
    if (voterId && !VOTER_ID_REGEX.test(voterId.toUpperCase())) {
      setError(t('register.voter_id_error'));
      return false;
    }
    setError('');
    return true;
  };

  const goToStep2 = () => {
    if (validateStep1()) setStep(2);
  };

  const goToStep3 = () => {
    if (!validateStep2()) return;
    const langCode = STATE_LANGUAGE_MAP[state] || 'en';
    setDetectedLang(langCode);
    setStep(3);
  };

  const handleLanguageChoice = async (switchLang: boolean) => {
    if (switchLang && detectedLang !== 'en') {
      i18n.changeLanguage(detectedLang);
    }
    await handleRegister(switchLang ? detectedLang : 'en');
  };

  const handleRegister = async (chosenLang: string) => {
    setLoading(true);
    setError('');
    try {
      const user = await register(email, password);
      await saveProfile(user.uid, {
        fullName,
        age: parseInt(age),
        voterId: voterId.toUpperCase(),
        state,
        language: chosenLang,
        createdAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed');
    }
  };

  const detectedLangInfo = LANGUAGES.find((l) => l.code === detectedLang);

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 40px',
        position: 'relative',
      }}
    >
      <div className="bg-dots" />
      <div className="orb orb-blue" style={{ width: 400, height: 400, top: '5%', left: '5%' }} />
      <div className="orb orb-saffron" style={{ width: 350, height: 350, bottom: '10%', right: '5%' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}
      >
        <div
          className="glass"
          style={{
            padding: '48px 36px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '2.5rem' }}>🗳️</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '12px' }}>{t('register.title')}</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '6px', fontSize: '0.95rem' }}>
              {t('register.subtitle')}
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: step >= s ? 'var(--gradient-saffron)' : 'var(--color-surface-lighter)',
                    color: step >= s ? 'white' : 'var(--color-text-dim)',
                    transition: 'all 0.3s',
                  }}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    style={{
                      width: 40,
                      height: 2,
                      background: step > s ? 'var(--color-primary)' : 'var(--color-surface-lighter)',
                      transition: 'background 0.3s',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: Account Setup */}
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '20px', color: 'var(--color-primary-light)' }}>
                  {t('register.step1_title')}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="reg-email">{t('register.email')}</label>
                  <input id="reg-email" type="email" className="input-field" placeholder={t('register.email_placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="reg-password">{t('register.password')}</label>
                  <input id="reg-password" type="password" className="input-field" placeholder={t('register.password_placeholder')} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label" htmlFor="reg-confirm">{t('register.confirm_password')}</label>
                  <input id="reg-confirm" type="password" className="input-field" placeholder={t('register.confirm_placeholder')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>

                <button id="reg-next-1" className="btn-primary" onClick={goToStep2} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                  {t('register.next')} →
                </button>

                <div className="divider-text"><span>{t('register.or')}</span></div>

                <button id="reg-google-btn" onClick={handleGoogle} className="btn-google" style={{ width: '100%', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  {t('register.google')}
                </button>

                <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {t('register.have_account')}{' '}
                  <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{t('register.login_link')}</Link>
                </p>
              </motion.div>
            )}

            {/* STEP 2: Profile */}
            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '20px', color: 'var(--color-primary-light)' }}>
                  {t('register.step2_title')}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="reg-name">{t('register.full_name')}</label>
                  <input id="reg-name" type="text" className="input-field" placeholder={t('register.name_placeholder')} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="reg-age">{t('register.age')}</label>
                  <input id="reg-age" type="number" className="input-field" placeholder={t('register.age_placeholder')} value={age} onChange={(e) => setAge(e.target.value)} min={18} max={120} required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="reg-voterid">{t('register.voter_id')}</label>
                  <input id="reg-voterid" type="text" className="input-field" placeholder={t('register.voter_id_placeholder')} value={voterId} onChange={(e) => setVoterId(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label" htmlFor="reg-state">{t('register.state')}</label>
                  <select id="reg-state" className="select-field" value={state} onChange={(e) => setState(e.target.value)} required>
                    <option value="">{t('register.state_placeholder')}</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button id="reg-back-2" className="btn-outline" onClick={() => { setError(''); setStep(1); }} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
                    ← {t('register.back')}
                  </button>
                  <button id="reg-next-2" className="btn-primary" onClick={goToStep3} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
                    {t('register.next')} →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Language */}
            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '20px', color: 'var(--color-primary-light)' }}>
                  {t('register.step3_title')}
                </p>

                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px 24px',
                    background: 'rgba(232,98,28,0.06)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(232,98,28,0.15)',
                    marginBottom: '28px',
                  }}
                >
                  {detectedLang && detectedLang !== 'en' ? (
                    <>
                      <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🌐</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px' }}>
                        {t('register.language_detect')}
                      </p>
                      <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                        {detectedLangInfo?.nativeName} ({detectedLangInfo?.name})
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🌐</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        English is the default language for your region.
                      </p>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {detectedLang && detectedLang !== 'en' && (
                    <button
                      id="reg-switch-lang"
                      className="btn-primary"
                      onClick={() => handleLanguageChoice(true)}
                      disabled={loading}
                      style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                    >
                      {loading ? '...' : t('register.switch_language', { language: detectedLangInfo?.nativeName })}
                    </button>
                  )}
                  <button
                    id="reg-keep-english"
                    className={detectedLang !== 'en' ? 'btn-outline' : 'btn-primary'}
                    onClick={() => handleLanguageChoice(false)}
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                  >
                    {loading ? '...' : detectedLang !== 'en' ? t('register.keep_english') : t('register.submit')}
                  </button>
                  <button
                    id="reg-back-3"
                    className="btn-outline"
                    onClick={() => { setError(''); setStep(2); }}
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.9rem' }}
                  >
                    ← {t('register.back')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
