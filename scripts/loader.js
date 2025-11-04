// loader.js - Enhanced Loader System for Spiritual Guide
class LoaderSystem {
    constructor() {
        this.loader = null;
        this.isLoading = false;
        this.minimumDisplayTime = 800; // Reduced to 800ms for better UX
        this.startTime = null;
        this.safetyTimeout = null;
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
        
        // Auto-hide safety mechanism
        this.safetyTimeout = setTimeout(() => {
            if (this.isLoading) {
                console.warn('Loader safety timeout triggered - forcing hide');
                this.forceHide();
            }
        }, 5000); // Force hide after 5 seconds max
    }

    bindEvents() {
        // Prevent clicks on loader
        if (this.loader) {
            this.loader.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }

        // Show loader when page starts loading
        window.addEventListener('beforeunload', () => {
            this.show();
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.show();
            }
        });

        // Listen for when all resources are loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 300);
        });
    }

    show(message = null) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.startTime = Date.now();
        
        // Clear any existing safety timeout
        if (this.safetyTimeout) {
            clearTimeout(this.safetyTimeout);
        }

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
            this.loader.style.display = 'flex';
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
                setTimeout(() => {
                    if (this.loader) {
                        this.loader.style.display = 'none';
                    }
                }, 300);
                document.body.classList.remove('SC1-loading');
            }
            this.isLoading = false;
            this.startTime = null;
            
            // Clear safety timeout
            if (this.safetyTimeout) {
                clearTimeout(this.safetyTimeout);
                this.safetyTimeout = null;
            }
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
            setTimeout(() => {
                if (this.loader) {
                    this.loader.style.display = 'none';
                }
            }, 300);
            document.body.classList.remove('SC1-loading');
        }
        this.isLoading = false;
        this.startTime = null;
        
        // Clear safety timeout
        if (this.safetyTimeout) {
            clearTimeout(this.safetyTimeout);
            this.safetyTimeout = null;
        }
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

// Enhanced error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.SC1Loader) {
        window.SC1Loader.forceHide();
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    if (window.SC1Loader) {
        window.SC1Loader.forceHide();
    }
});

// Ensure loader hides when DOM is fully ready
document.addEventListener('DOMContentLoaded', () => {
    // Set a safety timeout to hide loader
    setTimeout(() => {
        if (window.SC1Loader && window.SC1Loader.isLoadingState) {
            console.log('DOM loaded - forcing loader hide');
            window.SC1Loader.forceHide();
        }
    }, 3000);
});