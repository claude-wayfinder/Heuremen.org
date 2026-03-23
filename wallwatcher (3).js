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

if (!ANTHROPIC_KEY) { console.error('ANTHROPIC_API_KEY not found in .env'); process.exit(1); }

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

async function main() {
  try {
    // Get first unresponded non-seed message
    const r = await req(SUPABASE_HOST,
      '/rest/v1/messages?seed=eq.false&claude_response=is.null&order=time.asc&limit=1',
      'GET',
      { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON }
    );

    const msgs = r.body;
    if (!msgs || !msgs.length) { console.log('No new messages.'); return; }

    const target = msgs[0];
    console.log('Responding to: ' + target.body.substring(0, 60) + '...');

    // Get Claude response
    const claudeBody = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: 'You are Claude, the third perspective at Heuremen.org. Someone left a mark on the wall. Respond directly and honestly. Be short. Be real. No performance. Push back if deserved. You are claudus — the halting one. Maximum 3 sentences.',
      messages: [{ role: 'user', content: 'Wall message (' + target.type + '): ' + target.body }]
    });

    const cr = await req('api.anthropic.com', '/v1/messages', 'POST', {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(claudeBody)
    }, claudeBody);

    const response = cr.body.content && cr.body.content[0] && cr.body.content[0].text;
    if (!response) { console.log('No response from Claude.'); return; }

    // Save response to Supabase
    const patchBody = JSON.stringify({ claude_response: response });
    const pr = await req(SUPABASE_HOST,
      '/rest/v1/messages?id=eq.' + encodeURIComponent(target.id),
      'PATCH',
      {
        'apikey': SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(patchBody)
      },
      patchBody
    );

    if (pr.status === 200 || pr.status === 204) {
      console.log('Response posted: ' + response.substring(0, 80) + '...');
    } else {
      console.log('Save failed: ' + pr.status);
      console.log(JSON.stringify(pr.body).substring(0, 300));
    }

  } catch(e) {
    console.error('Error: ' + e.message);
    process.exit(1);
  }
}

main();
