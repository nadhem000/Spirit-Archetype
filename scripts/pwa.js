// pwa.js - Enhanced PWA functionality with Background Sync
console.log('PWA script loaded');

// Enhanced service worker registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Register immediately for better PWA detection
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                
                // Register background sync if supported
                if ('sync' in registration) {
                    registration.sync.register('background-sync')
                        .then(() => console.log('Background Sync registered'))
                        .catch(err => console.log('Background Sync registration failed:', err));
                }
                
                return registration;
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    }
}

// Background Sync functionality
async function registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('background-sync');
            console.log('Background Sync registered successfully');
            return true;
        } catch (error) {
            console.log('Background Sync registration failed:', error);
            return false;
        }
    }
    return false;
}

// Push Notification permission
async function requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted');
                return true;
            }
        } catch (error) {
            console.log('Notification permission error:', error);
        }
    }
    return false;
}

// Install Button Logic
function initializeInstallButton() {
    const installBtn = document.getElementById('SC1-install-btn');
    if (!installBtn) {
        console.warn('Install button not found');
        return;
    }

    installBtn.style.display = 'none';
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'flex';
        
        // Request notification permission when install prompt shows
        setTimeout(() => {
            requestNotificationPermission();
        }, 1000);
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User ${outcome} the install prompt`);
        if (outcome === 'accepted') {
            installBtn.style.display = 'none';
            // Register background sync after installation
            setTimeout(() => {
                registerBackgroundSync();
            }, 2000);
        }
        
        deferredPrompt = null;
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installBtn.style.display = 'none';
        deferredPrompt = null;
    });
}

// Enhanced initialization
function initializePWA() {
    console.log('Initializing PWA with enhanced features...');
    
    // Register service worker immediately
    registerServiceWorker();
    
    // Initialize install button
    initializeInstallButton();
    
    // Request notification permission after a delay
    setTimeout(() => {
        requestNotificationPermission();
    }, 3000);
    
    // Register background sync when coming online
    window.addEventListener('online', () => {
        registerBackgroundSync();
    });
}

// Make functions available globally
window.initializePWA = initializePWA;
window.registerBackgroundSync = registerBackgroundSync;
window.requestNotificationPermission = requestNotificationPermission;