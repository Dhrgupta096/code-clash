import React, { useState, useEffect, useRef, useCallback } from 'react';
import TopNav from './components/TopNav';
import PlanetaryGlobe from './components/PlanetaryGlobe';
import CampusTwin from './components/CampusTwin';
import VisionFeed from './components/VisionFeed';
import SimulatorPanel from './components/SimulatorPanel';
import AIPlaybook from './components/AIPlaybook';
import ResearchDossier from './components/ResearchDossier';
import JudgeDemoTour from './components/JudgeDemoTour';
import PageTransition from './components/PageTransition';
import AICopilotDrawer from './components/AICopilotDrawer';
import EdolusPresentationDeck from './components/EdolusPresentationDeck';
import ClickSpark from './components/reactbits/ClickSpark';

export default function App() {
  const [viewEngine, setViewEngine] = useState('globe'); // 'globe' | 'campus'
  const [activeMode, setActiveMode] = useState('overview'); // 'overview' | 'vision' | 'simulator' | 'playbook' | 'research'
  const [soundEnabled, setSoundEnabled] = useState(false); // Clean & silent by default
  const [isTourActive, setIsTourActive] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(false);

  // Unified Simulation State
  const [simState, setSimState] = useState({
    fleetEv: 30, // %
    aiSolarShift: true, // boolean
    solarCapacity: 350, // kW
    hvacOpt: 40 // %
  });

  // Reusable Single AudioContext (muted/passive by default)
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

  // Subtle Sound FX Helper
  const playSound = useCallback((freq = 440, type = 'sine', duration = 0.06) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext muted/unsupported
    }
  }, [soundEnabled, getAudioContext]);

  // Keyboard shortcut (Cmd+K / Ctrl+K) for AI Copilot & 'P' for Presentation Deck
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea', 'select'].includes(e.target?.tagName?.toLowerCase())) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCopilotOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'p' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsDeckOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleModeTransition = useCallback((newMode) => {
    setActiveMode(prev => {
      if (newMode === prev) return prev;
      playSound(480, 'sine', 0.05);
      return newMode;
    });
  }, [playSound]);

  const handleEngineTransition = useCallback((newEngine) => {
    setViewEngine(prev => {
      if (newEngine === prev) return prev;
      playSound(520, 'sine', 0.06);
      return newEngine;
    });
  }, [playSound]);

  const handleZoomCampus = useCallback(() => {
    handleEngineTransition('campus');
  }, [handleEngineTransition]);

  const pageKey = activeMode === 'overview' ? `overview-${viewEngine}` : activeMode;

  return (
    <ClickSpark
      sparkColor={['#10b981', '#38bdf8', '#f8fafc', '#34d399', '#60a5fa']}
      sparkSize={10}
      sparkRadius={26}
      sparkCount={9}
      duration={380}
    >
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0d14',
        overflow: 'hidden',
        color: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
      {/* Git/Linear-style Top Command Bar */}
      <TopNav
        activeMode={activeMode}
        setActiveMode={handleModeTransition}
        viewEngine={viewEngine}
        setViewEngine={handleEngineTransition}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        isTourActive={isTourActive}
        onStartJudgeTour={() => setIsTourActive(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenPresentation={() => setIsDeckOpen(true)}
      />

      {/* Main Workspace with Fast, Clean 140ms Crossfade */}
      <main style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <PageTransition pageKey={pageKey}>
          {/* DIGITAL TWIN: Clean, Open Full-Screen Canvas */}
          {activeMode === 'overview' && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {viewEngine === 'globe' ? (
                <PlanetaryGlobe onZoomCampus={handleZoomCampus} playSound={playSound} />
              ) : (
                <CampusTwin simulationValues={simState} playSound={playSound} />
              )}
            </div>
          )}

          {/* METROPOLIS EDGE CV VISION */}
          {activeMode === 'vision' && <VisionFeed simState={simState} playSound={playSound} />}

          {/* WHAT-IF DECARBONIZATION SANDBOX */}
          {activeMode === 'simulator' && (
            <SimulatorPanel
              simState={simState}
              setSimState={setSimState}
              onOpenPlaybook={() => setIsCopilotOpen(true)}
              playSound={playSound}
            />
          )}

          {/* AI PLAYBOOK */}
          {activeMode === 'playbook' && <AIPlaybook simState={simState} playSound={playSound} />}

          {/* RESEARCH DOSSIER & ISO 14064 AUDIT */}
          {activeMode === 'research' && <ResearchDossier simState={simState} playSound={playSound} />}
        </PageTransition>
      </main>

      {/* Smooth Slide-Out AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        simState={simState}
        setSimState={setSimState}
        setActiveMode={handleModeTransition}
        setViewEngine={handleEngineTransition}
        playSound={playSound}
      />

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

      {/* Full-Screen Edolus-Style Cinematic PPT Slide Deck */}
      <EdolusPresentationDeck
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        playSound={playSound}
      />
    </div>
    </ClickSpark>
  );
}
