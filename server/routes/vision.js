/**
 * VISION ROUTES: NVIDIA Metropolis Edge Computer Vision & Vehicle Telemetry
 * OMNICARBON Backend - SRE Digital Twin Control Plane
 */

import { getIdleViolations, recordIdleViolation } from '../data/empiricalStore.js';

const CAMERAS = [
  {
    id: 'cam-01',
    code: 'CAM-01',
    name: 'DSU South Gate Transit Loop',
    category: 'Scope 1 Tailpipe Tracking',
    streamUrl: 'rtsp://10.24.4.12/metropolis/gate1-live',
    location: 'Gate 1 KS Layout Depot',
    inferenceModel: 'YOLO-v8x TensorRT FP16',
    detections: [
      {
        id: 'BUS-12',
        label: 'Diesel Shuttle #12',
        plate: 'KA-05-MN-8841',
        engine: 'BS-IV 6-Cylinder Turbo Diesel',
        status: 'IDLING EXCEEDED',
        idleTime: '08:42 min',
        burn: '0.28 L/min',
        co2: '+3.72 kg CO2',
        pm25: '84.2 µg/m³ (Severe)',
        isEv: false,
        alert: true
      },
      {
        id: 'EV-04',
        label: 'Staff EV Hatchback',
        plate: 'KA-01-EV-4419',
        engine: 'Permanent Magnet Synchronous Motor (72 kWh)',
        status: 'CHARGING DOCK',
        idleTime: '00:00',
        burn: '0.00 L/min',
        co2: '0.00 kg CO2',
        pm25: '0.0 µg/m³ (Zero)',
        isEv: true,
        alert: false
      },
      {
        id: 'VAN-02',
        label: 'Delivery Cargo Van',
        plate: 'KA-04-TR-9102',
        engine: 'Common Rail Diesel (2.2L)',
        status: 'UNLOADING IDLE',
        idleTime: '04:15 min',
        burn: '0.19 L/min',
        co2: '+1.84 kg CO2',
        pm25: '48.1 µg/m³ (Moderate)',
        isEv: false,
        alert: true
      }
    ]
  },
  {
    id: 'cam-02',
    code: 'CAM-02',
    name: 'Central Academic Quadrangle',
    category: 'Pedestrian & Micro-Transit Density',
    streamUrl: 'rtsp://10.24.4.13/metropolis/quad-live',
    location: 'Engineering Block A Plaza',
    inferenceModel: 'ByteTrack Multi-Object Tracker',
    detections: [
      { id: 'PED-GROUP-1', label: 'Student Group (14)', status: 'ACTIVE_TRANSIT', alert: false },
      { id: 'SHUTTLE-EV-01', label: 'DSU Campus EV Shuttle', plate: 'KA-05-EV-0012', status: 'IN_MOTION (18 km/h)', alert: false }
    ]
  },
  {
    id: 'cam-03',
    code: 'CAM-03',
    name: 'NVIDIA DGX Supercomputing Lab',
    category: 'Scope 2 High-Density Compute Thermal',
    streamUrl: 'rtsp://10.24.4.14/metropolis/dgx-lab',
    location: 'Advanced Computing Center Rack Bay 3',
    inferenceModel: 'Thermal FLIR Anomaly Detector',
    detections: [
      { id: 'DGX-RACK-01', label: 'DGX A100 Unit 1', temp: '52.4°C (Nominal)', load: '84% Solar Power', alert: false },
      { id: 'DGX-RACK-02', label: 'DGX A100 Unit 2', temp: '54.1°C (Nominal)', load: '88% Solar Power', alert: false }
    ]
  },
  {
    id: 'cam-04',
    code: 'CAM-04',
    name: 'Block B Rooftop Solar Array',
    category: 'Solar Generation & Soiling Inspection',
    streamUrl: 'rtsp://10.24.4.15/metropolis/solar-deck',
    location: 'Academic Block B Rooftop',
    inferenceModel: 'Dust & Soiling Segmentation',
    detections: [
      { id: 'STRING-A', label: 'Solar String Array A', efficiency: '98.4%', soilingIndex: '0.02 (Clean)', alert: false },
      { id: 'STRING-B', label: 'Solar String Array B', efficiency: '97.9%', soilingIndex: '0.03 (Clean)', alert: false }
    ]
  }
];

export function handleGetStreams(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    timestamp: new Date().toISOString(),
    edgeNodes: [
      { id: 'jetson-orin-01', model: 'NVIDIA Jetson AGX Orin 64GB', status: 'HEALTHY_275_TOPS', tempC: 48.2 },
      { id: 'jetson-orin-02', model: 'NVIDIA Jetson AGX Orin 64GB', status: 'HEALTHY_275_TOPS', tempC: 46.8 }
    ],
    cameraStreams: CAMERAS
  }, null, 2));
}

export function handleGetViolations(req, res) {
  const violations = getIdleViolations();
  const totalLiters = violations.reduce((acc, v) => acc + (v.dieselWastedLiters || 0), 0);
  const totalCo2 = violations.reduce((acc, v) => acc + (v.co2EmittedKg || 0), 0);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    timestamp: new Date().toISOString(),
    totalRecordedViolations: violations.length,
    cumulativeDieselWastedLiters: Number(totalLiters.toFixed(2)),
    cumulativeCo2EmittedKg: Number(totalCo2.toFixed(2)),
    activeAlerts: violations.filter(v => v.status.includes('ALERT')).length,
    violations
  }, null, 2));
}

export function handlePostViolation(req, res, body) {
  try {
    const payload = JSON.parse(body || '{}');
    if (!payload.vehicleId && !payload.plate) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing required vehicleId or plate' }));
    }

    const recorded = recordIdleViolation(payload);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Vehicle idle violation logged by Edge Vision SRE node',
      violation: recorded
    }, null, 2));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON payload', details: err.message }));
  }
}
