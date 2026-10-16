import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Globe2, 
  Zap, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Sun, 
  Target, 
  Layers, 
  Minimize2, 
  ChevronUp, 
  ChevronDown, 
  Search, 
  MapPin, 
  Navigation,
  Compass,
  Radio,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import OptionWheel from './reactbits/OptionWheel';
import ShinyText from './reactbits/ShinyText';
import SpotlightCard from './reactbits/SpotlightCard';
import Magnet from './reactbits/Magnet';
import GoogleMapsInspector from './GoogleMapsInspector';
import { GLOBAL_PRESETS, classifyEarthLocation } from '../utils/geoTelemetry';

// Real-world electricity grid regional emission factors (gCO2/kWh)
const REGIONS = [
  {
    name: 'Karnataka SLDC (Bangalore, IN)',
    wheelLabel: 'Karnataka SLDC (Bangalore)',
    lat: 12.9716,
    lon: 77.5946,
    baseCarbon: 238,
    status: 'moderate',
    note: 'CEA v20.0 (0.716 kg/kWh) • Pavagada 2,050 MW Solar Cluster',
    mix: { solar: 36, coal: 31, hydro: 19, wind: 11, nuclear: 3 },
    rot: { y: 4.2, x: 0.22 }
  },
  {
    name: 'California CAISO (San Jose, US)',
    wheelLabel: 'California CAISO (San Jose)',
    lat: 37.3382,
    lon: -121.8863,
    baseCarbon: 182,
    status: 'optimal',
    note: 'High Solar + Battery Storage',
    mix: { solar: 54, battery: 16, gas: 18, wind: 12 },
    rot: { y: 1.0, x: 0.55 }
  },
  {
    name: 'Europe West (Paris, FR)',
    wheelLabel: 'RTE Grid (France)',
    lat: 48.8566,
    lon: 2.3522,
    baseCarbon: 56,
    status: 'optimal',
    note: '70% Nuclear Baseload + Wind',
    mix: { nuclear: 68, wind: 16, hydro: 10, solar: 6 },
    rot: { y: 2.9, x: 0.75 }
  },
  {
    name: 'Europe Central (Frankfurt, DE)',
    wheelLabel: 'Amprion Grid (Germany)',
    lat: 50.1109,
    lon: 8.6821,
    baseCarbon: 340,
    status: 'moderate',
    note: 'Wind + Gas Balance',
    mix: { wind: 38, coal: 26, solar: 22, gas: 14 },
    rot: { y: 2.8, x: 0.78 }
  },
  {
    name: 'Nordic Grid (Oslo, NO)',
    wheelLabel: 'Nord Pool (Norway)',
    lat: 59.9139,
    lon: 10.7522,
    baseCarbon: 28,
    status: 'optimal',
    note: '98% Hydroelectric & Wind',
    mix: { hydro: 88, wind: 10, biomass: 2 },
    rot: { y: 2.7, x: 0.95 }
  },
  {
    name: 'East Asia Grid (Tokyo, JP)',
    wheelLabel: 'TEPCO (Tokyo, JP)',
    lat: 35.6762,
    lon: 139.6503,
    baseCarbon: 490,
    status: 'moderate',
    note: 'LNG Baseload + Nuclear',
    mix: { gas: 64, nuclear: 18, coal: 11, solar: 7 },
    rot: { y: 5.2, x: 0.52 }
  },
];

export default function PlanetaryGlobe({ onZoomCampus, playSound }) {
  const mountRef = useRef(null);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [hudMode, setHudMode] = useState('wheel'); // 'wheel' | 'tiles'
  const [liveJitter, setLiveJitter] = useState(0);
  const [simulatedTime, setSimulatedTime] = useState('');
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(true);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Google Maps Recon & Targeting State
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 12.6521,
    lon: 77.4411,
    source: 'preset'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const targetRotationRef = useRef({ y: REGIONS[0].rot.y, x: REGIONS[0].rot.x });
  const beaconGroupRef = useRef(null);
  const selectedRegion = REGIONS[selectedRegionIndex];

  // Helper to convert lat/lon to Three.js 3D Vector on globe sphere
  const latLonToVector3 = useCallback((lat, lon, radius = 60) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, []);

  // Update 3D Beacon and Reticle Position
  const updateBeacon = useCallback((lat, lon) => {
    if (!beaconGroupRef.current) return;
    const pos = latLonToVector3(lat, lon, 60.4);
    beaconGroupRef.current.position.copy(pos);
    const normal = pos.clone().normalize();
    beaconGroupRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    beaconGroupRef.current.visible = true;
  }, [latLonToVector3]);

  // Rotate Earth Sphere smoothly to face given coordinates
  const orientGlobeToCoords = useCallback((lat, lon) => {
    targetRotationRef.current = {
      y: 2.85 + (lon * Math.PI) / 180,
      x: (lat * Math.PI) / 180 * 0.9
    };
  }, []);

  // Master handler for selecting any location on Earth
  const handleSelectLocation = useCallback((lat, lon, source = 'click', customName = null) => {
    if (playSound) playSound(880, 'sine', 0.08);
    updateBeacon(lat, lon);
    orientGlobeToCoords(lat, lon);
    setSelectedLocation({
      lat: parseFloat(lat.toFixed(4)),
      lon: parseFloat(lon.toFixed(4)),
      source,
      name: customName
    });
    setIsInspectorOpen(true);
  }, [playSound, updateBeacon, orientGlobeToCoords]);

  const handleSelectLocationRef = useRef(handleSelectLocation);
  useEffect(() => {
    handleSelectLocationRef.current = handleSelectLocation;
  }, [handleSelectLocation]);

  // Live dynamic fluctuation ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveJitter((Math.random() - 0.5) * 3.5);
      const now = new Date();
      setSimulatedTime(now.toTimeString().split(' ')[0] + ' UTC');
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleSelectRegion = (index) => {
    setSelectedRegionIndex(index);
    const reg = REGIONS[index];
    if (reg) {
      handleSelectLocation(reg.lat, reg.lon, 'region', reg.name);
    }
  };

  // Search input handler
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();

    // 1. Check if user entered direct coordinates like "12.65, 77.44"
    const coordMatch = query.match(/^([-+]?[0-9]*\.?[0-9]+)[,\s]+([-+]?[0-9]*\.?[0-9]+)$/);
    if (coordMatch) {
      const pLat = parseFloat(coordMatch[1]);
      const pLon = parseFloat(coordMatch[2]);
      if (pLat >= -90 && pLat <= 90 && pLon >= -180 && pLon <= 180) {
        handleSelectLocation(pLat, pLon, 'search', `Coordinates [${pLat.toFixed(2)}, ${pLon.toFixed(2)}]`);
        return;
      }
    }

    // 2. Check local presets
    const matchedPreset = GLOBAL_PRESETS.find(p => 
      p.name.toLowerCase().includes(query) || 
      p.subtext.toLowerCase().includes(query) ||
      (query === 'dsu' && p.isCampus) ||
      (query.includes('dayananda') && p.isCampus) ||
      (query.includes('harohalli') && p.isCampus) ||
      (query.includes('solar') && p.name.includes('Solar'))
    );

    if (matchedPreset) {
      handleSelectLocation(matchedPreset.lat, matchedPreset.lon, 'search', matchedPreset.name);
      return;
    }

    // 3. Online Geocoding Search via OpenStreetMap Nominatim
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const place = data[0];
        const sLat = parseFloat(place.lat);
        const sLon = parseFloat(place.lon);
        handleSelectLocation(sLat, sLon, 'search', place.display_name.split(',')[0]);
      } else {
        // Fallback to DSU Campus if not found
        handleSelectLocation(12.6521, 77.4411, 'search', 'Dayananda Sagar University (DSU)');
      }
    } catch {
      handleSelectLocation(12.6521, 77.4411, 'search', 'Dayananda Sagar University (DSU)');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 205;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Core Earth Sphere with Local NASA High-Res Texture
    const textureLoader = new THREE.TextureLoader();
    const dayTexture = textureLoader.load('/textures/earth_daymap.jpg');
    const cloudsTexture = textureLoader.load('/textures/earth_clouds.png');

    const earthGeo = new THREE.SphereGeometry(60, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: dayTexture,
      roughness: 0.65,
      metalness: 0.12,
      bumpScale: 0.05
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // 2. Realistic Atmospheric Clouds Layer
    const cloudsGeo = new THREE.SphereGeometry(60.8, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    // 3. Atmospheric Rayleigh Scattering Glow (Fresnel outer halo)
    const atmosphereGeo = new THREE.SphereGeometry(62.5, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 4. Cinematic Space Sun Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(150, 40, 120);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x101b33, 0.6);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.4);
    rimLight.position.set(-150, -50, -80);
    scene.add(rimLight);

    // 5. Preset Region Markers
    const markerMeshes = [];
    REGIONS.forEach((region) => {
      const pos = latLonToVector3(region.lat, region.lon, 61.2);
      const color = region.status === 'optimal' ? 0xd4ff00 : (region.status === 'dirty' ? 0xff5500 : 0x00f0ff);
      const dotGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      globeGroup.add(dot);

      const ringGeo = new THREE.RingGeometry(1.6, 2.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      globeGroup.add(ring);

      markerMeshes.push({ dot, ring, region });
    });

    // 6. Dynamic Cybernetic Targeting Laser Beacon Group
    const beaconGroup = new THREE.Group();
    beaconGroup.visible = false;
    beaconGroupRef.current = beaconGroup;
    globeGroup.add(beaconGroup);

    // Base pulsing dot
    const beaconDotGeo = new THREE.SphereGeometry(1.5, 24, 24);
    const beaconDotMat = new THREE.MeshBasicMaterial({ color: 0xd4ff00 });
    const beaconDot = new THREE.Mesh(beaconDotGeo, beaconDotMat);
    beaconGroup.add(beaconDot);

    // Expanding shockwave ring
    const beaconRingGeo = new THREE.RingGeometry(2.0, 3.8, 32);
    const beaconRingMat = new THREE.MeshBasicMaterial({ 
      color: 0x38bdf8, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.9 
    });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconRing.rotation.x = Math.PI / 2;
    beaconGroup.add(beaconRing);

    // Vertical Laser Beacon Beam pointing into space
    const beamGeo = new THREE.CylinderGeometry(0.35, 0.75, 20, 16);
    beamGeo.translate(0, 10, 0);
    const beamMat = new THREE.MeshBasicMaterial({ 
      color: 0x38bdf8, 
      transparent: true, 
      opacity: 0.7, 
      blending: THREE.AdditiveBlending 
    });
    const beaconBeam = new THREE.Mesh(beamGeo, beamMat);
    beaconGroup.add(beaconBeam);

    // Orbital Reticle Diamond at beacon tip
    const reticleGeo = new THREE.RingGeometry(3.5, 4.2, 4);
    const reticleMat = new THREE.MeshBasicMaterial({ 
      color: 0xd4ff00, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.85 
    });
    const beaconReticle = new THREE.Mesh(reticleGeo, reticleMat);
    beaconReticle.position.set(0, 20, 0);
    beaconReticle.rotation.x = Math.PI / 2;
    beaconGroup.add(beaconReticle);

    // Initial Beacon set to DSU Campus
    const initialPos = latLonToVector3(12.6521, 77.4411, 60.4);
    beaconGroup.position.copy(initialPos);
    const initialNormal = initialPos.clone().normalize();
    beaconGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), initialNormal);
    beaconGroup.visible = true;

    // 7. Space Particles Dust
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 800;
      starPositions[i + 1] = (Math.random() - 0.5) * 800;
      starPositions[i + 2] = (Math.random() - 0.5) * 800;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0x64748b, size: 1.1, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Initial orientation: Center on India / Bangalore
    globeGroup.rotation.y = targetRotationRef.current.y;
    globeGroup.rotation.x = targetRotationRef.current.x;

    // Raycaster for Earth Click Detection
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    // Mouse Drag & Click Discrimination
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;

    const performEarthRaycast = (clientX, clientY) => {
      const rect = currentMount.getBoundingClientRect();
      mouseVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObject(earthMesh, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        // Convert world hit point to earth local coordinates
        const localPoint = earthMesh.worldToLocal(hit.point.clone());
        const radius = localPoint.length();
        
        // Inverted spherical trigonometry: local (x,y,z) -> (lat, lon)
        const phi = Math.acos(Math.max(-1, Math.min(1, localPoint.y / radius)));
        const lat = 90 - (phi * 180) / Math.PI;
        const theta = Math.atan2(localPoint.z, -localPoint.x);
        let lon = (theta * 180) / Math.PI - 180;
        while (lon < -180) lon += 360;
        while (lon > 180) lon -= 360;
        if (handleSelectLocationRef.current) {
          handleSelectLocationRef.current(lat, lon, 'click');
        }
      }
    };

    const handleMouseDown = (e) => {
      if (
        e.target.tagName === 'BUTTON' || 
        e.target.closest('button') || 
        e.target.tagName === 'INPUT' || 
        e.target.closest('input') || 
        e.target.closest('.option-wheel')
      ) {
        return;
      }
      isDragging = true;
      pointerDownPos = { x: e.clientX, y: e.clientY };
      pointerDownTime = performance.now();
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      targetRotationRef.current.y = globeGroup.rotation.y;
      targetRotationRef.current.x = globeGroup.rotation.x;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e) => {
      if (isDragging) {
        const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
        const elapsed = performance.now() - pointerDownTime;
        // If movement is subtle (< 6px) and duration < 380ms, register as deliberate click!
        if (moveDist < 6 && elapsed < 380) {
          performEarthRaycast(e.clientX, e.clientY);
        }
      }
      isDragging = false;
    };

    // Mobile Touch Interaction
    let touchStartPos = { x: 0, y: 0 };
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchStartTime = performance.now();
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        isDragging = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      targetRotationRef.current.y = globeGroup.rotation.y;
      targetRotationRef.current.x = globeGroup.rotation.x;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const dist = Math.hypot(touch.clientX - touchStartPos.x, touch.clientY - touchStartPos.y);
        const elapsed = performance.now() - touchStartTime;
        if (dist < 8 && elapsed < 400) {
          performEarthRaycast(touch.clientX, touch.clientY);
        }
      }
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    currentMount.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 60 FPS Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth interpolation toward target rotation when not dragging
      if (!isDragging) {
        globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.06;
        globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.06;
        // Subtle planetary drift
        targetRotationRef.current.y += 0.0006;
      }

      // Clouds rotate slightly faster for realistic atmospheric drift
      cloudsMesh.rotation.y += 0.0004;

      // Animate pulsing rings on markers
      markerMeshes.forEach((m, idx) => {
        const scale = 1.0 + Math.sin(elapsedTime * 3 + idx) * 0.25;
        m.ring.scale.set(scale, scale, scale);
        m.ring.material.opacity = 0.5 + Math.sin(elapsedTime * 3 + idx) * 0.35;
      });

      // Animate active cybernetic beacon
      if (beaconGroup.visible) {
        const pulse = Math.sin(elapsedTime * 5);
        beaconRing.scale.set(1.0 + pulse * 0.35, 1.0 + pulse * 0.35, 1);
        beaconRingMat.opacity = 0.5 + pulse * 0.35;
        beamMat.opacity = 0.55 + Math.sin(elapsedTime * 8) * 0.25;
        beaconReticle.rotation.z += 0.025;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      currentMount.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const currentDisplayCarbon = (selectedRegion.baseCarbon + liveJitter).toFixed(1);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Realistic WebGL Earth Canvas */}
      <div 
        ref={mountRef} 
        style={{ width: '100%', height: '100%', cursor: 'crosshair' }} 
        title="Click ANY place on Earth to inspect in Google Maps Satellite!"
      />

      {/* Atmospheric Spatial Vignette & Subtle Scanlines */}
      <div className="spatial-vignette" />
      <div className="hud-scanlines" />

      {/* Top Center: Global Place Search Bar & Quick Recon Presets */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 40,
          width: '92%',
          maxWidth: '680px'
        }}
      >
        {/* Search Bar Form */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(7, 9, 14, 0.92)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '999px',
            padding: '4px 6px 4px 14px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.15)',
            transition: 'border-color 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <Search size={14} color="var(--cyan)" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search any place on Earth (e.g. Tokyo, Paris, DSU, 12.65, 77.44)..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontFamily: 'var(--font-ui)'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="submit"
              disabled={isSearching}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'var(--cyan)',
                border: 'none',
                color: '#07090e',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{isSearching ? 'Recon...' : 'Locate'}</span>
              <Navigation size={10} />
            </button>
          </div>
        </form>

        {/* Quick Location Chips Carousel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            width: '100%',
            padding: '2px 4px',
            scrollbarWidth: 'none',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => handleSelectLocation(12.6521, 77.4411, 'preset', 'Dayananda Sagar University (DSU)')}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(212, 255, 0, 0.15)',
              border: '1px solid rgba(212, 255, 0, 0.4)',
              color: 'var(--phosphor)',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={10} />
            <span>🏛️ DSU Harohalli Campus</span>
          </button>

          <button
            onClick={() => handleSelectLocation(14.2810, 77.2514, 'preset', 'Pavagada Solar Park')}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: 'var(--cyan)',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ☀️ Pavagada 2,050 MW
          </button>

          <button
            onClick={() => handleSelectLocation(12.9716, 77.5946, 'preset', 'Bangalore KPTCL SLDC')}
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ⚡ Bangalore SLDC
          </button>

          <button
            onClick={() => handleSelectLocation(37.3382, -121.8863, 'preset', 'Silicon Valley')}
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🌉 Silicon Valley
          </button>

          <button
            onClick={() => handleSelectLocation(48.8566, 2.3522, 'preset', 'Paris RTE Grid')}
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🗼 Paris RTE
          </button>

          <button
            onClick={() => handleSelectLocation(35.6762, 139.6503, 'preset', 'Tokyo TEPCO')}
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🏙️ Tokyo TEPCO
          </button>

          <button
            onClick={() => handleSelectLocation(25.1972, 55.2744, 'preset', 'Dubai Solar')}
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🏜️ Dubai Solar
          </button>

          <button
            onClick={() => handleSelectLocation(64.1466, -21.9426, 'preset', 'Reykjavik Geothermal')}
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🏔️ Iceland 0g
          </button>
        </div>
      </div>

      {/* Top-Left HUD Corner Bracket: Orbital Telemetry */}
      <div className="hud-corner-box cyan" style={{
        position: 'absolute',
        top: '20px',
        left: '24px',
        padding: '9px 14px',
        background: 'rgba(6, 8, 12, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 20,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span className="pulse-dot cyan" />
          <span className="swiss-label" style={{ color: 'var(--cyan)' }}>[ORBITAL TELEMETRY // MERRA-2]</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-main)', display: 'flex', gap: '12px' }}>
          <span>LAT <span className="mono-nums" style={{ color: 'var(--cyan)', fontWeight: 700 }}>{selectedLocation.lat}°</span></span>
          <span>LON <span className="mono-nums" style={{ color: 'var(--cyan)', fontWeight: 700 }}>{selectedLocation.lon}°</span></span>
          <span>ALT <span className="mono-nums" style={{ color: 'var(--text-pure)' }}>640 KM</span></span>
        </div>
      </div>

      {/* Top-Right HUD Corner: Google Maps Satellite Quick Launcher */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '24px',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={() => {
            if (playSound) playSound(800, 'sine', 0.08);
            setIsInspectorOpen(!isInspectorOpen);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            background: isInspectorOpen ? '#1f6feb' : '#161b22',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f0f6fc',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Radio size={12} color={isInspectorOpen ? '#ffffff' : '#38bdf8'} />
          <span>{isInspectorOpen ? 'Close Satellite Panel' : 'Google Satellite'}</span>
        </button>
      </div>

      {/* Subtle Center Interaction Hint */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '6px',
        background: 'rgba(13, 17, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '11px',
        color: '#8b949e',
        fontFamily: 'var(--font-mono)',
        pointerEvents: 'none',
        zIndex: 20
      }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8' }} />
        <span>Click anywhere on globe to inspect coordinates in Google Maps</span>
      </div>

      {/* Floating Left HUD: Global Grid Nodes Selector */}
      {isLeftCollapsed ? (
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 20 }}>
          <button
            onClick={() => setIsLeftCollapsed(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
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
            <Globe2 size={13} color="var(--cyan)" />
            <span>{selectedRegion.wheelLabel}</span>
            <span style={{ color: 'var(--phosphor)', fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>
              {currentDisplayCarbon} gCO₂/kWh
            </span>
            <ChevronUp size={12} color="var(--text-muted)" />
          </button>
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '320px',
          maxWidth: '90vw',
          pointerEvents: 'auto',
          zIndex: 20
        }}>
          <SpotlightCard
            spotlightColor="rgba(212, 255, 0, 0.15)"
            spotlightSize={260}
            style={{ padding: '14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe2 size={14} color="var(--cyan)" />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-pure)' }}>
                  Global Grid Nodes
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <button
                    onClick={() => {
                      setHudMode('wheel');
                      if (playSound) playSound(520, 'sine', 0.05);
                    }}
                    style={{
                      padding: '2px 7px',
                      background: hudMode === 'wheel' ? 'rgba(212, 255, 0, 0.15)' : 'transparent',
                      border: hudMode === 'wheel' ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                      color: hudMode === 'wheel' ? 'var(--phosphor)' : 'var(--text-muted)',
                      borderRadius: '999px',
                      fontSize: '9.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Wheel
                  </button>
                  <button
                    onClick={() => {
                      setHudMode('tiles');
                      if (playSound) playSound(520, 'sine', 0.05);
                    }}
                    style={{
                      padding: '2px 7px',
                      background: hudMode === 'tiles' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      border: hudMode === 'tiles' ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
                      color: hudMode === 'tiles' ? 'var(--cyan)' : 'var(--text-muted)',
                      borderRadius: '999px',
                      fontSize: '9.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    List
                  </button>
                </div>

                <button
                  onClick={() => setIsLeftCollapsed(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                  title="Minimize Nodes Panel"
                >
                  <Minimize2 size={12} />
                </button>
              </div>
            </div>

            {hudMode === 'wheel' ? (
              <div style={{
                height: '150px',
                position: 'relative',
                background: 'rgba(5, 7, 10, 0.7)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '6px',
                  right: '6px',
                  transform: 'translateY(-50%)',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid rgba(212, 255, 0, 0.25)',
                  pointerEvents: 'none',
                  background: 'rgba(212, 255, 0, 0.05)'
                }} />

                <OptionWheel
                  items={REGIONS.map(r => r.wheelLabel)}
                  defaultSelected={selectedRegionIndex}
                  onChange={(idx) => handleSelectRegion(idx)}
                  onTick={() => {
                    if (playSound) playSound(720, 'sine', 0.03);
                  }}
                  fontSize={0.88}
                  spacing={1.3}
                  tilt={5}
                  curve={1.05}
                  activeColor="var(--phosphor)"
                  textColor="#64748b"
                  inset={14}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {REGIONS.map((r, i) => {
                  const isSelected = selectedRegionIndex === i;
                  return (
                    <div
                      key={i}
                      onClick={() => handleSelectRegion(i)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(212, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div className={`pulse-dot ${r.status === 'dirty' ? 'thermal' : (r.status === 'optimal' ? '' : 'cyan')}`} />
                        <span style={{ fontSize: '10.5px', fontWeight: 600, color: isSelected ? 'var(--text-pure)' : 'var(--text-secondary)' }}>
                          {r.name.split('(')[0].trim()}
                        </span>
                      </div>
                      <span className="mono-nums" style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        color: r.status === 'optimal' ? 'var(--phosphor)' : (r.status === 'dirty' ? 'var(--thermal)' : 'var(--cyan)')
                      }}>
                        {isSelected ? `${currentDisplayCarbon} g` : `${r.baseCarbon} g`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Active Node Live Carbon Sheen Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.45)',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                Carbon Intensity
              </span>
              <ShinyText
                text={`${currentDisplayCarbon} gCO₂/kWh`}
                color="var(--phosphor)"
                shineColor="#ffffff"
                speed={2.2}
                style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* Floating Right HUD: Live Regional Energy Mix & Facility Target */}
      {isRightCollapsed ? (
        <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 20 }}>
          <button
            onClick={() => setIsRightCollapsed(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(8, 10, 16, 0.88)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(212, 255, 0, 0.3)',
              color: 'var(--phosphor)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.5)'
            }}
          >
            <Target size={13} color="var(--phosphor)" />
            <span>TARGET: {selectedRegion.name.split('(')[0].trim()}</span>
            <ChevronUp size={12} color="var(--text-muted)" />
          </button>
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          width: '340px',
          maxWidth: '90vw',
          pointerEvents: 'auto',
          zIndex: 20
        }}>
          <SpotlightCard
            spotlightColor="rgba(56, 189, 248, 0.15)"
            spotlightSize={280}
            style={{ padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={14} color="var(--phosphor)" />
                <span className="swiss-label" style={{ color: 'var(--phosphor)', fontSize: '8.5px' }}>
                  [TARGET GRID NODE]
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {simulatedTime || 'LIVE UTC'}
                </span>
                <button
                  onClick={() => setIsRightCollapsed(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                  title="Minimize Target Panel"
                >
                  <Minimize2 size={12} />
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '3px', letterSpacing: '-0.02em' }}>
              {selectedRegion.name}
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {selectedRegion.note}
            </p>

            {/* Clean Dynamic Generation Mix */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 10px',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '9.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Generation Mix
                </span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>100% Real-time</span>
              </div>

              <div style={{ display: 'flex', height: '5px', borderRadius: '999px', overflow: 'hidden', marginBottom: '6px' }}>
                {selectedRegion.mix.solar && <div style={{ width: `${selectedRegion.mix.solar}%`, background: 'var(--emerald)' }} title="Solar" />}
                {selectedRegion.mix.wind && <div style={{ width: `${selectedRegion.mix.wind}%`, background: 'var(--cyan)' }} title="Wind" />}
                {selectedRegion.mix.hydro && <div style={{ width: `${selectedRegion.mix.hydro}%`, background: '#38bdf8' }} title="Hydro" />}
                {selectedRegion.mix.nuclear && <div style={{ width: `${selectedRegion.mix.nuclear}%`, background: '#a855f7' }} title="Nuclear" />}
                {selectedRegion.mix.gas && <div style={{ width: `${selectedRegion.mix.gas}%`, background: '#f59e0b' }} title="Gas" />}
                {selectedRegion.mix.coal && <div style={{ width: `${selectedRegion.mix.coal}%`, background: 'var(--thermal)' }} title="Coal" />}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', fontSize: '10px' }}>
                {Object.entries(selectedRegion.mix).map(([source, val]) => (
                  <div key={source} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{source}:</span>
                    <span className="mono-nums" style={{ fontWeight: 700, color: 'var(--text-pure)' }}>{val}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Magnetic CTA Button to Dive to DSU Campus */}
            <Magnet padding={40} magnetStrength={3} maxOffset={6} style={{ width: '100%' }}>
              <button
                onClick={onZoomCampus}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '999px',
                  background: 'var(--phosphor)',
                  color: '#08090d',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 0 16px rgba(212, 255, 0, 0.3)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  outline: 'none'
                }}
              >
                <span>Dive to DSU Campus 3D Twin</span>
                <ArrowRight size={13} />
              </button>
            </Magnet>
          </SpotlightCard>
        </div>
      )}

      {/* Interactive Google Maps Satellite & Orbital Reconnaissance Inspector */}
      <GoogleMapsInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        location={selectedLocation}
        onJumpCampus={onZoomCampus}
        onSelectPreset={(p) => handleSelectLocation(p.lat, p.lon, 'preset', p.name)}
        playSound={playSound}
      />
    </div>
  );
}
