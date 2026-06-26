const CACHE = 'privnav-v2';
const APP_ASSETS = ['/', '/index.html', '/manifest.json'];

// Tile cache — separate from app cache, with size limit
const TILE_CACHE = 'privnav-tiles-v2';
const MAX_TILE_CACHE = 500; // max tiles to cache

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE && k !== TILE_CACHE)
        .map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // TomTom API — always network, never cache (live data)
  if (url.hostname.includes('tomtom.com') ||
      url.hostname.includes('nominatim.openstreetmap.org')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response('', { status: 503 })
    ));
    return;
  }

  // CARTO base map tiles — cache aggressively
  if (url.hostname.includes('cartocdn.com')) {
    e.respondWith(
      caches.open(TILE_CACHE).then(async cache => {
        const cached = await cache.match(e.request);
        if (cached) return cached;
        // Fetch and cache the tile
        try {
          const response = await fetch(e.request);
          if (response.ok) {
            // Check cache size before adding
            const keys = await cache.keys();
            if (keys.length >= MAX_TILE_CACHE) {
              // Delete oldest 50 tiles to make room
              for (let i = 0; i < 50; i++) {
                await cache.delete(keys[i]);
              }
            }
            cache.put(e.request, response.clone());
          }
          return response;
        } catch(e) {
          return new Response('', { status: 503 });
        }
      })
    );
    return;
  }

  // App shell — cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
