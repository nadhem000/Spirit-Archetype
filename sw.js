// sw.js - Enhanced Service Worker for Spiritual Guide with Offline Support
const CACHE_NAME = 'spiritual-guide-v2.2.7'; // Changed version to force update
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html', // Make sure you create this file!
  '/styles/main.css',
  '/scripts/data.js',
  '/scripts/i18n_en.js',
  '/scripts/i18n_ar.js',
  '/scripts/translations.js',
  '/scripts/notifications.js',
  '/scripts/storage.js',
  '/scripts/pwa.js',
  '/scripts/ui.js',
  '/scripts/navigation.js',
  '/scripts/results.js',
  '/scripts/music.js',
  '/scripts/main.js',
  '/manifest.json',
  // Add your icons
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing and caching files');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching essential files');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Cache First with Network Fallback and Offline Support
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If found in cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - try network
        return fetch(event.request)
          .then(networkResponse => {
            // If valid response, cache it for future
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('Network failed, serving offline content:', error);
            
            // 🔑 CRITICAL: Provide offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // For other requests (CSS, JS, images), try cache again
            return caches.match(event.request)
              .then(cachedResource => {
                if (cachedResource) {
                  return cachedResource;
                }
                // If nothing in cache, return empty response for non-HTML
                return new Response('', { 
                  status: 408, 
                  statusText: 'Offline' 
                });
              });
          });
      })
  );
});