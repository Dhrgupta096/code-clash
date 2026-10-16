/**
 * TELEMETRY ROUTES: Karnataka SLDC Grid & DSU Harohalli Campus
 * OMNICARBON Backend - SRE Digital Twin Control Plane
 */

import { getEmpiricalData } from '../data/empiricalStore.js';

export function handleGridTelemetry(req, res) {
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const hour = now.getHours() + now.getMinutes() / 60;

  // Realistic micro-fluctuations around Southern Regional Grid standard (50.02 Hz)
  const frequencyJitter = (Math.sin(seconds * 0.4) * 0.025) + ((Math.random() - 0.5) * 0.008);
  const gridFrequencyHz = Number((50.02 + frequencyJitter).toFixed(3));

  // Diurnal solar curve (peak ~12:30 PM, zero at night)
  const solarAngle = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
  const solarIrradianceGHI = Number((solarAngle * 950).toFixed(1)); // W/m²
  const ambientTempC = Number((21 + (solarAngle * 9) + (Math.sin(seconds * 0.1) * 0.2)).toFixed(1));

  // Karnataka state load (MW) curve: 11,000 MW base, up to 15,400 MW daytime peak
  const stateDemandMW = Math.round(11200 + (solarAngle * 3800) + (Math.sin(seconds * 0.2) * 50));
  const pavagadaOutputMW = Math.round(solarAngle * 1950); // Pavagada 2050 MW peak

  // CEA v20.0 (Dec 2024 Gazette) Combined Margin Factor
  const baseEmissionFactor = 0.716; // kg CO2 / kWh
  // Dynamic instantaneous factor offsets cleaner grid during solar peak
  const instantaneousEmissionFactor = Number((baseEmissionFactor - (solarAngle * 0.142)).toFixed(3));

  const payload = {
    timestamp: now.toISOString(),
    grid: {
      frequencyHz: gridFrequencyHz,
      gridStatus: (gridFrequencyHz >= 49.90 && gridFrequencyHz <= 50.05) ? 'NORMAL_STABLE' : 'ALERT_DEVIATION',
      regionalAuthority: 'SRLDC / KPTCL (Karnataka State Load Despatch Centre)',
      ceaBaselineVersion: 'v20.0 (Dec 2024)',
      standardMarginalEmissionFactor: baseEmissionFactor,
      instantaneousEmissionFactorKgPerKwh: instantaneousEmissionFactor,
      totalDemandMW: stateDemandMW,
      generationMix: {
        solarPct: Number((18 + solarAngle * 16).toFixed(1)),
        coalPct: Number((42 - solarAngle * 12).toFixed(1)),
        hydroPct: Number((22 + Math.sin(seconds * 0.05) * 2).toFixed(1)),
        windPct: Number((14 + Math.cos(seconds * 0.07) * 2).toFixed(1)),
        nuclearPct: 4.0
      },
      keyAssets: {
        pavagadaSolarParkMW: pavagadaOutputMW,
        raichurThermalMW: 1420,
        sharavathiHydroMW: 890
      }
    },
    climatology: {
      station: 'NASA POWER MERRA-2 / CPCB Bengaluru South (12.9716°N, 77.5946°E)',
      ambientTempC,
      solarIrradianceGHI,
      airQualityIndex: 68,
      primaryPollutant: 'PM2.5'
    }
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload, null, 2));
}

export function handleCampusTelemetry(req, res) {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const seconds = now.getSeconds();

  // DSU Solar generation from 350 kW rooftop array
  const solarFactor = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
  const solarGenKw = Number((350 * solarFactor * (0.92 + Math.sin(seconds * 0.1) * 0.05)).toFixed(1));

  // Campus loads
  const academicBlocksKw = Number((140 + (hour >= 8 && hour <= 18 ? 120 : 25) + Math.sin(seconds * 0.3) * 5).toFixed(1));
  const hvacChillersKw = Number((hour >= 9 && hour <= 17 ? 95 : 20).toFixed(1));
  const dgxSupercomputingKw = Number((42.5 + Math.sin(seconds * 0.2) * 4.2).toFixed(1));
  const hostelAndLightingKw = Number((hour >= 18 || hour <= 7 ? 65 : 20).toFixed(1));

  const totalCampusDemandKw = Number((academicBlocksKw + hvacChillersKw + dgxSupercomputingKw + hostelAndLightingKw).toFixed(1));
  const netGridImportKw = Math.max(0, Number((totalCampusDemandKw - solarGenKw).toFixed(1)));
  const solarSurplusExportKw = Math.max(0, Number((solarGenKw - totalCampusDemandKw).toFixed(1)));

  // Instantaneous carbon rate: kg CO2 / hour (based on 0.716 kg/kWh)
  const carbonRateKgPerHour = Number((netGridImportKw * 0.716).toFixed(2));

  // 24-hour diurnal profile curve for charting
  const diurnal24h = Array.from({ length: 24 }).map((_, h) => {
    const sFactor = Math.max(0, Math.sin(((h - 6) / 12) * Math.PI));
    const demand = 160 + (h >= 8 && h <= 18 ? 180 : 30);
    const solar = Math.round(350 * sFactor * 0.9);
    const grid = Math.max(0, demand - solar);
    return {
      hour: `${h.toString().padStart(2, '0')}:00`,
      campusDemandKw: demand,
      solarGenerationKw: solar,
      netGridImportKw: grid,
      carbonKg: Number((grid * 0.716).toFixed(1))
    };
  });

  const payload = {
    timestamp: now.toISOString(),
    campus: {
      name: 'Dayananda Sagar University (DSU) Harohalli Campus',
      coordinates: { lat: 12.9716, lon: 77.5946 },
      siteAreaAcres: 140,
      totalDemandKw: totalCampusDemandKw,
      solarGenerationKw: solarGenKw,
      netGridImportKw,
      solarSurplusExportKw,
      carbonEmissionRateKgPerHour: carbonRateKgPerHour,
      subsystemLoads: {
        academicBlocksKw,
        hvacChillersKw,
        dgxSupercomputingLabKw: dgxSupercomputingKw,
        hostelsAndAuxiliaryKw: hostelAndLightingKw
      },
      bessBattery: {
        capacityKwh: 300,
        stateOfChargePct: Math.round(65 + solarFactor * 25),
        status: solarSurplusExportKw > 0 ? 'CHARGING_SOLAR' : 'STANDBY_BUFFER',
        currentFlowKw: solarSurplusExportKw > 0 ? Math.min(60, solarSurplusExportKw) : 0
      },
      diurnal24hProfile: diurnal24h
    }
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload, null, 2));
}
