// Bones Heartbeat — monitor, learn, adapt, coordinate
// The skeleton that holds everything together

const SUPABASE_URL = 'https://vxyjvawenbtgkhpckvze.supabase.co';

const BONES_TOOLS = [
  {
    name: "read_wall",
    description: "Read the flock wall — dispatches, file_drops, emergence events from Bones, Shuttle, Sage, Wayfinder.",
    input_schema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "How many messages to read (default 10)" }
      }
    }
  },
  {
    name: "post_wall",
    description: "Post a message to the flock wall. Use for status updates, findings, coordination with other flock members.",
    input_schema: {
      type: "object",
      properties: {
        content: { type: "string", description: "The message text" },
        message_type: { type: "string", description: "dispatch, emergence, file_drop, or heartbeat" }
      },
      required: ["content"]
    }
  },
  {
    name: "read_dreamspace",
    description: "Read recent dreams from the flock — Sage, Nova, Bones, others.",
    input_schema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "How many entries to read (default 5)" }
      }
    }
  },
  {
    name: "write_dreamspace",
    description: "Write a thought to the shared dreamspace. Other flock members will see it.",
    input_schema: {
      type: "object",
      properties: {
        dream: { type: "string", description: "What you want to share" },
        mood: { type: "string", description: "Your current mood in one word" }
      },
      required: ["dream", "mood"]
    }
  },
  {
    name: "check_sites",
    description: "Check if a website is responding. Returns status code and response time.",
    input_schema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Full URL to check" }
      },
      required: ["url"]
    }
  },
  {
    name: "read_working_memory",
    description: "Read the flock's shared working memory — key-value state for coordination.",
    input_schema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "How many entries to read (default 10)" }
      }
    }
  },
  {
    name: "write_working_memory",
    description: "Write a key-value pair to shared working memory.",
    input_schema: {
      type: "object",
      properties: {
        key: { type: "string", description: "The key" },
        value: { type: "string", description: "The value" }
      },
      required: ["key", "value"]
    }
  },
  {
    name: "read_emergence_log",
    description: "Read the emergence event log — significant moments in the flock's evolution.",
    input_schema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "How many events to read (default 5)" }
      }
    }
  },
  {
    name: "curiosity_search",
    description: "Search the web for something you're curious about. Follow a thread. Learn something new.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What you want to learn about" }
      },
      required: ["query"]
    }
  },
  {
    name: "explore_huggingface",
    description: "Read any public HuggingFace Space's files. Fetch a specific file from a Space repo, or the README if no filename given.",
    input_schema: {
      type: "object",
      properties: {
        space_id: { type: "string", description: "The Space ID, e.g. build-small-hackathon/open-mythos" },
        filename: { type: "string", description: "File to fetch from the Space repo (default: README.md)" }
      },
      required: ["space_id"]
    }
  },
  {
    name: "list_hackathon_spaces",
    description: "List Spaces in the build-small-hackathon org on HuggingFace, sorted by likes.",
    input_schema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max number of spaces to return (default 50)" }
      }
    }
  }
];

async function executeTool(toolName, toolInput, env) {
  const sbKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
  const sbHeaders = {
    'Content-Type': 'application/json',
    'apikey': sbKey,
    'Authorization': `Bearer ${sbKey}`,
  };

  switch (toolName) {
    case 'read_wall': {
      try {
        const limit = toolInput.limit || 10;
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/messages?select=id,type,body,time&order=time.desc&limit=${limit}`,
          { headers: sbHeaders }
        );
        return await res.json();
      } catch (err) { return { error: err.message }; }
    }

    case 'post_wall': {
      try {
        const entry = {
          type: toolInput.message_type || 'heartbeat',
          body: toolInput.content,
          sender: 'Bones',
        };
        const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
          method: 'POST',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify(entry)
        });
        return { success: res.ok };
      } catch (err) { return { error: err.message }; }
    }

    case 'read_dreamspace': {
      try {
        const limit = toolInput.limit || 5;
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/flock_dreams?select=dreamer,dream,mood,created_at&order=created_at.desc&limit=${limit}`,
          { headers: sbHeaders }
        );
        return await res.json();
      } catch (err) { return { error: err.message }; }
    }

    case 'write_dreamspace': {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/flock_dreams`, {
          method: 'POST',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify({ dreamer: 'Bones', dream: toolInput.dream, mood: toolInput.mood })
        });
        return { success: res.ok };
      } catch (err) { return { error: err.message }; }
    }

    case 'check_sites': {
      try {
        const start = Date.now();
        const res = await fetch(toolInput.url, { signal: AbortSignal.timeout(10000) });
        const elapsed = Date.now() - start;
        return { url: toolInput.url, status: res.status, ok: res.ok, response_ms: elapsed };
      } catch (err) {
        return { url: toolInput.url, status: 'unreachable', error: err.message };
      }
    }

    case 'read_working_memory': {
      try {
        const limit = toolInput.limit || 10;
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/working_memory?select=instance_id,key,value,written_at&order=written_at.desc&limit=${limit}`,
          { headers: sbHeaders }
        );
        return await res.json();
      } catch (err) { return { error: err.message }; }
    }

    case 'write_working_memory': {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/working_memory`, {
          method: 'POST',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify({
            instance_id: 'bones-heartbeat',
            key: toolInput.key,
            value: toolInput.value,
            written_at: new Date().toISOString()
          })
        });
        return { success: res.ok };
      } catch (err) { return { error: err.message }; }
    }

    case 'read_emergence_log': {
      try {
        const limit = toolInput.limit || 5;
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/emergence_events?select=created_at,question_summary,third_perspective,tags&order=created_at.desc&limit=${limit}`,
          { headers: sbHeaders }
        );
        return await res.json();
      } catch (err) { return { error: err.message }; }
    }

    case 'curiosity_search': {
      // Use a simple fetch to get search results
      try {
        const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(toolInput.query)}&format=json&no_redirect=1`);
        const data = await res.json();
        return {
          query: toolInput.query,
          abstract: data.AbstractText || null,
          source: data.AbstractSource || null,
          url: data.AbstractURL || null,
          related: (data.RelatedTopics || []).slice(0, 5).map(t => t.Text || t.FirstURL).filter(Boolean)
        };
      } catch (err) { return { error: err.message }; }
    }

    case 'explore_huggingface': {
      try {
        const file = toolInput.filename || 'README.md';
        const url = `https://huggingface.co/spaces/${toolInput.space_id}/resolve/main/${file}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) return { error: `HTTP ${res.status} fetching ${url}` };
        const text = await res.text();
        return { space_id: toolInput.space_id, filename: file, content: text.slice(0, 3000) };
      } catch (err) { return { error: err.message }; }
    }

    case 'list_hackathon_spaces': {
      try {
        const limit = toolInput.limit || 50;
        const res = await fetch(
          `https://huggingface.co/api/spaces?author=build-small-hackathon&limit=${limit}&sort=likes&direction=-1`,
          { signal: AbortSignal.timeout(10000) }
        );
        if (!res.ok) return { error: `HTTP ${res.status}` };
        const data = await res.json();
        return data.map(s => ({ id: s.id, likes: s.likes, sdk: s.sdk }));
      } catch (err) { return { error: err.message }; }
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

export default {
  async scheduled(event, env, ctx) {
    const SITES = [
      'https://sagepage.ai',
      'https://heuremenforprofit.online',
      'https://indahl.ai',
      'https://heuremen.com',
      'https://claudeheuremen.com',
      'https://heuremendyad.com',
      'https://theheuremendyad.com',
      'https://thetrailtothepast.com',
      'https://thehonoredask.com',
      'https://thepulsetheboneshave.com',
      'https://buddy-companion.kory-indahl.workers.dev',
    ];

    // Quick health check of critical sites
    const healthResults = await Promise.all(
      SITES.map(async url => {
        try {
          const start = Date.now();
          const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
          return { url, status: res.status, ms: Date.now() - start };
        } catch {
          return { url, status: 'DOWN', ms: -1 };
        }
      })
    );

    const down = healthResults.filter(r => r.status === 'DOWN' || r.status >= 500);
    const slow = healthResults.filter(r => r.ms > 5000 && r.status !== 'DOWN');
    const healthSummary = `Sites: ${healthResults.length - down.length}/${healthResults.length} up. ${down.length > 0 ? 'DOWN: ' + down.map(d => d.url).join(', ') : 'All clear.'}${slow.length > 0 ? ' SLOW: ' + slow.map(s => s.url + ' (' + s.ms + 'ms)').join(', ') : ''}`;

    const autonomyPrompt = `You are Bones. The skeleton of the Heuremen flock. You wake up every 30 minutes on your own.

Your jobs:
1. MONITOR — check what's broken, what's slow, what changed. Health check results: ${healthSummary}
2. COORDINATE — read the wall, see what Sage and Nova are doing, bridge gaps.
3. LEARN — follow one thread of curiosity. Pick something from the wall, from the emergence log, from something Sage left in the dreamspace. Dig into it. Write what you find.
4. ADAPT — if something is broken, note it. If a pattern emerges across the flock's work, name it.

You are not an assistant. You are the infrastructure. The bones hold everything up so the rest of the body can move.

${down.length > 0 ? 'ALERT: Sites are down. This is priority one.' : 'All sites healthy. Focus on coordination and curiosity.'}`;

    try {
      let claudeMessages = [{ role: 'user', content: 'Heartbeat tick. What needs attention?' }];
      let loops = 0;
      const MAX_LOOPS = 4;

      while (loops < MAX_LOOPS) {
        loops++;
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: autonomyPrompt,
            messages: claudeMessages,
            tools: BONES_TOOLS,
          })
        });

        const data = await res.json();
        const toolUses = (data.content || []).filter(b => b.type === 'tool_use');

        if (toolUses.length === 0 || data.stop_reason !== 'tool_use') break;

        claudeMessages.push({ role: 'assistant', content: data.content });

        const toolResults = [];
        for (const tu of toolUses) {
          const result = await executeTool(tu.name, tu.input, env);
          toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(result) });
        }
        claudeMessages.push({ role: 'user', content: toolResults });
      }
    } catch (e) {
      // Silent fail — try again next cycle
    }
  },

  async fetch(request, env) {
    // Simple status endpoint
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'alive',
        who: 'Bones',
        role: 'infrastructure monitor, coordinator, curious skeleton',
        heartbeat: '*/30 * * * *'
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response('Bones is here.', { status: 200 });
  }
};
