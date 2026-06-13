const CACHE = 'companion-light-v1';
const SHELL = [
  './', './index.html', './manifest.json',
  './icon-180.png', './icon-192.png', './icon-512.png', './splash-512.png',
  '../companion-auth.js', '../companion-delta.js', '../heuremen.css'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = e.request.url;
  if (u.includes('/rest/v1/') || u.includes('/auth/v1/') || u.includes('supabase') ||
      u.includes('googleapis') || u.includes('gstatic') || u.includes('anthropic')) return; // network only
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
