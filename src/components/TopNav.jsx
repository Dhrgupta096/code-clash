import React, { useState, useEffect } from 'react';
import { Globe, Building2, Eye, Sliders, BookOpen, Volume2, VolumeX, Zap, Play, Sparkles, GitBranch, Maximize, User } from 'lucide-react';
import { ApiClient } from '../services/apiClient';

export default function TopNav({
  activeMode,
  setActiveMode,
  viewEngine,
  setViewEngine,
  soundEnabled,
  setSoundEnabled,
  isTourActive,
  onStartJudgeTour,
  onOpenCopilot,
  onOpenPresentation,
  currentUser,
  onOpenLogin
}) {
  const [time, setTime] = useState('');
  const [gridFreq, setGridFreq] = useState('50.02');
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const dateObj = new Date();
      setTime(dateObj.toLocaleTimeString('en-US', { hour12: false }));
      const jitter = (50.00 + (Math.sin(Date.now() / 3000) * 0.025) + ((Math.random() - 0.5) * 0.008)).toFixed(2);
      setGridFreq(prev => (prev === '50.02' ? jitter : prev));
    };

    const timer = setInterval(updateTime, 1000);
    updateTime();

    // Check backend health & telemetry
    const checkBackend = async () => {
      try {
        const health = await ApiClient.checkHealth();
        if (health && health.status === 'ONLINE') {
          setBackendOnline(true);
          const telemetry = await ApiClient.getGridTelemetry();
          if (telemetry?.grid?.frequencyHz) {
            setGridFreq(telemetry.grid.frequencyHz.toFixed(2));
          }
        } else {
          setBackendOnline(false);
        }
      } catch {
        setBackendOnline(false);
      }
    };

    checkBackend();
    const backendTimer = setInterval(checkBackend, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(backendTimer);
    };
  }, []);

  return (
    <header style={{
      height: '52px',
      background: '#0d1117',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      zIndex: 100,
      flexShrink: 0
    }}>
      {/* Left: Git-style Breadcrumb & Twin Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '5px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '12px'
          }}>
            Ω
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ color: '#8b949e' }}>dsu</span>
            <span style={{ color: '#484f58' }}>/</span>
            <span style={{ color: '#f0f6fc', fontWeight: 700 }}>omnicarbon</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            padding: '2px 7px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#8b949e'
          }}>
            <GitBranch size={10} />
            <span>main</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

        {/* 3D Twin View Switcher (Globe vs Campus) */}
        {activeMode === 'overview' && (
          <div style={{
            display: 'flex',
            background: '#161b22',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '2px',
            gap: '2px'
          }}>
            <button
              onClick={() => setViewEngine('globe')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: viewEngine === 'globe' ? '#21262d' : 'transparent',
                color: viewEngine === 'globe' ? '#f0f6fc' : '#8b949e',
                border: 'none',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Globe size={11} color={viewEngine === 'globe' ? '#38bdf8' : 'currentColor'} />
              <span>Globe</span>
            </button>

            <button
              onClick={() => setViewEngine('campus')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: viewEngine === 'campus' ? '#21262d' : 'transparent',
                color: viewEngine === 'campus' ? '#f0f6fc' : '#8b949e',
                border: 'none',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={11} color={viewEngine === 'campus' ? '#3fb950' : 'currentColor'} />
              <span>Campus Twin</span>
            </button>
          </div>
        )}
      </div>

      {/* Center: Clean Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        background: '#161b22',
        padding: '2px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {[
          { id: 'overview', label: 'Digital Twin', icon: Globe },
          { id: 'vision', label: 'Metropolis Vision', icon: Eye },
          { id: 'simulator', label: 'Sandbox', icon: Sliders },
          { id: 'research', label: 'Audit & Science', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              style={{
                padding: '5px 13px',
                borderRadius: '6px',
                background: isActive ? '#21262d' : 'transparent',
                color: isActive ? '#f0f6fc' : '#8b949e',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: isActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={12} color={isActive ? '#3fb950' : '#8b949e'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Telemetry & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Real-time Grid Frequency */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#e6edf3'
        }} title="Karnataka SLDC Grid Frequency">
          <Zap size={11} color="#38bdf8" />
          <span>{gridFreq} Hz</span>
        </div>

        {/* Backend Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: backendOnline ? 'rgba(35, 134, 54, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${backendOnline ? 'rgba(46, 160, 67, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '10px',
          fontWeight: 600,
          color: backendOnline ? '#3fb950' : '#8b949e'
        }} title={backendOnline ? "Bun/Node SRE Backend Connected on Port 3001" : "Static Client Mode"}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: backendOnline ? '#3fb950' : '#6e7681',
            boxShadow: backendOnline ? '0 0 6px #3fb950' : 'none'
          }} />
          <span>{backendOnline ? 'API :3001' : 'STATIC'}</span>
        </div>

        {/* SRE Operator / Login Profile Pill */}
        <button
          onClick={onOpenLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          title="Click to Switch SRE Operator / Open Login Interface"
        >
          <User size={11} color="#34d399" />
          <span>{currentUser?.name ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
        </button>

        {/* Native Fullscreen Mission Control Toggle */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#8b949e',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease'
          }}
          title="Toggle Fullscreen Mission Control Mode (F11)"
          onMouseEnter={e => { e.currentTarget.style.color = '#f0f6fc'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
        >
          <Maximize size={12} />
        </button>

        {/* Tour Demo Button */}
        <button
          onClick={onStartJudgeTour}
          style={{
            padding: '4px 11px',
            borderRadius: '6px',
            background: isTourActive ? '#10b981' : 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: isTourActive ? '#ffffff' : '#f0f6fc',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Run 1-Click Code Clash Judge Demo Tour"
          onMouseEnter={e => { if (!isTourActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
          onMouseLeave={e => { if (!isTourActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
        >
          <Play size={10} fill="currentColor" />
          <span>{isTourActive ? 'Touring...' : 'Judge Tour'}</span>
        </button>

        {/* Smooth AI Copilot Action Button */}
        <button
          onClick={onOpenCopilot}
          style={{
            padding: '4px 11px',
            borderRadius: '6px',
            background: 'rgba(16, 185, 129, 0.16)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            color: '#34d399',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.15)',
            transition: 'all 0.15s ease'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.24)'; e.currentTarget.style.borderColor = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.16)'; e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.45)'; }}
          title="Open OmniAgent Decarbonization AI Copilot (Cmd+K)"
        >
          <Sparkles size={11} color="#34d399" />
          <span style={{ color: '#f8fafc' }}>AI Copilot</span>
          <span style={{ fontSize: '9px', opacity: 0.9, padding: '1px 4px', background: 'rgba(0, 0, 0, 0.35)', color: '#34d399', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>⌘K</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            color: soundEnabled ? '#3fb950' : '#6e7681',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 7px',
            transition: 'all 0.15s ease'
          }}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
        </button>
      </div>
    </header>
  );
}
