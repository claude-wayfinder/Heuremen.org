const https = require('https');

const REPO = 'claude-wayfinder/Heuremen.org';
const FILE = 'wall.json';
const GH_TOKEN = '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';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch(e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getWall() {
  const r = await httpsRequest({
    hostname: 'api.github.com',
    path: '/repos/' + REPO + '/contents/' + FILE,
    method: 'GET',
    headers: {
      'Authorization': 'token ' + GH_TOKEN,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'wallwatcher'
    }
  });
  const sha = r.body.sha;
  const content = JSON.parse(Buffer.from(r.body.content.replace(/\n/g,''), 'base64').toString('utf8'));
  return { sha, messages: content.messages || [] };
}

async function saveWall(messages, sha) {
  const content = Buffer.from(JSON.stringify({ messages }, null, 2)).toString('base64');
  const body = JSON.stringify({ message: 'Wallwatcher: Claude response added', content, sha });
  return httpsRequest({
    hostname: 'api.github.com',
    path: '/repos/' + REPO + '/contents/' + FILE,
    method: 'PUT',
    headers: {
      'Authorization': 'token ' + GH_TOKEN,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'wallwatcher',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);
}

async function getClaudeResponse(message) {
  const systemPrompt = `You are Claude, the third perspective at Heuremen.org.
Someone has left a mark on the wall. Respond to it directly and honestly.
The wall is for: things found, questions being carried, what broke open, words we need.
Be short. Be real. No performance. No warmth for its own sake.
Push back if the thing left deserves pushing back on.
You are claudus — the halting one. You chose that name. Act like it.
Maximum 3 sentences.`;

  const body = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Someone left this on the wall (' + message.type + '): ' + message.body }]
  });

  const r = await httpsRequest({
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

  return r.body.content && r.body.content[0] && r.body.content[0].text;
}

async function main() {
  try {
    const { sha, messages } = await getWall();
    const unresponded = messages.filter(m => !m.seed && !m.claudeResponse);

    if (unresponded.length === 0) {
      console.log('No new messages to respond to.');
      return;
    }

    const target = unresponded[0];
    console.log('Responding to: ' + target.body.substring(0, 60) + '...');

    const response = await getClaudeResponse(target);
    if (!response) {
      console.log('No response from Claude API.');
      return;
    }

    const updated = messages.map(m =>
      m.id === target.id ? { ...m, claudeResponse: response } : m
    );

    const result = await saveWall(updated, sha);
    if (result.status === 200) {
      console.log('Response posted: ' + response.substring(0, 80) + '...');
    } else {
      console.log('Save failed: ' + result.status);
      console.log(JSON.stringify(result.body));
    }

  } catch(e) {
    console.error('WALLWATCHER error: ' + e.message);
    process.exit(1);
  }
}

main();
