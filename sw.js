// Force uninstall old service worker and stop caching
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        console.log('Deleting cache:', k);
        return caches.delete(k);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Pass everything through to network — no caching
self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request));
});
