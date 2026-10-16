import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Minimize2, 
  Download, 
  Volume2, 
  VolumeX, 
  Printer, 
  Sparkles,
  Zap,
  Globe,
  Building2,
  Eye,
  Sliders,
  FileText,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { exportOmniCarbonPptx } from '../utils/pptxExport';

const SLIDES = [
  {
    id: 'intro',
    chapter: '00',
    title: 'OMNICARBON',
    tagline: 'Autonomous Decarbonization Digital Twin & SRE Control Plane',
    category: 'MISSION INITIALIZATION',
    icon: Globe,
    badgeColor: '#d4ff00',
    cameraTarget: { rotY: 0, scale: 1.0, fov: 45 },
    content: {
      lead: 'An end-to-end reliability engineering platform synchronizing real-time Karnataka grid telemetry, 140-acre 3D spatial twin meshes, NVIDIA Metropolis edge computer vision, and generative SRE playbooks for institutional sustainability.',
      metrics: [
        { label: 'CAMPUS FOOTPRINT', val: '140 ACRES', sub: 'DSU Harohalli Ground Truth (pano.xml)' },
        { label: 'GRID SYNCHRONIZATION', val: '50.02 HZ', sub: 'Live Karnataka SLDC & CEA Baseline' },
        { label: 'EDGE INFERENCE', val: '275 TOPS', sub: 'Simulated Jetson AGX Orin / DeepStream 7.0' },
        { label: 'ANNUAL OPEX IMPACT', val: '₹ 24.8 L', sub: '412 MT CO₂e Direct Annual Abatement' }
      ]
    }
  },
  {
    id: 'problem',
    chapter: '01',
    title: 'THE INVISIBLE CARBON LEAK',
    tagline: 'Campus Reliability & Emissions Dilemma',
    category: 'PROBLEM STATEMENT',
    icon: TrendingDown,
    badgeColor: '#ef4444',
    cameraTarget: { rotY: 0.8, scale: 1.15, fov: 42 },
    content: {
      lead: 'Higher education and research campuses consume gigawatt-hours annually while navigating 3 systemic blind spots that inflate utility OPEX and scope 1 & 2 carbon footprints.',
      columns: [
        {
          num: '01',
          title: 'Dirty Peak-Grid Surges',
          desc: 'Karnataka grid baseline hits 0.716 kg CO₂/kWh during evening thermal peaks (18:00–22:00). Running campus HVAC chillers and DGX compute racks during these windows causes massive emissions and peak tariff penalties.',
          stat: '0.716 kg CO₂/kWh',
          statLabel: 'CEA v20.0 Combined Margin'
        },
        {
          num: '02',
          title: 'Unmitigated Diesel Idling',
          desc: 'Shuttle buses and delivery fleets idle for 15–40 minutes at Gate 1 loops, releasing localized PM2.5 carcinogens and wasting ₹3.4L in fuel every semester without telemetry.',
          stat: '180+ SECONDS',
          statLabel: 'Avg Gate 1 Bus Dwell'
        },
        {
          num: '03',
          title: 'Quarterly Spreadsheet Delay',
          desc: 'Legacy ESG accounting relies on utility bill entry 60–90 days post-facto. Campus reliability engineers cannot intervene diurnally or dispatch peak-shaving storage proactively.',
          stat: '90-DAY DELAY',
          statLabel: 'Traditional Audit Latency'
        }
      ]
    }
  },
  {
    id: 'telemetry',
    chapter: '02',
    title: 'ORBITAL TELEMETRY & GRID SYNC',
    tagline: 'Connecting Macro Atmospheric & Grid Telemetry',
    category: 'DATA INGESTION',
    icon: Zap,
    badgeColor: '#38bdf8',
    cameraTarget: { rotY: 1.6, scale: 1.3, fov: 40 },
    content: {
      lead: 'Macro telemetry directly streams into the OmniCarbon control plane, substituting static emissions estimates with empirical physical sensor feeds.',
      features: [
        {
          title: 'Karnataka SLDC Real-Time Sync (50.02 Hz)',
          desc: 'Monitors the state-load dispatch frequency. Sub-50Hz frequency dips trigger automated load-shedding and battery energy storage dispatch before brownout conditions emerge.'
        },
        {
          title: 'NASA POWER MERRA-2 Solar Irradiance',
          desc: 'Extracts real-time Global Horizontal Irradiance (GHI) and surface meteorological data at 12.97°N, 77.59°E to forecast campus rooftop solar generation curves with 94.2% accuracy.'
        },
        {
          title: 'Marginal vs Average Emission Factors',
          desc: 'Leverages Central Electricity Authority (CEA v20.0) combined margin baseline data rather than national averages, enabling surgical, carbon-aware compute and chiller load shifting.'
        }
      ],
      terminalLines: [
        'TELEMETRY_LINK: KPTCL_SLDC_ONLINE',
        'GRID_FREQUENCY: 50.02 Hz [NOMINAL]',
        'MARGINAL_CARBON: 0.716 kg CO₂/kWh',
        'SOLAR_FLUX_GHI: 842 W/m² @ 28.4°C',
        'CAMPUS_SUBSTATION: 66/11 kV DEDICATED',
        'DISPATCH_STATUS: OPTIMIZED'
      ]
    }
  },
  {
    id: 'spatial',
    chapter: '03',
    title: '140-ACRE 3D SPATIAL TWIN',
    tagline: 'Authentic Campus Infrastructure Reconstruction',
    category: 'SPATIAL DIGITAL TWIN',
    icon: Building2,
    badgeColor: '#10b981',
    cameraTarget: { rotY: 2.4, scale: 1.45, fov: 38 },
    content: {
      lead: 'Built from official DSU ground-truth virtual tour coordinates (`pano.xml`), providing interactive 3D WebGL inspection of all campus physical infrastructure.',
      zones: [
        {
          id: 'Z-01',
          name: 'Academic Blocks A & B',
          spec: '350 kW Rooftop Solar PV · 18 Smart Inverters · Real-time kWh Sub-metering'
        },
        {
          id: 'Z-02',
          name: 'NVIDIA DGX AI Lab',
          spec: 'A100 Compute Cluster · 85 kW Thermal Load · Dynamic Carbon-Aware Job Queuing'
        },
        {
          id: 'Z-03',
          name: 'Central Chiller Plant',
          spec: '450 TR Water-Cooled Chillers · COP 5.8 Optimized · Diurnal Pre-cooling Logic'
        },
        {
          id: 'Z-04',
          name: 'Hostel Microgrid & BESS',
          spec: '500 kWh Lithium Iron Phosphate BESS · Solar Carport EV Fast-Charging Hub'
        }
      ]
    }
  },
  {
    id: 'vision',
    chapter: '04',
    title: 'METROPOLIS EDGE AI VISION',
    tagline: 'Hardware-Accelerated Computer Vision at Gate 1',
    category: 'EDGE INFERENCE',
    icon: Eye,
    badgeColor: '#a855f7',
    cameraTarget: { rotY: 3.2, scale: 1.3, fov: 42 },
    content: {
      lead: 'Simulating an NVIDIA Jetson AGX Orin platform (275 TOPS, FP16/INT8 TensorRT 10.2) running DeepStream 7.0 for vehicular idle detection and emissions forensics.',
      steps: [
        {
          step: 'STAGE 01',
          title: 'RTSP Stream Ingest',
          desc: 'High-throughput hardware video decode across campus perimeter CCTV and Gate 1 arrival loops.'
        },
        {
          step: 'STAGE 02',
          title: 'TensorRT 10.2 YOLO-v8x',
          desc: 'Sub-millisecond inference classifying campus shuttles, delivery trucks, and private vehicles at 38 FPS.'
        },
        {
          step: 'STAGE 03',
          title: 'DeepStream 7.0 Dwell Tracker',
          desc: 'Tracks stationary dwell duration with pixel velocity matching; raises breach events past 180 seconds.'
        },
        {
          step: 'STAGE 04',
          title: 'IISc CES Empirical Forensics',
          desc: 'Applies Ramachandra et al. Table 6 factors to calculate exact grams of CO₂ and PM2.5 tailpipe output.'
        }
      ]
    }
  },
  {
    id: 'simulator',
    chapter: '05',
    title: 'DIURNAL MICROGRID SOLVER',
    tagline: 'Finite Physics Mathematical What-If Sandbox',
    category: 'PREDICTIVE SIMULATION',
    icon: Sliders,
    badgeColor: '#f59e0b',
    cameraTarget: { rotY: 4.0, scale: 1.2, fov: 45 },
    content: {
      lead: 'Interactive 24-hour diurnal dispatch solver evaluating multi-variable physical constraints and forecasting carbon reduction curves in real time.',
      levers: [
        {
          name: 'Fleet Electrification',
          range: '0% → 100% EV',
          formula: 'Replaces 4.2 km/L diesel shuttles with 1.1 kWh/km electric buses charged via solar.',
          impact: 'Abates 84.6 MT CO₂e / Year'
        },
        {
          name: 'Solar Expansion',
          range: '100 kW → 1000 kW',
          formula: 'Calculates roof area yield using NASA POWER MERRA-2 diurnal solar irradiation curve.',
          impact: 'Generates 512 MWh / Year Clean'
        },
        {
          name: 'BESS Peak Shaving',
          range: '250 kWh → 1000 kWh',
          formula: 'Charges during solar peak (11:00-14:00); discharges during dirty peak grid (18:00-22:00).',
          impact: 'Eliminates ₹6.2L Peak Tariff'
        },
        {
          name: 'HVAC Chiller COP Tuning',
          range: 'COP 4.2 → COP 6.5',
          formula: 'Dynamic chilled water setpoint optimization reducing base-load chiller kW by 28%.',
          impact: 'Saves 112 MWh Electricity'
        }
      ]
    }
  },
  {
    id: 'playbook',
    chapter: '06',
    title: 'GENERATIVE SRE PLAYBOOK',
    tagline: 'Autonomous AI Decarbonization Dispatch Plane',
    category: 'NVIDIA NIM AGENT',
    icon: FileText,
    badgeColor: '#ec4899',
    cameraTarget: { rotY: 4.8, scale: 1.15, fov: 44 },
    content: {
      lead: 'NVIDIA NIM generative AI reasoning engine that analyzes real-time grid stresses and automatically synthesizes calibrated SRE mitigation actions.',
      phases: [
        {
          phase: 'PHASE 01 // IMMEDIATE (0 - 2 HOURS)',
          title: 'Tactical Peak Shaving & Idle Interception',
          points: [
            'Push automated alert to Gate 1 security terminal for 3 idling diesel shuttles',
            'Ramp BESS discharge to 180 kW as Karnataka grid frequency dips below 49.95 Hz',
            'Throttle non-urgent DGX A100 training checkpoints to night window'
          ]
        },
        {
          phase: 'PHASE 02 // DIURNAL (2 - 24 HOURS)',
          title: 'Diurnal Thermal Pre-Cooling Shift',
          points: [
            'Pre-cool Academic Block auditoriums to 21°C during peak solar irradiation (12:00-14:00)',
            'Float chiller setpoint to 24°C during evening peak tariff window (18:00-21:00)',
            'Schedule overnight EV fleet charging only when state wind share exceeds 40%'
          ]
        },
        {
          phase: 'PHASE 03 // STRATEGIC (1 - 3 YEARS)',
          title: 'Institutional Microgrid Autonomy',
          points: [
            'Commission Phase 2 650 kW solar canopy across student hostel rooftops',
            'Implement ISO 14064 cryptographic ledger for verifiable carbon credit issuance',
            'Achieve 100% zero-diesel internal mobility across DSU Harohalli campus'
          ]
        }
      ]
    }
  },
  {
    id: 'roi',
    chapter: '07',
    title: 'FINANCIAL ROI & ESG AUDIT',
    tagline: 'Measurable Financial Impact & ISO 14064 Compliance',
    category: 'AUDIT & FORENSICS',
    icon: ShieldCheck,
    badgeColor: '#10b981',
    cameraTarget: { rotY: 5.6, scale: 1.1, fov: 46 },
    content: {
      lead: 'Transforming environmental sustainability from a compliance burden into a direct cost-reduction engine for institutional leadership.',
      cards: [
        {
          label: 'ANNUAL OPEX SAVINGS',
          val: '₹ 24,80,000',
          desc: 'Direct utility bill and diesel expenditure reduction achieved through peak-shaving and solar alignment.',
          color: '#d4ff00'
        },
        {
          label: 'NET CARBON ABATEMENT',
          val: '412.5 MT CO₂e',
          desc: 'Equivalent to taking 89 passenger cars off the road or planting 19,000 mature trees on campus.',
          color: '#10b981'
        },
        {
          label: 'CAPEX PAYBACK PERIOD',
          val: '2.8 YEARS',
          desc: 'Accelerated payback supported by Karnataka clean energy tax credits and avoided diesel fuel logistics.',
          color: '#38bdf8'
        },
        {
          label: 'AUDIT COMPLIANCE',
          val: 'ISO 14064-1',
          desc: '1-click verifiable ESG report generation with cryptographic SHA-256 telemetry timestamping.',
          color: '#a855f7'
        }
      ]
    }
  },
  {
    id: 'conclusion',
    chapter: '08',
    title: 'THE AUTONOMOUS SRE HORIZON',
    tagline: 'Live Production System // Built for Code Clash',
    category: 'SYSTEM EVALUATION',
    icon: CheckCircle2,
    badgeColor: '#d4ff00',
    cameraTarget: { rotY: 6.28, scale: 1.0, fov: 45 },
    content: {
      lead: 'Autonomous decarbonization is no longer speculative. OmniCarbon is running live with zero external cloud dependencies.',
      liveUrl: 'https://dhrgupta096.github.io/code-clash/',
      highlights: [
        'Full-Stack Reliability: Vite + React 19 + Three.js WebGL + Bun SRE backend with sub-millisecond local telemetry',
        'Ground-Truth Geometry: Direct 3D reconstruction from official DSU virtual tour pano.xml',
        'Empirical Physics: Ingests Karnataka SLDC 50.02 Hz grid telemetry, CEA v20.0, and NASA POWER MERRA-2',
        'Edge AI Integration: Simulates NVIDIA Jetson AGX Orin with DeepStream 7.0 & IISc Table 6 factors',
        'Predictive What-If Sandbox: Real-time diurnal microgrid mathematical solver forecasting INR savings',
        'Audit-Ready: 1-click verifiable ISO 14064 compliance reporting and downloadable PowerPoint slide decks'
      ]
    }
  }
];

export default function EdolusPresentationDeck({
  isOpen,
  onClose,
  soundEnabled = true,
  onToggleSound,
  playSound
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);
  const threeSceneRef = useRef(null);

  const slide = SLIDES[currentSlide];

  // Sound trigger helper
  const triggerSlideSound = useCallback((idx) => {
    if (playSound) {
      playSound(380 + idx * 45, 'sine', 0.12);
    }
  }, [playSound]);

  // Navigate next / prev
  const handleNext = useCallback(() => {
    setCurrentSlide(prev => {
      const next = (prev + 1) % SLIDES.length;
      triggerSlideSound(next);
      return next;
    });
  }, [triggerSlideSound]);

  const handlePrev = useCallback(() => {
    setCurrentSlide(prev => {
      const next = (prev - 1 + SLIDES.length) % SLIDES.length;
      triggerSlideSound(next);
      return next;
    });
  }, [triggerSlideSound]);

  const handleSelectSlide = (idx) => {
    if (idx === currentSlide) return;
    triggerSlideSound(idx);
    setCurrentSlide(idx);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Export PPTX handler
  const handleExportPptx = async () => {
    setIsExporting(true);
    if (playSound) playSound(880, 'triangle', 0.15);
    try {
      await exportOmniCarbonPptx();
      if (playSound) playSound(1020, 'sine', 0.2);
    } catch (err) {
      console.error('PPTX Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Print PDF handler
  const handlePrint = () => {
    window.print();
  };

  // Setup Three.js 3D Background with Orbiting Earth & Cyber Dust
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const container = canvasRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020408, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: container,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Glowing Wireframe Earth Sphere
    const earthGeo = new THREE.SphereGeometry(1.6, 36, 36);
    const earthMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // 2. Inner Solid Dark Core
    const coreGeo = new THREE.SphereGeometry(1.57, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x030812,
      transparent: true,
      opacity: 0.95
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 3. Orbiting Telemetry Rings (Latitude / Orbital Arcs)
    const ringGeo = new THREE.RingGeometry(2.1, 2.12, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.8;
    scene.add(ringMesh);

    const ringGeo2 = new THREE.RingGeometry(2.5, 2.51, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 3.4;
    ringMesh2.rotation.y = Math.PI / 6;
    scene.add(ringMesh2);

    // 4. Floating Cyber Particle Field (Satellites & Telemetry Nodes)
    const particleCount = 280;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 14;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // 5. Ambient Grid Plane at bottom
    const gridHelper = new THREE.GridHelper(20, 24, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -2.4;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.22;
    scene.add(gridHelper);

    threeSceneRef.current = {
      scene,
      camera,
      renderer,
      earthMesh,
      ringMesh,
      ringMesh2,
      particleMesh,
      targetRotY: 0,
      targetFov: 45
    };

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (threeSceneRef.current) {
        const { earthMesh, ringMesh, ringMesh2, particleMesh, camera } = threeSceneRef.current;
        earthMesh.rotation.y += 0.0018;
        ringMesh.rotation.z += 0.0012;
        ringMesh2.rotation.z -= 0.0009;
        particleMesh.rotation.y += 0.0004;

        // Smoothly interpolate to slide camera targets
        const target = SLIDES[currentSlide]?.cameraTarget;
        if (target) {
          earthMesh.rotation.y += (target.rotY - earthMesh.rotation.y) * 0.03;
          camera.fov += (target.fov - camera.fov) * 0.04;
          camera.updateProjectionMatrix();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#020408',
      color: '#f8fafc',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      {/* Real-time 3D Three.js WebGL Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Cyber Grid Lines Overlay (edolus.com signature) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Ambient Radial Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 4, 8, 0.85) 90%)',
        pointerEvents: 'none',
        zIndex: 3
      }} />

      {/* ============================================================== */}
      {/* TOP HUD BAR */}
      {/* ============================================================== */}
      <header style={{
        position: 'relative',
        zIndex: 20,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        background: 'rgba(2, 4, 8, 0.65)'
      }}>
        {/* Top-Left Telemetry Coordinates */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 9px',
            borderRadius: '4px',
            background: 'rgba(212, 255, 0, 0.1)',
            border: '1px solid rgba(212, 255, 0, 0.3)',
            color: '#d4ff00',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#d4ff00',
              boxShadow: '0 0 8px #d4ff00'
            }} />
            <span>EDOLUS DECK // v3.8</span>
          </div>

          <span style={{
            color: '#94a3b8',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            letterSpacing: '0.5px'
          }}>
            DSU HAROHALLI · 12.9716°N · 77.5946°E
          </span>
        </div>

        {/* Top-Right Telemetry Badges & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '4px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px'
          }}>
            <Zap size={11} />
            <span>SLDC: 50.02 Hz</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px'
          }}>
            <ShieldCheck size={11} />
            <span>CEA: 0.716 kg/kWh</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: soundEnabled ? '#d4ff00' : '#64748b',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title={soundEnabled ? 'Audio Online' : 'Audio Muted'}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#f8fafc',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          {/* Close Deck Button */}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '4px',
              color: '#ef4444',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono, monospace)'
            }}
            title="Exit Presentation (Esc)"
          >
            <X size={13} />
            <span>EXIT</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN SLIDE VIEWPORT (16:9 Aspect Ratio Container) */}
      {/* ============================================================== */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 36px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1240px',
          height: '100%',
          maxHeight: '680px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgba(5, 10, 18, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: '12px',
          padding: '40px 48px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          {/* Slide Category Header & Chapter Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                fontWeight: 800,
                color: slide.badgeColor,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>
                // CHAPTER {slide.chapter} · {slide.category}
              </span>
            </div>

            <div style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: '#64748b'
            }}>
              [ {currentSlide + 1} / {SLIDES.length} ]
            </div>
          </div>

          {/* Slide Heading & Tagline */}
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <h1 style={{
              fontSize: currentSlide === 0 ? '44px' : '32px',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              color: '#ffffff',
              margin: '0 0 6px 0',
              textTransform: 'uppercase'
            }}>
              {slide.title}
            </h1>
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#38bdf8',
              letterSpacing: '0.5px',
              margin: 0,
              fontFamily: 'var(--font-mono, monospace)'
            }}>
              {slide.tagline}
            </p>
          </div>

          {/* Dynamic Content Area per Slide */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* SLIDE 0: TITLE & METRICS */}
            {slide.id === 'intro' && (
              <div>
                <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '850px', marginBottom: '28px' }}>
                  {slide.content.lead}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                  {slide.content.metrics.map((m, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                        {m.label}
                      </span>
                      <span style={{ fontSize: '22px', fontWeight: 900, color: idx === 3 ? '#d4ff00' : '#ffffff', margin: '8px 0 4px 0' }}>
                        {m.val}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.3 }}>
                        {m.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 1: PROBLEM COLUMNS */}
            {slide.id === 'problem' && (
              <div>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '22px', maxWidth: '820px' }}>
                  {slide.content.lead}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {slide.content.columns.map((col, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#ef4444', fontWeight: 800 }}>
                          {col.num} // CRITICAL
                        </span>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: '8px 0 10px 0' }}>
                          {col.title}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                          {col.desc}
                        </p>
                      </div>

                      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8' }}>
                          {col.stat}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
                          {col.statLabel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 2: TELEMETRY & TERMINAL */}
            {slide.id === 'telemetry' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 6px 0' }}>
                    {slide.content.lead}
                  </p>
                  {slide.content.features.map((feat, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '14px 18px'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
                        {feat.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                        {feat.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Terminal Window */}
                <div style={{
                  background: '#040810',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  padding: '20px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
                }}>
                  <div style={{ color: '#d4ff00', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4ff00' }} />
                    <span>// LIVE ORBITAL INGESTION FEED</span>
                  </div>
                  {slide.content.terminalLines.map((line, idx) => (
                    <div key={idx} style={{ color: '#e2e8f0', padding: '4px 0', borderBottom: '1px dashed rgba(255, 255, 255, 0.05)' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 3: 3D SPATIAL TWIN ZONES */}
            {slide.id === 'spatial' && (
              <div>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
                  {slide.content.lead}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {slide.content.zones.map((z, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '18px 22px'
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#10b981', fontWeight: 800 }}>
                        {z.id} // FACILITY NODE
                      </span>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: '6px 0 8px 0' }}>
                        {z.name}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                        {z.spec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 4: VISION PIPELINE */}
            {slide.id === 'vision' && (
              <div>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
                  {slide.content.lead}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                  {slide.content.steps.map((s, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '18px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#a855f7', fontWeight: 800 }}>
                          {s.step}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: '8px 0 10px 0' }}>
                          {s.title}
                        </h4>
                        <p style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 5: SIMULATOR LEVERS */}
            {slide.id === 'simulator' && (
              <div>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
                  {slide.content.lead}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {slide.content.levers.map((lev, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                            {lev.name}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>
                            {lev.range}
                          </span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '8px 0 10px 0', lineHeight: 1.4 }}>
                          {lev.formula}
                        </p>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#d4ff00', fontWeight: 700 }}>
                        {lev.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 6: SRE PLAYBOOK PHASES */}
            {slide.id === 'playbook' && (
              <div>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '18px' }}>
                  {slide.content.lead}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {slide.content.phases.map((ph, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '14px 20px',
                      display: 'grid',
                      gridTemplateColumns: '260px 1fr',
                      gap: '20px',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#ec4899', fontWeight: 800 }}>
                          {ph.phase}
                        </span>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                          {ph.title}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {ph.points.map((pt, pIdx) => (
                          <div key={pIdx} style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#d4ff00' }}>•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 7: FINANCIAL ROI CARDS */}
            {slide.id === 'roi' && (
              <div>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '22px' }}>
                  {slide.content.lead}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {slide.content.cards.map((c, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '20px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                          {c.label}
                        </span>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: c.color, margin: '10px 0 8px 0' }}>
                          {c.val}
                        </div>
                      </div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 8: FINALE & LIVE LINK */}
            {slide.id === 'conclusion' && (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(212, 255, 0, 0.1)',
                  border: '1px solid rgba(212, 255, 0, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  color: '#d4ff00',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '20px'
                }}>
                  <ExternalLink size={13} />
                  <span>LIVE PRODUCTION APPLICATION: dhrgupta096.github.io/code-clash</span>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '14px'
                }}>
                  {slide.content.highlights.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#d4ff00" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Slide Footer Navigation Arrows */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={handlePrev}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono, monospace)'
              }}
            >
              <ChevronLeft size={14} />
              <span>PREVIOUS</span>
            </button>

            {/* Central Scrub Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx)}
                  style={{
                    width: idx === currentSlide ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentSlide ? '#d4ff00' : 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={`Go to Chapter ${s.chapter}: ${s.title}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              style={{
                background: '#d4ff00',
                border: 'none',
                color: '#000000',
                borderRadius: '6px',
                padding: '8px 20px',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono, monospace)',
                boxShadow: '0 0 15px rgba(212, 255, 0, 0.3)'
              }}
            >
              <span>{currentSlide === SLIDES.length - 1 ? 'REPLAY MISSION' : 'NEXT CHAPTER'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* BOTTOM HUD STATUS & PPTX EXPORT BAR */}
      {/* ============================================================== */}
      <footer style={{
        position: 'relative',
        zIndex: 20,
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        background: 'rgba(2, 4, 8, 0.65)'
      }}>
        {/* Chapter Thumbnails Drawer / Jump Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          {SLIDES.map((s, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSlide(idx)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: isActive ? 'rgba(212, 255, 0, 0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212, 255, 0, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
                  color: isActive ? '#d4ff00' : '#64748b',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {s.chapter} {s.title.length > 12 ? s.title.slice(0, 12) + '...' : s.title}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Download PPTX & Print PDF */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
            [ NAV: ← → SPACE ESC ]
          </span>

          <button
            onClick={handlePrint}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
            title="Print or Save as PDF"
          >
            <Printer size={12} />
            <span>PDF</span>
          </button>

          <button
            onClick={handleExportPptx}
            disabled={isExporting}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #d4ff00 0%, #10b981 100%)',
              border: 'none',
              color: '#000000',
              fontSize: '11px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono, monospace)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: isExporting ? 'wait' : 'pointer',
              boxShadow: '0 0 14px rgba(212, 255, 0, 0.35)',
              opacity: isExporting ? 0.7 : 1
            }}
            title="Download real 16:9 Microsoft PowerPoint (.pptx) file"
          >
            <Download size={12} />
            <span>{isExporting ? 'COMPILING PPTX...' : 'DOWNLOAD .PPTX'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
