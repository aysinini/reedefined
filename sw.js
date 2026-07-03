// Reedefined Service Worker
const CACHE = 'reedefined-v1';
const STATIC = [
  '/',
  '/newsstand.html',
  '/magazine-reader.html',
  '/portal.html',
  '/discover.html',
  '/index.html',
  '/editor-portal.html',
  '/connections.html',
  '/cover-brief.html',
  '/legal.html',
  '/privacy.html',
  '/terms.html',
];

// Install — cache all static pages
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', e => {
  // Only handle GET requests for our own pages
  if (e.request.method !== 'GET') return;
  if (!e.request.url.includes(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
