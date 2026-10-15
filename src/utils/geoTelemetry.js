// Curated high-impact global carbon and infrastructure landmarks
export const GLOBAL_PRESETS = [
  {
    name: 'Dayananda Sagar University (DSU)',
    subtext: 'Harohalli Global Campus Twin',
    lat: 12.6521,
    lon: 77.4411,
    category: 'campus',
    badge: 'DSU TWIN',
    carbon: 238,
    isCampus: true
  },
  {
    name: 'Pavagada Solar Park',
    subtext: '2,050 MW Ultra-Mega Solar',
    lat: 14.2810,
    lon: 77.2514,
    category: 'clean',
    badge: '2,050 MW',
    carbon: 42
  },
  {
    name: 'Bangalore KPTCL SLDC',
    subtext: 'State Load Despatch Center',
    lat: 12.9716,
    lon: 77.5946,
    category: 'grid',
    badge: 'SLDC',
    carbon: 238
  },
  {
    name: 'Silicon Valley / San Jose',
    subtext: 'California CAISO High Solar',
    lat: 37.3382,
    lon: -121.8863,
    category: 'grid',
    badge: 'CAISO',
    carbon: 182
  },
  {
    name: 'Paris RTE Nuclear Grid',
    subtext: '70% Nuclear Baseload + Offshore Wind',
    lat: 48.8566,
    lon: 2.3522,
    category: 'clean',
    badge: 'RTE 56g',
    carbon: 56
  },
  {
    name: 'Tokyo TEPCO Central',
    subtext: 'LNG Baseload + Smart Island Grid',
    lat: 35.6762,
    lon: 139.6503,
    category: 'grid',
    badge: 'TEPCO',
    carbon: 490
  },
  {
    name: 'New York / Manhattan',
    subtext: 'NYISO Eastern Interconnect',
    lat: 40.7128,
    lon: -74.0060,
    category: 'grid',
    badge: 'NYISO',
    carbon: 295
  },
  {
    name: 'Dubai / Mohammed bin Rashid Solar',
    subtext: '5,000 MW Concentrated Solar & PV',
    lat: 25.1972,
    lon: 55.2744,
    category: 'clean',
    badge: 'DEWA',
    carbon: 320
  },
  {
    name: 'Reykjavik Geothermal Basin',
    subtext: '100% Geothermal + Hydro Grid',
    lat: 64.1466,
    lon: -21.9426,
    category: 'clean',
    badge: '0g GEO',
    carbon: 18
  },
  {
    name: 'Sydney / Hornsdale Battery Reserve',
    subtext: 'Australian NEM Solar Corridor',
    lat: -33.8568,
    lon: 151.2153,
    category: 'grid',
    badge: 'AEMO',
    carbon: 510
  },
  {
    name: 'Itaipu Dam / Parana River',
    subtext: '14,000 MW Hydroelectric Giant',
    lat: -25.4089,
    lon: -54.5889,
    category: 'clean',
    badge: '14 GW',
    carbon: 24
  },
  {
    name: 'London Zero-Emission Zone',
    subtext: 'National Grid ESO Wind Corridors',
    lat: 51.5074,
    lon: -0.1278,
    category: 'grid',
    badge: 'UK ESO',
    carbon: 195
  }
];

// Physical calculation of Solar Irradiance and daylight state
export function calculateSolarTelemetry(lat, lon) {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Solar declination approximation (Cooper, 1969)
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);

  // Local solar time from UTC and longitude
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const solarHour = (utcHours + lon / 15 + 24) % 24;
  const hourAngle = (solarHour - 12) * 15;

  const latRad = (lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const haRad = (hourAngle * Math.PI) / 180;

  // Solar elevation angle sin(alpha)
  const sinAltitude = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAltitude))) * (180 / Math.PI);

  const isDaylight = altitude > 0;
  let irradiance = 0;
  if (isDaylight) {
    const airMass = 1 / Math.max(0.08, sinAltitude);
    irradiance = Math.round(1361 * Math.pow(0.72, Math.pow(airMass, 0.678)) * sinAltitude);
    irradiance = Math.max(15, Math.min(1120, irradiance));
  }

  const hours = Math.floor(solarHour);
  const minutes = Math.floor((solarHour % 1) * 60);
  const localSolarTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} LST`;

  return {
    irradiance,
    altitude: altitude.toFixed(1),
    isDaylight,
    localSolarTime
  };
}

// Instant offline fallback classifier for any place on Earth
export function classifyEarthLocation(lat, lon) {
  // 1. Check exact presets
  for (const preset of GLOBAL_PRESETS) {
    if (Math.abs(lat - preset.lat) < 0.25 && Math.abs(lon - preset.lon) < 0.25) {
      return {
        name: preset.name,
        region: preset.subtext,
        country: preset.lat > 0 && preset.lon > 65 && preset.lon < 95 ? 'India 🇮🇳' : 'Regional Hub',
        grid: preset.badge,
        carbon: preset.carbon,
        isCampus: preset.isCampus || false,
        note: preset.isCampus ? 'Ground Truth Campus Digital Twin' : 'Monitored Critical Renewable/Grid Hub'
      };
    }
  }

  // 2. DSU Campus Vicinity (< 35 km)
  if (Math.abs(lat - 12.65) < 0.35 && Math.abs(lon - 77.44) < 0.35) {
    return {
      name: 'Dayananda Sagar University (DSU)',
      region: 'Harohalli, Kanakapura Road, Ramanagara District',
      country: 'India 🇮🇳',
      grid: 'KPTCL Southern Grid',
      carbon: 238,
      isCampus: true,
      note: 'Primary Ground Truth Digital Twin • Scope 1, 2, 3 Active Telemetry'
    };
  }

  // 3. Pavagada Solar Cluster (< 60 km)
  if (Math.abs(lat - 14.28) < 0.65 && Math.abs(lon - 77.25) < 0.65) {
    return {
      name: 'Pavagada Solar Cluster (2,050 MW)',
      region: 'Tumakuru District, Karnataka',
      country: 'India 🇮🇳',
      grid: 'KREDL / KPTCL Solar Grid',
      carbon: 42,
      note: 'World’s 3rd largest solar operational park powering Bangalore metro grid'
    };
  }

  // 4. Greater Karnataka & Bangalore Metropolitan
  if (lat >= 11.5 && lat <= 18.5 && lon >= 74.0 && lon <= 78.6) {
    return {
      name: 'Karnataka Grid Service Territory',
      region: 'Bangalore & Mysore Corridor (KPTCL)',
      country: 'India 🇮🇳',
      grid: 'KPTCL 50.02 Hz SLDC',
      carbon: 238,
      note: 'CEA v20.0 Base (0.716 kg/kWh) • Real-time Hydro + Solar Mix'
    };
  }

  // 5. India National Grid
  if (lat >= 8.0 && lat <= 37.0 && lon >= 68.0 && lon <= 97.0) {
    return {
      name: 'National Synchronous Grid of India',
      region: 'National Grid (NEW / POSOCO)',
      country: 'India 🇮🇳',
      grid: 'PowerGrid Central Transmission',
      carbon: 716,
      note: 'CEA v20.0 National Baseline: 0.716 kg CO₂/kWh'
    };
  }

  // 6. Western & Central Europe
  if (lat >= 36.0 && lat <= 62.0 && lon >= -10.0 && lon <= 28.0) {
    return {
      name: 'Continental European Grid (ENTSO-E)',
      region: 'Western European Cross-Border Network',
      country: 'European Union 🇪🇺',
      grid: 'ENTSO-E Synchronous',
      carbon: 180,
      note: 'Cross-border nuclear + offshore wind + hydro corridor'
    };
  }

  // 7. Scandinavia & Nordic
  if (lat >= 55.0 && lat <= 71.0 && lon >= 4.0 && lon <= 32.0) {
    return {
      name: 'Nord Pool Scandinavian Energy Area',
      region: 'Nordic Hydroelectric & Wind Belt',
      country: 'Nordic Zone 🇳🇴 🇸🇪 🇫🇮',
      grid: 'Statnett / Svenska kraftnät',
      carbon: 32,
      note: '94%+ Hydroelectric, Wind, and Geothermal zero-carbon baseload'
    };
  }

  // 8. North America
  if (lat >= 24.0 && lat <= 52.0 && lon >= -126.0 && lon <= -66.0) {
    return {
      name: 'North American Interconnection (NERC)',
      region: 'Continental United States',
      country: 'United States 🇺🇸',
      grid: 'NERC Regional ISO/RTO',
      carbon: 386,
      note: 'Natural Gas + Utility-Scale Solar & Wind storage'
    };
  }

  // 9. East Asia
  if (lat >= 24.0 && lat <= 46.0 && lon >= 120.0 && lon <= 146.0) {
    return {
      name: 'East Asia Regional Power Sector',
      region: 'Pacific Island & Coastal Grid',
      country: 'Japan 🇯🇵 / East Asia',
      grid: 'Regional Dispatch Center',
      carbon: 490,
      note: 'High efficiency LNG + Nuclear restart + Rooftop Solar'
    };
  }

  // 10. Middle East & Gulf
  if (lat >= 14.0 && lat <= 35.0 && lon >= 34.0 && lon <= 62.0) {
    return {
      name: 'Arabian Gulf Interconnected Grid (GCCIA)',
      region: 'Middle East Solar & Gas Corridor',
      country: 'GCC Region 🇦🇪 🇸🇦',
      grid: 'GCCIA Interconnect',
      carbon: 420,
      note: 'High Solar DNI (>2,200 kWh/m²/year) + Combined-Cycle Gas'
    };
  }

  // 11. Australia & Oceania
  if (lat >= -45.0 && lat <= -10.0 && lon >= 110.0 && lon <= 155.0) {
    return {
      name: 'National Electricity Market (NEM Australia)',
      region: 'Eastern & Southern Energy Belt',
      country: 'Australia 🇦🇺',
      grid: 'AEMO Grid',
      carbon: 510,
      note: 'World record rooftop solar uptake + utility big battery storage'
    };
  }

  // 12. South America
  if (lat >= -56.0 && lat <= 12.0 && lon >= -82.0 && lon <= -34.0) {
    return {
      name: 'South American Hydro & Solar Basin',
      region: 'National Interconnected System',
      country: 'South America 🇧🇷 🇦🇷',
      grid: 'ONS / CAMMESA',
      carbon: 110,
      note: 'Amazon & Paraná Hydro Basin + High Andes Solar Plateau'
    };
  }

  // 13. Africa
  if (lat >= -35.0 && lat <= 37.0 && lon >= -18.0 && lon <= 52.0) {
    return {
      name: 'African Regional Power Corridors',
      region: 'Pan-African Power Pool',
      country: 'Africa 🌍',
      grid: 'Regional Power Pools',
      carbon: 580,
      note: 'Sub-Saharan Solar Potential + Rift Valley Geothermal'
    };
  }

  // 14. International Waters / Polar / Remote
  return {
    name: 'Maritime & Atmospheric Reconnaissance Zone',
    region: 'International Waters / Remote Meridian',
    country: 'Global Surface 🌊',
    grid: 'Copernicus / MERRA-2',
    carbon: 120,
    note: 'Monitored via Sentinel-5P & NASA OCO-3 orbital sensors'
  };
}
