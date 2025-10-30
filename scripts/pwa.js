// pwa.js - PWA installation logic AND service worker registration
let deferredPrompt;

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Use relative path for Netlify compatibility
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('SW update found!', newWorker);
                    // Show update notification to user
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    }
}

// Show update notification
function showUpdateNotification() {
    if (window.showInfo) {
        window.showInfo('New version available! Refresh to update.', 5000);
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

    // Initially hide the install button
    installBtn.style.display = 'none';

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install button
        installBtn.style.display = 'flex';
    });

    // Handle install button click
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User ${outcome} the install prompt`);
        
        if (outcome === 'accepted') {
            // Hide the install button after successful installation
            installBtn.style.display = 'none';
        }
        
        // Clear the saved prompt since it can't be used again
        deferredPrompt = null;
    });

    // Hide the install button when the app is successfully installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installBtn.style.display = 'none';
        deferredPrompt = null;
    });
}

// Check if app is running as PWA
function isRunningAsPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

// Initialize all PWA functionality with error handling
console.log('PWA script loaded');

// Safe initialization function
function initializePWA() {
    console.log('Initializing PWA...');
    
    // Service Worker Registration - FIXED PATH
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered successfully: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
    
    // Install Button Handling
    const installBtn = document.getElementById('SC1-install-btn');
    if (installBtn) {
        installBtn.style.display = 'none';
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPrompt = e;
            installBtn.style.display = 'flex';
        });

        installBtn.addEventListener('click', async () => {
            const promptEvent = window.deferredPrompt;
            if (!promptEvent) return;
            
            promptEvent.prompt();
            const result = await promptEvent.userChoice;
            console.log('User response to install prompt:', result);
            window.deferredPrompt = null;
            installBtn.style.display = 'none';
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            window.deferredPrompt = null;
            installBtn.style.display = 'none';
        });
    }
}


// Make functions available globally
window.initializePWA = initializePWA;
window.registerServiceWorker = registerServiceWorker;
window.initializeInstallButton = initializeInstallButton;
window.isRunningAsPWA = isRunningAsPWA;