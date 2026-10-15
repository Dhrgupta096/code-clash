import React, { useState } from 'react';
import { Zap, Sun, ShieldCheck, Activity, ArrowDownRight, Sparkles, TrendingDown } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';

export default function MicrogridLoadChart({ simState }) {
  const [hoveredHour, setHoveredHour] = useState(null);

  const { fleetEv = 30, aiSolarShift = true, solarCapacity = 350, hvacOpt = 40 } = simState;

  // Generate 24-Hour Diurnal Microgrid Curve
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const curveData = hours.map(h => {
    // 1. Solar Generation Profile (Bell Curve between 06:00 and 18:00, apex at 12:30)
    let solarKW = 0;
    if (h >= 6 && h <= 18) {
      const solarAngle = ((h - 6) / 12) * Math.PI;
      solarKW = Math.round(solarCapacity * Math.pow(Math.sin(solarAngle), 1.25));
    }

    // 2. Base Campus Academic & Hospital Demand (kW)
    // Night baseload: 70 kW (hospital ICU, server cooling, campus lighting)
    // Day peak: 340 kW (lectures, labs, HVAC chiller chill water loop, student workstations)
    let baselineLoad = 72;
    if (h >= 7 && h <= 19) {
      const dayFactor = Math.sin(((h - 7) / 12) * Math.PI);
      baselineLoad = Math.round(72 + 250 * Math.pow(dayFactor, 0.85));
    } else if (h >= 20 && h <= 23) {
      baselineLoad = Math.round(72 + 60 * Math.cos(((h - 20) / 4) * (Math.PI / 2)));
    }

    // Add un-managed DGX compute peak at 19:00 - 22:00 in baseline (students running evening training jobs)
    if (!aiSolarShift && h >= 18 && h <= 22) {
      baselineLoad += 46;
    }

    // 3. SRE-Optimized Load Curve
    let optLoad = baselineLoad;

    // A. AI Solar Shift: Move 46 kW compute from evening into 11:00 - 15:00 solar window
    if (aiSolarShift) {
      if (h >= 18 && h <= 22) {
        // Evening load is cleanly avoided
        optLoad = Math.max(72, optLoad - 38);
      }
      if (h >= 11 && h <= 14) {
        // Shifted under peak solar curve
        optLoad += 28;
      }
    }

    // B. HVAC Chiller Optimization: Variable Speed Drive trims peak hours (11:00 - 16:00)
    if (h >= 11 && h <= 16) {
      const hvacTrim = Math.round(36 * (hvacOpt / 100));
      optLoad = Math.max(80, optLoad - hvacTrim);
    }

    // C. Fleet EV Charging: Shift charging to off-peak night hours (01:00 - 05:00)
    if (h >= 1 && h <= 4) {
      const evChargeLoad = Math.round(42 * (fleetEv / 100));
      optLoad += evChargeLoad;
    }

    // 4. Net Grid Import (kW drawn from Karnataka KPTCL grid)
    const netGridImport = Math.max(0, optLoad - solarKW);
    const solarSurplus = Math.max(0, solarKW - optLoad);

    return {
      hour: h,
      label: `${h.toString().padStart(2, '0')}:00`,
      solarKW,
      baselineLoad,
      optLoad,
      netGridImport,
      solarSurplus
    };
  });

  // Calculate Peak Shaving Statistics
  const maxBaseline = Math.max(...curveData.map(d => d.baselineLoad));
  const maxOptimized = Math.max(...curveData.map(d => d.optLoad));
  const peakShavedKW = maxBaseline - maxOptimized;
  const peakShavedPct = ((peakShavedKW / maxBaseline) * 100).toFixed(1);

  const totalSolarYieldKWh = curveData.reduce((acc, d) => acc + d.solarKW, 0);
  const totalCleanDirectKWh = curveData.reduce((acc, d) => acc + Math.min(d.optLoad, d.solarKW), 0);
  const selfConsumptionPct = totalSolarYieldKWh > 0 ? ((totalCleanDirectKWh / totalSolarYieldKWh) * 100).toFixed(1) : 0;

  // SVG Geometry Dimensions
  const svgWidth = 860;
  const svgHeight = 220;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 20;
  const padBottom = 35;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;
  const maxKW = 450; // Y axis ceiling

  const getX = (hour) => padLeft + (hour / 23) * chartW;
  const getY = (kw) => padTop + chartH - (kw / maxKW) * chartH;

  // Build SVG Paths
  const buildSmoothPath = (points) => {
    return points.reduce((acc, p, i, a) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = a[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }, '');
  };

  const baselinePoints = curveData.map(d => ({ x: getX(d.hour), y: getY(d.baselineLoad) }));
  const optPoints = curveData.map(d => ({ x: getX(d.hour), y: getY(d.optLoad) }));
  const solarPoints = curveData.map(d => ({ x: getX(d.hour), y: getY(d.solarKW) }));

  const baselinePath = buildSmoothPath(baselinePoints);
  const optPath = buildSmoothPath(optPoints);
  const solarPath = buildSmoothPath(solarPoints);
  const solarAreaPath = `${solarPath} L ${getX(23)} ${padTop + chartH} L ${getX(0)} ${padTop + chartH} Z`;

  const activeHoverData = hoveredHour !== null ? curveData[hoveredHour] : curveData[13];

  return (
    <div className="hud-corner-box">
      <SpotlightCard
        spotlightColor="rgba(16, 185, 129, 0.15)"
        spotlightSize={420}
        style={{ padding: '22px', borderRadius: '20px', border: '1px solid var(--border-medium)' }}
      >
        {/* Header & SRE Domain Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="var(--emerald)" />
              <span className="swiss-label" style={{ color: 'var(--emerald)' }}>
                [SRE MICROGRID ORCHESTRATION // 24-HOUR DIURNAL LOAD PROFILE]
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-pure)', margin: '3px 0 0 0', letterSpacing: '-0.02em' }}>
              Dynamic Peak-Shaving & Solar-Shifted Dispatch Curve
            </h2>
          </div>

          {/* Interactive Chart Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '2px', background: '#ff5500', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-muted)' }}>Baseline Grid Demand</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '3px', background: 'var(--emerald)', display: 'inline-block', boxShadow: '0 0 8px var(--emerald)' }} />
              <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>SRE Optimized Load</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '12px', height: '10px', background: 'rgba(212, 255, 0, 0.25)', border: '1px solid var(--phosphor)', borderRadius: '2px', display: 'inline-block' }} />
              <span style={{ color: 'var(--phosphor)' }}>Rooftop Solar PV ({solarCapacity} kW)</span>
            </div>
          </div>
        </div>

        {/* 24-Hour Interactive SVG Canvas */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: '100%', height: 'auto', maxHeight: '240px', overflow: 'visible', display: 'block' }}
          >
            <defs>
              {/* Solar Area Gradient */}
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4ff00" stopOpacity="0.32" />
                <stop offset="70%" stopColor="#d4ff00" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#d4ff00" stopOpacity="0.00" />
              </linearGradient>

              {/* SRE Solar Time Shift Band Gradient */}
              <linearGradient id="aiShiftBand" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(56, 189, 248, 0.12)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[0, 100, 200, 300, 400].map(kw => {
              const y = getY(kw);
              return (
                <g key={kw}>
                  <line x1={padLeft} y1={y} x2={svgWidth - padRight} y2={y} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray={kw === 0 ? 'none' : '4 4'} />
                  <text x={padLeft - 8} y={y + 3.5} fill="#64748b" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">
                    {kw} kW
                  </text>
                </g>
              );
            })}

            {/* Highlight AI Solar-Shift Window (11:00 - 15:00) */}
            {aiSolarShift && (
              <rect
                x={getX(11)}
                y={padTop}
                width={getX(15) - getX(11)}
                height={chartH}
                fill="url(#aiShiftBand)"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeDasharray="4 4"
              />
            )}

            {/* Solar Generation Filled Curve */}
            <path d={solarAreaPath} fill="url(#solarGradient)" />
            <path d={solarPath} fill="none" stroke="var(--phosphor)" strokeWidth="1.8" strokeDasharray="3 3" />

            {/* Baseline Load Curve (Red/Amber) */}
            <path d={baselinePath} fill="none" stroke="#ff5500" strokeWidth="1.6" opacity="0.65" strokeDasharray="5 3" />

            {/* SRE Optimized Load Curve (Vibrant Emerald) */}
            <path
              d={optPath}
              fill="none"
              stroke="var(--emerald)"
              strokeWidth="2.6"
              style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' }}
            />

            {/* X-Axis Hour Labels */}
            {[0, 3, 6, 9, 12, 15, 18, 21, 23].map(h => (
              <text key={h} x={getX(h)} y={padTop + chartH + 16} fill="#94a3b8" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
                {h.toString().padStart(2, '0')}:00
              </text>
            ))}

            {/* Interactive Hover Guides & Collision Sensor Columns */}
            {hours.map(h => {
              const x = getX(h);
              const isHovered = hoveredHour === h;
              return (
                <g key={h} onMouseEnter={() => setHoveredHour(h)} onMouseLeave={() => setHoveredHour(null)} style={{ cursor: 'pointer' }}>
                  {/* Invisible broad hitbox for each hour */}
                  <rect
                    x={x - chartW / 46}
                    y={padTop}
                    width={chartW / 23}
                    height={chartH}
                    fill="transparent"
                  />
                  {/* Vertical Guide Line */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padTop}
                      x2={x}
                      y2={padTop + chartH}
                      stroke="var(--cyan)"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />
                  )}
                  {/* Active Nodes on Points */}
                  {isHovered && (
                    <>
                      <circle cx={x} cy={getY(curveData[h].optLoad)} r="4" fill="var(--emerald)" stroke="#fff" strokeWidth="1.5" />
                      <circle cx={x} cy={getY(curveData[h].baselineLoad)} r="3" fill="#ff5500" />
                      {curveData[h].solarKW > 0 && (
                        <circle cx={x} cy={getY(curveData[h].solarKW)} r="3.5" fill="var(--phosphor)" />
                      )}
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Real-Time SRE Dispatch Telemetry Deck */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {/* Card 1: Peak Demand Shaved */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <TrendingDown size={12} color="var(--emerald)" />
              <span className="swiss-label" style={{ color: 'var(--emerald)' }}>PEAK DEMAND SHAVED</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span className="mono-nums" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--emerald)' }}>
                -{peakShavedKW} kW
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(-{peakShavedPct}%)</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              From {maxBaseline} kW down to {maxOptimized} kW
            </span>
          </div>

          {/* Card 2: Solar Self-Consumption */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <Sun size={12} color="var(--phosphor)" />
              <span className="swiss-label" style={{ color: 'var(--phosphor)' }}>SOLAR SELF-CONSUMPTION</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span className="mono-nums" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--phosphor)' }}>
                {selfConsumptionPct}%
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Direct Utilization</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {totalCleanDirectKWh.toLocaleString()} kWh/day clean power
            </span>
          </div>

          {/* Card 3: AI Workload Solar Alignment */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <Sparkles size={12} color="var(--cyan)" />
              <span className="swiss-label" style={{ color: 'var(--cyan)' }}>AI SOLAR-SHIFT WINDOW</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span className="mono-nums" style={{ fontSize: '18px', fontWeight: 800, color: aiSolarShift ? 'var(--cyan)' : 'var(--text-muted)' }}>
                {aiSolarShift ? '11:00 – 14:30' : 'OFFLINE'}
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {aiSolarShift ? '46 kW DGX jobs locked to solar apex' : 'DGX running on dirty evening coal'}
            </span>
          </div>

          {/* Card 4: Hover Inspection Telemetry */}
          <div style={{ background: 'rgba(56, 189, 248, 0.04)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span className="swiss-label" style={{ color: 'var(--cyan)' }}>INSPECTOR @ {activeHoverData.label}</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>HOVER HOUR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Net Grid Import:</span>
              <strong style={{ color: activeHoverData.netGridImport === 0 ? 'var(--emerald)' : 'var(--text-pure)' }}>
                {activeHoverData.netGridImport} kW
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              <span>Solar: <strong style={{ color: 'var(--phosphor)' }}>{activeHoverData.solarKW} kW</strong></span>
              <span>Load: <strong style={{ color: 'var(--emerald)' }}>{activeHoverData.optLoad} kW</strong></span>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
