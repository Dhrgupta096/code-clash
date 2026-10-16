import pptxgen from 'pptxgenjs';

/**
 * Generates and downloads a native 16:9 PowerPoint (.pptx) presentation
 * styled in the exact Edolus dark cyberpunk aesthetic for OmniCarbon.
 */
export async function exportOmniCarbonPptx() {
  const pptx = new pptxgen();

  // Configure 16:9 widescreen layout
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'DSU Knotspot Team // OmniCarbon';
  pptx.company = 'Dayananda Sagar University / Code Clash';
  pptx.subject = 'OmniCarbon SRE Decarbonization Digital Twin Presentation';
  pptx.title = 'OmniCarbon - Edolus Cinematic Deck';

  // Cyberpunk Color Palette
  const C = {
    bg: '030508',
    cardBg: '0a0f18',
    border: '1e293b',
    volt: 'D4FF00',
    cyan: '38BDF8',
    emerald: '10B981',
    white: 'F8FAFC',
    slate: '94A3B8',
    darkSlate: '475569'
  };

  // Helper to add Edolus-style HUD Header & Footer to each slide
  const applyHudTemplate = (slide, chapterNum, chapterName) => {
    // Background fill
    slide.background = { color: C.bg };

    // Top HUD bar
    slide.addText(`[ OMNICARBON // EDOLUS ENGINE v3.8 ] · LAT 12.9716°N · LON 77.5946°E`, {
      x: 0.8,
      y: 0.4,
      w: 6.5,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Courier New',
      color: C.slate,
      bold: true
    });

    slide.addText(`SLDC: 50.02 Hz  |  CEA v20.0: 0.716 kg/kWh  |  ISO 14064 READY`, {
      x: 6.0,
      y: 0.4,
      w: 6.5,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Courier New',
      color: C.cyan,
      align: 'right',
      bold: true
    });

    // Top divider line
    slide.addShape(pptx.ShapeType.line, {
      x: 0.8,
      y: 0.75,
      w: 11.7,
      h: 0,
      line: { color: C.border, width: 1 }
    });

    // Bottom HUD bar
    slide.addShape(pptx.ShapeType.line, {
      x: 0.8,
      y: 6.9,
      w: 11.7,
      h: 0,
      line: { color: C.border, width: 1 }
    });

    slide.addText(`CHAPTER ${chapterNum} // ${chapterName.toUpperCase()}`, {
      x: 0.8,
      y: 7.0,
      w: 6.0,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Courier New',
      color: C.volt,
      bold: true
    });

    slide.addText(`CODE CLASH SRE HACKATHON · DSU HAROHALLI 140-ACRE CAMPUS`, {
      x: 6.5,
      y: 7.0,
      w: 6.0,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Courier New',
      color: C.slate,
      align: 'right'
    });
  };

  // ==========================================
  // SLIDE 1: TITLE // MISSION INITIALIZATION
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '00', 'Mission Initialization');

    slide.addText('OMNICARBON', {
      x: 0.8,
      y: 1.6,
      w: 11.7,
      h: 1.1,
      fontSize: 48,
      fontFace: 'Arial Black',
      color: C.volt,
      bold: true,
      letterSpacing: 2
    });

    slide.addText('AUTONOMOUS DECARBONIZATION DIGITAL TWIN & SRE CONTROL PLANE', {
      x: 0.8,
      y: 2.7,
      w: 11.7,
      h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.cyan,
      bold: true,
      letterSpacing: 1
    });

    slide.addText(
      'An end-to-end reliability engineering platform synchronizing real-time Karnataka grid telemetry, 140-acre 3D spatial twin meshes, NVIDIA Metropolis edge computer vision, and generative SRE playbooks for institutional sustainability.',
      {
        x: 0.8,
        y: 3.3,
        w: 11.7,
        h: 0.8,
        fontSize: 12,
        fontFace: 'Arial',
        color: C.slate,
        lineSpacing: 18
      }
    );

    // 4 Key metric cards
    const metrics = [
      { label: 'CAMPUS FOOTPRINT', val: '140 ACRES', sub: 'DSU Harohalli (pano.xml ground truth)' },
      { label: 'GRID SYNCHRONIZATION', val: '50.02 HZ', sub: 'Karnataka SLDC & CEA 0.716 kg/kWh' },
      { label: 'EDGE INFERENCE', val: '275 TOPS', sub: 'Jetson AGX Orin / DeepStream 7.0' },
      { label: 'ANNUAL OPEX IMPACT', val: '₹24.8 LAKHS', sub: '412 MT CO₂e direct abatement' }
    ];

    metrics.forEach((m, idx) => {
      const xPos = 0.8 + idx * 2.95;
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: 4.4,
        w: 2.8,
        h: 2.0,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1 }
      });

      slide.addText(m.label, {
        x: xPos + 0.2,
        y: 4.6,
        w: 2.4,
        h: 0.3,
        fontSize: 9,
        fontFace: 'Courier New',
        color: C.slate,
        bold: true
      });

      slide.addText(m.val, {
        x: xPos + 0.2,
        y: 5.0,
        w: 2.4,
        h: 0.6,
        fontSize: 18,
        fontFace: 'Arial Black',
        color: idx === 3 ? C.volt : C.white,
        bold: true
      });

      slide.addText(m.sub, {
        x: xPos + 0.2,
        y: 5.65,
        w: 2.4,
        h: 0.6,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: C.slate
      });
    });
  }

  // ==========================================
  // SLIDE 2: THE PROBLEM // THE INVISIBLE CARBON LEAK
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '01', 'The Problem // The Invisible Carbon Leak');

    slide.addText('THE CAMPUS RELIABILITY & CARBON DILEMMA', {
      x: 0.8,
      y: 1.1,
      w: 11.7,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial Black',
      color: C.white,
      bold: true
    });

    slide.addText('Institutional campuses consume millions of kilowatt-hours annually while navigating 3 systemic blind spots:', {
      x: 0.8,
      y: 1.7,
      w: 11.7,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.slate
    });

    const pillars = [
      {
        tag: 'CRISIS 01',
        title: 'Dirty Peak-Grid Reliance',
        desc: 'Karnataka grid baseline reaches 0.716 kg CO₂/kWh. Running compute clusters and HVAC chillers during thermal peak hours triggers severe carbon surges and maximum demand penalty tariffs.',
        stat: '0.716 kg CO₂/kWh',
        statLabel: 'CEA v20.0 Combined Margin'
      },
      {
        tag: 'CRISIS 02',
        title: 'Unmitigated Diesel Idling',
        desc: 'Shuttle buses and delivery fleets idle for 15-40 minutes at campus gates, producing localized PM2.5 hotspots and burning ₹3.4L in wasted fuel without telemetry.',
        stat: '180+ SECONDS',
        statLabel: 'Avg. Gate 1 Shuttle Idling'
      },
      {
        tag: 'CRISIS 03',
        title: 'Quarterly Spreadsheet Delay',
        desc: 'Legacy ESG accounting relies on manual utility bill entry 60-90 days after consumption. SREs have zero real-time visibility to intervene or optimize dispatch diurnally.',
        stat: '90-DAY LAG',
        statLabel: 'Legacy Audit Latency'
      }
    ];

    pillars.forEach((p, idx) => {
      const xPos = 0.8 + idx * 3.95;
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: 2.3,
        w: 3.8,
        h: 4.2,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1 }
      });

      slide.addText(p.tag, {
        x: xPos + 0.3,
        y: 2.6,
        w: 3.2,
        h: 0.3,
        fontSize: 9,
        fontFace: 'Courier New',
        color: C.volt,
        bold: true
      });

      slide.addText(p.title, {
        x: xPos + 0.3,
        y: 3.0,
        w: 3.2,
        h: 0.6,
        fontSize: 16,
        fontFace: 'Arial Black',
        color: C.white,
        bold: true
      });

      slide.addText(p.desc, {
        x: xPos + 0.3,
        y: 3.7,
        w: 3.2,
        h: 1.4,
        fontSize: 10.5,
        fontFace: 'Arial',
        color: C.slate,
        lineSpacing: 16
      });

      slide.addShape(pptx.ShapeType.line, {
        x: xPos + 0.3,
        y: 5.3,
        w: 3.2,
        h: 0,
        line: { color: C.border, width: 1 }
      });

      slide.addText(p.stat, {
        x: xPos + 0.3,
        y: 5.5,
        w: 3.2,
        h: 0.4,
        fontSize: 15,
        fontFace: 'Arial Black',
        color: C.cyan,
        bold: true
      });

      slide.addText(p.statLabel, {
        x: xPos + 0.3,
        y: 5.95,
        w: 3.2,
        h: 0.3,
        fontSize: 8.5,
        fontFace: 'Courier New',
        color: C.slate
      });
    });
  }

  // ==========================================
  // SLIDE 3: CHAPTER 02 // ORBITAL TELEMETRY & GRID SYNC
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '02', 'Orbital Telemetry & Grid Synchronization');

    slide.addText('PLANETARY TELEMETRY & GRID SYNCHRONIZATION', {
      x: 0.8,
      y: 1.1,
      w: 11.7,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial Black',
      color: C.white,
      bold: true
    });

    slide.addText('Connecting campus operations to macro atmospheric data and state grid frequencies.', {
      x: 0.8,
      y: 1.7,
      w: 11.7,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.slate
    });

    // Left: Architectural highlights
    const items = [
      {
        t: 'Karnataka SLDC Frequency Sync (50.02 Hz)',
        d: 'Live state-load dispatch center frequency polling detects grid stress. Frequency drops trigger automated load shedding and battery discharge.'
      },
      {
        t: 'NASA POWER MERRA-2 Solar Irradiance',
        d: 'Extracts real-time Global Horizontal Irradiance (GHI) and surface meteorological data at 12.97°N, 77.59°E to forecast campus solar output.'
      },
      {
        t: 'Marginal vs Average Emission Dispatch',
        d: 'Replaces static averages with Central Electricity Authority (CEA v20.0) combined margin baseline factors for surgical SRE dispatch.'
      }
    ];

    items.forEach((item, idx) => {
      const yPos = 2.4 + idx * 1.4;
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 7.2,
        h: 1.25,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1 }
      });

      slide.addText(item.t, {
        x: 1.1,
        y: yPos + 0.15,
        w: 6.6,
        h: 0.35,
        fontSize: 13,
        fontFace: 'Arial Black',
        color: C.cyan,
        bold: true
      });

      slide.addText(item.d, {
        x: 1.1,
        y: yPos + 0.52,
        w: 6.6,
        h: 0.65,
        fontSize: 10,
        fontFace: 'Arial',
        color: C.slate,
        lineSpacing: 15
      });
    });

    // Right: Live Telemetry Telemetry Terminal
    slide.addShape(pptx.ShapeType.rect, {
      x: 8.3,
      y: 2.4,
      w: 4.2,
      h: 4.1,
      fill: { color: '050b14' },
      line: { color: C.cyan, width: 1 }
    });

    slide.addText('// LIVE TELEMETRY FEED', {
      x: 8.6,
      y: 2.65,
      w: 3.6,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Courier New',
      color: C.volt,
      bold: true
    });

    const feedLines = [
      'GEO: DSU Harohalli Campus',
      'COORDS: 12.9716°N, 77.5946°E',
      'FREQ: 50.02 Hz (NOMINAL)',
      'GRID CO₂: 0.716 kg/kWh',
      'SOLAR FLUX: 842 W/m² GHI',
      'WIND FACTOR: 3.2 m/s @ 28°C',
      'SUBSTATION: 66/11kV Dedicated',
      'STATUS: SECURE_LINK_ACTIVE'
    ];

    slide.addText(feedLines.join('\n'), {
      x: 8.6,
      y: 3.1,
      w: 3.6,
      h: 3.2,
      fontSize: 10,
      fontFace: 'Courier New',
      color: C.white,
      lineSpacing: 22
    });
  }

  // ==========================================
  // SLIDE 4: CHAPTER 03 // 3D SPATIAL DIGITAL TWIN
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '03', '3D Spatial Digital Twin // DSU Harohalli');

    slide.addText('140-ACRE PHYSICAL INFRASTRUCTURE TWIN', {
      x: 0.8,
      y: 1.1,
      w: 11.7,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial Black',
      color: C.white,
      bold: true
    });

    slide.addText('Built from official DSU ground truth pano.xml coordinates with interactive Three.js WebGL telemetry.', {
      x: 0.8,
      y: 1.7,
      w: 11.7,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.slate
    });

    const zones = [
      { name: 'ACADEMIC BLOCKS (A & B)', spec: '350 kW Rooftop Solar PV · 18 Smart Inverters · Real-time kWh metering' },
      { name: 'NVIDIA DGX AI LAB', spec: 'A100 Compute Cluster · 85 kW Thermal Load · Dynamic Carbon-Aware Queuing' },
      { name: 'CENTRAL CHILLER PLANT', spec: '450 TR Water-Cooled Chillers · COP 5.8 Optimized · Peak-shaving dispatch' },
      { name: 'HOSTEL MICROGRID & BESS', spec: '500 kWh Lithium Iron Phosphate BESS · Solar Carport EV Fast Chargers' }
    ];

    zones.forEach((z, idx) => {
      const xPos = 0.8 + (idx % 2) * 5.95;
      const yPos = 2.4 + Math.floor(idx / 2) * 2.05;

      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: yPos,
        w: 5.75,
        h: 1.85,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1 }
      });

      slide.addText(`FACILITY NODE // 0${idx + 1}`, {
        x: xPos + 0.3,
        y: yPos + 0.2,
        w: 5.15,
        h: 0.25,
        fontSize: 9,
        fontFace: 'Courier New',
        color: C.volt,
        bold: true
      });

      slide.addText(z.name, {
        x: xPos + 0.3,
        y: yPos + 0.5,
        w: 5.15,
        h: 0.4,
        fontSize: 14,
        fontFace: 'Arial Black',
        color: C.white,
        bold: true
      });

      slide.addText(z.spec, {
        x: xPos + 0.3,
        y: yPos + 0.95,
        w: 5.15,
        h: 0.7,
        fontSize: 10.5,
        fontFace: 'Arial',
        color: C.slate,
        lineSpacing: 16
      });
    });
  }

  // ==========================================
  // SLIDE 5: CHAPTER 04 // METROPOLIS EDGE AI COMPUTER VISION
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '04', 'Metropolis Edge AI Computer Vision');

    slide.addText('HARDWARE-ACCELERATED EDGE COMPUTER VISION', {
      x: 0.8,
      y: 1.1,
      w: 11.7,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial Black',
      color: C.white,
      bold: true
    });

    slide.addText('Simulated NVIDIA Jetson AGX Orin running DeepStream 7.0 for vehicular idle detection & emissions forensics.', {
      x: 0.8,
      y: 1.7,
      w: 11.7,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.slate
    });

    const pipelineSteps = [
      { step: '01 RTSP INGEST', title: 'Campus CCTV Cameras', desc: 'Streams Gate 1 loop & perimeter traffic feeds into Jetson hardware decoder.' },
      { step: '02 TENSORRT 10.2', title: 'YOLO-v8x Detection', desc: 'Extracts bounding boxes, vehicle classifications, and license plates at 38 FPS in FP16/INT8.' },
      { step: '03 DEEPSTREAM 7.0', title: 'Idle Duration Tracker', desc: 'Calculates continuous dwell time; triggers violation event at > 180 seconds idling.' },
      { step: '04 IISC CES MODEL', title: 'Tailpipe Emission Math', desc: 'Computes real-time kg CO₂ and g PM2.5 based on Ramachandra et al. Table 6 factors.' }
    ];

    pipelineSteps.forEach((s, idx) => {
      const xPos = 0.8 + idx * 2.95;
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: 2.4,
        w: 2.8,
        h: 4.1,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1 }
      });

      slide.addText(s.step, {
        x: xPos + 0.25,
        y: 2.65,
        w: 2.3,
        h: 0.3,
        fontSize: 9,
        fontFace: 'Courier New',
        color: C.cyan,
        bold: true
      });

      slide.addText(s.title, {
        x: xPos + 0.25,
        y: 3.05,
        w: 2.3,
        h: 0.6,
        fontSize: 14,
        fontFace: 'Arial Black',
        color: C.white,
        bold: true
      });

      slide.addText(s.desc, {
        x: xPos + 0.25,
        y: 3.75,
        w: 2.3,
        h: 2.4,
        fontSize: 10,
        fontFace: 'Arial',
        color: C.slate,
        lineSpacing: 16
      });
    });
  }

  // ==========================================
  // SLIDE 6: CHAPTER 05 // DIURNAL MICROGRID SOLVER
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '05', 'Diurnal Microgrid Physics Solver');

    slide.addText('FINITE PHYSICS WHAT-IF SIMULATOR', {
      x: 0.8,
      y: 1.1,
      w: 11.7,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial Black',
      color: C.white,
      bold: true
    });

    slide.addText('Empirical 24-hour diurnal dispatch model calculating financial savings and carbon abatement in real-time.', {
      x: 0.8,
      y: 1.7,
      w: 11.7,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.slate
    });

    const levers = [
      {
        name: 'Fleet Electrification',
        range: '0% → 100% EV',
        math: 'Replaces 4.2 km/L diesel shuttles with 1.1 kWh/km electric buses charged via solar.',
        impact: 'Abates 84.6 MT CO₂e/yr'
      },
      {
        name: 'Solar Expansion',
        range: '100 kW → 1000 kW',
        math: 'Calculates roof area yield using NASA POWER MERRA-2 diurnal solar irradiation curve.',
        impact: 'Generates 512 MWh/yr clean'
      },
      {
        name: 'BESS Peak Shaving',
        range: '250 kWh → 1000 kWh',
        math: 'Charges during solar peak (11:00-14:00); discharges during dirty peak grid (18:00-22:00).',
        impact: 'Eliminates ₹6.2L peak tariff'
      },
      {
        name: 'HVAC Chiller COP Tuning',
        range: 'COP 4.2 → COP 6.5',
        math: 'Dynamic chilled water setpoint optimization reducing base-load chiller kW by 28%.',
        impact: 'Saves 112 MWh electricity'
      }
    ];

    levers.forEach((l, idx) => {
      const xPos = 0.8 + (idx % 2) * 5.95;
      const yPos = 2.4 + Math.floor(idx / 2) * 2.05;

      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: yPos,
        w: 5.75,
        h: 1.85,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1 }
      });

      slide.addText(l.name.toUpperCase(), {
        x: xPos + 0.3,
        y: yPos + 0.2,
        w: 3.5,
        h: 0.35,
        fontSize: 13,
        fontFace: 'Arial Black',
        color: C.volt,
        bold: true
      });

      slide.addText(l.range, {
        x: xPos + 3.8,
        y: yPos + 0.2,
        w: 1.6,
        h: 0.35,
        fontSize: 9,
        fontFace: 'Courier New',
        color: C.cyan,
        align: 'right',
        bold: true
      });

      slide.addText(l.math, {
        x: xPos + 0.3,
        y: yPos + 0.65,
        w: 5.15,
        h: 0.6,
        fontSize: 10,
        fontFace: 'Arial',
        color: C.slate,
        lineSpacing: 15
      });

      slide.addText(`ROI FORECAST: ${l.impact}`, {
        x: xPos + 0.3,
        y: yPos + 1.35,
        w: 5.15,
        h: 0.3,
        fontSize: 9.5,
        fontFace: 'Courier New',
        color: C.white,
        bold: true
      });
    });
  }

  // ==========================================
  // SLIDE 7: CHAPTER 06 // GENERATIVE SRE PLAYBOOK
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '06', 'Generative NIM SRE Decarbonization Playbook');

    slide.addText('AUTONOMOUS SRE DECISION & MITIGATION PLANE', {
      x: 0.8,
      y: 1.1,
      w: 11.7,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial Black',
      color: C.white,
      bold: true
    });

    slide.addText('Autonomous reasoning engine synthesizing telemetry into calibrated mitigation actions.', {
      x: 0.8,
      y: 1.7,
      w: 11.7,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.slate
    });

    const phases = [
      {
        phase: 'PHASE 01 // IMMEDIATE (0 - 2 HOURS)',
        title: 'Tactical Peak Shaving & Idle Interception',
        actions: '• Dispatch automated security alert to Gate 1 security terminal for 3 idling shuttles\n• Ramp BESS discharge to 180 kW as Karnataka grid frequency dips below 49.95 Hz\n• Throttle non-critical DGX test jobs to off-peak night window'
      },
      {
        phase: 'PHASE 02 // DIURNAL (2 - 24 HOURS)',
        title: 'Diurnal Solar & Thermal Pre-Cooling Shift',
        actions: '• Pre-cool Academic Block lecture halls to 21°C during peak solar irradiation (12:00-14:00)\n• Float chiller setpoint to 24°C during evening peak tariff window (18:00-21:00)\n• Schedule overnight EV fleet charging only when wind share exceeds 40%'
      },
      {
        phase: 'PHASE 03 // STRATEGIC (1 - 3 YEARS)',
        title: 'Microgrid Autonomy & ISO 14064 Compliance',
        actions: '• Commission Phase 2 650 kW rooftop solar expansion across hostel rooftops\n• Establish automated verifiable ledger for carbon offset trading\n• Institutionalize Zero-Diesel campus policy for all internal transit'
      }
    ];

    phases.forEach((ph, idx) => {
      const yPos = 2.4 + idx * 1.4;
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos,
        w: 11.7,
        h: 1.25,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1 }
      });

      slide.addText(ph.phase, {
        x: 1.1,
        y: yPos + 0.12,
        w: 4.5,
        h: 0.25,
        fontSize: 8.5,
        fontFace: 'Courier New',
        color: C.volt,
        bold: true
      });

      slide.addText(ph.title, {
        x: 1.1,
        y: yPos + 0.38,
        w: 4.5,
        h: 0.7,
        fontSize: 12.5,
        fontFace: 'Arial Black',
        color: C.white,
        bold: true
      });

      slide.addText(ph.actions, {
        x: 5.8,
        y: yPos + 0.15,
        w: 6.4,
        h: 0.95,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: C.slate,
        lineSpacing: 15
      });
    });
  }

  // ==========================================
  // SLIDE 8: CHAPTER 07 // FINANCIAL ROI & ISO 14064
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '07', 'Financial OPEX ROI & ISO 14064 Audit');

    slide.addText('MEASURABLE FINANCIAL ROI & ESG COMPLIANCE', {
      x: 0.8,
      y: 1.1,
      w: 11.7,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial Black',
      color: C.white,
      bold: true
    });

    slide.addText('Transforming environmental compliance into an empirical cost-reduction engine for DSU leadership.', {
      x: 0.8,
      y: 1.7,
      w: 11.7,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.slate
    });

    const finCards = [
      {
        k: 'ANNUAL OPEX SAVINGS',
        v: '₹ 24,80,000',
        d: 'Direct utility bill & diesel expenditure reduction through peak shaving and solar alignment.'
      },
      {
        k: 'NET CARBON ABATEMENT',
        v: '412.5 MT CO₂e',
        d: 'Equivalent to removing 89 passenger vehicles or planting 19,000 mature deciduous trees.'
      },
      {
        k: 'CAPEX PAYBACK PERIOD',
        v: '2.8 YEARS',
        d: 'Fast IRR based on accelerated depreciation and avoided diesel logistics expenses.'
      },
      {
        k: 'AUDIT COMPLIANCE',
        v: 'ISO 14064-1',
        d: '1-click automated report generation with verifiable cryptographic timestamp ledger.'
      }
    ];

    finCards.forEach((c, idx) => {
      const xPos = 0.8 + idx * 2.95;
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: 2.4,
        w: 2.8,
        h: 4.1,
        fill: { color: C.cardBg },
        line: { color: C.border, width: 1 }
      });

      slide.addText(c.k, {
        x: xPos + 0.25,
        y: 2.7,
        w: 2.3,
        h: 0.35,
        fontSize: 9,
        fontFace: 'Courier New',
        color: C.slate,
        bold: true
      });

      slide.addText(c.v, {
        x: xPos + 0.25,
        y: 3.2,
        w: 2.3,
        h: 0.8,
        fontSize: 20,
        fontFace: 'Arial Black',
        color: idx === 0 ? C.volt : idx === 1 ? C.emerald : C.cyan,
        bold: true
      });

      slide.addShape(pptx.ShapeType.line, {
        x: xPos + 0.25,
        y: 4.3,
        w: 2.3,
        h: 0,
        line: { color: C.border, width: 1 }
      });

      slide.addText(c.d, {
        x: xPos + 0.25,
        y: 4.6,
        w: 2.3,
        h: 1.6,
        fontSize: 10,
        fontFace: 'Arial',
        color: C.slate,
        lineSpacing: 15
      });
    });
  }

  // ==========================================
  // SLIDE 9: FINALE // PRODUCTION READY
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyHudTemplate(slide, '08', 'System Online // Production Evaluation');

    slide.addText('AUTONOMOUS DECARBONIZATION IS ONLINE', {
      x: 0.8,
      y: 1.3,
      w: 11.7,
      h: 0.7,
      fontSize: 32,
      fontFace: 'Arial Black',
      color: C.volt,
      bold: true
    });

    slide.addText('LIVE INTERACTIVE DIGITAL TWIN: dhrgupta096.github.io/code-clash', {
      x: 0.8,
      y: 2.1,
      w: 11.7,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Courier New',
      color: C.cyan,
      bold: true
    });

    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 2.8,
      w: 11.7,
      h: 3.7,
      fill: { color: C.cardBg },
      line: { color: C.border, width: 1 }
    });

    slide.addText('SYSTEM HIGHLIGHTS FOR CODE CLASH JUDGING', {
      x: 1.2,
      y: 3.1,
      w: 10.9,
      h: 0.35,
      fontSize: 13,
      fontFace: 'Arial Black',
      color: C.white,
      bold: true
    });

    const highlights = [
      '✔ FULL-STACK SRE STACK: Vite + React 19 + Three.js WebGL + Bun Server running with sub-millisecond telemetry',
      '✔ EMPIRICAL DATASETS: Ingests ground-truth CEA v20.0 (0.716 kg/kWh) and NASA MERRA-2 solar irradiance',
      '✔ REAL GROUND TRUTH 3D MESH: Built directly from official DSU virtual tour coordinates (pano.xml)',
      '✔ METROPOLIS EDGE AI: Simulates Jetson AGX Orin with DeepStream 7.0 for vehicular idle detection',
      '✔ WHAT-IF DECISION ENGINE: Interactive parameter solver calculating diurnal curves and ₹ OPEX savings in real-time',
      '✔ LIVE WEB PRODUCTION: Fully deployed on GitHub Pages with zero external cloud lock-in'
    ];

    slide.addText(highlights.join('\n\n'), {
      x: 1.2,
      y: 3.65,
      w: 10.9,
      h: 2.6,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: C.slate,
      lineSpacing: 18
    });
  }

  // Trigger file download
  await pptx.writeFile({ fileName: 'OmniCarbon_Edolus_Slide_Deck.pptx' });
}
