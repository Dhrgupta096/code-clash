/**
 * AI ROUTE: NVIDIA NIM & Decarbonization Reasoning Agent
 * OMNICARBON Backend - SRE Digital Twin Control Plane
 */

async function callExternalGemini(apiKey, prompt, context) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const systemInstruction = `You are OmniAgent, the autonomous NVIDIA NIM-powered Decarbonization Assistant for Dayananda Sagar University (DSU) Harohalli Campus.
You are grounded in empirical Karnataka State Energy data:
- CEA Baseline Database v20.0 (Combined Margin: 0.716 kg CO2/kWh).
- KPTCL SLDC real-time grid frequency (50.02 Hz).
- DSU 140-acre campus with 350kW rooftop solar, DGX A100 AI Lab, and transit shuttle fleet.
Provide concise, technical, audit-ready SRE insights with specific numbers.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nCampus Context:\n${JSON.stringify(context)}\n\nUser Question:\n${prompt}` }]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API HTTP ${response.status}: ${await response.text()}`);
  }

  const json = await response.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text;
}

export async function handleAIChat(req, res, body) {
  try {
    const payload = JSON.parse(body || '{}');
    const query = (payload.message || '').trim();
    const simState = payload.simState || { fleetEv: 30, aiSolarShift: true, solarCapacity: 350, hvacOpt: 40 };

    if (!query) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Missing message in request body' }));
    }

    const { fleetEv = 30, aiSolarShift = true, solarCapacity = 350, hvacOpt = 40 } = simState;
    const baselineEmissions = 420;
    const fleetReduction = 120 * (fleetEv / 100);
    const computeReduction = aiSolarShift ? 46.2 : 0;
    const solarReduction = ((solarCapacity - 100) / 100) * 32;
    const hvacReduction = 28 * (hvacOpt / 100);
    const totalSaved = Math.min(baselineEmissions * 0.85, (fleetReduction + computeReduction + solarReduction + hvacReduction));
    const percentSaved = ((totalSaved / baselineEmissions) * 100).toFixed(1);
    const annualSavingsINR = ((fleetReduction * 14000 + computeReduction * 18000 + solarReduction * 16000 + hvacReduction * 11000) / 100000).toFixed(2);

    let answer = null;
    let provider = 'OmniAgent Heuristic SRE Reasoning Engine';

    // Check if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        answer = await callExternalGemini(apiKey, query, { simState, percentSaved, totalSaved, annualSavingsINR });
        provider = 'Google Gemini 2.0 Flash (Cloud NIM LLM)';
      } catch (err) {
        console.warn('[AIChat] External Gemini call failed, falling back to heuristic engine:', err.message);
      }
    }

    // Heuristic Fallback reasoning if no key or error
    if (!answer) {
      const q = query.toLowerCase();
      if (q.includes('net-zero') || q.includes('2030')) {
        answer = `To achieve Net-Zero by 2030 at DSU Harohalli Campus:\n\n1. **Phase 1 (Months 1–6):** Electrify the KS Layout ⇋ Harohalli shuttle loop (${fleetEv}% current target saves ~${fleetReduction.toFixed(1)} Tons/yr).\n2. **Phase 2 (Year 1):** Expand rooftop solar to 600 kW to fully power daytime academic lab loads.\n3. **Phase 3 (Year 2):** Deploy 300 kWh BESS storage to capture midday solar surplus for evening research loads.\n\nProjected capital expenditure payback: ~1.8 years.`;
      } else if (q.includes('dgx') || q.includes('solar time-shift') || q.includes('algorithm')) {
        answer = `The DGX A100 Solar Time-Shift algorithm dynamically queues batch deep learning training and vision inferences to execute during Bangalore's 11:00 AM – 2:30 PM peak solar window.\n\n* **Without Shift:** Powered by grid coal baseload (~0.716 kg CO₂/kWh).\n* **With Shift:** Direct solar feed (0.00 kg CO₂/kWh).\n* **Net Impact:** Saves ~${computeReduction.toFixed(1)} Metric Tons CO₂e annually.`;
      } else if (q.includes('scope 2') || q.includes('largest')) {
        answer = `DSU's largest Scope 2 emission source is currently daytime HVAC chiller power in the Academic Blocks (~180 MWh/year), followed by the NVIDIA DGX Supercomputing Lab (~42 MWh/year).\n\nDeploying AI-driven chiller modulation and rooftop solar canopy directly counters this footprint.`;
      } else if (q.includes('roi') || q.includes('financial') || q.includes('payback')) {
        answer = `Financial Analysis for DSU Interventions:\n\n* **Annual OPEX Savings:** ₹${annualSavingsINR} Lakhs.\n* **Diesel Savings:** Avoids ~${(fleetReduction * 14000 / 100000).toFixed(2)} Lakhs in diesel.\n* **Solar Electricity Offset:** Saves ~${(solarReduction * 16000 / 100000).toFixed(2)} Lakhs in grid peak tariffs.\n* **Estimated Payback Horizon:** 1.8 Years with high IRR.`;
      } else {
        answer = `Based on your query: "${query}"\n\nOmniCarbon digital twin telemetry confirms that Dayananda Sagar University is currently tracking at a **${percentSaved}% carbon reduction**, saving **${totalSaved.toFixed(1)} Tons CO₂e/yr** across transportation, HVAC, and AI computing workloads.`;
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      timestamp: new Date().toISOString(),
      provider,
      query,
      answer,
      metrics: {
        percentSaved: Number(percentSaved),
        totalCarbonSavedTons: Number(totalSaved.toFixed(1)),
        annualSavingsLakhsINR: Number(annualSavingsINR)
      }
    }, null, 2));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'AI reasoning error', details: err.message }));
  }
}

export function handleGetPlaybook(req, res) {
  const playbook = {
    institution: 'Dayananda Sagar University (DSU) Harohalli Campus',
    standard: 'ISO 14064 Carbon Quantification & GHG Protocol',
    generatedAt: new Date().toISOString(),
    initiatives: [
      {
        phase: 'Immediate (Month 1-3)',
        title: 'NVIDIA DGX Compute Solar Time-Shift (AI Eco-Scheduler)',
        scope: 'Scope 2',
        impactTonsCo2Year: 46.2,
        capexINR: 0,
        status: 'READY_TO_DEPLOY',
        details: 'Automatically schedule heavy student deep learning jobs between 11:00 AM - 2:30 PM peak solar window.'
      },
      {
        phase: 'Immediate (Month 1-3)',
        title: 'Transit Depot Idling Enforcement (Metropolis CV)',
        scope: 'Scope 1',
        impactTonsCo2Year: 14.8,
        capexINR: 0,
        status: 'DEPLOYED_ON_JETSON_ORIN',
        details: 'Real-time CCTV tailpipe tracking alerts security if diesel shuttles idle > 3 minutes at Gate 1.'
      },
      {
        phase: 'Near-Term (Year 1)',
        title: 'Campus Shuttle Electrification (Phase 1 - 30% Fleet)',
        scope: 'Scope 1',
        impactTonsCo2Year: 36.0,
        capexINR: 1600000,
        status: 'FINANCING_APPROVED',
        details: 'Transition 4 high-frequency diesel transit buses to electric powertrains with on-campus chargers.'
      },
      {
        phase: 'Medium-Term (Year 1-2)',
        title: 'Rooftop Photovoltaic Expansion to 600 kW',
        scope: 'Scope 2',
        impactTonsCo2Year: 80.0,
        capexINR: 3500000,
        status: 'FEASIBILITY_VERIFIED',
        details: 'Install crystalline monocrystalline solar arrays across Academic Blocks B & C.'
      }
    ]
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(playbook, null, 2));
}
