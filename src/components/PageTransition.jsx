import React, { useState, useEffect, useRef } from 'react';

const TRANSITION_METADATA = {
  'overview-globe': {
    title: 'ORBITAL GRID TELEMETRY',
    sub: 'NASA MERRA-2 // KPTCL SLDC 50.02 Hz',
    icon: '🛰️',
    color: 'var(--cyan)'
  },
  'overview-campus': {
    title: 'DSU HAROHALLI 3D SPATIAL TWIN',
    sub: '140-Acre Campus Substrate & Microgrid Mesh',
    icon: '📍',
    color: 'var(--phosphor)'
  },
  'vision': {
    title: 'METROPOLIS EDGE INFERENCE',
    sub: 'NVIDIA DeepStream 7.0 & TensorRT 10.2 Stream',
    icon: '⚡',
    color: '#ff5500'
  },
  'simulator': {
    title: 'FINITE DECARBONIZATION SANDBOX',
    sub: 'Predictive Mathematical Carbon ROI Solver',
    icon: '⚙️',
    color: 'var(--emerald)'
  },
  'playbook': {
    title: 'NVIDIA NIM CLIMATE PLAYBOOK',
    sub: 'Autonomous ISO 14064 Carbon Audit Synthesis',
    icon: '🤖',
    color: 'var(--phosphor)'
  },
  'research': {
    title: 'EMPIRICAL SCIENTIFIC DOSSIER',
    sub: '2020–2024 CEA v20.0 & IISc Ground Truth',
    icon: '📊',
    color: 'var(--cyan)'
  }
};

export default function PageTransition({ pageKey, children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevKeyRef = useRef(pageKey);

  useEffect(() => {
    if (prevKeyRef.current !== pageKey) {
      prevKeyRef.current = pageKey;
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 480);

      return () => clearTimeout(timer);
    }
  }, [pageKey]);

  const currentMeta = TRANSITION_METADATA[pageKey] || {
    title: 'TELEMETRY SUBSYSTEM SYNC',
    sub: 'OmniCarbon Real-Time Stream',
    icon: 'Ω',
    color: 'var(--phosphor)'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Dynamic Animated Content Container */}
      <div
        key={pageKey}
        className="quantum-page-content"
        style={{
          width: '100%',
          height: '100%',
          animation: 'quantumContentIn 0.36s cubic-bezier(0.16, 1, 0.3, 1) both'
        }}
      >
        {children}
      </div>

      {/* Quantum Laser Sweep Line */}
      {isTransitioning && (
        <div
          className="quantum-laser-sweep"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, transparent 0%, ${currentMeta.color} 20%, #ffffff 50%, ${currentMeta.color} 80%, transparent 100%)`,
            boxShadow: `0 0 24px ${currentMeta.color}, 0 0 48px #ffffffaa`,
            pointerEvents: 'none',
            zIndex: 998,
            animation: 'pageLaserSweep 0.46s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        />
      )}

      {/* High-Tech Ephemeral Shutter Badge */}
      {isTransitioning && (
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 999,
            animation: 'pageHudBadge 0.46s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(6, 8, 14, 0.94)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1.5px solid ${currentMeta.color}`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px ${currentMeta.color}44`
          }}>
            <span style={{ fontSize: '13px' }}>{currentMeta.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                color: currentMeta.color,
                textTransform: 'uppercase'
              }}>
                {currentMeta.title}
              </span>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                letterSpacing: '0.02em'
              }}>
                {currentMeta.sub}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
