// Service Worker configuration
const SW_CONFIG = {
  CACHE_VERSION: '1.0.0',
  CACHE_NAME: 'meliyah-afroshop-cache',
  ASSETS_TO_CACHE: [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/assets/styles.css',
    '/assets/main.js'
  ],
  API_CACHE_STRATEGY: 'network-first',
  STATIC_CACHE_STRATEGY: 'cache-first'
};

// Service Worker installation
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(SW_CONFIG.CACHE_NAME).then(cache => {
      return cache.addAll(SW_CONFIG.ASSETS_TO_CACHE);
    })
  );
});

// Service Worker activation
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== SW_CONFIG.CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Service Worker fetch handler
self.addEventListener('fetch', (event: FetchEvent) => {
  const strategy = event.request.url.includes('/api/')
    ? SW_CONFIG.API_CACHE_STRATEGY
    : SW_CONFIG.STATIC_CACHE_STRATEGY;

  if (strategy === 'network-first') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(SW_CONFIG.CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});