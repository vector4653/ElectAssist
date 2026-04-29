import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES, LANGUAGES } from '../i18n';

export default function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { i18n } = useTranslation();
  const { user, profile, saveProfile, logout } = useAuth();
  
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [age, setAge] = useState(profile?.age ? profile.age.toString() : '');
  const [voterId, setVoterId] = useState(profile?.voterId || '');
  const [state, setState] = useState(profile?.state || '');
  const [language, setLanguage] = useState(profile?.language || i18n.language || 'en');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!user || !profile) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress and resize image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to high-quality compressed JPEG base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoURL(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

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
        fullName,
        age: parseInt(age),
        voterId,
        state,
        language,
        photoURL
      });
      // Changing language preference updates the app instantly
      if (language !== i18n.language) {
        i18n.changeLanguage(language);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    onClose();
    await logout();
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
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '32px 40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#f8fafc' }}>
            Edit Profile
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer', border: 'none' }}
          >
            ×
          </button>
        </div>

        {/* Profile Picture Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              background: photoURL ? `url(${photoURL}) center/cover` : 'var(--color-surface-lighter)',
              border: '2px dashed var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', overflow: 'hidden', position: 'relative'
            }}
          >
            {!photoURL && <span style={{ fontSize: '2rem' }}>📷</span>}
            <div style={{
              position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.6)', 
              color: 'white', fontSize: '0.7rem', textAlign: 'center', padding: '4px 0'
            }}>Edit</div>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Full Name *</label>
            <input
              type="text"
              className="input-field"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Age *</label>
              <input
                type="number"
                className="input-field"
                value={age}
                onChange={e => setAge(e.target.value)}
                min="18"
                max="120"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Voter ID</label>
              <input
                type="text"
                className="input-field"
                value={voterId}
                onChange={e => setVoterId(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ color: '#cbd5e1' }}>State / Union Territory *</label>
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
            <label className="form-label" style={{ color: '#cbd5e1' }}>Preferred Language *</label>
            <select
              className="input-field"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              required
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.nativeName} ({lang.name})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={handleLogout}
              style={{ flex: 1, justifyContent: 'center', borderColor: 'rgba(239,68,68,0.5)', color: '#ef4444' }}
            >
              Logout
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 2, justifyContent: 'center' }}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
