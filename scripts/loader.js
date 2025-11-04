// loader.js - Enhanced Loader System for Spiritual Guide
class LoaderSystem {
    constructor() {
        this.loader = null;
        this.isLoading = false;
        this.minimumDisplayTime = 1000; // Minimum 1 second to prevent flash
        this.startTime = null;
        this.initializeLoader();
    }

    initializeLoader() {
        // Create loader if it doesn't exist
        if (!document.getElementById('SC1-loader')) {
            const loaderHTML = `
                <div id="SC1-loader" class="SC1-loader">
                    <div class="SC1-loader-spinner"></div>
                    <p data-i18n="SC1.loader.loading">Loading Spiritual Guide...</p>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        }
        
        this.loader = document.getElementById('SC1-loader');
        this.bindEvents();
    }

    bindEvents() {
        // Prevent clicks on loader
        this.loader.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        // Show loader when page starts loading
        window.addEventListener('beforeunload', () => {
            this.show();
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.show(); // Show loader when tab becomes inactive
            }
        });
    }

    show(message = null) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.startTime = Date.now();
        
        // Update message if provided
        if (message && this.loader) {
            const messageElement = this.loader.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }
        
        // Show loader and disable interactions
        if (this.loader) {
            this.loader.classList.remove('hidden');
            document.body.classList.add('SC1-loading');
        }
    }

    hide() {
        if (!this.isLoading) return;

        const elapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minimumDisplayTime - elapsed);

        setTimeout(() => {
            if (this.loader) {
                this.loader.classList.add('hidden');
                document.body.classList.remove('SC1-loading');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    if (this.loader && this.loader.parentNode) {
                        this.loader.parentNode.removeChild(this.loader);
                    }
                }, 300);
            }
            
            this.isLoading = false;
            this.startTime = null;
        }, remainingTime);
    }

    // Show loader with different states
    showPreparing() {
        this.show(translate('SC1.loader.preparing'));
    }

    showAlmostReady() {
        this.show(translate('SC1.loader.almostReady'));
    }

    // Force hide (for emergency cases)
    forceHide() {
        if (this.loader) {
            this.loader.classList.add('hidden');
            document.body.classList.remove('SC1-loading');
            
            setTimeout(() => {
                if (this.loader && this.loader.parentNode) {
                    this.loader.parentNode.removeChild(this.loader);
                }
            }, 300);
        }
        this.isLoading = false;
        this.startTime = null;
    }

    // Check if currently loading
    get isLoadingState() {
        return this.isLoading;
    }
}

// Create global instance
window.SC1Loader = new LoaderSystem();

// Make functions available globally
window.showLoader = function(message) {
    return window.SC1Loader.show(message);
};

window.hideLoader = function() {
    return window.SC1Loader.hide();
};

window.forceHideLoader = function() {
    return window.SC1Loader.forceHide();
};

// Error boundary for loader
window.addEventListener('error', (event) => {
    console.error('Loader error:', event.error);
    if (window.SC1Loader) {
        window.SC1Loader.forceHide();
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Loader unhandled rejection:', event.reason);
    if (window.SC1Loader) {
        window.SC1Loader.forceHide();
    }
});