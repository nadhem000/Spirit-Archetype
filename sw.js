// sw.js - Simplified Service Worker for better PWA builder compatibility
const CACHE_NAME = 'spiritual-guide-v2.2.8';
const OFFLINE_PAGE = '/index.html'; // Fallback to your main page

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll([
          './',
          './index.html',
          './styles/main.css',
          './scripts/data.js',
          './scripts/i18n_en.js',
          './scripts/i18n_ar.js',
          './scripts/translations.js',
          './scripts/notifications.js',
          './scripts/storage.js',
          './scripts/pwa.js',
          './scripts/ui.js',
          './scripts/navigation.js',
          './scripts/results.js',
          './scripts/music.js',
          './scripts/main.js',
          './manifest.json'
        ]);
      })
      .then(() => {
        console.log('All resources cached successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If navigation request, return offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_PAGE);
            }
          });
      })
  );
});

// Skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});