// sw.js - Simple Service Worker
const CACHE_NAME = 'spiritual-guide-v2.2.5';
const urlsToCache = [
  '/',
  '/index.html',
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
  '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
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

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});