import React, { useState } from 'react';
import { Bus, Zap, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, TrendingDown, Navigation, Fuel, Sparkles, MapPin } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import Magnet from './reactbits/Magnet';
import ShinyText from './reactbits/ShinyText';

// Real-world DSU Harohalli Bus Routes & Vehicle Engineering Parameters
export const DSU_BUS_ROUTES = [
  {
    id: 'route-01',
    name: 'South Bangalore Trunk (Banashankari Metro)',
    corridor: 'Kanakapura Road (NH 948)',
    oneWayKm: 38.4,
    roundTripKm: 76.8,
    busesAssigned: 8,
    dailyTrips: 16,
    avgOccupancy: 39, // out of 42
    capacity: 42,
    waypoints: ['Banashankari TTMC', 'Konanakunte Cross', 'Thalaghattapura', 'Art of Living', 'Kaggalipura', 'Harohalli Campus'],
    elevationProfile: { startM: 920, endM: 680, dropM: 240, regenRecoveryKWh: 8.4 },
    dieselBus: 'Ashok Leyland Viking BS-IV 42-Seater',
    dieselBurnPerDayL: 180.7,
    dieselCo2KgPerDay: 485.0
  },
  {
    id: 'route-02',
    name: 'IT Corridor Tech Express (Electronic City)',
    corridor: 'NICE Road & Bannerghatta Link',
    oneWayKm: 34.2,
    roundTripKm: 68.4,
    busesAssigned: 6,
    dailyTrips: 12,
    avgOccupancy: 41,
    capacity: 42,
    waypoints: ['Electronic City Toll', 'NICE Toll Plaza', 'Bannerghatta Zoo Link', 'Jigani Road', 'Harohalli Phase 2', 'Harohalli Campus'],
    elevationProfile: { startM: 910, endM: 680, dropM: 230, regenRecoveryKWh: 7.6 },
    dieselBus: 'Tata LP 1512 BS-IV 42-Seater',
    dieselBurnPerDayL: 120.7,
    dieselCo2KgPerDay: 323.9
  },
  {
    id: 'route-03',
    name: 'Rural Feeder South (Kanakapura Town)',
    corridor: 'Kanakapura Road (NH 948 South)',
    oneWayKm: 22.5,
    roundTripKm: 45.0,
    busesAssigned: 4,
    dailyTrips: 8,
    avgOccupancy: 36,
    capacity: 42,
    waypoints: ['Kanakapura KSRTC Stand', 'Channasandra Gate', 'Gabbadi Cross', 'Harohalli Gate', 'Harohalli Campus'],
    elevationProfile: { startM: 638, endM: 680, dropM: -42, regenRecoveryKWh: 2.1 },
    dieselBus: 'Ashok Leyland Lynx BS-IV',
    dieselBurnPerDayL: 52.9,
    dieselCo2KgPerDay: 142.0
  },
  {
    id: 'route-04',
    name: 'West Bangalore Shuttle (Mysore Road Satellite)',
    corridor: 'NICE Expressway West',
    oneWayKm: 41.8,
    roundTripKm: 83.6,
    busesAssigned: 6,
    dailyTrips: 12,
    avgOccupancy: 38,
    capacity: 42,
    waypoints: ['Kengeri Metro TTMC', 'NICE Mysore Rd Interchange', 'Kanakapura Rd Junction', 'Kaggalipura', 'Harohalli Campus'],
    elevationProfile: { startM: 840, endM: 680, dropM: 160, regenRecoveryKWh: 6.8 },
    dieselBus: 'Tata LP 1618 BS-IV 42-Seater',
    dieselBurnPerDayL: 147.5,
    dieselCo2KgPerDay: 395.9
  },
  {
    id: 'route-05',
    name: 'Central City Trunk (Jayanagar 4th Block)',
    corridor: 'Sarakki & Konanakunte Arterial',
    oneWayKm: 36.0,
    roundTripKm: 72.0,
    busesAssigned: 4,
    dailyTrips: 8,
    avgOccupancy: 40,
    capacity: 42,
    waypoints: ['Jayanagar 4th Block', 'Banashankari Metro', 'Puttenahalli Underpass', 'Gottigere Link', 'Harohalli Campus'],
    elevationProfile: { startM: 928, endM: 680, dropM: 248, regenRecoveryKWh: 8.6 },
    dieselBus: 'Ashok Leyland Viking BS-IV',
    dieselBurnPerDayL: 84.7,
    dieselCo2KgPerDay: 227.3
  }
];

export default function FleetRouteTelemetry({ simState, setSimState, playSound }) {
  const [selectedRouteId, setSelectedRouteId] = useState('route-01');
  const [routeEvStatus, setRouteEvStatus] = useState({
    'route-01': (simState?.fleetEv || 30) >= 30,
    'route-02': (simState?.fleetEv || 30) >= 50,
    'route-03': (simState?.fleetEv || 30) >= 70,
    'route-04': (simState?.fleetEv || 30) >= 90,
    'route-05': (simState?.fleetEv || 30) >= 100
  });

  const selectedRoute = DSU_BUS_ROUTES.find(r => r.id === selectedRouteId) || DSU_BUS_ROUTES[0];
  const isSelectedRouteEv = routeEvStatus[selectedRoute.id];

  // Total Fleet Bus Count
  const totalBuses = DSU_BUS_ROUTES.reduce((acc, r) => acc + r.busesAssigned, 0); // 28 buses
  const electrifiedBuses = DSU_BUS_ROUTES.reduce((acc, r) => acc + (routeEvStatus[r.id] ? r.busesAssigned : 0), 0);
  const actualFleetEvPct = Math.round((electrifiedBuses / totalBuses) * 100);

  // Toggle Route Electrification
  const handleToggleRouteEv = (routeId) => {
    const nextStatus = !routeEvStatus[routeId];
    const newRouteStatus = { ...routeEvStatus, [routeId]: nextStatus };
    setRouteEvStatus(newRouteStatus);

    const newEvBuses = DSU_BUS_ROUTES.reduce((acc, r) => acc + (newRouteStatus[r.id] ? r.busesAssigned : 0), 0);
    const newPct = Math.round((newEvBuses / totalBuses) * 100);

    if (setSimState) {
      setSimState(prev => ({ ...prev, fleetEv: newPct }));
    }

    if (playSound) {
      playSound(nextStatus ? 780 : 440, nextStatus ? 'triangle' : 'sine', 0.1);
    }
  };

  // Empirical Vehicle Engineering Math:
  // Diesel: 3.4 km/L fuel economy, 0.832 kg/L density, 43.1 MJ/kg, 74.8 g CO2/MJ => 2.684 kg CO2/L => 789 g CO2/km
  // Electric Bus: 1.08 kWh/km. Charged from 350kW Rooftop Solar => 0 g CO2/km Scope 1.
  const dieselKmPerLitre = 3.4;
  const dieselEmissionFactorKgPerLitre = 2.684;
  const dieselGramCo2PerKm = 789.4;
  const dieselPricePerLitreINR = 88.50; // Bengaluru High Speed Diesel tariff

  const totalDailyKm = DSU_BUS_ROUTES.reduce((acc, r) => acc + (r.roundTripKm * (r.dailyTrips / 2)), 0); // ~1,980 km/day
  const annualOperatingDays = 240; // Academic year operating days

  const dailyDieselBurnLitres = DSU_BUS_ROUTES.reduce((acc, r) => {
    return acc + (routeEvStatus[r.id] ? 0 : r.dieselBurnPerDayL);
  }, 0);

  const dailyAvoidedCo2Kg = DSU_BUS_ROUTES.reduce((acc, r) => {
    return acc + (routeEvStatus[r.id] ? r.dieselCo2KgPerDay : 0);
  }, 0);

  const annualAvoidedCo2Tons = ((dailyAvoidedCo2Kg * annualOperatingDays) / 1000).toFixed(1);
  const annualFuelSavingsLakhsINR = (((dailyAvoidedCo2Kg / dieselEmissionFactorKgPerLitre) * dieselPricePerLitreINR * annualOperatingDays) / 100000).toFixed(2);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      background: 'rgba(10, 13, 20, 0.75)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '16px',
      padding: '24px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Module Header with Live Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(212, 255, 0, 0.12)',
              border: '1px solid var(--border-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--phosphor)'
            }}>
              <Bus size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-pure)', letterSpacing: '-0.02em' }}>
                  DSU Harohalli Transit Fleet Telemetry & Scope 1 Matrix
                </h2>
                <span className="swiss-label" style={{ color: 'var(--phosphor)', background: 'rgba(212, 255, 0, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                  GROUND TRUTH
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Empirical tracking of 28 Ashok Leyland & Tata BS-IV college buses across 5 major Bengaluru arterial transit corridors.
              </p>
            </div>
          </div>
        </div>

        {/* Global Summary KPI Pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 14px',
            borderRadius: '10px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
              Fleet Electrified
            </span>
            <span className="mono-nums" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--phosphor)' }}>
              {electrifiedBuses}/{totalBuses} Buses ({actualFleetEvPct}%)
            </span>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 14px',
            borderRadius: '10px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
              Scope 1 Avoided / Yr
            </span>
            <span className="mono-nums" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--emerald)' }}>
              {annualAvoidedCo2Tons} Tons CO₂e
            </span>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 14px',
            borderRadius: '10px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
              Diesel OPEX Savings
            </span>
            <span className="mono-nums" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--cyan)' }}>
              ₹{annualFuelSavingsLakhsINR} Lakhs / Yr
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Deck: Route Selector on Left, Route Deep-Dive on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '20px' }}>
        
        {/* Left Column: 5 Arterial Routes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Bengaluru Corridor Arteries ({DSU_BUS_ROUTES.length})
          </span>

          {DSU_BUS_ROUTES.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isEv = routeEvStatus[route.id];

            return (
              <div
                key={route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  if (playSound) playSound(560, 'sine', 0.04);
                }}
                style={{
                  background: isSelected ? 'rgba(212, 255, 0, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: isSelected ? 'var(--text-pure)' : 'var(--text-main)' }}>
                      {route.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {route.corridor} • {route.oneWayKm} km
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isEv ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 85, 0, 0.15)',
                    color: isEv ? 'var(--emerald)' : 'var(--thermal)',
                    border: isEv ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 85, 0, 0.4)'
                  }}>
                    {isEv ? '100% SOLAR EV' : 'DIESEL BS-IV'}
                  </span>
                  <span className="mono-nums" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {route.busesAssigned} Buses
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Card for Selected Route */}
        <SpotlightCard
          className="tactical-panel"
          spotlightColor="rgba(212, 255, 0, 0.1)"
          style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Route Deep-Dive Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="swiss-label" style={{ color: 'var(--cyan)' }}>CORRIDOR PROFILE</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {selectedRoute.corridor}
                </span>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-pure)', marginTop: '4px' }}>
                {selectedRoute.name}
              </h3>
            </div>

            {/* 1-Click Interactive Electrification Switch */}
            <Magnet padding={30} magnetStrength={3} maxOffset={6}>
              <button
                onClick={() => handleToggleRouteEv(selectedRoute.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '999px',
                  background: isSelectedRouteEv ? 'var(--emerald)' : 'rgba(255, 85, 0, 0.2)',
                  color: isSelectedRouteEv ? '#05070a' : 'var(--thermal)',
                  border: isSelectedRouteEv ? 'none' : '1px solid var(--thermal)',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelectedRouteEv ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Zap size={14} />
                <span>{isSelectedRouteEv ? 'ELECTRIFIED (0 g CO₂/km)' : 'CONVERT ROUTE TO EV'}</span>
              </button>
            </Magnet>
          </div>

          {/* Real-World Engineering Parameters Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px'
          }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>One-Way Distance</span>
              <span className="mono-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-pure)' }}>
                {selectedRoute.oneWayKm} km
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                {selectedRoute.roundTripKm} km roundtrip
              </span>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Active Vehicles</span>
              <span className="mono-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-pure)' }}>
                {selectedRoute.busesAssigned} Buses
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                {selectedRoute.dailyTrips} trips / day
              </span>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Daily Passenger Load</span>
              <span className="mono-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-pure)' }}>
                {selectedRoute.busesAssigned * selectedRoute.avgOccupancy} Students
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                {((selectedRoute.avgOccupancy / selectedRoute.capacity) * 100).toFixed(0)}% Load factor
              </span>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Tailpipe Emissions</span>
              <span className="mono-nums" style={{
                fontSize: '15px',
                fontWeight: 700,
                color: isSelectedRouteEv ? 'var(--emerald)' : 'var(--thermal)'
              }}>
                {isSelectedRouteEv ? '0.00 kg' : `${selectedRoute.dieselCo2KgPerDay.toFixed(1)} kg`}
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                {isSelectedRouteEv ? 'Zero Tailpipe Scope 1' : `${dieselGramCo2PerKm} g CO₂/km per bus`}
              </span>
            </div>
          </div>

          {/* Interactive Route Waypoint Corridor */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                GPS Telemetry Waypoint Chain ({selectedRoute.waypoints.length} Nodes)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--phosphor)' }}>
                <Navigation size={11} />
                <span>NH 948 Live Corridor</span>
              </div>
            </div>

            {/* Horizontal Waypoint Trail */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {selectedRoute.waypoints.map((wp, idx) => (
                <React.Fragment key={wp}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: idx === selectedRoute.waypoints.length - 1 ? 'rgba(212, 255, 0, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: idx === selectedRoute.waypoints.length - 1 ? '1px solid var(--border-active)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    whiteSpace: 'nowrap'
                  }}>
                    <MapPin size={11} color={idx === selectedRoute.waypoints.length - 1 ? 'var(--phosphor)' : 'var(--text-muted)'} />
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: idx === selectedRoute.waypoints.length - 1 ? 'var(--text-pure)' : 'var(--text-secondary)'
                    }}>
                      {wp}
                    </span>
                  </div>
                  {idx < selectedRoute.waypoints.length - 1 && (
                    <ArrowRight size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Elevation Profile & Regenerative Braking Engineering Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(56, 189, 248, 0.04)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingDown size={14} color="var(--cyan)" />
              <span>
                <strong>Elevation Delta:</strong> {selectedRoute.elevationProfile.startM}m (Bangalore) ➔ {selectedRoute.elevationProfile.endM}m (Harohalli) = <strong>{selectedRoute.elevationProfile.dropM}m drop</strong>
              </span>
            </div>
            <span style={{ color: 'var(--cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              Regen Energy Recovery: +{selectedRoute.elevationProfile.regenRecoveryKWh} kWh/trip
            </span>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
