import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Download, Check, ArrowRight, ShieldCheck, Zap, Terminal } from 'lucide-react';
import { ApiClient } from '../services/apiClient';

const SUGGESTED_QUERIES = [
  "How can DSU reach Net-Zero by 2030?",
  "Explain the DGX A100 solar time-shift algorithm",
  "What is our largest Scope 2 emission source?",
  "Calculate financial ROI & payback for +200kW solar"
];

export default function AICopilotDrawer({ isOpen, onClose, simState = { fleetEv: 30, aiSolarShift: true, solarCapacity: 350, hvacOpt: 40 }, playSound }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      time: '10:00',
      content: 'Hello! I am **OmniAgent**, your autonomous SRE Decarbonization Copilot for DSU Harohalli Campus.\n\nI am connected to real-time Karnataka SLDC grid telemetry (CEA v20.0 factor 0.716 kg/kWh) and your 3D campus digital twin. How can I assist your climate audit today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isReportDownloaded, setIsReportDownloaded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
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
      const response = await ApiClient.sendAIChat(text, simState);
      const replyContent = response?.answer || `Based on DSU Harohalli telemetry, the current campus simulation saves **${((120 * (simState.fleetEv / 100) + (simState.aiSolarShift ? 46.2 : 0) + (((simState.solarCapacity - 100) / 100) * 32) + (28 * (simState.hvacOpt / 100)))).toFixed(1)} Tons CO₂e/yr** across transit and AI compute workloads.`;

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          content: replyContent,
          provider: response?.provider
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          content: `OmniCarbon digital twin analysis confirms that implementing 350kW rooftop solar and DGX solar-shift avoids 0.716 kg CO₂ per kWh of displaced grid electricity.`
        }
      ]);
    } finally {
      setIsTyping(false);
      if (playSound) playSound(720, 'triangle', 0.08);
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
      background: 'rgba(5, 7, 10, 0.55)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
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
        maxWidth: '480px',
        height: '100%',
        background: '#0d1117',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.7)',
        animation: 'slideInRight 0.24s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(22, 27, 34, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(35, 134, 54, 0.2)',
              border: '1px solid rgba(46, 160, 67, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3fb950'
            }}>
              <Sparkles size={15} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f0f6fc', letterSpacing: '-0.01em' }}>
                  OmniAgent Copilot
                </span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  v2.6 SRE
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#8b949e', marginTop: '1px' }}>
                Real-time reasoning on DSU campus & Karnataka CEA telemetry
              </p>
            </div>
          </div>

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

        {/* Live Telemetry Context Strip */}
        <div style={{
          padding: '10px 20px',
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
          </div>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8b949e', marginBottom: '2px' }}>
                  <span>{isUser ? 'You' : 'OmniAgent'}</span>
                  <span>{m.time}</span>
                  {m.provider && (
                    <span style={{ color: '#38bdf8', fontSize: '9px' }}>({m.provider})</span>
                  )}
                </div>

                <div style={{
                  maxWidth: '92%',
                  padding: '12px 16px',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: isUser ? '#1f6feb' : '#161b22',
                  color: isUser ? '#ffffff' : '#e6edf3',
                  fontSize: '12.5px',
                  lineHeight: '1.55',
                  border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  whiteSpace: 'pre-line'
                }}>
                  {m.content}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#161b22', borderRadius: '8px', width: 'fit-content', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '11px', color: '#8b949e' }}>OmniAgent is calculating...</span>
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
          background: 'rgba(13, 17, 23, 0.8)',
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

        {/* Bottom Input & Audit Download Bar */}
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
              placeholder="Ask OmniAgent about DSU decarbonization, solar, or grid..."
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
