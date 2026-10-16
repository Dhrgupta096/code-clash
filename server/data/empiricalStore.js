/**
 * EMPIRICAL DATA STORE & IN-MEMORY STATE
 * OMNICARBON Backend - DSU Decarbonization Digital Twin
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load empirical dataset from public/data
let empiricalData = null;
try {
  const jsonPath = path.resolve(__dirname, '../../public/data/karnataka_empirical_data_2020_2024.json');
  if (fs.existsSync(jsonPath)) {
    empiricalData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
} catch (err) {
  console.warn('[EmpiricalStore] Failed to load JSON from disk, using fallback defaults:', err.message);
}

// In-Memory violation event logs (persists during server lifetime)
const idleViolations = [
  {
    id: 'VIOL-2026-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    cameraId: 'cam-01',
    cameraName: 'DSU South Gate Transit Loop',
    vehicleId: 'BUS-12',
    label: 'Diesel Shuttle #12',
    plate: 'KA-05-MN-8841',
    engineType: 'BS-IV 6-Cylinder Turbo Diesel',
    idleDurationMinutes: 8.7,
    dieselWastedLiters: 2.44,
    co2EmittedKg: 6.47,
    status: 'ACTIVE_DISPATCH_ALERT',
    driverNotified: true
  },
  {
    id: 'VIOL-2026-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    cameraId: 'cam-01',
    cameraName: 'DSU South Gate Transit Loop',
    vehicleId: 'VAN-02',
    label: 'Delivery Cargo Van',
    plate: 'KA-04-TR-9102',
    engineType: 'Common Rail Diesel (2.2L)',
    idleDurationMinutes: 4.25,
    dieselWastedLiters: 0.81,
    co2EmittedKg: 2.15,
    status: 'SECURITY_WARNED',
    driverNotified: true
  }
];

export function getEmpiricalData() {
  return empiricalData;
}

export function getIdleViolations() {
  return idleViolations;
}

export function recordIdleViolation(violation) {
  const idleMins = Number(violation.idleDurationMinutes || 3.0);
  // IISc CiSTUP diesel burn rate: ~0.28 L/min idle; 1L diesel = 2.65 kg CO2
  const fuelRatePerMin = violation.engineType?.includes('Van') ? 0.19 : 0.28;
  const dieselWastedLiters = Number((idleMins * fuelRatePerMin).toFixed(2));
  const co2EmittedKg = Number((dieselWastedLiters * 2.65).toFixed(2));

  const record = {
    id: `VIOL-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    cameraId: violation.cameraId || 'cam-01',
    cameraName: violation.cameraName || 'DSU South Gate Transit Loop',
    vehicleId: violation.vehicleId || 'UNKNOWN_VEHICLE',
    label: violation.label || 'Unidentified Vehicle',
    plate: violation.plate || 'KA-00-XX-0000',
    engineType: violation.engineType || 'Diesel ICE',
    idleDurationMinutes: idleMins,
    dieselWastedLiters,
    co2EmittedKg,
    status: 'LOGGED_BY_METROPOLIS_CV',
    driverNotified: Boolean(violation.driverNotified)
  };

  idleViolations.unshift(record);
  // Keep last 100 entries
  if (idleViolations.length > 100) idleViolations.pop();

  return record;
}
