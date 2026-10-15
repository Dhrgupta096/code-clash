import React, { useState, useEffect, useRef } from 'react';

const TRANSITION_METADATA = {
  'overview-globe': {
    title: 'ORBITAL GRID TELEMETRY',
    sub: 'NASA MERRA-2 // KPTCL SLDC 50.02 Hz',
    icon: '🛰️',
    color: 'var(--cyan)',
    styleType: 'globe'
  },
  'overview-campus': {
    title: 'DSU HAROHALLI 3D SPATIAL TWIN',
    sub: '140-Acre Campus Substrate & Microgrid Mesh',
    icon: '📍',
    color: 'var(--phosphor)',
    styleType: 'campus'
  },
  'vision': {
    title: 'METROPOLIS EDGE INFERENCE',
    sub: 'NVIDIA DeepStream 7.0 & TensorRT 10.2 Stream',
    icon: '⚡',
    color: '#ff5500',
    styleType: 'vision'
  },
  'simulator': {
    title: 'FINITE DECARBONIZATION SANDBOX',
    sub: 'Predictive Mathematical Carbon ROI Solver',
    icon: '⚙️',
    color: 'var(--emerald)',
    styleType: 'simulator'
  },
  'playbook': {
    title: 'NVIDIA NIM CLIMATE PLAYBOOK',
    sub: 'Autonomous ISO 14064 Carbon Audit Synthesis',
    icon: '🤖',
    color: 'var(--phosphor)',
    styleType: 'playbook'
  },
  'research': {
    title: 'EMPIRICAL SCIENTIFIC DOSSIER',
    sub: '2020–2024 CEA v20.0 & IISc Ground Truth',
    icon: '📊',
    color: 'var(--cyan)',
    styleType: 'research'
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
    color: 'var(--phosphor)',
    styleType: 'globe'
  };

  // Bespoke content animation mapping
  const contentAnimationMap = {
    'overview-globe': 'orbitalIrisIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) both',
    'overview-campus': 'campusLidarIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both',
    'vision': 'visionApertureIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both',
    'simulator': 'sandboxWaveIn 0.40s cubic-bezier(0.16, 1, 0.3, 1) both',
    'playbook': 'playbookSynapseIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both',
    'research': 'researchDecodeIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both'
  };

  const activeContentAnimation = contentAnimationMap[pageKey] || 'quantumContentIn 0.36s cubic-bezier(0.16, 1, 0.3, 1) both';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* Dynamic Animated Content Container with Bespoke Geometry */}
      <div
        key={pageKey}
        className="quantum-page-content"
        style={{
          width: '100%',
          height: '100%',
          animation: activeContentAnimation
        }}
      >
        {children}
      </div>

      {/* =========================================================================
          BESPOKE OVERLAY 1: Earth 3D - Expanding Orbital Atmosphere Ring
          ========================================================================= */}
      {isTransitioning && currentMeta.styleType === 'globe' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            border: '2px solid rgba(56, 189, 248, 0.8)',
            pointerEvents: 'none',
            zIndex: 998,
            animation: 'orbitalRingExpand 0.46s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        />
      )}

      {/* =========================================================================
          BESPOKE OVERLAY 2: DSU Campus Twin - Precision LiDAR Laser Grid Beam
          ========================================================================= */}
      {isTransitioning && currentMeta.styleType === 'campus' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #d4ff00 20%, #ffffff 50%, #d4ff00 80%, transparent 100%)',
            boxShadow: '0 0 24px #d4ff00, 0 0 48px #ffffffaa',
            pointerEvents: 'none',
            zIndex: 998,
            animation: 'campusLaserBeam 0.46s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        />
      )}

      {/* =========================================================================
          BESPOKE OVERLAY 3: Metropolis CV - Dual-Blade Camera Shutter & Crosshair
          ========================================================================= */}
      {isTransitioning && currentMeta.styleType === 'vision' && (
        <>
          {/* Top Blade */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'rgba(6, 8, 12, 0.94)',
              borderBottom: '2px solid #ff5500',
              boxShadow: '0 4px 20px rgba(255, 85, 0, 0.4)',
              pointerEvents: 'none',
              zIndex: 997,
              animation: 'opticalBladeTop 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          />
          {/* Bottom Blade */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'rgba(6, 8, 12, 0.94)',
              borderTop: '2px solid #ff5500',
              boxShadow: '0 -4px 20px rgba(255, 85, 0, 0.4)',
              pointerEvents: 'none',
              zIndex: 997,
              animation: 'opticalBladeBottom 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          />
          {/* Crosshair Lock Center */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '140px',
              height: '140px',
              border: '1.5px solid rgba(255, 85, 0, 0.6)',
              borderRadius: '6px',
              pointerEvents: 'none',
              zIndex: 998,
              animation: 'crosshairLock 0.42s ease-out forwards'
            }}
          />
        </>
      )}

      {/* =========================================================================
          BESPOKE OVERLAY 4: What-If Sandbox - Kinetic Physics Energy Wave Slice
          ========================================================================= */}
      {isTransitioning && currentMeta.styleType === 'simulator' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'linear-gradient(180deg, transparent 0%, #10b981 30%, #ffffff 50%, #10b981 70%, transparent 100%)',
            boxShadow: '0 0 24px #10b981, 0 0 48px #10b981aa',
            pointerEvents: 'none',
            zIndex: 998,
            animation: 'kineticEnergyWipe 0.44s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        />
      )}

      {/* =========================================================================
          BESPOKE OVERLAY 5: AI Playbook - Neural Synapse Pulse Stream
          ========================================================================= */}
      {isTransitioning && currentMeta.styleType === 'playbook' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 15%, rgba(212, 255, 0, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 998,
            animation: 'neuralPulseStream 0.46s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        />
      )}

      {/* =========================================================================
          BESPOKE OVERLAY 6: Science & Audit - Cryptographic Forensic Scan
          ========================================================================= */}
      {isTransitioning && currentMeta.styleType === 'research' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '8%',
            right: '8%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #38bdf8 30%, #ffffff 50%, #38bdf8 70%, transparent 100%)',
            boxShadow: '0 0 20px #38bdf8, 0 0 35px #ffffff88',
            transformOrigin: 'center',
            pointerEvents: 'none',
            zIndex: 998,
            animation: 'cryptographicVerifyScan 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
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
