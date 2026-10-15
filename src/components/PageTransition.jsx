import React, { useState, useEffect, useRef } from 'react';

const TRANSITION_METADATA = {
  'overview-globe': {
    title: 'ORBITAL GRID TELEMETRY',
    sub: 'NASA MERRA-2 // KPTCL SLDC 50.02 Hz',
    coords: '12.9716° N, 77.5946° E • ALT 420,000 M',
    icon: '🛰️',
    color: '#38bdf8'
  },
  'overview-campus': {
    title: 'DSU HAROHALLI 3D SPATIAL TWIN',
    sub: '140-Acre Campus Substrate & 350kW Solar Canopy',
    coords: '12.6518° N, 77.4326° E • ALT 840 M',
    icon: '📍',
    color: '#d4ff00'
  },
  'vision': {
    title: 'METROPOLIS EDGE INFERENCE',
    sub: 'NVIDIA DeepStream 7.0 & TensorRT 10.2 Pipeline',
    coords: 'EDGE NODE: JETSON AGX ORIN #01 • 30 FPS',
    icon: '⚡',
    color: '#ff5500'
  },
  'simulator': {
    title: 'DIURNAL MICROGRID SOLVER',
    sub: '24-Hour Finite Element Dispatch & 500kWh BESS',
    coords: 'SOLVER ITERATION: 86,400 DT • PEAK SHAVING',
    icon: '⚙️',
    color: '#10b981'
  },
  'playbook': {
    title: 'NVIDIA NIM CLIMATE PLAYBOOK',
    sub: 'Autonomous ISO 14064 Carbon Audit Synthesis',
    coords: 'LLM REASONING KERNEL: DECARBONIZATION 70B',
    icon: '🤖',
    color: '#d4ff00'
  },
  'research': {
    title: 'EMPIRICAL SCIENTIFIC DOSSIER',
    sub: '2020–2024 CEA v20.0 & IISc Ground Truth Validation',
    coords: 'VERIFIED DATASET: 80,000 KM TRAVEL LOGGED',
    icon: '📊',
    color: '#38bdf8'
  }
};

export default function PageTransition({ pageKey, children, soundEnabled = true }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevKeyRef = useRef(pageKey);
  const canvasRef = useRef(null);

  // Cinematic Warp Audio Synthesizer
  const playWarpSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      // 1. High-speed Doppler hyperspace sweep
      const sweepOsc = audioCtx.createOscillator();
      const sweepGain = audioCtx.createGain();
      sweepOsc.type = 'sawtooth';
      sweepOsc.frequency.setValueAtTime(880, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(140, now + 0.38);

      sweepGain.gain.setValueAtTime(0.001, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      sweepOsc.connect(sweepGain);
      sweepGain.connect(audioCtx.destination);
      sweepOsc.start(now);
      sweepOsc.stop(now + 0.42);

      // 2. Sub-bass arrival impact
      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(70, now + 0.15);
      subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.45);

      subGain.gain.setValueAtTime(0.001, now + 0.15);
      subGain.gain.exponentialRampToValueAtTime(0.06, now + 0.22);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);
      subOsc.start(now + 0.15);
      subOsc.stop(now + 0.48);
    } catch (e) {
      // AudioContext unavailable
    }
  };

  useEffect(() => {
    if (prevKeyRef.current !== pageKey) {
      prevKeyRef.current = pageKey;
      setIsTransitioning(true);
      playWarpSound();

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 460);

      return () => clearTimeout(timer);
    }
  }, [pageKey]);

  // Hyperspace Particle Warp Canvas Animation
  useEffect(() => {
    if (!isTransitioning || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 2;

    const particles = Array.from({ length: 64 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 14;
      const dist = 30 + Math.random() * 100;
      const colors = ['#d4ff00', '#38bdf8', '#ffffff', '#10b981'];
      return {
        angle,
        dist,
        speed,
        length: 20 + Math.random() * 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 1.2 + Math.random() * 2.2
      };
    });

    let animId;
    const startTime = performance.now();

    const render = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / 450);

      ctx.clearRect(0, 0, w, h);

      // Central Atmospheric Plasma Flare
      const flareAlpha = progress < 0.5 ? progress * 1.8 : (1 - progress) * 1.8;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 380);
      gradient.addColorStop(0, `rgba(212, 255, 0, ${flareAlpha * 0.35})`);
      gradient.addColorStop(0.35, `rgba(56, 189, 248, ${flareAlpha * 0.2})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Draw accelerating velocity streaks
      particles.forEach((p) => {
        p.dist += p.speed * (1 + progress * 7);
        const x1 = cx + Math.cos(p.angle) * p.dist;
        const y1 = cy + Math.sin(p.angle) * p.dist;
        const x2 = cx + Math.cos(p.angle) * (p.dist + p.length * (1 + progress * 3.5));
        const y2 = cy + Math.sin(p.angle) * (p.dist + p.length * (1 + progress * 3.5));

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.width;
        ctx.globalAlpha = Math.max(0, 1 - progress * 0.6);
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.stroke();
      });

      if (progress < 1) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isTransitioning]);

  const currentMeta = TRANSITION_METADATA[pageKey] || {
    title: 'TELEMETRY SUBSYSTEM SYNC',
    sub: 'OmniCarbon Real-Time Stream',
    coords: '12.9716° N, 77.5946° E • NOMINAL',
    icon: 'Ω',
    color: '#d4ff00'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Perspective Dive & Elastic Rebound Container */}
      <div
        key={pageKey}
        className="quantum-page-content"
        style={{
          width: '100%',
          height: '100%',
          animation: 'edolusWarpDiveIn 0.44s cubic-bezier(0.16, 1, 0.3, 1) both'
        }}
      >
        {children}
      </div>

      {/* FULL-VIEWPORT HYPERSPACE WARP STREAKS CANVAS */}
      {isTransitioning && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 99990
          }}
        />
      )}

      {/* CINEMATIC SRE HOLOGRAPHIC TARGETING HUD OVERLAY */}
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 99995,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'edolusHudFade 0.46s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* Chromatic Aberration Scanlines */}
          <div className="edolus-chromatic-scanlines" />

          {/* Central Holographic Reticle */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer Rotating Dashed Ring */}
            <div className="edolus-hud-ring-outer" />

            {/* Inner Counter-Rotating Ring */}
            <div className="edolus-hud-ring-inner" />

            {/* Corner Targeting Brackets [   ] */}
            <div className="edolus-hud-brackets" />

            {/* Subsystem Telemetry Badge Inside Reticle */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '24px 36px',
                background: 'rgba(5, 7, 11, 0.88)',
                border: `1.5px solid ${currentMeta.color}`,
                borderRadius: '16px',
                boxShadow: `0 0 35px ${currentMeta.color}55, inset 0 0 20px ${currentMeta.color}22`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              {/* Target Acquire Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px' }}>{currentMeta.icon}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    color: currentMeta.color,
                    letterSpacing: '0.14em'
                  }}
                >
                  [SPATIAL VECTOR ACQUIRED]
                </span>
              </div>

              {/* Big Subsystem Title */}
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-ui)',
                  marginBottom: '4px',
                  textShadow: `0 0 20px ${currentMeta.color}`
                }}
              >
                {currentMeta.title}
              </h2>

              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '10px'
                }}
              >
                {currentMeta.sub}
              </p>

              {/* Coordinates and Dynamic Equalizer Visualizer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                  paddingTop: '8px'
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: currentMeta.color,
                    letterSpacing: '0.06em'
                  }}
                >
                  {currentMeta.coords}
                </span>

                {/* 5-bar animated audio spectrum */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '12px' }}>
                  <div className="edolus-spectrum-bar b1" />
                  <div className="edolus-spectrum-bar b2" />
                  <div className="edolus-spectrum-bar b3" />
                  <div className="edolus-spectrum-bar b4" />
                  <div className="edolus-spectrum-bar b5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
