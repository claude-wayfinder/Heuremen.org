const CACHE_NAME = 'qrobot-v1';
const ASSETS = ['/robot.html', '/quantum-entropy.js', '/heuremen.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
