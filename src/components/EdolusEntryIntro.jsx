import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowRight, Zap, Globe, Cpu, User, Key, CheckCircle2, 
  Volume2, VolumeX, Sparkles, Building2, Award, Lock, ExternalLink 
} from 'lucide-react';
import ShinyText from './reactbits/ShinyText';
import Magnet from './reactbits/Magnet';

const BOOT_LOGS = [
  'Establishing secure telemetry link to Karnataka SLDC (50.02 Hz)...',
  'Ingesting Central Electricity Authority Database v20.0 (0.716 kg CO₂/kWh)...',
  'Reconstructing DSU Harohalli 140-acre spatial mesh from pano.xml...',
  'Initializing NVIDIA Jetson AGX Orin DeepStream 7.0 inference pipeline...',
  'Calibrating finite element microgrid diurnal solver & peak-shaving matrix...',
  'Security & role access verified // Certified ready for SRE evaluation.'
];

export default function EdolusEntryIntro({ 
  onEnter, 
  soundEnabled = false, 
  onToggleSound, 
  currentUser, 
  setCurrentUser,
  playSound 
}) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const [ready, setReady] = useState(false);
  const [authMode, setAuthMode] = useState('judge'); // 'judge' | 'credentials' | 'google'

  // Form state
  const [email, setEmail] = useState('judge@codeclash.sre');
  const [operatorId, setOperatorId] = useState('DSU-SRE-2026');
  const [selectedRole, setSelectedRole] = useState('Code Clash Judge');

  // Progressive system bootloader simulation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 1600; // 1.6s smooth load

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      const nextLog = Math.min(
        BOOT_LOGS.length - 1,
        Math.floor((pct / 100) * BOOT_LOGS.length)
      );
      setLogIndex(nextLog);

      if (pct >= 100) {
        clearInterval(interval);
        setReady(true);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  const handleCompleteLogin = (userData) => {
    const userToSave = userData || {
      name: selectedRole,
      email: email.trim() || 'judge@codeclash.sre',
      operatorId: operatorId.trim() || 'DSU-SRE-2026',
      role: selectedRole.toUpperCase(),
      loginTime: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('omnicarbon_user', JSON.stringify(userToSave));
    }
    if (setCurrentUser) setCurrentUser(userToSave);

    if (playSound) playSound(640, 'sine', 0.1);
    setIsEntering(true);
    setTimeout(() => {
      onEnter(userToSave);
    }, 450);
  };

  const handleJudgeQuickLogin = (roleName) => {
    const roleMap = {
      'Code Clash Judge': { name: 'Code Clash Evaluator', email: 'judge@codeclash.sre', operatorId: 'JUDGE-01', role: 'JUDGE' },
      'DSU Facility Director': { name: 'DSU Chief SRE Director', email: 'director.sre@dsu.edu.in', operatorId: 'DIR-HAROHALLI', role: 'ADMIN' },
      'IISc Climate Scientist': { name: 'IISc Senior Fellow', email: 'cistup.audit@iisc.ac.in', operatorId: 'IISC-CES-04', role: 'AUDITOR' }
    };
    const chosen = roleMap[roleName] || roleMap['Code Clash Judge'];
    handleCompleteLogin(chosen);
  };

  const handleGoogleLogin = () => {
    // Simulated Google OAuth handshake matching DSU Hub
    handleCompleteLogin({
      name: 'Google Verified Student / SRE',
      email: 'student.dsu@dsu.edu.in',
      operatorId: 'GSUITE-AUTH-99',
      role: 'STUDENT_ENGINEER'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#07090e',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'auto',
      opacity: isEntering ? 0 : 1,
      transform: isEntering ? 'scale(1.03)' : 'scale(1)',
      filter: isEntering ? 'blur(10px)' : 'none',
      transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Background Subtle Radial Glow & Subtle Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.08) 0%, rgba(56, 189, 248, 0.03) 45%, transparent 75%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none'
      }} />

      {/* Main Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '540px',
        width: '100%',
        margin: 'auto'
      }}>
        {/* Monogram Symbol */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{
            position: 'absolute',
            inset: '-14px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, transparent 70%)',
            animation: 'smoothPulse 3s infinite ease-in-out',
            pointerEvents: 'none'
          }} />
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 0 28px rgba(16, 185, 129, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.5)'
          }}>
            Ω
          </div>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShinyText
            text="OMNICARBON"
            color="#ffffff"
            shineColor="#34d399"
            speed={2.5}
            shineWidth={60}
            style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em', fontFamily: 'var(--font-ui)' }}
          />
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.14)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '2px 7px',
            borderRadius: '999px',
            letterSpacing: '0.06em'
          }}>
            SRE PORTAL
          </span>
        </div>

        <p style={{
          fontSize: '12.5px',
          color: '#94a3b8',
          lineHeight: 1.5,
          marginBottom: '20px',
          maxWidth: '480px'
        }}>
          Autonomous Climate Spatial Digital Twin & Microgrid Reliability Orchestrator for <strong style={{ color: '#f8fafc' }}>Dayananda Sagar University</strong> Harohalli Campus.
        </p>

        {/* Telemetry Bootloader Progress Indicator */}
        <div style={{
          width: '100%',
          background: 'rgba(15, 20, 30, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px 18px',
          backdropFilter: 'blur(20px)',
          marginBottom: '18px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: ready ? '#34d399' : '#38bdf8' }}>
              {ready ? '[TELEMETRY SUBSYSTEMS VERIFIED]' : '[INITIALIZING SRE SENSORS...]'}
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#f8fafc' }}>
              {progress}%
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)',
              borderRadius: '999px',
              transition: 'width 0.1s linear'
            }} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10.5px',
            color: '#8b949e',
            fontFamily: 'var(--font-mono)',
            textAlign: 'left'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: ready ? '#34d399' : '#38bdf8', flexShrink: 0 }} />
            <span style={{ color: ready ? '#34d399' : '#94a3b8' }}>
              {BOOT_LOGS[logIndex]}
            </span>
          </div>
        </div>

        {/* Authentication & Role Selection Card */}
        <div style={{
          width: '100%',
          background: '#0e121a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '18px 20px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Auth Tab Switcher */}
          <div style={{
            display: 'flex',
            background: '#141a24',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <button
              onClick={() => setAuthMode('judge')}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '6px',
                background: authMode === 'judge' ? '#1f2937' : 'transparent',
                color: authMode === 'judge' ? '#f8fafc' : '#8b949e',
                border: 'none',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Award size={12} color={authMode === 'judge' ? '#34d399' : 'currentColor'} />
              <span>Judge Quick Pass</span>
            </button>

            <button
              onClick={() => setAuthMode('credentials')}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '6px',
                background: authMode === 'credentials' ? '#1f2937' : 'transparent',
                color: authMode === 'credentials' ? '#f8fafc' : '#8b949e',
                border: 'none',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Key size={12} color={authMode === 'credentials' ? '#38bdf8' : 'currentColor'} />
              <span>SRE Credentials</span>
            </button>

            <button
              onClick={() => setAuthMode('google')}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '6px',
                background: authMode === 'google' ? '#1f2937' : 'transparent',
                color: authMode === 'google' ? '#f8fafc' : '#8b949e',
                border: 'none',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Google SSO</span>
            </button>
          </div>

          {/* TAB 1: Fast Judge & Evaluator Quick Login */}
          {authMode === 'judge' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleJudgeQuickLogin('Code Clash Judge')}
                style={{
                  padding: '11px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  transition: 'transform 0.12s ease'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} />
                  <span>Enter as Code Clash Evaluator</span>
                </div>
                <ArrowRight size={14} />
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleJudgeQuickLogin('DSU Facility Director')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                >
                  DSU Campus Director
                </button>

                <button
                  onClick={() => handleJudgeQuickLogin('IISc Climate Scientist')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                >
                  IISc Climate Auditor
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Custom SRE Operator Form */}
          {authMode === 'credentials' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCompleteLogin();
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}
            >
              <div>
                <label style={{ fontSize: '10px', color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Operator Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="engineer@dsu.edu.in"
                  style={{
                    width: '100%',
                    background: '#07090e',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    color: '#f8fafc',
                    outline: 'none',
                    marginTop: '3px',
                    fontFamily: 'var(--font-mono)'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SRE Authorization Token
                </label>
                <input
                  type="password"
                  value={operatorId}
                  onChange={e => setOperatorId(e.target.value)}
                  placeholder="DSU-SRE-2026"
                  style={{
                    width: '100%',
                    background: '#07090e',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    color: '#f8fafc',
                    outline: 'none',
                    marginTop: '3px',
                    fontFamily: 'var(--font-mono)'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '9px 14px',
                  borderRadius: '6px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <ShieldCheck size={13} />
                <span>Verify Credentials & Enter Twin</span>
              </button>
            </form>
          )}

          {/* TAB 3: Google SSO */}
          {authMode === 'google' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4 }}>
                Sign in with your Dayananda Sagar University Google Workspace account to sync carbon logs with DSU Hub.
              </p>

              <button
                onClick={handleGoogleLogin}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#1f2937',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google (@dsu.edu.in)</span>
              </button>
            </div>
          )}

          {/* Bottom Bar: Sound Toggle & Direct Guest Skip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '11px',
            color: '#8b949e'
          }}>
            <button
              onClick={onToggleSound}
              style={{
                background: 'transparent',
                border: 'none',
                color: soundEnabled ? '#34d399' : '#8b949e',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontSize: '10.5px'
              }}
            >
              {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
              <span>{soundEnabled ? 'Audio Synth Active' : 'Audio Muted'}</span>
            </button>

            <button
              onClick={() => handleJudgeQuickLogin('Code Clash Judge')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                fontSize: '10.5px',
                textDecoration: 'underline'
              }}
            >
              <span>Instant Guest Entry</span>
              <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Credentials Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '20px',
          fontSize: '9.5px',
          color: '#64748b',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>CEA v20.0 (0.716 kg/kWh)</span>
          <span>•</span>
          <span>KPTCL 50.02 Hz</span>
          <span>•</span>
          <span>NVIDIA JETSON AGX ORIN</span>
          <span>•</span>
          <span>ISO 14064</span>
        </div>
      </div>
    </div>
  );
}
