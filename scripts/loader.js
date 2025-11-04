// loader.js - Enhanced Loader System for Spiritual Guide (FIXED VERSION)
class LoaderSystem {
    constructor() {
        this.loader = null;
        this.isLoading = false;
        this.minimumDisplayTime = 800;
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
        
        // Set up safety timeout
        this.setupSafetyTimeout();
    }

    setupSafetyTimeout() {
        // Clear any existing safety timeout
        if (this.safetyTimeout) {
            clearTimeout(this.safetyTimeout);
        }
        
        // Extended safety mechanism - hide after 8 seconds no matter what
        this.safetyTimeout = setTimeout(() => {
            if (this.isLoading) {
                console.warn('Loader safety timeout triggered - forcing hide after 8 seconds');
                this.forceHide();
            }
        }, 8000);
    }

    bindEvents() {
        // Prevent clicks on loader
        if (this.loader) {
            this.loader.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }

        // Listen for when all resources are loaded
        window.addEventListener('load', () => {
            console.log('Window load event - checking if loader should be hidden');
            if (this.isLoading) {
                console.log('Window loaded and loader is still showing - hiding now');
                this.hide();
            }
        });
    }

    show(message = null) {
        console.log('Loader: Showing with message:', message);
        
        // Clear any existing safety timeout
        if (this.safetyTimeout) {
            clearTimeout(this.safetyTimeout);
        }

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
            this.loader.style.display = 'flex';
            document.body.classList.add('SC1-loading');
        }

        // Reset safety timeout
        this.setupSafetyTimeout();
    }

    hide() {
        if (!this.isLoading) {
            console.log('Loader: Not currently loading, skipping hide');
            return;
        }

        const elapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minimumDisplayTime - elapsed);
        
        console.log(`Loader: Hiding in ${remainingTime}ms (elapsed: ${elapsed}ms)`);

        setTimeout(() => {
            this.executeHide();
        }, remainingTime);
    }

    executeHide() {
        if (!this.isLoading) {
            console.log('Loader: Already hidden, skipping execution');
            return;
        }

        console.log('Loader: Executing hide operation');
        
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
        
        console.log('Loader: Hidden successfully');
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
        console.log('Loader: Force hiding loader');
        this.executeHide();
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
    console.log('DOMContentLoaded - setting up loader safety');
    
    // Additional safety: hide loader if everything seems ready
    setTimeout(() => {
        if (window.SC1Loader && window.SC1Loader.isLoadingState) {
            console.log('DOM loaded safety check - forcing loader hide');
            window.SC1Loader.forceHide();
        }
    }, 3000);
});