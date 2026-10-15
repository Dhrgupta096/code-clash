import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Volume2, ShieldCheck, ArrowRight, Zap, Globe, Cpu } from 'lucide-react';
import ShinyText from './reactbits/ShinyText';
import Magnet from './reactbits/Magnet';

const BOOT_LOGS = [
  'Establishing secure telemetry link to Karnataka SLDC (50.02 Hz)...',
  'Ingesting Central Electricity Authority Database v20.0 (0.716 kg CO₂/kWh)...',
  'Reconstructing DSU Harohalli 140-acre spatial mesh from pano.xml...',
  'Initializing NVIDIA Jetson AGX Orin DeepStream 7.0 inference pipeline...',
  'Calibrating finite element microgrid diurnal solver & peak-shaving matrix...',
  'All telemetry subsystems online // Certified ready for SRE evaluation.'
];

export default function EdolusEntryIntro({ onEnter, soundEnabled, onToggleSound }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const [ready, setReady] = useState(false);

  // Progressive system bootloader simulation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds smooth load

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
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#040508',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden',
      opacity: isEntering ? 0 : 1,
      transform: isEntering ? 'scale(1.05)' : 'scale(1)',
      filter: isEntering ? 'blur(12px)' : 'none',
      transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Background Animated Subtle Starfield & Spatial Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 45%, rgba(56, 189, 248, 0.08) 0%, rgba(212, 255, 0, 0.04) 40%, transparent 75%)',
        pointerEvents: 'none'
      }} />

      {/* Cyber Grid Lines (edolus.com inspired) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none'
      }} />

      {/* Central Content Box */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '680px',
        width: '100%'
      }}>
        {/* Monogram Symbol with Breathing Energy Aura */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div style={{
            position: 'absolute',
            inset: '-18px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 255, 0, 0.35) 0%, transparent 70%)',
            animation: 'smoothPulse 3s infinite ease-in-out',
            pointerEvents: 'none'
          }} />
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #d4ff00 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#05070a',
            fontSize: '32px',
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 0 32px rgba(212, 255, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)'
          }}>
            Ω
          </div>
        </div>

        {/* Title & Organization Subtitle with ShinyText */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShinyText
            text="OMNICARBON"
            color="#ffffff"
            shineColor="#d4ff00"
            speed={2.5}
            shineWidth={60}
            style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.03em', fontFamily: 'var(--font-ui)' }}
          />
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: 'var(--phosphor)',
            background: 'rgba(212, 255, 0, 0.12)',
            border: '1px solid var(--border-active)',
            padding: '3px 8px',
            borderRadius: '999px',
            letterSpacing: '0.06em'
          }}>
            DSU // SRE
          </span>
        </div>

        <p style={{
          fontSize: '13.5px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '28px',
          maxWidth: '540px'
        }}>
          Autonomous Climate Spatial Digital Twin & Microgrid Reliability Orchestrator for <strong style={{ color: 'var(--text-pure)' }}>Dayananda Sagar University</strong> Harohalli Campus.
        </p>

        {/* Interactive Progress Bar Deck */}
        <div style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '18px 22px',
          backdropFilter: 'blur(20px)',
          marginBottom: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Progress Percent & Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="swiss-label" style={{ color: ready ? 'var(--emerald)' : 'var(--cyan)' }}>
              {ready ? '[SYSTEM CALIBRATION COMPLETE]' : '[SYSTEM BOOTLOADER SEQUENCE]'}
            </span>
            <span className="mono-nums" style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-pure)' }}>
              {progress}%
            </span>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '12px',
            position: 'relative'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--cyan) 0%, var(--phosphor) 100%)',
              borderRadius: '999px',
              boxShadow: '0 0 16px var(--phosphor)',
              transition: 'width 0.1s linear'
            }} />
          </div>

          {/* Dynamic Console Ticker */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'left',
            minHeight: '22px'
          }}>
            <span className="pulse-dot cyan" style={{ flexShrink: 0 }} />
            <span style={{ color: ready ? 'var(--emerald)' : 'var(--text-secondary)' }}>
              {BOOT_LOGS[logIndex]}
            </span>
          </div>
        </div>

        {/* Action Button: Edolus-Style High-Impact Entry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Magnet padding={50} magnetStrength={3} maxOffset={8}>
            <button
              onClick={handleStart}
              style={{
                padding: '12px 32px',
                borderRadius: '999px',
                background: ready ? 'var(--phosphor)' : 'rgba(212, 255, 0, 0.2)',
                color: ready ? '#05070a' : 'var(--phosphor)',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: ready ? '0 0 28px rgba(212, 255, 0, 0.45)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                outline: 'none',
                letterSpacing: '0.04em'
              }}
            >
              <span>{ready ? 'ENTER OMNICARBON' : 'INITIALIZING...'}</span>
              <ArrowRight size={15} />
            </button>
          </Magnet>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={onToggleSound}
            style={{
              padding: '11px 16px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: soundEnabled ? 'var(--phosphor)' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
            title="Audio feedback recommended for full spatial immersion"
          >
            <Volume2 size={13} />
            <span>{soundEnabled ? 'AUDIO SYNTH: ON' : 'AUDIO: OFF'}</span>
          </button>
        </div>

        {/* Sub-Footer Credentials */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '36px',
          fontSize: '10px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>CEA v20.0 (0.716 kg/kWh)</span>
          <span>•</span>
          <span>KPTCL 50.02 Hz</span>
          <span>•</span>
          <span>NVIDIA METROPOLIS</span>
          <span>•</span>
          <span>THREE.JS WEBGL</span>
        </div>
      </div>
    </div>
  );
}
