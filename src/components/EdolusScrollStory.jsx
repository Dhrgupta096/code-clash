import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Globe, Building2, Eye, Sliders, FileText } from 'lucide-react';
import ShinyText from './reactbits/ShinyText';
import Magnet from './reactbits/Magnet';

export const EDOLUS_CHAPTERS = [
  {
    id: 'orbit',
    mode: 'overview',
    engine: 'globe',
    num: '01',
    label: 'ORBITAL TELEMETRY',
    short: 'ORBIT',
    icon: Globe,
    sub: 'NASA Earth-2 • Global Grids • KPTCL 50.02 Hz',
    nextCue: 'DESCEND TO DSU CAMPUS 3D TWIN',
    target: { mode: 'overview', engine: 'campus' }
  },
  {
    id: 'campus',
    mode: 'overview',
    engine: 'campus',
    num: '02',
    label: 'DSU 140-ACRE DIGITAL TWIN',
    short: 'CAMPUS',
    icon: Building2,
    sub: 'Spatial Mesh • 350kW Solar • DGX Racks',
    nextCue: 'ENGAGE METROPOLIS CV SENSORS',
    target: { mode: 'vision', engine: 'campus' }
  },
  {
    id: 'vision',
    mode: 'vision',
    engine: 'campus',
    num: '03',
    label: 'METROPOLIS VISION SENSORS',
    short: 'VISION',
    icon: Eye,
    sub: 'Jetson AGX Orin • Thermal FLIR • Idle Track',
    nextCue: 'CALIBRATE MICROGRID SOLVER',
    target: { mode: 'simulator', engine: 'campus' }
  },
  {
    id: 'simulator',
    mode: 'simulator',
    engine: 'campus',
    num: '04',
    label: 'DIURNAL MICROGRID SOLVER',
    short: 'SOLVER',
    icon: Sliders,
    sub: '24-Hr Diurnal Dispatch • 500kWh BESS',
    nextCue: 'ACTIVATE GENAI NIM PLAYBOOK',
    target: { mode: 'playbook', engine: 'campus' }
  },
  {
    id: 'playbook',
    mode: 'playbook',
    engine: 'campus',
    num: '05',
    label: 'GENAI NIM SRE DOSSIER',
    short: 'NIM SRE',
    icon: FileText,
    sub: 'Autonomous Decarbonization • ISO 14064',
    nextCue: 'ASCEND TO ORBITAL TELEMETRY',
    target: { mode: 'overview', engine: 'globe' }
  }
];

export default function EdolusScrollStory({
  activeMode,
  viewEngine,
  onNavigateChapter,
  playSound
}) {
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const lastScrollTime = useRef(0);

  // Compute current chapter index
  const getCurrentIndex = () => {
    if (activeMode === 'overview') {
      return viewEngine === 'campus' ? 1 : 0;
    }
    if (activeMode === 'vision') return 2;
    if (activeMode === 'simulator') return 3;
    if (activeMode === 'playbook' || activeMode === 'research') return 4;
    return 0;
  };

  const currentIndex = getCurrentIndex();
  const currentChapter = EDOLUS_CHAPTERS[currentIndex] || EDOLUS_CHAPTERS[0];

  const handleStep = (direction) => {
    const nextIdx = (currentIndex + direction + EDOLUS_CHAPTERS.length) % EDOLUS_CHAPTERS.length;
    const target = EDOLUS_CHAPTERS[nextIdx];
    if (playSound) playSound(direction > 0 ? 640 : 480, 'sine', 0.08);
    onNavigateChapter(target.mode, target.engine);
  };

  // Wheel interaction with smart cooldown
  useEffect(() => {
    const handleWheel = (e) => {
      // Do not hijack scroll if inside scrollable text/dossier/inputs
      const target = e.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('.scrollable-content') ||
        target.closest('.dossier-scroll') ||
        target.closest('.option-wheel')
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastScrollTime.current < 750) return;

      if (Math.abs(e.deltaY) > 28) {
        lastScrollTime.current = now;
        if (e.deltaY > 0) {
          // Scroll Down
          handleStep(1);
        } else {
          // Scroll Up
          handleStep(-1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex]);

  return (
    <>
      {/* 1. EDOLUS ANIMATED SCROLL DOWN PROMPT (Hero Cue at Bottom Center) */}
      <div style={{
        position: 'absolute',
        bottom: '22px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Magnet padding={40} magnetStrength={3} maxOffset={8}>
          <div
            onClick={() => handleStep(1)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              background: 'rgba(8, 10, 15, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              padding: '8px 20px 10px 20px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 255, 0, 0.12)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              userSelect: 'none'
            }}
            title="Click or scroll mouse wheel down to explore next subsystem"
          >
            {/* Top Micro Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ShinyText
                text="SCROLL TO EXPLORE"
                color="var(--text-secondary)"
                shineColor="var(--phosphor)"
                speed={2.8}
                shineWidth={45}
                style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.14em', fontFamily: 'var(--font-mono)' }}
              />
              <span style={{ fontSize: '9px', color: 'var(--phosphor)', fontWeight: 800 }}>
                [{currentChapter.num}/05]
              </span>
            </div>

            {/* Mouse Capsule + Animated Wheel Dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div className="edolus-mouse-capsule">
                <div className="edolus-mouse-wheel-dot" />
              </div>

              {/* Laser line descending */}
              <div className="edolus-laser-track" />

              {/* Bouncing Chevron Arrow */}
              <div className="edolus-chevron-bounce" style={{ marginTop: '-4px' }}>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Target Subsystem Cue Action */}
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-pure)',
              marginTop: '4px',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>{currentChapter.nextCue}</span>
              <span style={{ color: 'var(--phosphor)' }}>▶</span>
            </span>
          </div>
        </Magnet>
      </div>

      {/* 2. EDOLUS VERTICAL CHAPTER RAIL (Right Edge Timeline) */}
      <div style={{
        position: 'absolute',
        right: '18px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(8, 10, 16, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '999px',
        padding: '12px 7px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Step Up Button */}
        <button
          onClick={() => handleStep(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease',
            outline: 'none'
          }}
          title="Previous Chapter (Scroll Up)"
        >
          <ChevronUp size={14} />
        </button>

        {/* Milestone Pips with Connector Line */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          position: 'relative',
          padding: '4px 0'
        }}>
          {/* Vertical Connecting Hairline */}
          <div style={{
            position: 'absolute',
            top: '4px',
            bottom: '4px',
            width: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }} />

          {EDOLUS_CHAPTERS.map((ch, idx) => {
            const isActive = idx === currentIndex;
            const isHovered = hoveredChapter === idx;

            return (
              <div
                key={ch.id}
                onMouseEnter={() => setHoveredChapter(idx)}
                onMouseLeave={() => setHoveredChapter(null)}
                onClick={() => {
                  if (playSound) playSound(520 + idx * 80, 'sine', 0.08);
                  onNavigateChapter(ch.mode, ch.engine);
                }}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Milestone Pip */}
                <div style={{
                  width: isActive ? '12px' : '8px',
                  height: isActive ? '12px' : '8px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--phosphor)' : 'rgba(255, 255, 255, 0.25)',
                  boxShadow: isActive ? '0 0 12px var(--phosphor)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}>
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '50%',
                      border: '1px solid var(--phosphor)',
                      animation: 'edolusPulseRing 2.4s infinite ease-in-out'
                    }} />
                  )}
                </div>

                {/* Tactical Tooltip on Hover */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    right: '26px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(6, 8, 12, 0.95)',
                    border: '1px solid var(--border-active)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8), 0 0 16px rgba(212, 255, 0, 0.15)',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    zIndex: 100
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono-nums" style={{ fontSize: '9.5px', color: 'var(--phosphor)', fontWeight: 800 }}>
                        {ch.num}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-pure)', letterSpacing: '-0.01em' }}>
                        {ch.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {ch.sub}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Down Button */}
        <button
          onClick={() => handleStep(1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease',
            outline: 'none'
          }}
          title="Next Chapter (Scroll Down)"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </>
  );
}
