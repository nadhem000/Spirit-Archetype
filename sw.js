// Service Worker for Spiritual Guide Test PWA - Enhanced Version with Push Notifications
const CACHE_NAME = 'spiritual-guide-v1.3.8'; // Increment version
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/manifest.json',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  '/assets/screenshots/screenshot-desktop_1280x720.png',
  '/assets/screenshots/screenshot-mobile_375x667.png'
];

// Background Sync queue name
const BACKGROUND_SYNC_QUEUE = 'background-sync-queue';

// VAPID public key (you'll need to generate your own for production)
const VAPID_PUBLIC_KEY = 'BCk-q7nq79UoXZEG4sLuvyr0sxUXl4DR4mFPNPbVf9WmOlGZdj_3B2KpN4xLHJfyEWYMqA7RQxkuM1Nk1_mA1uY';

// Install event - cache essential files with network-first approach for HTML
self.addEventListener('install', event => {
  console.log('Service Worker installing... Version: 1.3.8');
  
  // Force the waiting service worker to become active
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        // Use network-first for critical files, cache as fallback
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url, { cache: 'no-cache' })
              .then(response => {
                if (response.status === 200) {
                  console.log('Caching:', url);
                  return cache.put(url, response);
                }
              })
              .catch(error => {
                console.warn('Could not fetch', url, 'will use cached version later');
                // Don't throw error, we'll use stale-while-revalidate
              });
          })
        );
      })
      .then(() => {
        console.log('All resources cached successfully');
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Enhanced fetch with version control and update detection
self.addEventListener('fetch', event => {
  // Skip non-GET requests and external URLs
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const requestUrl = new URL(event.request.url);
  
  // For HTML documents, use network-first strategy
  if (event.request.destination === 'document') {
    event.respondWith(networkFirstThenCache(event.request));
    return;
  }

  // For assets, use cache-first with background update
  if (requestUrl.pathname.match(/\.(css|js|json|png|jpg|jpeg|gif|svg|ico)$/)) {
    event.respondWith(cacheFirstWithUpdate(event.request));
    return;
  }

  // Default: network first
  event.respondWith(networkFirstThenCache(event.request));
});
// Push event handler
self.addEventListener('push', event => {
  console.log('Push event received:', event);
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('Error parsing push data:', error);
    data = {
      title: 'Spiritual Guide Test',
      body: 'New update available!',
      icon: '/assets/icons/icon-192x192.png'
    };
  }

  const options = {
    body: data.body || 'New content is available!',
    icon: data.icon || '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/assets/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Spiritual Guide Test',
      options
    )
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data || '/');
        }
      })
  );
});

// Notification close handler
self.addEventListener('notificationclose', event => {
  console.log('Notification closed:', event);
});

// Background sync for push subscription updates
self.addEventListener('sync', event => {
  console.log('Background Sync event:', event.tag);
  
  if (event.tag === 'push-subscription-sync') {
    event.waitUntil(
      syncPushSubscription()
        .then(() => {
          console.log('Push subscription synced successfully');
        })
        .catch(error => {
          console.error('Push subscription sync failed:', error);
        })
    );
  }
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncFailedRequests()
        .then(() => {
          console.log('Background Sync completed successfully');
        })
        .catch(error => {
          console.error('Background Sync failed:', error);
        })
    );
  }
  
  if (event.tag === 'periodic-sync-update') {
    event.waitUntil(
      performPeriodicSync()
        .then(() => {
          console.log('Periodic Sync completed successfully');
        })
        .catch(error => {
          console.error('Periodic Sync failed:', error);
        })
    );
  }
});

// Sync push subscription with server
async function syncPushSubscription() {
  try {
    const registration = await self.registration;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Send subscription to server
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription,
          type: 'subscribe'
        })
      });
      console.log('Push subscription synced with server');
    }
  } catch (error) {
    console.error('Error syncing push subscription:', error);
    throw error;
  }
}

// Send update notification to all clients
function sendUpdateNotification() {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        message: 'A new version of Spiritual Guide Test is available!',
        timestamp: new Date().toISOString()
      });
    });
  });
}

// Network first strategy for HTML
async function networkFirstThenCache(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Update cache with fresh response
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache and it's an HTML request, return offline page or homepage
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Stale-while-revalidate for assets
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Return cached version immediately
  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request, cache);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Cache first with background update
async function cacheFirstWithUpdate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request, cache);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Helper function to fetch and cache in background
async function fetchAndCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silent fail - we already returned cached response
  }
}

// Enhanced activate event with better cleanup
self.addEventListener('activate', event => {
  console.log('Service Worker activating... Version: 1.3.0');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete all caches that are not the current version
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Claiming clients for version:', CACHE_NAME);
      // Take control of all clients immediately
      return self.clients.claim();
    })
    .then(() => {
      // Send message to all clients about update
      return self.clients.matchAll();
    })
    .then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          version: CACHE_NAME,
          message: 'Service Worker updated and activated'
        });
      });
    })
    .then(() => {
      // Register periodic sync if supported
      if ('periodicSync' in self.registration) {
        return self.registration.periodicSync.register('content-update', {
          minInterval: 24 * 60 * 60 * 1000 // 24 hours
        }).then(() => {
          console.log('Periodic Sync registered on activate');
        }).catch(error => {
          console.log('Periodic Sync not supported:', error);
        });
      }
    })
  );
});

// Enhanced message handling for updates
self.addEventListener('message', event => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_FOR_UPDATES') {
    checkForUpdates().then(hasUpdates => {
      event.ports[0].postMessage({ hasUpdates });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ cleared: true });
    });
  }
  
  if (event.data && event.data.type === 'SEND_UPDATE_NOTIFICATION') {
    sendUpdateNotification();
  }
});

// Enhanced update checking with cache busting
async function checkForUpdates() {
  try {
    console.log('Checking for updates with cache busting...');
    
    const cache = await caches.open(CACHE_NAME);
    const resourcesToCheck = ['/', '/index.html', '/styles/main.css', '/scripts/main.js'];
    let hasUpdates = false;
    
    for (const url of resourcesToCheck) {
      // Fetch fresh version
      const networkResponse = await fetch(url, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      }).catch(() => null);
      
      if (!networkResponse || networkResponse.status !== 200) continue;
      
      // Clone the network response immediately for comparison
      const networkClone = networkResponse.clone();
      
      const cachedResponse = await cache.match(url);
      
      if (!cachedResponse) {
        // New resource, update cache with the original response
        await cache.put(url, networkResponse);
        hasUpdates = true;
        continue;
      }
      
      // Clone cached response for comparison
      const cachedClone = cachedResponse.clone();
      
      // Compare responses using the clones
      const cachedText = await cachedClone.text();
      const networkText = await networkClone.text();
      
      if (cachedText !== networkText) {
        // Update cache with the original network response
        await cache.put(url, networkResponse);
        hasUpdates = true;
        console.log(`Updated: ${url}`);
      }
    }
    
    return hasUpdates;
    
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
}

// Keep the existing sync events
self.addEventListener('periodicsync', event => {
  console.log('Periodic Sync event:', event.tag);
  
  if (event.tag === 'content-update') {
    event.waitUntil(
      checkForUpdates()
        .then(updated => {
          if (updated) {
            console.log('New content available after periodic sync');
            // Send push notification about update
            self.registration.showNotification('Spiritual Guide Test Update', {
              body: 'New content is available! Tap to refresh.',
              icon: '/assets/icons/icon-192x192.png',
              badge: '/assets/icons/icon-72x72.png',
              tag: 'content-update',
              requireInteraction: true,
              actions: [
                {
                  action: 'refresh',
                  title: 'Refresh Now'
                }
              ]
            });
            
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({
                  type: 'CONTENT_UPDATED',
                  message: 'New content is available. Please refresh.'
                });
              });
            });
          }
        })
        .catch(error => {
          console.error('Periodic update check failed:', error);
        })
    );
  }
});

// Keep existing sync functions
async function syncFailedRequests() {
  try {
    console.log('Syncing failed requests...');
    
    const cache = await caches.open(CACHE_NAME);
    const requestsToUpdate = [
      '/',
      '/index.html',
      '/styles/main.css',
      '/scripts/main.js'
    ];
    
    const updatePromises = requestsToUpdate.map(url => 
      fetch(url)
        .then(response => {
          if (response.status === 200) {
            return cache.put(url, response);
          }
        })
        .catch(error => {
          console.error(`Failed to update ${url}:`, error);
        })
    );
    
    await Promise.all(updatePromises);
    console.log('Failed requests synced successfully');
    
  } catch (error) {
    console.error('Error syncing failed requests:', error);
    throw error;
  }
}

async function performPeriodicSync() {
  try {
    console.log('Performing periodic sync...');
    
    const cache = await caches.open(CACHE_NAME);
    
    const updatePromises = urlsToCache.map(url => 
      fetch(url, { cache: 'reload' })
        .then(response => {
          if (response.status === 200) {
            return cache.put(url, response);
          }
        })
        .catch(error => {
          console.error(`Failed to refresh ${url}:`, error);
        })
    );
    
    await Promise.all(updatePromises);
    console.log('Periodic sync completed');
    
  } catch (error) {
    console.error('Error during periodic sync:', error);
    throw error;
  }
}

async function registerPeriodicSync() {
  if ('periodicSync' in self.registration) {
    try {
      const status = await self.registration.periodicSync.register('content-update', {
        minInterval: 24 * 60 * 60 * 1000 // 24 hours
      });
      console.log('Periodic Sync registered:', status);
    } catch (error) {
      console.error('Periodic Sync registration failed:', error);
    }
  } else {
    console.log('Periodic Background Sync not supported');
  }
}