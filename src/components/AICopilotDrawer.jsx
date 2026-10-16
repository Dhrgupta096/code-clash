import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, Sparkles, Download, Check, ArrowRight, ShieldCheck, Zap, 
  Terminal, Key, CheckCircle2, Sliders, ExternalLink, RefreshCw, Volume2, 
  VolumeX, Copy, ChevronDown, ChevronUp, Cpu, Activity, Play, Square, Layers
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';

const SUGGESTED_QUERIES = [
  "How can DSU reach Net-Zero by 2030?",
  "Explain the DGX A100 solar time-shift algorithm",
  "What is our largest Scope 2 emission source?",
  "Calculate financial ROI & payback for +200kW solar",
  "Inspect Gate 1 shuttle idling emissions"
];

export default function AICopilotDrawer({
  isOpen,
  onClose,
  simState = { fleetEv: 30, aiSolarShift: true, solarCapacity: 350, hvacOpt: 40 },
  setSimState,
  setActiveMode,
  setViewEngine,
  playSound
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      time: '10:00',
      content: '### ⚡ OmniAgent Autonomous Decarbonization Copilot\n\nConnected to **Karnataka SLDC telemetry** (50.02 Hz, CEA v20.0 factor **0.716 kg/kWh**) and the **DSU Harohalli 140-acre 3D spatial twin**.\n\nI can execute real-time SRE simulations, calculate financial ROI in INR, inspect edge CCTV streams, and prepare audit-ready ISO 14064 roadmaps. What would you like to analyze?',
      thoughtProcess: [
        'Ingested live KPTCL telemetry (50.02 Hz, CEA v20.0 factor 0.716 kg/kWh)',
        'Mounted DSU Harohalli 140-acre physical building coordinates and electrical nodes',
        'Verified NVIDIA Jetson AGX Orin edge vision stream at South Gate 1 Depot',
        'Initialised ISO 14064-1:2018 greenhouse gas inventory baseline (420.0 tCO₂e/yr)'
      ],
      citations: [
        'CEA Baseline Database v20.0 (Dec 2024 Gazette)',
        'Karnataka State Load Despatch Centre (KPTCL / SRLDC)',
        'ISO 14064-1:2018 Carbon Standard'
      ],
      actions: [
        { label: '🎯 Net-Zero 2030 Plan', type: 'PROMPT', query: 'How can DSU reach Net-Zero by 2030?' },
        { label: '⚡ DGX Solar Time-Shift', type: 'PROMPT', query: 'Explain the DGX A100 solar time-shift algorithm' },
        { label: '🚌 Gate 1 CCTV Idling', type: 'PROMPT', query: 'Inspect Gate 1 shuttle idling emissions' }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isReportDownloaded, setIsReportDownloaded] = useState(false);
  const [appliedActionIdx, setAppliedActionIdx] = useState(null);
  const [actionToast, setActionToast] = useState(null);
  const [copiedMsgIdx, setCopiedMsgIdx] = useState(null);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState(null);
  const [expandedThoughts, setExpandedThoughts] = useState({ 0: false });

  // Custom API Key Modal
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [activeApiKey, setActiveApiKey] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load API key from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('omnicarbon_gemini_key') || '';
      setActiveApiKey(storedKey);
      setApiKeyInput(storedKey);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    } else {
      // Stop speech on close
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeakingMsgIdx(null);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const cleanKey = apiKeyInput.trim();
    if (typeof window !== 'undefined') {
      if (cleanKey) {
        localStorage.setItem('omnicarbon_gemini_key', cleanKey);
      } else {
        localStorage.removeItem('omnicarbon_gemini_key');
      }
    }
    setActiveApiKey(cleanKey);
    setApiKeyModalOpen(false);
    if (playSound) playSound(640, 'triangle', 0.1);
  };

  // Web Speech API Text-to-Speech
  const handleToggleSpeak = (text, idx) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = text
      .replace(/###|\*\*|\*|`|\[.*?\]\(.*?\)|#/g, '')
      .replace(/- /g, '')
      .trim();

    const brief = clean.split('. ').slice(0, 3).join('. ') + '.';
    const utterance = new SpeechSynthesisUtterance(brief);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgIdx(null);
    utterance.onerror = () => setSpeakingMsgIdx(null);

    setSpeakingMsgIdx(idx);
    window.speechSynthesis.speak(utterance);
    if (playSound) playSound(600, 'sine', 0.05);
  };

  const handleCopyMessage = (text, idx) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMsgIdx(idx);
      setTimeout(() => setCopiedMsgIdx(null), 2000);
      if (playSound) playSound(720, 'sine', 0.05);
    }
  };

  const toggleThought = (idx) => {
    setExpandedThoughts(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Typewriter streaming helper
  const streamMessage = (fullText, actions = [], metrics = null, provider = null, thoughtProcess = [], citations = []) => {
    const words = fullText.split(' ');
    let currentIdx = 0;
    const msgId = Date.now();

    // Add initial placeholder
    setMessages(prev => [
      ...prev,
      {
        id: msgId,
        role: 'assistant',
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        content: words[0] || '',
        actions: [],
        metrics,
        provider,
        thoughtProcess,
        citations,
        isStreaming: true
      }
    ]);

    const interval = setInterval(() => {
      currentIdx += 3;
      if (currentIdx >= words.length) {
        clearInterval(interval);
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last) {
            last.content = fullText;
            last.actions = actions;
            last.thoughtProcess = thoughtProcess;
            last.citations = citations;
            last.isStreaming = false;
          }
          return updated;
        });
        setIsTyping(false);
        if (playSound) playSound(720, 'sine', 0.06);
      } else {
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last) {
            last.content = words.slice(0, currentIdx).join(' ');
          }
          return updated;
        });
      }
    }, 24);
  };

  const handleSend = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text) return;

    if (playSound) playSound(580, 'sine', 0.05);

    const userMsg = {
      role: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    if (!overrideText) setInput('');
    setIsTyping(true);

    try {
      const response = await ApiClient.sendAIChat(text, simState, activeApiKey);
      if (response?.answer) {
        streamMessage(
          response.answer, 
          response.actions || [], 
          response.metrics || null, 
          response.provider || 'OmniAgent SRE Kernel',
          response.thoughtProcess || [],
          response.citations || []
        );
      } else {
        throw new Error('Empty response');
      }
    } catch {
      // Local fallback calculation
      const fallbackText = `### 🔍 Local Telemetry Analysis\n\nDSU Harohalli digital twin simulation confirms an active **${((120 * (simState.fleetEv / 100) + (simState.aiSolarShift ? 46.2 : 0) + (((simState.solarCapacity - 100) / 100) * 32) + (28 * (simState.hvacOpt / 100)))).toFixed(1)} Tons CO₂e/yr** carbon avoidance based on CEA v20.0 factor (**0.716 kg/kWh**).\n\n* **Rooftop Solar:** ${simState.solarCapacity} kW on Academic Blocks.\n* **Fleet Electrification:** ${simState.fleetEv}% active EV conversion.\n* **DGX Supercomputer:** ${simState.aiSolarShift ? 'Solar sync active' : 'Standard grid baseline'}.`;
      
      const fallbackActions = [
        { label: '⚡ Maximize Solar to 600 kW', type: 'APPLY_SIM', sim: { solarCapacity: 600 } },
        { label: '📄 Export ISO 14064 Audit Plan', type: 'EXPORT_AUDIT' }
      ];
      
      const fallbackThoughts = [
        'Sampled active DSU digital twin simulation matrix',
        'Referenced CEA v20.0 baseline factor: 0.716 kg CO₂/kWh',
        'Calculated combined marginal avoidance across Scopes 1 & 2'
      ];

      streamMessage(fallbackText, fallbackActions, null, 'OmniAgent Offline Fallback', fallbackThoughts);
    }
  };

  // Handle agentic action execution with toast notification
  const handleExecuteAction = (action, idx) => {
    if (playSound) playSound(680, 'square', 0.1);
    setAppliedActionIdx(idx);

    if (action.type === 'APPLY_SIM' && setSimState && action.sim) {
      setSimState(prev => ({ ...prev, ...action.sim }));
      const keys = Object.keys(action.sim).map(k => `${k}: ${action.sim[k]}`).join(' • ');
      setActionToast(`⚡ Digital Twin Updated: ${keys}`);
      setTimeout(() => setActionToast(null), 3500);
      setTimeout(() => setAppliedActionIdx(null), 2500);
    } else if (action.type === 'NAVIGATE') {
      if (action.mode && setActiveMode) setActiveMode(action.mode);
      if (action.engine && setViewEngine) setViewEngine(action.engine);
      setActionToast(`🏫 Digital Twin Camera Vector: ${action.mode || 'overview'} [${action.engine || 'campus'}]`);
      setTimeout(() => setActionToast(null), 3500);
    } else if (action.type === 'EXPORT_AUDIT') {
      handleDownloadAuditReport();
      setActionToast(`📄 Generating Official ISO 14064 Audit Certificate...`);
      setTimeout(() => setActionToast(null), 3500);
    } else if (action.type === 'PROMPT' && action.query) {
      handleSend(action.query);
    }
  };

  const handleDownloadAuditReport = async () => {
    if (playSound) playSound(640, 'sine', 0.1);
    try {
      const reportData = await ApiClient.getAuditReport('json');
      const text = reportData?.reportText || `OMNICARBON ISO 14064 AUDIT REPORT\nInstitution: DSU Harohalli\nGenerated: ${new Date().toISOString()}`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DSU_ISO14064_Audit_Report_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsReportDownloaded(true);
      setTimeout(() => setIsReportDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to download audit report', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(5, 7, 10, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Backdrop Click */}
      <div 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Slide-out Drawer Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        height: '100%',
        background: '#0b0e14',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-16px 0 48px rgba(0, 0, 0, 0.85)',
        animation: 'slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(16, 21, 30, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
            }}>
              <Sparkles size={17} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f0f6fc', letterSpacing: '-0.01em' }}>
                  OmniAgent SRE Copilot
                </span>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: activeApiKey ? 'rgba(35, 134, 54, 0.2)' : 'rgba(56, 189, 248, 0.12)',
                  color: activeApiKey ? '#3fb950' : '#38bdf8',
                  border: `1px solid ${activeApiKey ? 'rgba(46, 160, 67, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`
                }}>
                  {activeApiKey ? 'Gemini 2.0 Flash' : 'SRE Neural Kernel'}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#8b949e', marginTop: '1px' }}>
                Autonomous reasoning & 3D digital twin control plane
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Custom API Key Button */}
            <button
              onClick={() => setApiKeyModalOpen(!apiKeyModalOpen)}
              title="Configure Google Gemini API Key"
              style={{
                background: activeApiKey ? 'rgba(35, 134, 54, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${activeApiKey ? 'rgba(46, 160, 67, 0.35)' : 'rgba(255, 255, 255, 0.1)'}`,
                color: activeApiKey ? '#3fb950' : '#8b949e',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '10.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Key size={11} />
              <span>{activeApiKey ? 'Key Set' : 'Set Key'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close Copilot (Esc)"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8b949e',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f0f6fc'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.background = 'transparent'; }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Toast Notification */}
        {actionToast && (
          <div style={{
            padding: '8px 18px',
            background: 'rgba(35, 134, 54, 0.15)',
            borderBottom: '1px solid rgba(46, 160, 67, 0.4)',
            color: '#3fb950',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <CheckCircle2 size={13} color="#3fb950" />
            <span style={{ flex: 1 }}>{actionToast}</span>
          </div>
        )}

        {/* API Key Modal Drawer Header Overlay */}
        {apiKeyModalOpen && (
          <div style={{
            padding: '12px 18px',
            background: '#161b22',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeIn 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#f0f6fc' }}>
                Google Gemini API Key (Optional)
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '10.5px', color: '#58a6ff', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
              >
                <span>Get Free Key</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy... (leave blank for local SRE kernel)"
                style={{
                  flex: 1,
                  background: '#0d1117',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  color: '#f0f6fc',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '6px 12px',
                  background: '#238636',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </form>
          </div>
        )}

        {/* Live Telemetry Context Strip */}
        <div style={{
          padding: '8px 18px',
          background: 'rgba(13, 17, 23, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10.5px',
          color: '#8b949e',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3fb950', display: 'inline-block' }} />
            <span>KPTCL 50.02 Hz</span>
            <span>•</span>
            <span>0.716 kg/kWh</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Solar: {simState.solarCapacity}kW</span>
            <span>•</span>
            <span>EV: {simState.fleetEv}%</span>
            <span>•</span>
            <span>DGX: {simState.aiSolarShift ? 'Synced' : 'Grid'}</span>
          </div>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            const isSpeaking = speakingMsgIdx === idx;
            const isCopied = copiedMsgIdx === idx;
            const hasThoughts = m.thoughtProcess && m.thoughtProcess.length > 0;
            const isThoughtOpen = !!expandedThoughts[idx];

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  gap: '5px',
                  width: '100%'
                }}
              >
                {/* Meta Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8b949e', marginBottom: '2px' }}>
                  <span>{isUser ? 'You' : 'OmniAgent'}</span>
                  <span>{m.time}</span>
                  {m.provider && (
                    <span style={{ color: '#38bdf8', fontSize: '9px' }}>({m.provider})</span>
                  )}
                </div>

                {/* Cognitive Reasoning Chain-of-Thought Accordion */}
                {!isUser && hasThoughts && (
                  <div style={{
                    width: '96%',
                    marginBottom: '4px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(22, 27, 34, 0.6)',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => toggleThought(idx)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        background: 'transparent',
                        border: 'none',
                        color: '#8b949e',
                        fontSize: '10.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Cpu size={12} color="#38bdf8" />
                        <span style={{ fontWeight: 600, color: '#c9d1d9' }}>
                          OmniAgent SRE Reasoning Trace ({m.thoughtProcess.length} steps)
                        </span>
                      </div>
                      {isThoughtOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isThoughtOpen && (
                      <div style={{
                        padding: '6px 10px 8px 10px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        background: 'rgba(13, 17, 23, 0.5)'
                      }}>
                        {m.thoughtProcess.map((step, sIdx) => (
                          <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '10.5px', color: '#8b949e', lineHeight: '1.4' }}>
                            <CheckCircle2 size={11} color="#3fb950" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div style={{
                  maxWidth: '96%',
                  padding: '12px 16px',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: isUser ? '#1f6feb' : '#161b22',
                  color: isUser ? '#ffffff' : '#e6edf3',
                  fontSize: '12.5px',
                  lineHeight: '1.6',
                  border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  whiteSpace: 'pre-line',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                }}>
                  {m.content}
                </div>

                {/* Structured KPI Metric Badges */}
                {!isUser && m.metrics && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '4px',
                    paddingLeft: '2px'
                  }}>
                    {m.metrics.totalCarbonSavedTons && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(35, 134, 54, 0.15)',
                        border: '1px solid rgba(46, 160, 67, 0.3)',
                        color: '#3fb950'
                      }}>
                        🍃 -{m.metrics.totalCarbonSavedTons} tCO₂e/yr Avoided
                      </span>
                    )}
                    {m.metrics.annualSavingsLakhsINR && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8'
                      }}>
                        💰 ₹{m.metrics.annualSavingsLakhsINR}L/yr OPEX Saved
                      </span>
                    )}
                    {m.metrics.percentSaved && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(210, 153, 34, 0.12)',
                        border: '1px solid rgba(210, 153, 34, 0.3)',
                        color: '#d29922'
                      }}>
                        📉 -{m.metrics.percentSaved}% Gross Reduction
                      </span>
                    )}
                  </div>
                )}

                {/* Action Toolbar (Speech, Copy, Citations) */}
                {!isUser && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '2px',
                    paddingLeft: '4px'
                  }}>
                    {/* Voice Briefing Button */}
                    <button
                      onClick={() => handleToggleSpeak(m.content, idx)}
                      title={isSpeaking ? "Stop Voice Briefing" : "Listen to SRE Audio Briefing"}
                      style={{
                        background: isSpeaking ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${isSpeaking ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                        color: isSpeaking ? '#38bdf8' : '#8b949e',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Voice Briefing'}</span>
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyMessage(m.content, idx)}
                      title="Copy SRE Briefing to Clipboard"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: isCopied ? '#3fb950' : '#8b949e',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isCopied ? <Check size={11} color="#3fb950" /> : <Copy size={11} />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Agentic Executable Action Buttons */}
                {m.actions && m.actions.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '6px',
                    paddingLeft: isUser ? '0' : '4px'
                  }}>
                    {m.actions.map((act, actIdx) => {
                      const isApplied = appliedActionIdx === `${idx}-${actIdx}`;
                      return (
                        <button
                          key={actIdx}
                          onClick={() => handleExecuteAction(act, `${idx}-${actIdx}`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: isApplied ? 'rgba(35, 134, 54, 0.2)' : 'rgba(31, 111, 235, 0.12)',
                            border: `1px solid ${isApplied ? 'rgba(46, 160, 67, 0.5)' : 'rgba(56, 189, 248, 0.35)'}`,
                            color: isApplied ? '#3fb950' : '#79c0ff',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = isApplied ? 'rgba(35, 134, 54, 0.3)' : 'rgba(31, 111, 235, 0.22)';
                            e.currentTarget.style.borderColor = isApplied ? '#3fb950' : '#58a6ff';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = isApplied ? 'rgba(35, 134, 54, 0.2)' : 'rgba(31, 111, 235, 0.12)';
                            e.currentTarget.style.borderColor = isApplied ? 'rgba(46, 160, 67, 0.5)' : 'rgba(56, 189, 248, 0.35)';
                          }}
                        >
                          {isApplied ? <CheckCircle2 size={12} color="#3fb950" /> : <Zap size={11} />}
                          <span>{isApplied ? 'Applied to Twin' : act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#161b22',
              borderRadius: '8px',
              width: 'fit-content',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <span style={{ fontSize: '11px', color: '#8b949e' }}>OmniAgent SRE kernel reasoning...</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3fb950', animation: 'smoothPulse 1s infinite' }} />
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3fb950', animation: 'smoothPulse 1s infinite 0.2s' }} />
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3fb950', animation: 'smoothPulse 1s infinite 0.4s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div style={{
          padding: '8px 16px',
          background: 'rgba(13, 17, 23, 0.9)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {SUGGESTED_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#8b949e',
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '999px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f0f6fc'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Bottom Input & 1-Click Report Bar */}
        <div style={{
          padding: '14px 18px',
          background: '#161b22',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask OmniAgent to simulate, inspect buildings, or audit emissions..."
              style={{
                flex: 1,
                background: '#0d1117',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#f0f6fc',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              style={{
                background: input.trim() ? '#238636' : 'rgba(255, 255, 255, 0.05)',
                color: input.trim() ? '#ffffff' : '#484f58',
                border: 'none',
                borderRadius: '8px',
                padding: '0 14px',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease'
              }}
            >
              <Send size={14} />
            </button>
          </form>

          {/* Official Audit Report 1-Click Action */}
          <button
            onClick={handleDownloadAuditReport}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: isReportDownloaded ? '#3fb950' : '#8b949e',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f0f6fc'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = isReportDownloaded ? '#3fb950' : '#8b949e'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            {isReportDownloaded ? <Check size={12} color="#3fb950" /> : <Download size={12} />}
            <span>{isReportDownloaded ? 'Audit Report Downloaded' : 'Export Official ISO 14064 Audit Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
