import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const N8N_DEFAULT_FORM_URL = 'https://student-2628.app.n8n.cloud/form/751f3faf-fec6-4519-ae5e-0aa4c9a0b018';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / Status endpoint to verify n8n Traveling Agent availability
app.get('/api/agent-status', async (req, res) => {
  const targetUrl = (req.query.url as string) || N8N_DEFAULT_FORM_URL;
  const startTime = Date.now();
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VoyageIQ/1.0',
      },
    });
    const latency = Date.now() - startTime;
    return res.json({
      status: response.ok ? 'online' : 'degraded',
      statusCode: response.status,
      latencyMs: latency,
      endpoint: targetUrl,
      lastChecked: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(502).json({
      status: 'offline',
      error: err?.message || 'Failed to reach n8n Travelling Agent endpoint',
      latencyMs: Date.now() - startTime,
      endpoint: targetUrl,
      lastChecked: new Date().toISOString(),
    });
  }
});

// Trip Submission endpoint forwarding to the n8n form webhook
app.post('/api/submit-trip', async (req, res) => {
  try {
    const {
      startLocation,
      destination,
      travelDate,
      returnDate,
      travelers,
      budget,
      email,
      notes,
      customN8nUrl,
    } = req.body;

    // Validate required fields matching n8n form requirement
    if (!startLocation || !destination || !travelDate || !returnDate || !travelers || !budget || !email) {
      return res.status(400).json({
        error: 'Missing required travel parameters. Please check all fields.',
      });
    }

    const targetUrl = customN8nUrl?.trim() || N8N_DEFAULT_FORM_URL;

    // Prepare FormData matching n8n form schema:
    // field-0: start location
    // field-1: Destination
    // field-2: travel date
    // field-3: return date
    // field-4: no of people travelling
    // field-5: budget (include notes if provided)
    // field-6: Email
    const formData = new FormData();
    formData.append('field-0', String(startLocation).trim());
    formData.append('field-1', String(destination).trim());
    formData.append('field-2', String(travelDate).trim());
    formData.append('field-3', String(returnDate).trim());
    formData.append('field-4', String(travelers).trim());
    
    // If user added travel style/notes, append gracefully to budget field for the agent
    const budgetPayload = notes?.trim() 
      ? `${budget.trim()} [Preferences: ${notes.trim()}]`
      : String(budget).trim();
    formData.append('field-5', budgetPayload);
    
    formData.append('field-6', String(email).trim());

    const startTime = Date.now();
    const n8nResponse = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VoyageIQ/1.0',
      },
    });

    const elapsed = Date.now() - startTime;
    const responseText = await n8nResponse.text();

    let parsedResponse: any = null;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      // response might be raw text or HTML
    }

    if (!n8nResponse.ok && n8nResponse.status !== 200) {
      return res.status(n8nResponse.status).json({
        error: 'n8n workflow rejected submission',
        status: n8nResponse.status,
        details: responseText,
      });
    }

    const submissionId = `TRIP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

    return res.json({
      success: true,
      submissionId,
      timestamp: new Date().toISOString(),
      durationMs: elapsed,
      endpoint: targetUrl,
      n8nRawResponse: parsedResponse || responseText,
      message: 'Travelling Agent workflow initiated successfully! Check your inbox shortly for your custom itinerary.',
      tripSummary: {
        startLocation,
        destination,
        travelDate,
        returnDate,
        travelers,
        budget,
        email,
        notes: notes || null,
      },
    });
  } catch (error: any) {
    console.error('Submission proxy error:', error);
    return res.status(500).json({
      error: 'Failed to dispatch itinerary request to n8n travelling agent.',
      message: error?.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoyageIQ server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
