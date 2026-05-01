import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Puducherry"
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' }
];

export default function OnboardingModal() {
  const { t, i18n } = useTranslation();
  const { user, profile, saveProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(profile?.isNewToPolitics === undefined ? 1 : 2);
  const [age, setAge] = useState(profile?.age ? profile.age.toString() : '');
  const [voterId, setVoterId] = useState(profile?.voterId || '');
  const [state, setState] = useState(profile?.state || '');
  const [language, setLanguage] = useState(profile?.language || i18n.language || 'en');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || !profile || profile.hasCompletedOnboarding) return null;

  const handleInitialChoice = async (isNew: boolean) => {
    setLoading(true);
    try {
      await saveProfile(user.uid, {
        ...profile,
        isNewToPolitics: isNew
      });
      if (isNew) {
        navigate('/assistant');
      } else {
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save choice.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!age || parseInt(age) < 18) {
      setError('You must be at least 18 years old to vote.');
      return;
    }
    
    if (!state) {
      setError('Please select your state.');
      return;
    }

    setLoading(true);
    try {
      await saveProfile(user.uid, {
        ...profile,
        age: parseInt(age),
        voterId,
        state,
        language,
        hasCompletedOnboarding: true
      });
      // Changing language preference updates the app instantly
      i18n.changeLanguage(language);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <motion.div
        className="modal-container"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🤔</div>
              <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '16px' }}>
                Are you new to politics?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '32px' }}>
                We can help you understand the Indian political landscape with our AI assistant.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => handleInitialChoice(true)}
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                >
                  Yes, I'd like help understanding
                </button>
                <button
                  onClick={() => handleInitialChoice(false)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  No, I'm already familiar
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👋</div>
                <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '8px' }}>
                  {t('onboarding.title', 'Complete Your Profile')}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                  {t('onboarding.subtitle', 'Please provide a few details so we can customize your dashboard.')}
                </p>
              </div>

              {error && (
                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="form-label" style={{ color: '#cbd5e1' }}>{t('onboarding.age', 'Age')} *</label>
                  <input
                    type="number"
                    className="input-field"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 25"
                    min="18"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ color: '#cbd5e1' }}>{t('onboarding.state', 'State / Union Territory')} *</label>
                  <select
                    className="input-field"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select your state...</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ color: '#cbd5e1' }}>{t('onboarding.language', 'Preferred Language')} *</label>
                  <select
                    className="input-field"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    required
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ color: '#cbd5e1' }}>{t('onboarding.voter_id', 'Voter ID (Optional)')}</label>
                  <input
                    type="text"
                    className="input-field"
                    value={voterId}
                    onChange={e => setVoterId(e.target.value)}
                    placeholder="e.g. ABC1234567"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '12px', fontSize: '1.05rem' }}
                >
                  {loading ? '...' : t('onboarding.save', 'Save Profile')}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
