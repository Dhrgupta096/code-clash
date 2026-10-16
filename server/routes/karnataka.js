/**
 * KARNATAKA DATA ROUTE: Exposes Empirical 2020–2024 Datasets
 * OMNICARBON Backend - SRE Digital Twin Control Plane
 */

import { getEmpiricalData } from '../data/empiricalStore.js';

export function handleGetKarnatakaData(req, res) {
  const data = getEmpiricalData();
  if (!data) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Empirical data file not found on disk' }));
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}
