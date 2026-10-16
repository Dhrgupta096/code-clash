/**
 * OMNICARBON RESILIENT API CLIENT
 * Connects frontend UI to backend SRE Control Plane (/api/...)
 * with automatic zero-disruption fallback for static deployments (GitHub Pages).
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

async function safeFetch(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (err) {
    // Return null so calling functions can trigger seamless client-side fallback
    return null;
  }
}

export const ApiClient = {
  /**
   * Health check
   */
  async checkHealth() {
    return await safeFetch('/api/health');
  },

  /**
   * Real-time Karnataka SLDC grid telemetry & CEA v20.0 factors
   */
  async getGridTelemetry() {
    const result = await safeFetch('/api/telemetry/grid');
    if (result) return { ...result, source: 'OMNICARBON_BACKEND_LIVE' };

    // Seamless fallback
    return {
      source: 'LOCAL_EMPIRICAL_CACHE',
      grid: {
        frequencyHz: 50.02,
        gridStatus: 'NORMAL_STABLE',
        ceaBaselineVersion: 'v20.0 (Dec 2024)',
        standardMarginalEmissionFactor: 0.716,
        totalDemandMW: 14200
      }
    };
  },

  /**
   * DSU Harohalli campus facility sensor telemetry
   */
  async getCampusTelemetry() {
    const result = await safeFetch('/api/telemetry/campus');
    if (result) return { ...result, source: 'OMNICARBON_BACKEND_LIVE' };
    return null;
  },

  /**
   * Metropolis CCTV camera streams
   */
  async getCameraStreams() {
    const result = await safeFetch('/api/vision/streams');
    return result?.cameraStreams || null;
  },

  /**
   * Vehicle idling violations
   */
  async getIdleViolations() {
    const result = await safeFetch('/api/vision/violations');
    return result || null;
  },

  /**
   * Log a vehicle idle violation
   */
  async reportIdleViolation(violation) {
    const result = await safeFetch('/api/vision/violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(violation)
    });
    return result;
  },

  /**
   * Run Decarbonization What-If physics solver
   */
  async runSimulation(simState) {
    const result = await safeFetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simState)
    });
    return result;
  },

  /**
   * Send question to Decarbonization AI Copilot
   */
  async sendAIChat(message, simState) {
    const result = await safeFetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, simState })
    });
    return result;
  },

  /**
   * Generate official ISO 14064 ESG Audit Report
   */
  async getAuditReport(format = 'json') {
    const result = await safeFetch(`/api/audit/report?format=${format}`);
    return result;
  }
};
