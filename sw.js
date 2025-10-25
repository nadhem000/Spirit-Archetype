// Service Worker for Spiritual Guide Test PWA
const CACHE_NAME = 'spiritual-guide-v1.2.1';
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

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Fetch event - serve from cache first, then network with background sync fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests and external URLs
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version immediately
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it can only be used once
            const responseToCache = response.clone();

            // Cache the new response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('Fetch failed; returning offline page:', error);
            
            // For HTML requests, return the cached homepage
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            
            // Queue for background sync if network fails
            if ('sync' in self.registration) {
              event.waitUntil(
                self.registration.sync.register('background-sync')
                  .then(() => {
                    console.log('Background Sync registered for failed request');
                  })
                  .catch(syncError => {
                    console.error('Background Sync registration failed:', syncError);
                  })
              );
            }
            
            throw error;
          });
      })
  );
});

// Background Sync event
self.addEventListener('sync', event => {
  console.log('Background Sync event:', event.tag);
  
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

// Periodic Sync event
self.addEventListener('periodicsync', event => {
  console.log('Periodic Sync event:', event.tag);
  
  if (event.tag === 'content-update') {
    event.waitUntil(
      checkForUpdates()
        .then(updated => {
          if (updated) {
            console.log('New content available after periodic sync');
            // Send message to clients about update
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

// Function to sync failed requests
async function syncFailedRequests() {
  try {
    // In a real app, you would retrieve failed requests from IndexedDB
    // and retry them here. For this demo, we'll update the cache.
    
    console.log('Syncing failed requests...');
    
    // Update cache with fresh content
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

// Function to perform periodic sync tasks
async function performPeriodicSync() {
  try {
    console.log('Performing periodic sync...');
    
    // Update cache with latest versions
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

// Function to check for updates
async function checkForUpdates() {
  try {
    console.log('Checking for updates...');
    
    const cache = await caches.open(CACHE_NAME);
    let hasUpdates = false;
    
    // Check main resources for updates
    const resourcesToCheck = ['/', '/index.html', '/styles/main.css', '/scripts/main.js'];
    
    for (const url of resourcesToCheck) {
      const cachedResponse = await cache.match(url);
      
      if (!cachedResponse) continue;
      
      const networkResponse = await fetch(url, {
        headers: {
          'Cache-Control': 'max-age=0'
        }
      }).catch(() => null);
      
      if (networkResponse && networkResponse.status === 200) {
        const cachedETag = cachedResponse.headers.get('etag');
        const networkETag = networkResponse.headers.get('etag');
        
        // If ETags are different or we can't compare, assume update
        if (!cachedETag || !networkETag || cachedETag !== networkETag) {
          await cache.put(url, networkResponse.clone());
          hasUpdates = true;
          console.log(`Updated: ${url}`);
        }
      }
    }
    
    return hasUpdates;
    
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
}

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
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
    }).then(() => {
      // Claim clients to ensure the service worker controls all pages
      return self.clients.claim();
    }).then(() => {
      // Register periodic sync only if supported
      if ('periodicSync' in self.registration) {
        return self.registration.periodicSync.register('content-update', {
          minInterval: 24 * 60 * 60 * 1000 // 24 hours
        }).then(() => {
          console.log('Periodic Sync registered on activate');
        }).catch(error => {
          console.log('Periodic Sync not registered:', error);
        });
      }
    })
  );
});

// Handle messages from the client
self.addEventListener('message', event => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'REGISTER_PERIODIC_SYNC') {
    registerPeriodicSync();
  }
});

// Function to register periodic background sync
async function registerPeriodicSync() {
  if ('periodicSync' in self.registration) {
    try {
      // Request permission for periodic sync
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
