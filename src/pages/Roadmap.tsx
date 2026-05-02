import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { AssistantPanel } from './Assistant';

export default function Roadmap() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const pathHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div style={{
      height: '100vh',
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="bg-dots" />
      <div className="orb orb-saffron" style={{ width: 600, height: 600, top: '-10%', right: '-5%', opacity: 0.1 }} />
      <div className="orb orb-blue" style={{ width: 500, height: 500, bottom: '-5%', left: '-5%', opacity: 0.1 }} />

      <div className="container" style={{ paddingTop: '100px', flex: 1, display: 'flex', gap: '24px', zIndex: 1, position: 'relative', minHeight: 0 }}>
        
        {/* Animated Path Line - Now outside the scroller so it stays visible */}
        <div style={{ position: 'absolute', top: '200px', bottom: '200px', left: '60px', width: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', zIndex: 0 }}>
          <motion.div style={{ width: '100%', height: pathHeight, background: 'var(--gradient-saffron)', borderRadius: '2px', transformOrigin: 'top' }} />
        </div>

        {/* Main Content Area */}
        <div ref={scrollRef} className="no-scrollbar" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto', paddingRight: '12px', position: 'relative' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginLeft: '80px' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome to Your Voting Journey
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
              We noticed you're new to politics. Don't worry, everyone starts somewhere! We are building a personalized roadmap to help you understand the political landscape, learn about your rights, and make an informed decision.
            </p>
          </motion.div>

          {/* Step 1: Why Vote? */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '70vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              🗳️
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a', // Solid dark background to cover the line
                border: '2px solid #ff9933',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(255, 153, 51, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                1
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Why should you vote?
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', marginBottom: '32px' }}>
                <strong style={{ color: '#f8fafc', fontWeight: 600 }}>India is the largest democracy in the world.</strong> The right to vote and, more importantly, the exercise of franchise by eligible citizens is at the heart of every democracy. 
              </p>
              
              <div style={{ 
                padding: '32px 40px', 
                background: 'rgba(59, 130, 246, 0.04)', 
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0 20px 20px 0',
                maxWidth: '900px',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', top: 10, left: 10, fontSize: '4rem', opacity: 0.1, color: '#3b82f6', fontFamily: 'serif', lineHeight: 1 }}>"</span>
                <p style={{ 
                  fontStyle: 'italic',
                  color: '#94a3b8',
                  fontSize: '1.15rem',
                  lineHeight: 1.8,
                  margin: 0,
                  position: 'relative',
                  zIndex: 1
                }}>
                  We, the people, through this exercise of our right to vote have the ultimate power to shape the destiny of country by electing our representatives who run the Government and take decisions for the growth, development and benefit of all the citizens.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 2: Who can vote? */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px', 
              display: 'flex',
              flexDirection: 'column',
              minHeight: '70vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              🇮🇳
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a', // Solid dark background
                border: '2px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                2
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Who can vote?
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', marginBottom: '32px' }}>
                All citizens of India who are <strong style={{ color: '#f8fafc', fontWeight: 600 }}>18 years of age</strong> as on 1st January of the year for which the electoral roll is prepared are entitled to be registered as a voter in the constituency where he or she ordinarily resides.
              </p>
              
              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(239, 68, 68, 0.05)', 
                borderLeft: '4px solid #ef4444',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px',
                display: 'flex',
                gap: '16px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                <p style={{ 
                  color: '#94a3b8',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  Only persons who are of unsound mind and have been declared so by a competent court or disqualified due to ‘Corrupt Practices’ or offences relating to elections are <strong style={{ color: '#cbd5e1' }}>not entitled</strong> to be registered in the electoral rolls.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 3: What is an electoral roll? */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px', 
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              📜
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a', // Solid dark background
                border: '2px solid #ff9933',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(255, 153, 51, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                3
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                What is an electoral roll?
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                An electoral roll is a list of all eligible citizens who are entitled to cast their vote in an election. 
              </p>

              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '900px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📍</div>
                  <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Polling Booths</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                    Rolls are prepared Assembly Constituency wise and subdivided into parts corresponding with polling booths. No voter should ordinarily travel more than <strong style={{ color: '#cbd5e1' }}>2 kms</strong>.
                  </p>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>👥</div>
                  <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Crowd Control</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                    The Election Commission generally sets a maximum of <strong style={{ color: '#cbd5e1' }}>1200 electors</strong> per booth to ensure a smooth voting experience.
                  </p>
                </div>
              </div>
              
              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(59, 130, 246, 0.05)', 
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px',
                marginTop: '12px'
              }}>
                <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>The Golden Rule</h4>
                <p style={{ 
                  color: '#cbd5e1',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  To exercise your franchise, your name <strong style={{ color: '#60a5fa' }}>must be in the electoral roll</strong>. Without it, you will not be allowed to vote, even if you are eligible. Therefore, it is your duty to check if you are registered!
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 4: How to register? */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '120vh', 
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              📝
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                4
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                How to register?
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: 1.8, maxWidth: '900px' }}>
                Registration isn't just a one-time event; the Election Commission ensures the list stays updated through two main processes:
                <ul style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li><strong style={{ color: '#f8fafc' }}>Intensive Revision:</strong> Happens once in 5 years. Officials go door-to-door (enumeration) to register every eligible resident.</li>
                  <li><strong style={{ color: '#f8fafc' }}>Summary Revision:</strong> Happens every year. This is your chance to register if you were left out or if you've recently turned 18.</li>
                </ul>
              </div>

              {/* Forms Guide Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', maxWidth: '850px' }}>
                {[
                  { form: 'Form 6', use: 'New registration or shifting to a new constituency.' },
                  { form: 'Form 7', use: 'Objecting to a name or requesting a deletion.' },
                  { form: 'Form 8', use: 'Correcting existing details (name, age, sex, etc.).' },
                  { form: 'Form 8A', use: 'Shifting within the same constituency.' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>{item.form}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.use}</div>
                  </div>
                ))}
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(239, 68, 68, 0.04)', 
                borderLeft: '4px solid #ef4444',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px'
              }}>
                <h4 style={{ color: '#ef4444', margin: '0 0 12px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⏳</span> Critical Deadline
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  You must apply <strong style={{ color: '#f8fafc' }}>at least 10 days before</strong> the last date of candidate nominations. This allows for the mandatory 7-day notice period for objections. Apply early to ensure you don't miss out!
                </p>
              </div>

              <div style={{ 
                padding: '20px 24px', 
                background: 'rgba(255, 255, 255, 0.03)', 
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: '0.95rem',
                color: '#64748b',
                maxWidth: '900px'
              }}>
                <strong>Important:</strong> You can only be registered in <strong style={{ color: '#94a3b8' }}>one place</strong>. Registering in multiple locations is a legal offence. If you move, use Form 6 to register at your new home and provide your previous address.
              </div>
            </div>


          </motion.div>

          {/* Step 5: Check Your Name & Polling Station */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              🔍
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #ff9933',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(255, 153, 51, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                5
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Where to find your name?
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                As an elector, you should <strong style={{ color: '#f8fafc' }}>immediately check</strong> whether your name has been included in the electoral roll of your constituency.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>💻</div>
                  <div>
                    <h4 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '1.1rem' }}>Official Websites</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>Electoral rolls for all major cities and constituencies are now displayed on official government portals for easy access.</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 153, 51, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🏛️</div>
                  <div>
                    <h4 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '1.1rem' }}>Registration Officer</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>You can also find this information by visiting the Electoral Registration Officer (ERO) of your local area physically.</p>
                  </div>
                </div>
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(16, 185, 129, 0.05)', 
                borderLeft: '4px solid #10b981',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px'
              }}>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: '#f8fafc' }}>Pro-tip:</strong> Finding your name on the roll also helps you identify your specific <strong style={{ color: '#10b981' }}>Polling Station</strong>, so you know exactly where to go on election day!
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 6: Mandatory Voter ID (EPIC) */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              🆔
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                6
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Identification is Mandatory
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                The Election Commission of India has made <strong style={{ color: '#f8fafc' }}>voter identification mandatory</strong> at the time of poll. You cannot vote without proving your identity.
              </p>

              <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '32px', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.1)', maxWidth: '900px' }}>
                <h4 style={{ color: '#60a5fa', margin: '0 0 16px 0', fontSize: '1.2rem' }}>Accepted Documents:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }} />
                    <span style={{ color: '#cbd5e1', fontSize: '1.1rem' }}><strong style={{ color: '#f8fafc' }}>EPIC Card</strong> (Electors Photo Identity Card)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }} />
                    <span style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>Any other <strong style={{ color: '#f8fafc' }}>documentary proof</strong> as prescribed by the Commission.</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(255, 153, 51, 0.05)', 
                borderLeft: '4px solid #ff9933',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px'
              }}>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: '#cbd5e1' }}>Note:</strong> While the EPIC card is the primary document, the Commission often allows alternatives like Aadhar, PAN card, or Passport if you haven't received your EPIC yet.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 7: The Final Verification */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              ✅
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #ff9933',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(255, 153, 51, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                7
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                The Final Verification
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ 
                padding: '32px', 
                background: 'rgba(239, 68, 68, 0.05)', 
                border: '1px solid rgba(239, 68, 68, 0.1)',
                borderRadius: '20px',
                maxWidth: '900px'
              }}>
                <h4 style={{ color: '#ef4444', margin: '0 0 12px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📢</span> Important Myth-Buster
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: 1.8, margin: 0 }}>
                  Mere possession of an EPIC card <strong style={{ color: '#f8fafc' }}>does not guarantee</strong> you the right to vote. 
                </p>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: 1.7, maxWidth: '900px', margin: 0 }}>
                You are only entitled to vote when you meet <strong style={{ color: '#cbd5e1' }}>both</strong> of these conditions:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <div style={{ fontSize: '1.5rem' }}>📋</div>
                  <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 500 }}>Your name appears in the Electoral Roll.</div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <div style={{ fontSize: '1.5rem' }}>🆔</div>
                  <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 500 }}>You possess a valid ID (EPIC or others).</div>
                </div>
              </div>

              <p style={{ color: '#64748b', fontSize: '1rem', fontStyle: 'italic', maxWidth: '900px' }}>
                As a conscientious citizen, knowing these rules is the first step toward a successful election day.
              </p>
            </div>


          </motion.div>

          {/* Step 8: Know Your Candidates */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              ⚖️
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                8
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Know Your Candidates
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                Thanks to a landmark Supreme Court judgment, every candidate must now file a mandatory <strong style={{ color: '#f8fafc' }}>Affidavit</strong> disclosing critical personal details.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '900px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>📁</div>
                  <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Criminal History</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Full disclosure of any past criminal antecedents.</p>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>💰</div>
                  <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Financials</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Assets and liabilities of self, spouse, and dependents.</p>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>🎓</div>
                  <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Education</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Verified details of educational background.</p>
                </div>
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(99, 102, 241, 0.05)', 
                borderLeft: '4px solid #6366f1',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px'
              }}>
                <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Your Right to Know</h4>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  You have a <strong style={{ color: '#6366f1' }}>legal right</strong> to access this information. Returning Officers must display these affidavits on notice boards and provide copies to the public free of cost.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 9: Electoral Integrity (Do's & Don'ts) */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '120vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              🛡️
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #ff9933',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(255, 153, 51, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                9
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Electoral Integrity
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                Protect the sanctity of your vote. As polling day approaches, you must be aware of what the law defines as <strong style={{ color: '#f8fafc' }}>Corrupt Practices</strong> or electoral offences.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '900px' }}>
                {[
                  { icon: '🚫💰', title: 'No Bribery', desc: 'Offering or accepting money to influence a vote is a serious offence.' },
                  { icon: '🚫🎁', title: 'No Inducements', desc: 'Accepting liquor, feasts, or gifts in exchange for your vote is prohibited.' },
                  { icon: '🚫🗣️', title: 'Identity-based Appeals', desc: 'Appealing for votes based on religion, caste, community, or place of birth is illegal.' },
                  { icon: '🚫⚠️', title: 'No Coercion', desc: 'Threatening electors with ex-communication or social boycott is a punishable crime.' },
                  { icon: '🚫🚗', title: 'Free Transport', desc: 'Candidates cannot offer free conveyance to take you to or from the polling booth.' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                    <div>
                      <h4 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(239, 68, 68, 0.05)', 
                borderLeft: '4px solid #ef4444',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px'
              }}>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: '#ef4444' }}>Warning:</strong> These practices are not just unethical—they are <strong style={{ color: '#f8fafc' }}>punishable offences</strong> under Indian law. Report any such activity to the Election Commission immediately.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 10: The Process of Voting */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '150vh', 
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              🗳️
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                10
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Your Day at the Polls
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              <div style={{ background: 'rgba(59, 130, 246, 0.03)', border: '1px dashed rgba(59, 130, 246, 0.2)', padding: '24px', borderRadius: '16px', maxWidth: '900px' }}>
                <h4 style={{ color: '#f8fafc', margin: '0 0 12px 0', fontSize: '1.1rem' }}>Arriving & Queues</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                  Entry is regulated by queues. <strong style={{ color: '#cbd5e1' }}>Priority</strong> is given to physically handicapped voters and women with infants. Follow the instructions of the queue enforcers.
                </p>
              </div>

              {/* Voting Stages Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', position: 'relative' }}>
                
                {[
                  { stage: 'Stage 1', icon: '👤', title: 'Identification', desc: 'The First Polling Officer checks your name in the electoral roll and verifies your ID document.' },
                  { stage: 'Stage 2', icon: '☝️', title: 'Ink & Register', desc: 'The Second Polling Officer marks your finger with indelible ink and obtains your signature in the register.' },
                  { stage: 'Stage 3', icon: '🎫', title: 'Ballot Ready', desc: 'The Third Polling Officer takes your voter slip and activates the Balloting Unit for you.' },
                  { stage: 'Stage 4', icon: '🔵', title: 'Casting the Vote', desc: 'Inside the compartment, press the blue button for your candidate. Wait for the red lamp and beep sound.' }
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', zIndex: 2 }}>{s.icon}</div>
                      {i < 3 && <div style={{ flex: 1, width: '2px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: '24px' }}>
                      <div style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{s.stage}</div>
                      <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.2rem' }}>{s.title}</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(239, 68, 68, 0.05)', 
                borderLeft: '4px solid #ef4444',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px'
              }}>
                <h4 style={{ color: '#ef4444', margin: '0 0 8px 0', fontSize: '1.1rem' }}>The Law of Secrecy</h4>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  Voting secrecy is mandatory. <strong style={{ color: '#f8fafc' }}>Photography is strictly prohibited</strong>. Do not disclose your choice to anyone inside or outside the booth. Violations are punishable under Section 128 of the RPA, 1951.
                </p>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.95rem', fontStyle: 'italic', maxWidth: '900px' }}>
                Note: No official is allowed inside the voting compartment with you. If you need assistance due to physical infirmity, you may bring a companion of 18+ years.
              </p>
            </div>


          </motion.div>

          {/* Step 11: Your Right to Decline */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              ✋
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #ff9933',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(255, 153, 51, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                11
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Your Right to Decline
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                Did you know? The law enables you to <strong style={{ color: '#f8fafc' }}>decline casting your vote</strong> even at the very last stage.
              </p>

              <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '32px', borderRadius: '20px', border: '1px solid rgba(255, 153, 51, 0.1)', maxWidth: '900px' }}>
                <h4 style={{ color: '#ff9933', margin: '0 0 16px 0', fontSize: '1.2rem' }}>The Process:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 153, 51, 0.2)', color: '#ff9933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0 }}>1</div>
                    <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>Inform the <strong style={{ color: '#f8fafc' }}>Presiding Officer</strong> immediately after receiving your voter slip.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 153, 51, 0.2)', color: '#ff9933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0 }}>2</div>
                    <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>Return the <strong style={{ color: '#f8fafc' }}>voter's slip</strong> to the officer.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 153, 51, 0.2)', color: '#ff9933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0 }}>3</div>
                    <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>Sign against the remark <strong style={{ color: '#f8fafc' }}>"Declined to exercise franchise"</strong> in the Register of Voters.</p>
                  </div>
                </div>
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(59, 130, 246, 0.05)', 
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px'
              }}>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  Once this is recorded, you are free to leave the polling station without proceeding to the voting compartment. Your choice to not vote is also protected by law.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 12: If Your Identity is Challenged */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              ⚖️
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                12
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Identity Challenges
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                A polling agent can challenge your identity if they suspect you aren't the person listed on the rolls. Here is how the law handles it:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '850px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: '#f8fafc', margin: '0 0 12px 0', fontSize: '1.1rem' }}>The Investigation</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                    The Presiding Officer will ask the challenger for evidence and ask you for proof of identity (EPIC, Passport, Ration Card, etc.).
                  </p>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <h4 style={{ color: '#10b981', margin: '0 0 12px 0', fontSize: '1.1rem' }}>Challenge Dismissed</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                    If the challenge is not established, you will be allowed to cast your vote normally.
                  </p>
                </div>
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(239, 68, 68, 0.05)', 
                borderLeft: '4px solid #ef4444',
                borderRadius: '0 16px 16px 0',
                maxWidth: '850px'
              }}>
                <h4 style={{ color: '#ef4444', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Challenge Established</h4>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  If the challenge is proven true, you will be <strong style={{ color: '#f8fafc' }}>debarred from voting</strong> and handed over to the police with a written complaint. Impersonation is a serious crime.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 13: The Tendered Vote */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              📝
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #ff9933',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(255, 153, 51, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                13
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                The Tendered Vote
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                If you arrive at the booth only to be told your vote has <strong style={{ color: '#f8fafc' }}>already been cast</strong>, don't panic. You still have a legal right to vote.
              </p>

              <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '32px', borderRadius: '20px', border: '1px solid rgba(255, 153, 51, 0.1)', maxWidth: '900px' }}>
                <h4 style={{ color: '#ff9933', margin: '0 0 16px 0', fontSize: '1.2rem' }}>Rule 49P: The Tendered Ballot</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                    1. Inform the <strong style={{ color: '#f8fafc' }}>Presiding Officer</strong> immediately.
                  </p>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                    2. You will be issued a physical <strong style={{ color: '#f8fafc' }}>Tendered Ballot Paper</strong> (stamped on the back).
                  </p>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                    3. Mark your choice using the special <strong style={{ color: '#f8fafc' }}>Arrow Cross Mark</strong> rubber stamp.
                  </p>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                    4. Hand it back to the Presiding Officer to be kept in a separate secure cover.
                  </p>
                </div>
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(59, 130, 246, 0.05)', 
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0 16px 16px 0',
                maxWidth: '900px'
              }}>
                <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Important Note</h4>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  In the case of a Tendered Vote, <strong style={{ color: '#3b82f6' }}>you will not use the EVM machine</strong>. Your physical ballot is recorded separately to ensure your genuine vote is counted.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Step 14: Grievance Redressal (Support) */}
          <motion.div 
            initial={{ opacity: 0.3, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginLeft: '80px',
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '24px', 
              padding: '120px 60px 80px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '90vh',
              position: 'relative',
              marginTop: '40px'
            }}
          >
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '18rem', opacity: 0.02, pointerEvents: 'none' }}>
              🆘
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '50%', background: '#0f172a',
                border: '2px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
              }}>
                14
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Grievances & Support
              </h2>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: 1.8, maxWidth: '900px', margin: 0 }}>
                If you have any issues regarding the electoral roll, your EPIC card, or any other matter, the Election Commission has a clear hierarchy of support:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', maxWidth: '850px' }}>
                {[
                  { level: 'State Level', officer: 'Chief Electoral Officer (CEO)' },
                  { level: 'District Level', officer: 'District Election Officer (DEO)' },
                  { level: 'Constituency Level', officer: 'Returning Officer (RO)' },
                  { level: 'Taluka/Tahsil Level', officer: 'Assistant Returning Officer (ARO)' },
                  { level: 'Local/Booth Level', officer: 'Presiding Officer' },
                  { level: 'Group Level', officer: 'Zonal Officer' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <div style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>{item.level}</div>
                    <div style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 500 }}>{item.officer}</div>
                  </div>
                ))}
              </div>

              <div style={{ 
                padding: '24px 32px', 
                background: 'rgba(16, 185, 129, 0.05)', 
                borderLeft: '4px solid #10b981',
                borderRadius: '0 16px 16px 0',
                maxWidth: '850px'
              }}>
                <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Independent Observers</h4>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  During elections, the Commission also appoints <strong style={{ color: '#10b981' }}>Observers</strong>—senior civil service officers from outside your state. They are impartial and specifically there to handle serious grievances.
                </p>
              </div>
            </div>


          </motion.div>

          {/* Spacer for scrolling / End of roadmap */}
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '1px dashed rgba(255,255,255,0.05)', marginTop: '40px', gap: '20px' }}>
             <h3 style={{ color: '#f8fafc', fontSize: '1.5rem', margin: 0 }}>You're all caught up!</h3>
             <p style={{ color: '#64748b', textAlign: 'center', maxWidth: '400px', marginBottom: '10px' }}>
               You now have the fundamental knowledge to start your journey as an informed voter in India's democracy.
             </p>
             <button 
               onClick={() => navigate('/dashboard')}
               className="btn-primary"
               style={{ padding: '16px 48px', fontSize: '1.2rem', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '14px', fontWeight: 600 }}
             >
               Explore Dashboard →
             </button>
          </div>
        </div>

      </div>

      {/* Floating AI Button - identical to Dashboard */}
      {!isAssistantOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAssistantOpen(true)}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: isMobile ? '56px' : '64px',
            height: isMobile ? '56px' : '64px',
            borderRadius: '20px',
            background: 'var(--gradient-saffron)',
            color: 'white',
            fontSize: '1.8rem',
            boxShadow: '0 10px 30px rgba(232, 98, 28, 0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          🤖
        </motion.button>
      )}

      {/* Floating AI Assistant Panel */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div
            key="roadmap-assistant"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: isMobile ? '0' : '32px',
              right: isMobile ? '0' : '32px',
              width: isMobile ? '100%' : '400px',
              height: isMobile ? '100%' : '600px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: isMobile ? '0' : '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10000,
            }}
          >
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid rgba(255,255,255,0.05)', 
              background: 'rgba(255,153,51,0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🤖</span> AI Assistant
              </h3>
              <button
                onClick={() => setIsAssistantOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <AssistantPanel isPanel onClose={() => setIsAssistantOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
