// pwa.js - PWA installation logic AND service worker registration
let deferredPrompt;

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('SW update found!', newWorker);
                });
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    }
}

// Install Button Logic
function initializeInstallButton() {
    const installBtn = document.getElementById('SC1-install-btn');
    
    // Check if the browser supports PWA installation
    if (!installBtn) {
        console.warn('Install button not found');
        return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install button
        installBtn.classList.add('SC1-visible');
    });

    // Handle install button click
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            // Hide the install button after successful installation
            installBtn.classList.remove('SC1-visible');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt since it can't be used again
        deferredPrompt = null;
    });

    // Hide the install button when the app is successfully installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installBtn.classList.remove('SC1-visible');
        deferredPrompt = null;
    });
}

// Initialize all PWA functionality
function initializePWA() {
    registerServiceWorker();
    initializeInstallButton();
}

// Make functions available globally
window.initializePWA = initializePWA;
window.registerServiceWorker = registerServiceWorker;
window.initializeInstallButton = initializeInstallButton;