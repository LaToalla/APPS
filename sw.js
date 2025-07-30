const cacheName = 'app-asistentes-v1';
const assets = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'sw.js'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== cacheName) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => cacheRes || fetch(evt.request))
  );
});