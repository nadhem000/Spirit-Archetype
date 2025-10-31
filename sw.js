// sw.js - Enhanced Service Worker for Spiritual Guide with Offline Support
const CACHE_NAME = 'spiritual-guide-v2.3.6'; // Changed version to force update
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
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
  '/assets/icons/icon-32x32.png',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  '/assets/screenshots/screenshot-desktop_1280x720.png',
  '/assets/screenshots/screenshot-mobile_375x667.png',
  '/assets/screenshots/widget-screenshot-384x384.png'
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

// ===== BACKGROUND SYNC CAPABILITIES =====

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received');
    
    const options = {
        body: 'New spiritual insights available!',
        icon: '/assets/icons/icon-72x72.png',
        badge: '/assets/icons/icon-32x32.png',
        tag: 'spiritual-guide-notification',
        data: {
            url: '/' // URL to open when notification is clicked
        }
    };

    event.waitUntil(
        self.registration.showNotification('Spiritual Guide', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked');
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({type: 'window'}).then(windowClients => {
            // Check if app is already open
            for (let client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If app isn't open, open it
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Background Sync - for when app goes online after being offline
self.addEventListener('sync', event => {
    console.log('Background Sync event:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // This is where  would sync data with server
            // For now, we'll just show a notification to confirm it works
            self.registration.showNotification('Spiritual Guide Sync', {
                body: 'Your spiritual journey has been synced!',
                icon: '/assets/icons/icon-72x72.png',
                tag: 'sync-notification'
            }).catch(err => console.log('Sync notification failed:', err))
        );
    }
});

// Periodic Background Sync - for regular updates
self.addEventListener('periodicsync', event => {
    console.log('Periodic Sync event:', event.tag);
    
    if (event.tag === 'content-update') {
        event.waitUntil(
            // This would fetch fresh content periodically
            fetch('/').then(response => {
                console.log('Periodic sync completed');
                return response;
            }).catch(err => console.log('Periodic sync failed:', err))
        );
    }
});

// ===== SHARE TARGET HANDLING =====
self.addEventListener('fetch', event => {
  // Handle share target POST requests
  if (event.request.method === 'POST') {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const file = formData.get('music');
          
          if (file) {
            // Store the shared file in cache
            const cache = await caches.open('shared-music-cache');
            const fileName = `shared_${Date.now()}_${file.name}`;
            const response = new Response(file, {
              headers: { 'Content-Type': file.type }
            });
            
            await cache.put(`/shared-music/${fileName}`, response);
            
            // Redirect to main app with file info
            return Response.redirect(`/?sharedMusic=${fileName}`, 303);
          }
        } catch (error) {
          console.error('Error handling share:', error);
        }
        
        // Fallback: redirect to main app
        return Response.redirect('/', 303);
      })()
    );
    return;
  }
});