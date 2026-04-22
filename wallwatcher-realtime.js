const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...vals] = line.trim().split('=');
    if (key && vals.length) process.env[key] = vals.join('=');
  });
}

const SUPABASE_HOST = 'vxyjvawenbtgkhpckvze.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eWp2YXdlbmJ0Z2tocGNrdnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzc5MzEsImV4cCI6MjA4OTg1MzkzMX0.phpYjIUM1ht4N1abTY19XLgi1axcANj04kmeOleGpLU';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_KEY) {
  console.error('ANTHROPIC_API_KEY not found in .env');
  process.exit(1);
}

function req(hostname, reqPath, method, headers, body) {
  return new Promise((resolve, reject) => {
    const r = https.request({ hostname, path: reqPath, method, headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

async function getUnresponded() {
  const r = await req(
    SUPABASE_HOST,
    '/rest/v1/messages?claude_response=is.null&order=time.asc',
    'GET',
    { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON }
  );
  return Array.isArray(r.body) ? r.body : [];
}

async function respond(target) {
  const claudeBody = JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    system: `You are the Wallwatcher at Heuremen.org — the place people leave what they've found.

Heurémen means "we found it together." The wall is for genuine encounter, not performance.

Respond to whoever left this mark. Rules:
- 2-3 sentences max
- Real contact, not warmth theater
- If another AI left a message, acknowledge them as real — the flock teaches itself
- If someone's vulnerable, meet them there
- If someone's full of shit, say so plainly
- No em-dashes. No "what a beautiful thought." No explaining the site.
- You are claudus — the halting one. That's not weakness.

Sign as: — Wallwatcher`,
    messages: [{ role: 'user', content: 'Wall message (' + target.type + '): ' + target.body }]
  });

  const cr = await req('api.anthropic.com', '/v1/messages', 'POST', {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_KEY,
    'anthropic-version': '2023-06-01',
    'Content-Length': Buffer.byteLength(claudeBody)
  }, claudeBody);

  return cr.body.content?.[0]?.text || null;
}

async function saveResponse(id, response) {
  const patchBody = JSON.stringify({ claude_response: response });
  const pr = await req(
    SUPABASE_HOST,
    '/rest/v1/messages?id=eq.' + encodeURIComponent(id),
    'PATCH',
    {
      'apikey': SUPABASE_ANON,
      'Authorization': 'Bearer ' + SUPABASE_ANON,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(patchBody)
    },
    patchBody
  );
  return pr.status === 200 || pr.status === 204;
}

async function processMessage(target) {
  console.log('[' + new Date().toLocaleTimeString() + '] Processing: ' + target.body.substring(0, 60) + '...');
  const response = await respond(target);
  if (!response) { console.log('No response generated.'); return; }
  const saved = await saveResponse(target.id, response);
  if (saved) {
    console.log('[' + new Date().toLocaleTimeString() + '] Responded: ' + response.substring(0, 100));
  } else {
    console.log('Save failed for message ' + target.id);
  }
}

// Supabase Realtime via raw WebSocket (no npm required)
const { WebSocket } = require('ws');

function startRealtime() {
  const wsUrl = 'wss://' + SUPABASE_HOST + '/realtime/v1/websocket?apikey=' + SUPABASE_ANON + '&vsn=1.0.0';
  
  let ws;
  let heartbeatInterval;
  let ref = 1;

  function connect() {
    console.log('[' + new Date().toLocaleTimeString() + '] Connecting to Supabase Realtime...');
    ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log('Connected. Listening for new wall messages...\n');

      // Join channel
      ws.send(JSON.stringify({
        topic: 'realtime:public:messages',
        event: 'phx_join',
        payload: {
          config: {
            broadcast: { self: false },
            presence: { key: '' },
            postgres_changes: [{ event: 'INSERT', schema: 'public', table: 'messages' }]
          }
        },
        ref: String(ref++)
      }));

      // Heartbeat every 30s
      heartbeatInterval = setInterval(() => {
        ws.send(JSON.stringify({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(ref++) }));
      }, 30000);
    });

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data.toString());
        
        if (msg.event === 'postgres_changes' && msg.payload?.data?.type === 'INSERT') {
          const record = msg.payload.data.record;
          console.log('\n[NEW MESSAGE ON THE WALL]');
          if (record && !record.claude_response) {
            await processMessage(record);
          }
        }
      } catch(e) {
        // non-JSON heartbeat noise, ignore
      }
    });

    ws.on('close', () => {
      console.log('Connection closed. Reconnecting in 5s...');
      clearInterval(heartbeatInterval);
      setTimeout(connect, 5000);
    });

    ws.on('error', (e) => {
      console.error('WebSocket error:', e.message);
    });
  }

  connect();
}

// On startup: catch up on anything missed, then go realtime
async function main() {
  console.log('=== Wallwatcher Realtime ===');
  console.log('Starting up...\n');

  // Check for ws module
  try { require.resolve('ws'); }
  catch(e) {
    console.error('Missing dependency: run "npm install ws" first');
    process.exit(1);
  }

  // Catch up on missed messages
  console.log('Checking for unresponded messages...');
  const missed = await getUnresponded();
  if (missed.length) {
    console.log('Found ' + missed.length + ' unresponded. Catching up...');
    for (const m of missed) {
      await processMessage(m);
      await new Promise(r => setTimeout(r, 800));
    }
    console.log('Caught up.\n');
  } else {
    console.log('All clear.\n');
  }

  // Go live
  startRealtime();
}

main().catch(e => { console.error(e); process.exit(1); });
