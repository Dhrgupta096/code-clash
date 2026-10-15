import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Cpu, Flame, Sun, Bus, ShieldAlert, Sparkles, Layers, Eye, RotateCcw, 
  Box, Wind, ArrowRight, Compass, Crosshair, ExternalLink, X, Maximize2, Minimize2,
  Droplets, HeartPulse, Trophy, Trees, Navigation, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import Magnet from './reactbits/Magnet';
import ShinyText from './reactbits/ShinyText';

// Official DSU Harohalli Campus Facilities extracted directly from https://www.dsu.edu.in/virtual-tour/pano.xml
export const BUILDINGS_BASE = [
  {
    id: 'soe-block',
    name: 'School of Engineering (SOE) & AI Lab',
    shortName: 'SOE & AI Lab',
    category: 'High-Density Compute & Academic',
    desc: 'Core academic quad housing NVIDIA DGX A100 AI server clusters, Dennis M. Ritchie Lab, Carver Mead VLSI, and aerodynamics test cells.',
    virtualTourNode: 'node260',
    gps: { lat: '12.662439° N', lon: '77.451082° E', alt: '674.6 m MSL' },
    pos: [32, 12, -22],
    size: [32, 24, 26],
    color: 0x00f0ff,
    accent: 'var(--cyan)',
    tourNodes: [
      { id: 'node260', name: 'SOE Aerial Drone View' },
      { id: 'node180', name: 'Engineering Main Entrance' },
      { id: 'node19', name: 'Dennis M. Ritchie Lab' },
      { id: 'node29', name: 'Maurice Wilkes Microprocessor Lab' },
      { id: 'node33', name: 'Carver Mead VLSI Lab' },
      { id: 'node27', name: 'Homi Bhabha Avionics Lab' },
      { id: 'node93', name: 'Energy Conversion Lab' }
    ],
    departments: [
      'Dennis M. Ritchie Common Lab',
      'Maurice Wilkes Microprocessor Lab',
      'NVIDIA DGX A100 AI Substrate',
      'Carver Mead VLSI Design Lab',
      'Homi Jehangir Bhabha Avionics Lab',
      'Energy Conversion & Fluid Mechanics'
    ]
  },
  {
    id: 'dsu-quad',
    name: 'Dayananda Sagar University (Central Quad)',
    shortName: 'DSU Central Quad',
    category: 'University Senate & Administrative Hub',
    desc: 'Iconic university administrative tower, Vice Chancellor Secretariat, Central Digital Library, and campus operations center.',
    virtualTourNode: 'node270',
    gps: { lat: '12.662229° N', lon: '77.449538° E', alt: '683.5 m MSL' },
    pos: [-14, 16, -16],
    size: [30, 32, 24],
    color: 0xd4ff00,
    accent: 'var(--phosphor)',
    tourNodes: [
      { id: 'node270', name: 'Dayananda Sagar Main Aerial' },
      { id: 'node16', name: 'Central Digital Library' },
      { id: 'node9', name: 'Senate Lecture Hall' }
    ],
    departments: [
      'Vice Chancellor Secretariat',
      'Central Digital Library & Archives',
      'Academic Senate & Council Chamber',
      'Campus Microgrid Operations Center'
    ]
  },
  {
    id: 'cdsimer-med',
    name: 'CDSIMER Medical Institute',
    shortName: 'CDSIMER Medical',
    category: 'Medical Research & Clinical Training',
    desc: 'Pre-clinical medical sciences, high-fidelity robotic simulation center, Central Research Laboratory, and anatomy dissection halls.',
    virtualTourNode: 'node276',
    gps: { lat: '12.661316° N', lon: '77.448689° E', alt: '681.9 m MSL' },
    pos: [-36, 11, 10],
    size: [28, 22, 28],
    color: 0x38bdf8,
    accent: '#38bdf8',
    tourNodes: [
      { id: 'node276', name: 'CDSIMER Aerial View' },
      { id: 'node206', name: 'Central Research Laboratory' },
      { id: 'node254', name: 'Robotic Skill & Simulation Lab' },
      { id: 'node109', name: 'Pre-Clinical Science Lab' }
    ],
    departments: [
      'Central Research Laboratory',
      'Robotic Medical Simulation Lab',
      'Skill Lab & Clinical Anatomy',
      'Pre-Clinical Science Research Wing'
    ]
  },
  {
    id: 'cds-hospital',
    name: 'CDS Multi-Speciality Hospital',
    shortName: 'CDS Hospital',
    category: 'Healthcare & Critical Life Support',
    desc: 'Tertiary care teaching hospital with 24/7 emergency trauma, surgical ICUs, catheterization lab, and continuous microgrid power backup.',
    virtualTourNode: 'node275',
    gps: { lat: '12.660699° N', lon: '77.448849° E', alt: '682.3 m MSL' },
    pos: [-32, 12, 34],
    size: [36, 24, 30],
    color: 0xff4d4d,
    accent: '#ff4d4d',
    tourNodes: [
      { id: 'node275', name: 'Hospital Aerial View' },
      { id: 'node207', name: 'Surgical ICU' },
      { id: 'node240', name: 'Intensive Care Unit (ICU)' },
      { id: 'node211', name: 'Neonatal ICU (NICU)' },
      { id: 'node248', name: 'Speciality OPD Wing' }
    ],
    departments: [
      'Surgical ICU & Intensive Care',
      '24/7 Emergency & Level-1 Trauma',
      'Neonatal ICU (NICU) Unit',
      'Speciality Outpatient Clinics (OPD)'
    ]
  },
  {
    id: 'heart-campus',
    name: 'Heart of Campus (Central Plaza & Yard)',
    shortName: 'Central Plaza',
    category: 'Campus Center & Pedestrian Commons',
    desc: 'Central pedestrian nexus of Harohalli campus featuring the monumental fountain, landscaped quad, and social amphitheatre walkways.',
    virtualTourNode: 'node271',
    gps: { lat: '12.661669° N', lon: '77.449987° E', alt: '683.5 m MSL' },
    pos: [0, 2, 0],
    size: [24, 4, 24],
    color: 0x00f0ff,
    accent: 'var(--cyan)',
    tourNodes: [
      { id: 'node271', name: 'Heart of the Campus Aerial' },
      { id: 'node280', name: 'Central Yard Fountain' },
      { id: 'node282', name: 'Campus Yard Promenade' }
    ],
    departments: [
      'Central Yard Tiered Fountain',
      'Student Commons & Promenade',
      'Outdoor Acoustic Amphitheatre',
      'Pedestrian Shaded Walkways'
    ]
  },
  {
    id: 'entrance-gate',
    name: 'Campus Entrance & Gate 1 Transit Depot',
    shortName: 'Gate 1 Transit',
    category: 'Transit & Clean Fleet Hub',
    desc: 'Campus gateway linking Bangalore KS Layout & Kanakapura corridor, housing security checkpoint, bus depot, and EV fast-charging canopies.',
    virtualTourNode: 'node272',
    gps: { lat: '12.662800° N', lon: '77.450511° E', alt: '679.6 m MSL' },
    pos: [16, 7, -36],
    size: [28, 14, 20],
    color: 0xff5500,
    accent: 'var(--thermal)',
    tourNodes: [
      { id: 'node272', name: 'Campus Entrance Aerial' },
      { id: 'node178', name: 'Transit Bus & EV Parking' },
      { id: 'node197', name: 'Main Security Gate 1' }
    ],
    departments: [
      'Campus Security Gate 1 Command',
      'Inter-Campus Shuttle Terminal',
      'EV Fleet Rapid DC Charging Bays',
      'Real-Time Diesel Idling CV Camera'
    ]
  },
  {
    id: 'keerangere-lake',
    name: 'Keerangere Lake Ecological Wetland Sink',
    shortName: 'Keerangere Lake',
    category: 'Natural Carbon Sink & Wetland Sink',
    desc: 'Natural freshwater wetland and riparian forest zone bordering campus south-west, providing biological carbon sequestration and runoff buffering.',
    virtualTourNode: 'node257',
    gps: { lat: '12.657934° N', lon: '77.448625° E', alt: '666.2 m MSL' },
    pos: [-36, 1, 56],
    size: [48, 2, 34],
    color: 0x06b6d4,
    accent: '#06b6d4',
    tourNodes: [
      { id: 'node257', name: 'Keerangere Lake Drone Panorama' }
    ],
    departments: [
      'Riparian Wetland Bio-Buffer',
      'Lake Water Quality Sensing Buoys',
      'IISc Carbon Sequestration Basin',
      'Native Wetland Ecological Flora'
    ]
  },
  {
    id: 'sports-facility',
    name: 'Multi-Sports Facility & Stadium Complex',
    shortName: 'Stadium & Arena',
    category: 'Athletic Complex & Renewable Microgrid',
    desc: 'Full-scale outdoor stadium complex comprising cricket grounds, 400m synthetic track, basketball arena, and solar floodlighting.',
    virtualTourNode: 'node198',
    gps: { lat: '12.660632° N', lon: '77.454752° E', alt: '703.9 m MSL' },
    pos: [48, 6, 22],
    size: [42, 10, 34],
    color: 0x10b981,
    accent: 'var(--emerald)',
    tourNodes: [
      { id: 'node198', name: 'Multi-Sports Facility Aerial' },
      { id: 'node203', name: 'Cricket Ground Pavilion' },
      { id: 'node202', name: '400m Track & Field Arena' }
    ],
    departments: [
      'Full-Size Cricket Arena',
      '400m Synthetic Track & Field',
      'Solar-Powered LED Floodlight Arrays',
      'Indoor Sports Pavilion & Gymnasium'
    ]
  }
];

// Helper to compute reactive metrics based on simulation values & Karnataka CEA v20.0
function getDynamicMetrics(buildingId, simValues = {}) {
  const { fleetEv = 30, aiSolarShift = true, solarCapacity = 350, hvacOpt = 40 } = simValues;

  switch (buildingId) {
    case 'soe-block':
      return {
        power: '4.82 kW Active Draw',
        pue: aiSolarShift ? '1.18 (Solar Microgrid PUE)' : '1.58 (Peak Fossil PUE)',
        coolingLoad: `${(2.4 * (1 - (hvacOpt / 100) * 0.3)).toFixed(1)} kW Variable Chiller`,
        activeJobs: '4 Vision Training Workloads',
        footprint: aiSolarShift ? '0.24 kg CO2/hr (-79% Solar Shift)' : '1.85 kg CO2/hr (Grid Coal)',
        carbonStatus: aiSolarShift ? 'Zero-Carbon Midday Solar Synchronized' : 'High-Carbon Grid Tariff'
      };
    case 'dsu-quad': {
      const load = (14.2 * (1 - (hvacOpt / 100) * 0.35)).toFixed(1);
      const footprint = (3.4 * (1 - (hvacOpt / 100) * 0.4)).toFixed(2);
      return {
        occupancy: '1,850 Students & Senate Faculty',
        lightingHVAC: `${load} kW Optimized Load`,
        solarRoof: `${Math.round(solarCapacity * 0.4)} kW Monocrystalline Array`,
        hvacModulation: `${hvacOpt}% AI VFD Chiller Modulation`,
        footprint: `${footprint} kg CO2/hr`,
        carbonStatus: '72% Clean Energy Offset'
      };
    }
    case 'cdsimer-med':
      return {
        labBaseload: '8.4 kW Continuous Lab Draw',
        simulationWings: '120 Trainee Stations Active',
        autoclaveCycle: 'Clean Microgrid Steam Cycle',
        solarSupply: `${Math.round(solarCapacity * 0.28)} kW Dedicated Solar Feed`,
        footprint: '1.92 kg CO2/hr',
        carbonStatus: '64% Solar Microgrid Offset'
      };
    case 'cds-hospital':
      return {
        icuLoad: '26.5 kW Critical Healthcare Draw',
        medicalUptime: '100.0% Uninterrupted Power Supply',
        blackoutTolerance: '0.00% Zero-Fail Life Support',
        emergencyBackup: 'Dual LiFePO4 Inverter + Standby',
        footprint: '6.20 kg CO2/hr',
        carbonStatus: 'Protected Continuous Clinical Circuit'
      };
    case 'heart-campus':
      return {
        fountainPump: '1.2 kW Solar Aeration Pump',
        dailyFootfall: '3,200 Pedestrians / Day',
        ambientCO2: '418 ppm Clean Air Quad',
        irrigationSensor: 'Automated Soil Hydration Active',
        footprint: '0.08 kg CO2/hr',
        carbonStatus: 'Zero-Carbon Open Microclimate'
      };
    case 'entrance-gate': {
      const dieselBuses = Math.max(1, Math.round(6 * (1 - fleetEv / 100)));
      const evBuses = Math.round(6 * (fleetEv / 100));
      const footprint = (4.82 * (1 - (fleetEv / 100) * 0.8)).toFixed(2);
      return {
        activeBuses: `${dieselBuses} Diesel • ${evBuses} Electric EV`,
        idlingAlerts: fleetEv > 60 ? '0 Idling (EV Swapped)' : '2 Detected (>3m Idle)',
        fuelBurnRate: fleetEv > 60 ? '0.08 L/min' : '0.56 L/min Waste',
        evTransition: `${fleetEv}% Fleet Electrified`,
        footprint: `${footprint} kg CO2/hr`,
        carbonStatus: fleetEv > 60 ? 'Optimal Green Fleet Transition' : 'High Tailpipe Concentration'
      };
    }
    case 'keerangere-lake':
      return {
        annualSink: '-14.8 Tonnes CO2/yr Biosequestration',
        waterVolume: '45,000 m³ Wetland Retention',
        riparianBuffer: '18 Hectares Native Flora',
        dissolvedOxygen: '7.8 mg/L Healthy Aquatic Flora',
        footprint: '-3.42 kg CO2/hr (Net Carbon Sink)',
        carbonStatus: 'Natural Ecological Sink (IISc Study)'
      };
    case 'sports-facility':
      return {
        stadiumDraw: '3.8 kW High-Efficiency LED Field',
        turfRecharge: '100% Rainwater Aquifer Recovery',
        storageBuffer: '24 kWh Distributed Battery Bank',
        solarCanopy: `${Math.round(solarCapacity * 0.15)} kW Pavilion Solar`,
        footprint: '0.45 kg CO2/hr',
        carbonStatus: 'Net Positive Athletic Pavilion'
      };
    default:
      return {};
  }
}

export default function CampusTwin({ simulationValues = {}, onSelectBuilding, playSound }) {
  const mountRef = useRef(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState('soe-block');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [xRayMode, setXRayMode] = useState(false);
  const [lidarScan, setLidarScan] = useState(false);
  const [activePreset, setActivePreset] = useState('iso');
  const [virtualTourModal, setVirtualTourModal] = useState(null); // node id string or null
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
  const [isDossierCollapsed, setIsDossierCollapsed] = useState(true);

  // Camera Target and Angle References for Smooth Tweening
  const cameraTargetRef = useRef({ x: 0, y: 0, z: 0 });
  const targetCameraTargetRef = useRef({ x: 0, y: 0, z: 0 });

  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 4, radius: 130 });
  const targetCameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 4, radius: 130 });

  const selectedBuilding = BUILDINGS_BASE.find(b => b.id === selectedBuildingId) || BUILDINGS_BASE[0];
  const dynamicMetrics = getDynamicMetrics(selectedBuilding.id, simulationValues);

  // 8 High-Precision Camera Presets for DSU Harohalli Campus
  const PRESETS = [
    { id: 'iso', label: 'DEFAULT ISO', target: { x: 0, y: 0, z: 0 }, angle: { theta: Math.PI / 4, phi: Math.PI / 4, radius: 135 }, buildingId: 'soe-block', xRay: false },
    { id: 'soe', label: 'ENG QUAD & AI', target: { x: 32, y: 12, z: -22 }, angle: { theta: -Math.PI / 3.2, phi: Math.PI / 3.4, radius: 72 }, buildingId: 'soe-block', xRay: true },
    { id: 'dsu', label: 'DSU SENATE', target: { x: -14, y: 16, z: -16 }, angle: { theta: -Math.PI / 4, phi: Math.PI / 3.2, radius: 80 }, buildingId: 'dsu-quad', xRay: false },
    { id: 'med', label: 'MED DISTRICT', target: { x: -34, y: 11, z: 22 }, angle: { theta: -Math.PI / 1.8, phi: Math.PI / 3.5, radius: 85 }, buildingId: 'cds-hospital', xRay: false },
    { id: 'heart', label: 'CENTRAL PLAZA', target: { x: 0, y: 2, z: 0 }, angle: { theta: 0.1, phi: Math.PI / 3.6, radius: 55 }, buildingId: 'heart-campus', xRay: false },
    { id: 'transit', label: 'GATE 1 TRANSIT', target: { x: 16, y: 7, z: -36 }, angle: { theta: Math.PI / 1.6, phi: Math.PI / 3.2, radius: 75 }, buildingId: 'entrance-gate', xRay: false },
    { id: 'lake', label: 'ECO SINK', target: { x: -36, y: 1, z: 56 }, angle: { theta: -Math.PI / 1.5, phi: Math.PI / 3.8, radius: 85 }, buildingId: 'keerangere-lake', xRay: false },
    { id: 'sports', label: 'SPORTS ARENA', target: { x: 48, y: 6, z: 22 }, angle: { theta: Math.PI / 3.2, phi: Math.PI / 3.4, radius: 82 }, buildingId: 'sports-facility', xRay: false },
    { id: 'ortho', label: 'TOP BLUEPRINT', target: { x: 0, y: 0, z: 0 }, angle: { theta: 0.001, phi: 0.05, radius: 155 }, buildingId: 'soe-block', xRay: false }
  ];

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setSelectedBuildingId(preset.buildingId);
    if (preset.xRay !== undefined) setXRayMode(preset.xRay);
    
    targetCameraTargetRef.current = { ...preset.target };
    targetCameraAngleRef.current = { ...preset.angle };

    if (playSound) playSound(520, 'triangle', 0.08);
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Three.js Scene & Orthographic Camera Setup
    const scene = new THREE.Scene();
    const aspect = width / height;
    const d = 75;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // 1. Campus Ground Baseplate
    const groundGeo = new THREE.PlaneGeometry(210, 210);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x060911,
      roughness: 0.92,
      metalness: 0.08
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // 2. Blueprint Architectural Grid
    const gridHelper = new THREE.GridHelper(210, 42, 0x1e293b, 0x0a101d);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // 3. Asphalt Road Network Connecting Harohalli Campus Artery
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x0f1523 });
    
    // East-West Main Artery (Gate 1 -> Central Plaza -> Sports)
    const road1Geo = new THREE.PlaneGeometry(210, 14);
    const road1 = new THREE.Mesh(road1Geo, roadMat);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(0, 0.1, -10);
    scene.add(road1);

    // North-South Central Spine (Gate 1 -> SOE -> Hospital -> Lake)
    const road2Geo = new THREE.PlaneGeometry(14, 210);
    const road2 = new THREE.Mesh(road2Geo, roadMat);
    road2.rotation.x = -Math.PI / 2;
    road2.position.set(6, 0.1, 0);
    scene.add(road2);

    // Diagonal Medical Connector Avenue
    const road3Geo = new THREE.PlaneGeometry(10, 110);
    const road3 = new THREE.Mesh(road3Geo, roadMat);
    road3.rotation.x = -Math.PI / 2;
    road3.rotation.z = Math.PI / 4;
    road3.position.set(-20, 0.11, 20);
    scene.add(road3);

    // Road dashed centerlines
    const centerLineGeo = new THREE.PlaneGeometry(210, 0.6);
    const centerLineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const centerLine = new THREE.Mesh(centerLineGeo, centerLineMat);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, 0.15, -10);
    scene.add(centerLine);

    // 4. Lighting: Sun Directional + Cyber Accent Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xd4ff00, 0.65);
    sunLight.position.set(80, 120, 60);
    scene.add(sunLight);

    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 0.5);
    cyanLight.position.set(-90, 70, -60);
    scene.add(cyanLight);

    // 5. Procedural 3D Trees (Green Zones / Carbon Offset Riparian Buffer)
    const treeGroup = new THREE.Group();
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.8 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x334155 });

    const treeLocations = [
      // Central Yard Grove
      [-12, 0, 8], [-8, 0, 12], [14, 0, 8], [12, 0, -16],
      // SOE Quad Landscape
      [20, 0, -32], [42, 0, -34], [48, 0, -12],
      // Keerangere Riparian Buffer (Dense Lake Border)
      [-55, 0, 48], [-52, 0, 62], [-46, 0, 72], [-28, 0, 72], [-18, 0, 64],
      // Medical Institute Perimeter
      [-48, 0, 2], [-45, 0, 24], [-20, 0, 42],
      // Sports Arena Border
      [68, 0, 12], [66, 0, 34], [35, 0, 36]
    ];

    treeLocations.forEach(([x, y, z]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 2.8, 6), trunkMat);
      trunk.position.set(x, 1.4, z);
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5.0, 6), treeMat);
      foliage.position.set(x, 4.6, z);
      treeGroup.add(trunk);
      treeGroup.add(foliage);
    });
    scene.add(treeGroup);

    // 6. Keerangere Lake 3D Water Surface & Shoreline Buffer
    const lakeGeo = new THREE.PlaneGeometry(54, 38, 20, 20);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.82
    });
    const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
    lakeMesh.rotation.x = -Math.PI / 2;
    lakeMesh.position.set(-36, 0.2, 56);
    scene.add(lakeMesh);

    // Lake border ring
    const lakeBorderGeo = new THREE.EdgesGeometry(lakeGeo);
    const lakeBorderMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const lakeBorder = new THREE.LineSegments(lakeBorderGeo, lakeBorderMat);
    lakeBorder.rotation.x = -Math.PI / 2;
    lakeBorder.position.set(-36, 0.25, 56);
    scene.add(lakeBorder);

    // 7. Central Yard Tiered Fountain & Water Jet Mesh
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(0, 0.1, 0);

    const fountainBasin = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 9, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 })
    );
    fountainBasin.position.y = 0.6;
    fountainGroup.add(fountainBasin);

    const fountainWater = new THREE.Mesh(
      new THREE.CylinderGeometry(7.2, 7.2, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.1, metalness: 0.9 })
    );
    fountainWater.position.y = 1.1;
    fountainGroup.add(fountainWater);

    // Center Spout
    const fountainSpout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.2, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 })
    );
    fountainSpout.position.y = 2.2;
    fountainGroup.add(fountainSpout);
    scene.add(fountainGroup);

    // Fountain Spray Particles
    const fountainParticleCount = 24;
    const fountainGeo = new THREE.BufferGeometry();
    const fountainPositions = new Float32Array(fountainParticleCount * 3);
    for (let i = 0; i < fountainParticleCount; i++) {
      const angle = (i / fountainParticleCount) * Math.PI * 2;
      const r = 2.5 + Math.random() * 2;
      fountainPositions[i * 3] = Math.cos(angle) * r;
      fountainPositions[i * 3 + 1] = 2.5 + Math.random() * 2.5;
      fountainPositions[i * 3 + 2] = Math.sin(angle) * r;
    }
    fountainGeo.setAttribute('position', new THREE.BufferAttribute(fountainPositions, 3));
    const fountainMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 1.8, transparent: true, opacity: 0.85 });
    const fountainParticles = new THREE.Points(fountainGeo, fountainMat);
    fountainParticles.position.set(0, 1.5, 0);
    scene.add(fountainParticles);

    // 8. 3D Architectural Buildings & Interior X-Ray Elements
    const buildingMeshes = [];
    const fanBlades = [];
    const serverRacks = [];
    const busMeshes = [];

    BUILDINGS_BASE.forEach((b) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.pos[0], 0, b.pos[2]);

      // Main Outer Building Geometry
      const geo = new THREE.BoxGeometry(b.size[0], b.size[1], b.size[2]);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0b1120,
        roughness: 0.35,
        metalness: 0.85,
        transparent: true,
        opacity: xRayMode ? 0.32 : 0.94
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = b;
      mesh.position.y = b.size[1] / 2;
      bGroup.add(mesh);

      // Glowing Wireframe Edges
      const edges = new THREE.EdgesGeometry(geo);
      const wireMat = new THREE.LineBasicMaterial({
        color: showHeatmap ? b.color : 0x38bdf8,
        linewidth: 1.5,
        transparent: true,
        opacity: xRayMode ? 0.95 : 0.8
      });
      const wireframe = new THREE.LineSegments(edges, wireMat);
      wireframe.position.y = b.size[1] / 2;
      bGroup.add(wireframe);

      // --- ROOFTOP DETAILS ACCORDING TO REAL DSU BLUEPRINT ---
      // A) Solar Panels on SOE, DSU Quad & CDSIMER
      if (b.id === 'soe-block' || b.id === 'dsu-quad' || b.id === 'cdsimer-med') {
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.2 });
        const panelRows = 3;
        for (let row = 0; row < panelRows; row++) {
          for (let col = -2; col <= 2; col++) {
            const panel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.3, 4.5), panelMat);
            panel.rotation.x = -0.32; // 18 degree solar tilt facing south
            panel.position.set(col * 4.8, b.size[1] + 1.2, (row - 1) * 6);
            bGroup.add(panel);
          }
        }
      }

      // B) Server Room Cooling Chiller Fans & Internal Racks on SOE AI Lab
      if (b.id === 'soe-block') {
        const chillerBox = new THREE.Mesh(
          new THREE.BoxGeometry(16, 4, 10),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 })
        );
        chillerBox.position.set(0, b.size[1] + 2, -6);
        bGroup.add(chillerBox);

        // 2 Spinning Industrial Chiller Fans
        [-4, 4].forEach((fx) => {
          const fanGeo = new THREE.BoxGeometry(3.5, 0.2, 0.6);
          const fanMat = new THREE.MeshBasicMaterial({ color: 0xd4ff00 });
          const fan = new THREE.Mesh(fanGeo, fanMat);
          fan.position.set(fx, b.size[1] + 4.2, -6);
          bGroup.add(fan);
          fanBlades.push(fan);
        });

        // 8 Internal NVIDIA A100 Tensor Core Server Racks
        for (let r = -2; r <= 2; r++) {
          const rack = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 12, 3.5),
            new THREE.MeshBasicMaterial({
              color: simulationValues?.aiSolarShift ? 0x10b981 : 0xff5500,
              transparent: true,
              opacity: xRayMode ? 0.95 : 0.0
            })
          );
          rack.position.set(r * 4.5, 6, 0);
          bGroup.add(rack);
          serverRacks.push(rack);
        }
      }

      // C) Illuminated Emergency Medical Cross (+) on CDS Hospital Roof
      if (b.id === 'cds-hospital') {
        const crossGroup = new THREE.Group();
        crossGroup.position.set(0, b.size[1] + 3, 0);

        const vBar = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 6.0, 1.2),
          new THREE.MeshBasicMaterial({ color: 0xff3333 })
        );
        const hBar = new THREE.Mesh(
          new THREE.BoxGeometry(6.0, 2.4, 1.2),
          new THREE.MeshBasicMaterial({ color: 0xff3333 })
        );
        crossGroup.add(vBar);
        crossGroup.add(hBar);
        bGroup.add(crossGroup);
      }

      // D) Stylized Buses at Gate 1 Transit Depot
      if (b.id === 'entrance-gate') {
        const isFleetGreen = (simulationValues?.fleetEv || 30) >= 50;
        [-8, 0, 8].forEach((bx, i) => {
          const isEvBus = isFleetGreen || i === 1;
          const busBody = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 3.5, 11),
            new THREE.MeshStandardMaterial({
              color: isEvBus ? 0x10b981 : 0xff5500,
              metalness: 0.6
            })
          );
          busBody.position.set(bx, 2, 14);
          bGroup.add(busBody);
          busMeshes.push({ mesh: busBody, isEv: isEvBus });
        });
      }

      // E) Stadium Floodlights & Turf Pitch at Sports Arena
      if (b.id === 'sports-facility') {
        const pitch = new THREE.Mesh(
          new THREE.PlaneGeometry(34, 26),
          new THREE.MeshBasicMaterial({ color: 0x065f46 })
        );
        pitch.rotation.x = -Math.PI / 2;
        pitch.position.y = 0.2;
        bGroup.add(pitch);

        // 4 Corner Floodlight Towers
        [[-16, -11], [16, -11], [-16, 11], [16, 11]].forEach(([fx, fz]) => {
          const tower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.4, 12, 6),
            new THREE.MeshStandardMaterial({ color: 0x64748b })
          );
          tower.position.set(fx, 6, fz);
          const lamp = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 1.2, 1.5),
            new THREE.MeshBasicMaterial({ color: 0xd4ff00 })
          );
          lamp.position.set(fx, 12, fz);
          bGroup.add(tower);
          bGroup.add(lamp);
        });
      }

      // Floating Marker Beacon
      const beaconGeo = new THREE.ConeGeometry(2, 4.5, 4);
      const beaconMat = new THREE.MeshBasicMaterial({ color: b.color });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.rotation.x = Math.PI;
      beacon.position.set(0, b.size[1] + 6, 0);
      bGroup.add(beacon);

      scene.add(bGroup);
      buildingMeshes.push({ mesh, bGroup, beacon, b, wireMat, mainMat: mat });
    });

    // 9. Dynamic Spline Energy Flow Particles
    // Spline 1: Solar Arrays on DSU & SOE -> DGX Compute Substrate
    const solarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, 20, -16),
      new THREE.Vector3(10, 18, -20),
      new THREE.Vector3(32, 16, -22)
    ]);

    // Spline 2: Transit Gateway Fuel / Grid Burn -> Central Campus
    const gridCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(16, 8, -36),
      new THREE.Vector3(8, 6, -10),
      new THREE.Vector3(-32, 14, 34)
    ]);

    // Spline 3: Emissions Sequestration Flow -> Keerangere Lake Natural Sink
    const sinkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4, 0),
      new THREE.Vector3(-18, 4, 28),
      new THREE.Vector3(-36, 2, 56)
    ]);

    const particleCount = 90;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;

      if (i < 30) {
        // Solar Generation Flow (Phosphor / Lime)
        particleColors[i * 3] = 0.83;
        particleColors[i * 3 + 1] = 1.0;
        particleColors[i * 3 + 2] = 0.0;
      } else if (i < 60) {
        // Transit / Hospital Baseload (Thermal Orange or Cyan)
        particleColors[i * 3] = 1.0;
        particleColors[i * 3 + 1] = 0.33;
        particleColors[i * 3 + 2] = 0.0;
      } else {
        // Carbon Sequestration into Keerangere Lake (Cyan-Teal)
        particleColors[i * 3] = 0.02;
        particleColors[i * 3 + 1] = 0.71;
        particleColors[i * 3 + 2] = 0.83;
      }
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 3.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 10. 360° Mouse Orbit & Pan Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const updateCameraPosition = () => {
      const curTarget = cameraTargetRef.current;
      const curAngle = cameraAngleRef.current;
      camera.position.x = curTarget.x + curAngle.radius * Math.sin(curAngle.phi) * Math.sin(curAngle.theta);
      camera.position.y = curTarget.y + curAngle.radius * Math.cos(curAngle.phi);
      camera.position.z = curTarget.z + curAngle.radius * Math.sin(curAngle.phi) * Math.cos(curAngle.theta);
      camera.lookAt(curTarget.x, curTarget.y, curTarget.z);
    };

    updateCameraPosition();

    const handleMouseDown = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('.interactive-modal')) return;
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;

      targetCameraAngleRef.current.theta -= deltaX * 0.008;
      targetCameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, targetCameraAngleRef.current.phi + deltaY * 0.008));

      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      targetCameraAngleRef.current.radius = Math.max(45, Math.min(200, targetCameraAngleRef.current.radius + e.deltaY * 0.08));
    };

    currentMount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    currentMount.addEventListener('wheel', handleWheel);

    // Raycasting for Building Click Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('.interactive-modal')) return;
      const rect = currentMount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes.map(bm => bm.mesh));

      if (intersects.length > 0) {
        const clickedBuilding = intersects[0].object.userData;
        setSelectedBuildingId(clickedBuilding.id);
        setIsDossierCollapsed(false);
        if (onSelectBuilding) onSelectBuilding(clickedBuilding);

        targetCameraTargetRef.current = {
          x: clickedBuilding.pos[0],
          y: clickedBuilding.size[1] / 2,
          z: clickedBuilding.pos[2]
        };
        targetCameraAngleRef.current.radius = 85;
        if (playSound) playSound(600, 'triangle', 0.08);
      }
    };

    currentMount.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      const newAspect = w / h;
      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Smooth Camera Interpolation
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001;

      // Camera Smooth Tweening
      const angle = cameraAngleRef.current;
      const targetAngle = targetCameraAngleRef.current;
      angle.theta += (targetAngle.theta - angle.theta) * 0.08;
      angle.phi += (targetAngle.phi - angle.phi) * 0.08;
      angle.radius += (targetAngle.radius - angle.radius) * 0.08;

      const target = cameraTargetRef.current;
      const targetTarget = targetCameraTargetRef.current;
      target.x += (targetTarget.x - target.x) * 0.08;
      target.y += (targetTarget.y - target.y) * 0.08;
      target.z += (targetTarget.z - target.z) * 0.08;

      updateCameraPosition();

      // Spin Rooftop Chiller Fans on SOE AI Lab
      fanBlades.forEach((fan) => {
        fan.rotation.y += 0.28;
      });

      // Beacon bounce animation
      buildingMeshes.forEach((bm) => {
        bm.beacon.position.y = bm.b.size[1] + 6 + Math.sin(time * 3.5) * 1.5;
        bm.beacon.rotation.y += 0.04;
      });

      // Animate Fountain Particle Spray
      const fp = fountainParticles.geometry.attributes.position.array;
      for (let i = 0; i < fountainParticleCount; i++) {
        fp[i * 3 + 1] = 2.0 + ((time * 2.5 + i * 0.3) % 3.5);
      }
      fountainParticles.geometry.attributes.position.needsUpdate = true;

      // Animate Energy Flow Particles
      if (showParticles) {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const t = ((time * 0.22 + i / particleCount) % 1);
          let point;
          if (i < 30) {
            point = solarCurve.getPoint(t);
          } else if (i < 60) {
            point = gridCurve.getPoint(t);
          } else {
            point = sinkCurve.getPoint(t);
          }
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      currentMount.removeEventListener('wheel', handleWheel);
      currentMount.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [showParticles, showHeatmap, xRayMode]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Atmospheric Spatial Vignette & Subtle Scanlines (edolus.com inspired) */}
      <div className="spatial-vignette" />
      <div className="hud-scanlines" />

      {/* Active LiDAR Laser Beam Sweep & Elegant Minimalist Chip */}
      {lidarScan && (
        <>
          <div className="lidar-scan-beam" />
          <div style={{
            position: 'absolute',
            top: '18px',
            right: '20px',
            background: 'rgba(6, 8, 12, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 255, 0, 0.35)',
            borderRadius: '999px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: '0 0 16px rgba(212, 255, 0, 0.12)',
            zIndex: 25
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--phosphor)', boxShadow: '0 0 8px var(--phosphor)' }} />
            <span style={{ fontSize: '10px', color: 'var(--phosphor)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              LIDAR SCAN: ±1.4cm (98.4%)
            </span>
          </div>
        </>
      )}

      {/* Unified Minimalist Command Capsule (Single Sleek Bar) */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(8, 10, 16, 0.88)',
        backdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '999px',
        padding: '3px 8px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
        zIndex: 30
      }}>
        {/* Sector Navigator Popover Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(212, 255, 0, 0.1)',
              border: '1px solid rgba(212, 255, 0, 0.3)',
              borderRadius: '999px',
              padding: '4px 11px',
              color: 'var(--phosphor)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--phosphor)' }} />
            <span>{selectedBuilding.shortName || selectedBuilding.name}</span>
            <ChevronDown size={11} />
          </button>

          {/* Sector Selector Floating Popover */}
          {sectorDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '0',
              width: '260px',
              background: 'rgba(9, 12, 18, 0.96)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
              zIndex: 50
            }}>
              <div style={{ padding: '4px 8px', fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                SELECT HAROHALLI CAMPUS SECTOR
              </div>
              {BUILDINGS_BASE.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBuildingId(b.id);
                    setIsDossierCollapsed(false);
                    targetCameraTargetRef.current = { x: b.pos[0], y: b.size[1] / 2, z: b.pos[2] };
                    targetCameraAngleRef.current.radius = 85;
                    setSectorDropdownOpen(false);
                    if (playSound) playSound(640, 'triangle', 0.08);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    background: selectedBuildingId === b.id ? 'rgba(212, 255, 0, 0.12)' : 'transparent',
                    border: selectedBuildingId === b.id ? '1px solid rgba(212, 255, 0, 0.3)' : '1px solid transparent',
                    color: selectedBuildingId === b.id ? 'var(--phosphor)' : 'var(--text-main)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{b.shortName || b.name}</span>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{b.virtualTourNode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subtle Divider */}
        <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* 4 Clean Essential Camera Presets */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {[
            { id: 'iso', label: 'ISO', target: { x: 0, y: 0, z: 0 }, angle: { theta: Math.PI / 4, phi: Math.PI / 4, radius: 135 }, buildingId: 'soe-block' },
            { id: 'soe', label: 'ENG & AI', target: { x: 32, y: 12, z: -22 }, angle: { theta: -Math.PI / 3.2, phi: Math.PI / 3.4, radius: 72 }, buildingId: 'soe-block' },
            { id: 'med', label: 'MED WING', target: { x: -34, y: 11, z: 22 }, angle: { theta: -Math.PI / 1.8, phi: Math.PI / 3.5, radius: 85 }, buildingId: 'cds-hospital' },
            { id: 'ortho', label: 'TOP', target: { x: 0, y: 0, z: 0 }, angle: { theta: 0.001, phi: 0.05, radius: 155 }, buildingId: 'soe-block' }
          ].map((p) => {
            const isActive = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                style={{
                  padding: '4px 9px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                  color: isActive ? 'var(--text-pure)' : 'var(--text-secondary)',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Subtle Divider */}
        <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Minimalist Layer Toggles */}
        <div style={{ display: 'flex', gap: '3px' }}>
          <button
            onClick={() => { setXRayMode(!xRayMode); if (playSound) playSound(660, 'square', 0.08); }}
            style={{
              padding: '4px 8px',
              borderRadius: '999px',
              background: xRayMode ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
              border: xRayMode ? '1px solid var(--cyan)' : '1px solid transparent',
              color: xRayMode ? 'var(--cyan)' : 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-mono)'
            }}
            title="Toggle X-Ray Internal Structures"
          >
            <Box size={11} />
            <span>X-Ray</span>
          </button>

          <button
            onClick={() => { setShowHeatmap(!showHeatmap); if (playSound) playSound(560, 'sine', 0.06); }}
            style={{
              padding: '4px 8px',
              borderRadius: '999px',
              background: showHeatmap ? 'rgba(255, 85, 0, 0.16)' : 'transparent',
              border: showHeatmap ? '1px solid var(--thermal)' : '1px solid transparent',
              color: showHeatmap ? 'var(--thermal)' : 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-mono)'
            }}
            title="Toggle Emissions Heatmap"
          >
            <Flame size={11} />
            <span>Heatmap</span>
          </button>

          <button
            onClick={() => { setLidarScan(!lidarScan); if (playSound) playSound(740, 'sawtooth', 0.08); }}
            style={{
              padding: '4px 8px',
              borderRadius: '999px',
              background: lidarScan ? 'rgba(212, 255, 0, 0.16)' : 'transparent',
              border: lidarScan ? '1px solid var(--phosphor)' : '1px solid transparent',
              color: lidarScan ? 'var(--phosphor)' : 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-mono)'
            }}
            title="Toggle LiDAR Laser Sweep"
          >
            <Crosshair size={11} />
            <span>LiDAR</span>
          </button>
        </div>
      </div>

      {/* Bottom Left: Collapsible Telemetry Dossier */}
      {isDossierCollapsed ? (
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 20 }}>
          <button
            onClick={() => setIsDossierCollapsed(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 14px',
              borderRadius: '999px',
              background: 'rgba(8, 10, 16, 0.88)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--text-main)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.5)'
            }}
          >
            <Cpu size={12} color={selectedBuilding.accent} />
            <span style={{ color: 'var(--text-pure)' }}>{selectedBuilding.shortName || selectedBuilding.name}</span>
            <span style={{ color: 'var(--phosphor)', fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>
              {dynamicMetrics.footprint?.split(' ')[0] || '0.24'} kg CO₂/hr
            </span>
            <ChevronUp size={12} color="var(--text-muted)" />
          </button>
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '360px',
          maxWidth: '90vw',
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
          pointerEvents: 'auto',
          zIndex: 20
        }}>
          <SpotlightCard
            spotlightColor={selectedBuilding.accent}
            spotlightSize={300}
            style={{ padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            {/* Header & Category */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={13} color={selectedBuilding.accent} />
                <span className="swiss-label" style={{ color: selectedBuilding.accent, fontSize: '8.5px' }}>
                  [{selectedBuilding.category.split('&')[0].trim()}]
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="telemetry-chip active" style={{ fontSize: '9px', padding: '1px 6px' }}>
                  {selectedBuilding.virtualTourNode}
                </span>
                <button
                  onClick={() => setIsDossierCollapsed(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                  title="Minimize Telemetry Dossier"
                >
                  <Minimize2 size={12} />
                </button>
              </div>
            </div>

            {/* Title & Coordinates */}
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '3px', letterSpacing: '-0.02em' }}>
              {selectedBuilding.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              <span>LAT: {selectedBuilding.gps.lat}</span>
              <span>•</span>
              <span>ALT: {selectedBuilding.gps.alt}</span>
            </div>

            {/* Dynamic Reactive Metric Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.45)',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '8px'
            }}>
              {Object.entries(dynamicMetrics).slice(0, 4).map(([key, val], idx) => (
                <div key={idx} style={{ gridColumn: key === 'carbonStatus' ? 'span 2' : 'span 1' }}>
                  <span className="swiss-label" style={{ display: 'block', marginBottom: '2px', fontSize: '8px' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="mono-nums" style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: key === 'footprint' ? 'var(--thermal)' : (key === 'carbonStatus' ? 'var(--phosphor)' : 'var(--text-pure)')
                  }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/* Direct 360° Virtual Tour Launch Button */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  setVirtualTourModal(selectedBuilding.virtualTourNode);
                  if (playSound) playSound(800, 'sine', 0.08);
                }}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.16), rgba(212, 255, 0, 0.12))',
                  border: '1px solid var(--border-active)',
                  borderRadius: '7px',
                  color: 'var(--phosphor)',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 0 10px rgba(212, 255, 0, 0.12)'
                }}
              >
                <Eye size={12} color="var(--phosphor)" />
                <span>LAUNCH 360° DSU PANORAMA</span>
              </button>

              <a
                href={`https://www.dsu.edu.in/virtual-tour/#${selectedBuilding.virtualTourNode}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '7px 9px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '7px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                title="Open Official Tour in New Tab"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* High-Tech In-App 360° DSU Virtual Tour Modal Viewer */}
      {virtualTourModal && (
        <div className="interactive-modal" style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 7, 12, 0.88)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 90
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1080px',
            height: '85vh',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-active)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye size={16} color="var(--cyan)" />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-pure)', letterSpacing: '-0.01em' }}>
                      DSU HAROHALLI 360° IMMERSIVE PANORAMA
                    </span>
                    <span className="telemetry-chip active" style={{ fontSize: '9px' }}>
                      {virtualTourModal}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    DAYANANDA SAGAR UNIVERSITY MAIN CAMPUS VIRTUAL TOUR FEED
                  </span>
                </div>
              </div>

              {/* Sub-node switcher buttons */}
              {selectedBuilding.tourNodes && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  {selectedBuilding.tourNodes.map((tn) => (
                    <button
                      key={tn.id}
                      onClick={() => setVirtualTourModal(tn.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: virtualTourModal === tn.id ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: virtualTourModal === tn.id ? '1px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: virtualTourModal === tn.id ? 'var(--cyan)' : 'var(--text-secondary)',
                        fontSize: '9.5px',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer'
                      }}
                    >
                      {tn.name.split(' ')[0]} {tn.name.split(' ')[1] || ''}
                    </button>
                  ))}
                </div>
              )}

              {/* Window Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={`https://www.dsu.edu.in/virtual-tour/#${virtualTourModal}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Full Screen</span>
                </a>

                <button
                  onClick={() => setVirtualTourModal(null)}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Embedded Live Iframe */}
            <div style={{ flex: 1, position: 'relative', background: '#000' }}>
              <iframe
                src={`https://www.dsu.edu.in/virtual-tour/#${virtualTourModal}`}
                title="DSU Harohalli Official Virtual Tour"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block'
                }}
                allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>

            {/* Modal Footer Dossier */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 18px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(0, 0, 0, 0.4)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--phosphor)' }}>● Pano2VR 360° SPATIAL MESH</span>
                <span>HAROHALLI CAMPUS (140 ACRES)</span>
                <span>ELEVATION: 683.5 M</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)' }}>
                <CheckCircle2 size={12} />
                <span>OFFICIAL DAYANANDA SAGAR UNIVERSITY TELEMETRY GROUND TRUTH</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
