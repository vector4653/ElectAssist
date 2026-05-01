import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getGeminiResponse } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { translateText } from '../services/translationService';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface AssistantPanelProps {
  isPanel?: boolean;
  onClose?: () => void;
  initialMessage?: string;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export function AssistantPanel({ isPanel, onClose, initialMessage, isMaximized, onToggleMaximize }: AssistantPanelProps) {
  const { t, i18n } = useTranslation();
  const { profile, user, saveProfile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      if (messages.length === 0 && profile) {
        const defaultPrompt = t('assistant.default_greeting', { name: profile.fullName || 'there' });
        
        if (initialMessage) {
          const userMsg: Message = { role: 'user', parts: [{ text: initialMessage }] };
          setMessages([userMsg]);
          setIsLoading(true);
          try {
            const response = await getGeminiResponse(initialMessage, [], i18n.language);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
          } catch (error) {
            console.error("Initial Gemini Error:", error);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: t('assistant.error_insights') }] }]);
          } finally {
            setIsLoading(false);
          }
        } else {
          setMessages([{ role: 'model', parts: [{ text: defaultPrompt }] }]);
        }
      }
    };
    
    initChat();
  }, [profile, initialMessage, i18n.language, t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(currentInput, messages, i18n.language);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: t('assistant.error_connection') }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const finishOnboarding = async () => {
    if (user && profile) {
      await saveProfile(user.uid, {
        ...profile,
        isNewToPolitics: true
      });
      navigate('/dashboard');
    }
  };

  const containerStyle: React.CSSProperties = isPanel ? {
    width: '100%',
    height: '100%',
    background: isMaximized ? '#020617' : 'transparent',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: isMaximized ? '0' : '24px',
    transition: 'all 0.3s ease-in-out',
    position: 'relative'
  } : {
    width: '100%',
    maxWidth: '800px',
    height: '70vh',
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(12px)',
    position: 'relative'
  };

  return (
    <div style={containerStyle}>
      {/* Absolute Control Buttons for Maximized State */}
      {isPanel && isMaximized && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          display: 'flex',
          gap: '12px',
          zIndex: 10000
        }}>
          <button
            onClick={onToggleMaximize}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#e8621c',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(232, 98, 28, 0.4)'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          </button>
          <button
            onClick={onClose}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #ef4444',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: '0 24px',
        height: '80px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        background: isMaximized ? '#0f172a' : (isPanel ? 'rgba(15, 23, 42, 0.6)' : 'rgba(30, 41, 59, 0.5)'),
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>{t('assistant.title')}</h2>
            {isMaximized && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t('assistant.full_power')}</span>}
          </div>
        </div>

        {/* Regular Buttons (when not maximized) */}
        {!isMaximized && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isPanel && onToggleMaximize && (
              <button
                onClick={onToggleMaximize}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
            )}
            {isPanel && (
              <button
                onClick={onClose}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            {!isPanel && (
              <button
                onClick={finishOnboarding}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              >
                {t('assistant.finish')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: isMaximized ? '40px' : '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent'
        }}
      >
        <div style={{ maxWidth: isMaximized ? '1000px' : 'none', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '16px 20px',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #e8621c, #f59e0b)' : 'rgba(30, 41, 59, 0.8)',
                  color: '#f1f5f9',
                  lineHeight: 1.6,
                  fontSize: isMaximized ? '1.05rem' : '0.95rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: msg.role === 'model' ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p style={{ marginBottom: '12px' }} {...props} />,
                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px', marginBottom: '12px', listStyleType: 'disc' }} {...props} />,
                    ol: ({ node, ...props }) => <ol style={{ paddingLeft: '20px', marginBottom: '12px', listStyleType: 'decimal' }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ marginBottom: '6px' }} {...props} />,
                    strong: ({ node, ...props }) => <strong style={{ color: '#fff', fontWeight: 800 }} {...props} />,
                    h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '16px 0 10px', color: '#fff' }} {...props} />,
                    h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '14px 0 8px', color: '#fff' }} {...props} />,
                    h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '12px 0 6px', color: '#fff' }} {...props} />,
                  }}
                >
                  {msg.parts[0].text}
                </ReactMarkdown>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ alignSelf: 'flex-start', padding: '12px 18px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '18px 18px 18px 2px', display: 'flex', gap: '4px' }}
              >
                <div className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                <div className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                <div className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
                <style>{`
                  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
                `}</style>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        padding: isMaximized ? '32px 40px' : '24px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: isMaximized ? '#0f172a' : (isPanel ? 'transparent' : 'rgba(30, 41, 59, 0.3)')
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          position: 'relative',
          maxWidth: isMaximized ? '1000px' : 'none',
          margin: '0 auto',
          width: '100%'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('assistant.input_placeholder')}
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '16px 24px',
              color: '#f8fafc',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#e8621c'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#e8621c',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: (isLoading || !input.trim()) ? 0.5 : 1
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Assistant() {
  return <AssistantPanel />;
}
