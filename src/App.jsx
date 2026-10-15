import React, { useState, useEffect, useRef, useCallback } from 'react';
import TopNav from './components/TopNav';
import PlanetaryGlobe from './components/PlanetaryGlobe';
import CampusTwin from './components/CampusTwin';
import VisionFeed from './components/VisionFeed';
import SimulatorPanel from './components/SimulatorPanel';
import AIPlaybook from './components/AIPlaybook';
import ResearchDossier from './components/ResearchDossier';
import JudgeDemoTour from './components/JudgeDemoTour';
import ClickSpark from './components/reactbits/ClickSpark';
import PageTransition from './components/PageTransition';
import EdolusEntryIntro from './components/EdolusEntryIntro';
import EdolusScrollStory from './components/EdolusScrollStory';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [viewEngine, setViewEngine] = useState('globe'); // 'globe' | 'campus'
  const [activeMode, setActiveMode] = useState('overview'); // 'overview' | 'vision' | 'simulator' | 'playbook' | 'research'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTourActive, setIsTourActive] = useState(false);

  // Unified Simulation State
  const [simState, setSimState] = useState({
    fleetEv: 30, // %
    aiSolarShift: true, // boolean
    solarCapacity: 350, // kW
    hvacOpt: 40 // %
  });

  // Reusable Single AudioContext (prevents browser audio context exhaustion & GC thrashing)
  const audioCtxRef = useRef(null);
  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Optimized Sound FX Helper
  const playSound = useCallback((freq = 440, type = 'sine', duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext muted/unsupported
    }
  }, [soundEnabled, getAudioContext]);

  // Cinematic Harmonic Swell for Edolus-style Entrance
  const playIntroSwell = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      [110, 220, 330, 440, 550, 660].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04 / (idx + 1), audioCtx.currentTime + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.8);
      });
    } catch {
      // AudioContext muted/unsupported
    }
  }, [soundEnabled, getAudioContext]);

  const handleModeTransition = useCallback((newMode) => {
    setActiveMode(prev => {
      if (newMode === prev) return prev;
      const soundMap = {
        overview: 520,
        vision: 840,
        simulator: 600,
        playbook: 760,
        research: 920
      };
      playSound(soundMap[newMode] || 520, 'sine', 0.08);

      if (typeof document !== 'undefined' && document.startViewTransition) {
        try {
          document.startViewTransition(() => {
            setActiveMode(newMode);
          });
        } catch {
          // If a view transition was already running or aborted, fail gracefully
        }
      }
      return newMode;
    });
  }, [playSound]);

  const handleEngineTransition = useCallback((newEngine) => {
    setViewEngine(prev => {
      if (newEngine === prev) return prev;
      playSound(newEngine === 'campus' ? 680 : 520, 'triangle', 0.1);

      if (typeof document !== 'undefined' && document.startViewTransition) {
        try {
          document.startViewTransition(() => {
            setViewEngine(newEngine);
          });
        } catch {
          // Fail gracefully
        }
      }
      return newEngine;
    });
  }, [playSound]);

  const handleZoomCampus = useCallback(() => {
    handleEngineTransition('campus');
  }, [handleEngineTransition]);

  const handleNavigateChapter = (targetMode, targetEngine) => {
    if (targetMode && targetMode !== activeMode) {
      handleModeTransition(targetMode);
    }
    if (targetEngine && targetEngine !== viewEngine) {
      handleEngineTransition(targetEngine);
    }
  };

  const pageKey = activeMode === 'overview' ? `overview-${viewEngine}` : activeMode;

  return (
    <ClickSpark
      sparkColor={['#d4ff00', '#ffffff', '#38bdf8']}
      sparkSize={10}
      sparkRadius={26}
      sparkCount={6}
      sparkWidth={1.6}
      duration={400}
    >
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-canvas)',
        overflow: 'hidden'
      }}>
        {/* EDOLUS-Inspired Atmospheric Entry Sequence Overlay */}
        {showIntro && (
          <EdolusEntryIntro
            onEnter={() => {
              playIntroSwell();
              setShowIntro(false);
            }}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
          />
        )}

        {/* Top Command Bar */}
        <TopNav
          activeMode={activeMode}
          setActiveMode={handleModeTransition}
          viewEngine={viewEngine}
          setViewEngine={handleEngineTransition}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          isTourActive={isTourActive}
          onStartJudgeTour={() => setIsTourActive(true)}
          onReplayIntro={() => setShowIntro(true)}
        />

        {/* Main Tactical Workspace with Unique Quantum Page Transition */}
        <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
          <PageTransition pageKey={pageKey} soundEnabled={soundEnabled}>
            {/* OVERVIEW MODE: Full-Screen Pure Spatial Experience */}
            {activeMode === 'overview' && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {viewEngine === 'globe' ? (
                  <PlanetaryGlobe onZoomCampus={handleZoomCampus} playSound={playSound} />
                ) : (
                  <CampusTwin simulationValues={simState} playSound={playSound} />
                )}
              </div>
            )}

            {/* FULL CV VISION MODE */}
            {activeMode === 'vision' && <VisionFeed simState={simState} playSound={playSound} />}

            {/* FULL WHAT-IF SIMULATOR MODE */}
            {activeMode === 'simulator' && (
              <SimulatorPanel
                simState={simState}
                setSimState={setSimState}
                onOpenPlaybook={() => handleModeTransition('playbook')}
                playSound={playSound}
              />
            )}

            {/* FULL GENAI PLAYBOOK MODE */}
            {activeMode === 'playbook' && <AIPlaybook simState={simState} playSound={playSound} />}

            {/* FULL RESEARCH & METHODOLOGY MODE */}
            {activeMode === 'research' && <ResearchDossier simState={simState} playSound={playSound} />}
          </PageTransition>

          {/* EDOLUS-Inspired Scroll Navigation & Animated Hero Cue */}
          {!isTourActive && !showIntro && (
            <EdolusScrollStory
              activeMode={activeMode}
              viewEngine={viewEngine}
              onNavigateChapter={handleNavigateChapter}
              playSound={playSound}
            />
          )}
        </div>

        {/* Automated Code Clash SRE Judge Demo Tour */}
        <JudgeDemoTour
          isActive={isTourActive}
          onClose={() => setIsTourActive(false)}
          onStepChange={({ mode, engine }) => {
            if (mode) handleModeTransition(mode);
            if (engine) handleEngineTransition(engine);
          }}
          onSimStateChange={setSimState}
          playSound={playSound}
        />
      </div>
    </ClickSpark>
  );
}
