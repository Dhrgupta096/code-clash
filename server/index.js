/**
 * OMNICARBON // AUTONOMOUS BACKEND SRE CONTROL PLANE
 * Zero-dependency native Node / Bun HTTP Server
 * 
 * Target: DSU Harohalli Campus Decarbonization Twin
 * Grounded in Karnataka SLDC & CEA v20.0 Empirical Telemetry
 */

import http from 'node:http';
import { URL } from 'node:url';
import { handleGridTelemetry, handleCampusTelemetry } from './routes/telemetry.js';
import { handleGetStreams, handleGetViolations, handlePostViolation } from './routes/vision.js';
import { handleSimulate } from './routes/simulator.js';
import { handleAIChat, handleGetPlaybook } from './routes/ai.js';
import { handleAuditReport } from './routes/audit.js';
import { handleGetKarnatakaData } from './routes/karnataka.js';

const PORT = Number(process.env.PORT || 3001);
const startTime = Date.now();

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Request body exceeded 5MB payload limit'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;
  const method = req.method;

  try {
    // 1. Health check
    if (pathname === '/api/health' && method === 'GET') {
      const memory = process.memoryUsage();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        status: 'ONLINE',
        service: 'OMNICARBON Autonomous SRE Control Plane',
        version: '2.6.0-enterprise',
        uptimeSeconds: Math.round((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
        runtime: typeof Bun !== 'undefined' ? `Bun ${Bun.version}` : `Node ${process.version}`,
        memoryUsageMB: {
          rss: Number((memory.rss / 1024 / 1024).toFixed(2)),
          heapUsed: Number((memory.heapUsed / 1024 / 1024).toFixed(2))
        },
        endpoints: [
          'GET  /api/health',
          'GET  /api/telemetry/grid',
          'GET  /api/telemetry/campus',
          'GET  /api/vision/streams',
          'GET  /api/vision/violations',
          'POST /api/vision/violation',
          'POST /api/simulate',
          'POST /api/ai/chat',
          'GET  /api/ai/playbook',
          'GET  /api/audit/report',
          'GET  /api/data/karnataka'
        ]
      }, null, 2));
    }

    // 2. Grid & Campus Telemetry
    if (pathname === '/api/telemetry/grid' && method === 'GET') {
      return handleGridTelemetry(req, res);
    }
    if (pathname === '/api/telemetry/campus' && method === 'GET') {
      return handleCampusTelemetry(req, res);
    }

    // 3. Vision & Idling Violations
    if (pathname === '/api/vision/streams' && method === 'GET') {
      return handleGetStreams(req, res);
    }
    if (pathname === '/api/vision/violations' && method === 'GET') {
      return handleGetViolations(req, res);
    }
    if (pathname === '/api/vision/violation' && method === 'POST') {
      const body = await parseBody(req);
      return handlePostViolation(req, res, body);
    }

    // 4. Mathematical Simulation Solver
    if (pathname === '/api/simulate' && method === 'POST') {
      const body = await parseBody(req);
      return handleSimulate(req, res, body);
    }

    // 5. Decarbonization AI Copilot & Playbook
    if (pathname === '/api/ai/chat' && method === 'POST') {
      const body = await parseBody(req);
      return await handleAIChat(req, res, body);
    }
    if (pathname === '/api/ai/playbook' && method === 'GET') {
      return handleGetPlaybook(req, res);
    }

    // 6. ISO 14064 Compliance Audit Report
    if (pathname === '/api/audit/report' && (method === 'GET' || method === 'POST')) {
      return handleAuditReport(req, res, reqUrl);
    }

    // 7. Karnataka Empirical Datasets
    if (pathname === '/api/data/karnataka' && method === 'GET') {
      return handleGetKarnatakaData(req, res);
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: `Endpoint ${method} ${pathname} does not exist on OmniCarbon SRE backend.`,
      documentation: 'Call GET /api/health to list all active endpoints.'
    }, null, 2));

  } catch (err) {
    console.error(`[Server Error] ${method} ${pathname}:`, err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }, null, 2));
  }
});

server.listen(PORT, () => {
  console.log(`
========================================================================
⚡ OMNICARBON SRE CONTROL PLANE BACKEND ONLINE
   Port: http://localhost:${PORT}
   Health: http://localhost:${PORT}/api/health
   Telemetry: http://localhost:${PORT}/api/telemetry/grid
   Campus: http://localhost:${PORT}/api/telemetry/campus
   Simulator: http://localhost:${PORT}/api/simulate
   AI Copilot: http://localhost:${PORT}/api/ai/chat
   Runtime: ${typeof Bun !== 'undefined' ? `Bun ${Bun.version}` : `Node ${process.version}`}
========================================================================
`);
});
