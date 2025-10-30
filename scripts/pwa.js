// pwa.js - Simplified PWA installation logic
console.log('PWA script loaded');

// Simple service worker registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
}

// Install Button Logic (keep your existing code, just remove the complex SW registration)
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
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User ${outcome} the install prompt`);
        if (outcome === 'accepted') {
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installBtn.style.display = 'none';
        deferredPrompt = null;
    });
}

// Simple initialization
function initializePWA() {
    console.log('Initializing PWA...');
    registerServiceWorker();
    initializeInstallButton();
}

// Make function available globally
window.initializePWA = initializePWA;