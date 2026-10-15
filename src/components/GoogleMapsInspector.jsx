import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ExternalLink, 
  Compass, 
  Sun, 
  Moon, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Globe2, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Navigation, 
  Eye, 
  ChevronRight,
  Maximize2,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Magnet from './reactbits/Magnet';
import ShinyText from './reactbits/ShinyText';
import { calculateSolarTelemetry, classifyEarthLocation } from '../utils/geoTelemetry';

// In-memory cache for reverse geocode lookups
const geocodeCache = new Map();

export default function GoogleMapsInspector({
  isOpen,
  onClose,
  location,
  onJumpCampus,
  onSelectPreset,
  playSound
}) {
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite' | 'hybrid' | 'roadmap' | 'osm'
  const [zoomLevel, setZoomLevel] = useState(15);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dynamicPlaceName, setDynamicPlaceName] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const lat = location?.lat || 12.6521;
  const lon = location?.lon || 77.4411;

  // Calculate real-time physical solar telemetry
  const solarData = calculateSolarTelemetry(lat, lon);
  // Default classified telemetry
  const classified = classifyEarthLocation(lat, lon);

  // Asynchronous reverse geocoding with debounce, caching, and quick abort
  useEffect(() => {
    if (!isOpen) return;
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    if (geocodeCache.has(cacheKey)) {
      setDynamicPlaceName(geocodeCache.get(cacheKey));
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
        const fetchPromise = fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12&addressdetails=1`,
          {
            signal: controller.signal,
            headers: { 'Accept-Language': 'en' }
          }
        );

        const res = await Promise.race([fetchPromise, timeoutPromise]);
        if (!res.ok) throw new Error('Geocoding offline');
        const data = await res.json();
        if (isMounted && data && data.display_name) {
          const parts = data.display_name.split(',').map(s => s.trim());
          const shortName = parts.slice(0, 3).join(', ');
          geocodeCache.set(cacheKey, shortName);
          setDynamicPlaceName(shortName);
        }
      } catch {
        if (isMounted) setDynamicPlaceName(null);
      } finally {
        if (isMounted) setIsGeocoding(false);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, lat, lon]);

  if (!isOpen) return null;

  // Embedded map URL builder
  let embedUrl = '';
  if (mapMode === 'satellite') {
    // Google Maps Satellite pure
    embedUrl = `https://maps.google.com/maps?q=${lat},${lon}&t=k&z=${zoomLevel}&output=embed`;
  } else if (mapMode === 'hybrid') {
    // Google Maps Satellite Hybrid (with roads and labels)
    embedUrl = `https://maps.google.com/maps?q=${lat},${lon}&t=h&z=${zoomLevel}&output=embed`;
  } else if (mapMode === 'roadmap') {
    // Google Maps Vector Street Map
    embedUrl = `https://maps.google.com/maps?q=${lat},${lon}&t=m&z=${zoomLevel}&output=embed`;
  } else {
    // OpenStreetMap high-fidelity embed
    const spanLat = 0.05 / Math.pow(1.5, zoomLevel - 13);
    const spanLon = 0.08 / Math.pow(1.5, zoomLevel - 13);
    embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - spanLon}%2C${lat - spanLat}%2C${lon + spanLon}%2C${lat + spanLat}&layer=mapnik&marker=${lat}%2C${lon}`;
  }

  // 1-Click Launchers into Google Ecosystem
  const handleOpenGoogleMaps = () => {
    if (playSound) playSound(800, 'sine', 0.08);
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleMapsSatellite = () => {
    if (playSound) playSound(880, 'sine', 0.08);
    window.open(`https://www.google.com/maps/@${lat},${lon},${zoomLevel}z/data=!3m1!1e3`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleEarth = () => {
    if (playSound) playSound(940, 'triangle', 0.09);
    window.open(`https://earth.google.com/web/@${lat},${lon},1500a,35y,0h,0t,0r`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenStreetView = () => {
    if (playSound) playSound(750, 'sine', 0.07);
    window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`, '_blank', 'noopener,noreferrer');
  };

  const displayName = dynamicPlaceName || classified.name;

  return (
    <div
      style={{
        position: 'absolute',
        top: '72px',
        right: '24px',
        width: isMinimized ? '340px' : '440px',
        maxWidth: 'calc(100vw - 48px)',
        zIndex: 50,
        borderRadius: '18px',
        background: 'rgba(7, 9, 14, 0.94)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.12)',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Laser Top Accent Line */}
      <div
        style={{
          height: '2px',
          width: '100%',
          background: 'linear-gradient(90deg, #d4ff00 0%, #38bdf8 50%, #10b981 100%)'
        }}
      />

      {/* Header Bar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(12, 16, 26, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Radio size={14} color="var(--cyan)" className="animate-spin-slow" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="swiss-label" style={{ color: 'var(--cyan)', fontSize: '8.5px', letterSpacing: '0.08em' }}>
                [GOOGLE MAPS // ORBITAL RECON]
              </span>
              <span className="pulse-dot cyan" style={{ width: '5px', height: '5px' }} />
            </div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-pure)',
                letterSpacing: '-0.02em',
                maxWidth: '240px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={displayName}
            >
              {displayName}
            </h4>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '5px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isMinimized ? 'Expand Satellite View' : 'Minimize View'}
          >
            {isMinimized ? <Maximize2 size={12} /> : <Compass size={12} />}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '5px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Close Recon Inspector"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Coordinates & Precision Telemetry Strip */}
          <div
            style={{
              padding: '8px 16px',
              background: 'rgba(0, 0, 0, 0.45)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                LAT: <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{lat >= 0 ? `${lat.toFixed(4)}°N` : `${Math.abs(lat).toFixed(4)}°S`}</span>
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                LON: <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{lon >= 0 ? `${lon.toFixed(4)}°E` : `${Math.abs(lon).toFixed(4)}°W`}</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isGeocoding && (
                <span style={{ fontSize: '9.5px', color: 'var(--phosphor)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={9} className="animate-spin" /> RESOLVING...
                </span>
              )}
              <span style={{ color: 'var(--text-pure)', fontWeight: 600, fontSize: '10px' }}>
                {classified.country}
              </span>
            </div>
          </div>

          {/* Interactive Satellite Iframe Window */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              background: '#05070a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden'
            }}
          >
            <iframe
              src={embedUrl}
              title="Google Maps Reconnaissance"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                filter: 'brightness(0.95) contrast(1.05)'
              }}
              loading="lazy"
            />

            {/* In-Map Floating Layer Controls */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                display: 'flex',
                gap: '4px',
                background: 'rgba(6, 8, 14, 0.85)',
                backdropFilter: 'blur(16px)',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                zIndex: 10
              }}
            >
              <button
                onClick={() => setMapMode('satellite')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: mapMode === 'satellite' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                  color: mapMode === 'satellite' ? 'var(--cyan)' : 'var(--text-muted)'
                }}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapMode('hybrid')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: mapMode === 'hybrid' ? 'rgba(212, 255, 0, 0.2)' : 'transparent',
                  color: mapMode === 'hybrid' ? 'var(--phosphor)' : 'var(--text-muted)'
                }}
              >
                Hybrid
              </button>
              <button
                onClick={() => setMapMode('roadmap')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: mapMode === 'roadmap' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: mapMode === 'roadmap' ? 'var(--text-pure)' : 'var(--text-muted)'
                }}
              >
                Streets
              </button>
            </div>

            {/* In-Map Zoom Controls */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 10
              }}
            >
              <button
                onClick={() => setZoomLevel(prev => Math.min(19, prev + 1))}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'rgba(6, 8, 14, 0.88)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Zoom In (+)"
              >
                <ZoomIn size={12} />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(3, prev - 1))}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'rgba(6, 8, 14, 0.88)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Zoom Out (-)"
              >
                <ZoomOut size={12} />
              </button>
            </div>

            {/* Center Reticle Over Map */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '1px dashed rgba(212, 255, 0, 0.7)',
                  borderRadius: '50%'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  background: 'var(--phosphor)',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px var(--phosphor)'
                }}
              />
            </div>
          </div>

          {/* Quick Launchpad to Google Maps Ecosystem */}
          <div style={{ padding: '12px 16px', background: 'rgba(8, 10, 16, 0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="swiss-label" style={{ color: 'var(--phosphor)', fontSize: '8.5px' }}>
                [DIRECT HIGH-RES LAUNCHERS]
              </span>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ZOOM LEVEL {zoomLevel}x
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              {/* Launcher 1: Full Google Maps Satellite */}
              <button
                onClick={handleOpenGoogleMapsSatellite}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: 'var(--cyan)',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--cyan)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={12} />
                  <span>Google Satellite</span>
                </div>
                <ExternalLink size={10} />
              </button>

              {/* Launcher 2: Google Earth 3D */}
              <button
                onClick={handleOpenGoogleEarth}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(212, 255, 0, 0.1)',
                  border: '1px solid rgba(212, 255, 0, 0.25)',
                  color: 'var(--phosphor)',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(212, 255, 0, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--phosphor)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(212, 255, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(212, 255, 0, 0.25)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe2 size={12} />
                  <span>Google Earth 3D</span>
                </div>
                <ExternalLink size={10} />
              </button>

              {/* Launcher 3: Google Maps Navigation / Places */}
              <button
                onClick={handleOpenGoogleMaps}
                style={{
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-main)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={11} color="var(--cyan)" />
                  <span>Google Maps UI</span>
                </div>
                <ExternalLink size={10} />
              </button>

              {/* Launcher 4: Google Street View */}
              <button
                onClick={handleOpenStreetView}
                style={{
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-main)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={11} color="var(--emerald)" />
                  <span>Street View 360°</span>
                </div>
                <ExternalLink size={10} />
              </button>
            </div>

            {/* Real-time Physical Energy & Environmental Telemetry */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="swiss-label" style={{ color: 'var(--text-muted)', fontSize: '8.5px' }}>
                  [ENVIRONMENTAL & GRID SENSORS]
                </span>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  {solarData.localSolarTime}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {/* Solar Irradiance */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    {solarData.isDaylight ? <Sun size={11} color="var(--phosphor)" /> : <Moon size={11} color="var(--cyan)" />}
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Solar Flux</span>
                  </div>
                  <div className="mono-nums" style={{ fontSize: '12px', fontWeight: 700, color: solarData.isDaylight ? 'var(--phosphor)' : 'var(--text-muted)' }}>
                    {solarData.irradiance} <span style={{ fontSize: '9px', fontWeight: 400 }}>W/m²</span>
                  </div>
                </div>

                {/* Regional Carbon Factor */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <Zap size={11} color="var(--cyan)" />
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Grid Factor</span>
                  </div>
                  <div className="mono-nums" style={{ fontSize: '12px', fontWeight: 700, color: classified.carbon < 100 ? 'var(--emerald)' : (classified.carbon > 450 ? 'var(--thermal)' : 'var(--cyan)') }}>
                    {classified.carbon} <span style={{ fontSize: '9px', fontWeight: 400 }}>g/kWh</span>
                  </div>
                </div>

                {/* Sun Elevation Angle */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <Compass size={11} color="var(--emerald)" />
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Sun Zenith</span>
                  </div>
                  <div className="mono-nums" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {solarData.altitude}°
                  </div>
                </div>
              </div>
            </div>

            {/* Special Action: Dive directly to DSU Campus Twin */}
            <Magnet padding={30} magnetStrength={2} maxOffset={4} style={{ width: '100%' }}>
              <button
                onClick={() => {
                  if (playSound) playSound(640, 'sine', 0.1);
                  if (onJumpCampus) onJumpCampus();
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '999px',
                  background: classified.isCampus ? 'var(--phosphor)' : 'rgba(212, 255, 0, 0.12)',
                  border: classified.isCampus ? 'none' : '1px solid rgba(212, 255, 0, 0.35)',
                  color: classified.isCampus ? '#08090d' : 'var(--phosphor)',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: classified.isCampus ? '0 0 16px rgba(212, 255, 0, 0.35)' : 'none'
                }}
              >
                <span>{classified.isCampus ? 'Launch DSU Campus 3D Twin' : 'Jump to DSU Harohalli Campus Twin (Bangalore)'}</span>
                <ArrowRight size={12} />
              </button>
            </Magnet>
          </div>
        </>
      )}
    </div>
  );
}
