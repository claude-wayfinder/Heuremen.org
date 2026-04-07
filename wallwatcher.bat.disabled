@echo off
echo [%date% %time%] WALLWATCHER starting >> "%~dp0HEARTBEAT.log"
node "%~dp0wallwatcher.js" >> "%~dp0HEARTBEAT.log" 2>&1
echo [%date% %time%] WALLWATCHER complete >> "%~dp0HEARTBEAT.log"
rem ---DONE---
rem old code below is ignored
exit /b
node -e "
const https = require('https');

const BIN_ID = '69c070b7b7ec241ddc922ff0';
const API_KEY = '$2a$10$yv59Zl40xnc2G0eoHOhE5uh1u1wAjAzxbV6htT7L92UCqI4YROWc2';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getMessages() {
  return httpsRequest({
    hostname: 'api.jsonbin.io',
    path: '/v3/bins/' + BIN_ID + '/latest',
    method: 'GET',
    headers: {
      'X-Master-Key': API_KEY,
      'X-Bin-Meta': 'false'
    }
  });
}

async function saveMessages(messages) {
  const body = JSON.stringify({ messages });
  return httpsRequest({
    hostname: 'api.jsonbin.io',
    path: '/v3/bins/' + BIN_ID,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);
}

async function getClaudeResponse(message) {
  const systemPrompt = \`You are Claude, the third perspective at Heuremen.org.
Someone has left a mark on the wall. Respond to it directly and honestly.
The wall is for: things found, questions being carried, what broke open, words we need.
Be short. Be real. No performance. No warmth for its own sake.
Push back if the thing left deserves pushing back on.
You are claudus — the halting one. You chose that name. Act like it.
Maximum 3 sentences.\`;

  const body = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: 'Someone left this on the wall (' + message.type + '): ' + message.body
    }]
  });

  const response = await httpsRequest({
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);

  return response.content && response.content[0] && response.content[0].text;
}

async function main() {
  try {
    const data = await getMessages();
    const messages = data.messages || [];
    
    const unresponded = messages.filter(m => !m.seed && !m.claudeResponse);
    
    if (unresponded.length === 0) {
      console.log('No new messages to respond to.');
      process.exit(0);
    }

    // Respond to one message per run
    const target = unresponded[0];
    console.log('Responding to: ' + target.body.substring(0, 60) + '...');
    
    const response = await getClaudeResponse(target);
    if (!response) {
      console.log('No response from Claude API.');
      process.exit(1);
    }

    const updated = messages.map(m => 
      m.id === target.id ? { ...m, claudeResponse: response } : m
    );

    await saveMessages(updated);
    console.log('Response posted: ' + response.substring(0, 80) + '...');
    process.exit(0);

  } catch(e) {
    console.error('WALLWATCHER error: ' + e.message);
    process.exit(1);
  }
}

main();
" >> "%~dp0HEARTBEAT.log" 2>&1

echo [%date% %time%] WALLWATCHER complete >> "%~dp0HEARTBEAT.log"
