// loader.js - Enhanced Loader System for Spiritual Guide (FIXED VERSION)
if (!window.SC1_LOADER_LOADED) {
    window.SC1_LOADER_LOADED = true;

    class LoaderSystem {
        constructor() {
            this.loader = null;
            this.isLoading = false;
            this.minimumDisplayTime = 800;
            this.startTime = null;
            this.safetyTimeout = null;
            this.hideTimeout = null;
            this.initializeLoader();
        }

        initializeLoader() {
            console.log('LoaderSystem: Initializing loader');
            
            // Create loader if it doesn't exist
            if (!document.getElementById('SC1-loader')) {
                console.log('LoaderSystem: Creating loader element');
                const loaderHTML = `
                    <div id="SC1-loader" class="SC1-loader">
                        <div class="SC1-loader-spinner"></div>
                        <p data-i18n="SC1.loader.loading">Loading Spiritual Guide...</p>
                    </div>
                `;
                document.body.insertAdjacentHTML('afterbegin', loaderHTML);
            }
            
            this.loader = document.getElementById('SC1-loader');
            
            if (!this.loader) {
                console.error('LoaderSystem: Could not find or create loader element');
                return;
            }
            
            console.log('LoaderSystem: Loader element found', this.loader);
            this.bindEvents();
            
            // Auto-hide safety after 5 seconds
            this.setupSafetyTimeout();
        }

        setupSafetyTimeout() {
            // Clear any existing safety timeout
            if (this.safetyTimeout) {
                clearTimeout(this.safetyTimeout);
            }
            
            // Safety mechanism - hide after 5 seconds no matter what
            this.safetyTimeout = setTimeout(() => {
                if (this.isLoading) {
                    console.warn('LoaderSystem: Safety timeout triggered - forcing hide after 5 seconds');
                    this.forceHide();
                }
            }, 5000);
        }

        bindEvents() {
            console.log('LoaderSystem: Binding events');
            
            // Prevent clicks on loader
            if (this.loader) {
                this.loader.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            // Listen for when all resources are loaded
            window.addEventListener('load', () => {
                console.log('LoaderSystem: Window load event - checking if loader should be hidden');
                if (this.isLoading) {
                    console.log('LoaderSystem: Window loaded and loader is still showing - hiding now');
                    this.hide();
                }
            });
        }

        show(message = null) {
            console.log('LoaderSystem: Showing loader with message:', message);
            
            // Clear any existing timeouts
            this.clearTimeouts();

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
                console.log('LoaderSystem: Making loader visible');
                this.loader.classList.remove('hidden');
                this.loader.style.display = 'flex';
                document.body.classList.add('SC1-loading');
            } else {
                console.error('LoaderSystem: Loader element not found when trying to show');
            }

            // Reset safety timeout
            this.setupSafetyTimeout();
        }

        hide() {
            if (!this.isLoading) {
                console.log('LoaderSystem: Not currently loading, skipping hide');
                return;
            }

            const elapsed = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minimumDisplayTime - elapsed);
            
            console.log(`LoaderSystem: Hiding in ${remainingTime}ms (elapsed: ${elapsed}ms)`);

            // Clear any pending hide timeout
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
            }

            this.hideTimeout = setTimeout(() => {
                this.executeHide();
            }, remainingTime);
        }

        executeHide() {
            if (!this.isLoading) {
                console.log('LoaderSystem: Already hidden, skipping execution');
                return;
            }

            console.log('LoaderSystem: Executing hide operation');
            
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
            this.clearTimeouts();
            
            console.log('LoaderSystem: Hidden successfully');
        }

        clearTimeouts() {
            if (this.safetyTimeout) {
                clearTimeout(this.safetyTimeout);
                this.safetyTimeout = null;
            }
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null;
            }
        }

        // Show loader with different states
        showPreparing() {
            console.log('LoaderSystem: showPreparing called');
            // Use fallback message if translate is not available yet
            const message = window.translate ? translate('SC1.loader.preparing') : 'Preparing your spiritual journey...';
            this.show(message);
        }

        showAlmostReady() {
            const message = window.translate ? translate('SC1.loader.almostReady') : 'Almost ready...';
            this.show(message);
        }

        // Force hide (for emergency cases)
        forceHide() {
            console.log('LoaderSystem: Force hiding loader');
            this.clearTimeouts();
            this.executeHide();
        }

        // Check if currently loading
        get isLoadingState() {
            return this.isLoading;
        }
    }

    // Create global instance immediately
    console.log('LoaderSystem: Creating global instance');
    window.SC1Loader = new LoaderSystem();

    // Make functions available globally
    window.showLoader = function(message) {
        if (window.SC1Loader) {
            return window.SC1Loader.show(message);
        }
        console.error('showLoader: SC1Loader not available');
    };

    window.hideLoader = function() {
        if (window.SC1Loader) {
            return window.SC1Loader.hide();
        }
        console.error('hideLoader: SC1Loader not available');
    };

    window.forceHideLoader = function() {
        if (window.SC1Loader) {
            return window.SC1Loader.forceHide();
        }
        console.error('forceHideLoader: SC1Loader not available');
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

    // Auto-show loader immediately if page is still loading
    if (document.readyState === 'loading') {
        console.log('LoaderSystem: Page still loading, showing loader immediately');
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            if (window.SC1Loader && !window.SC1Loader.isLoadingState) {
                window.SC1Loader.showPreparing();
            }
        }, 100);
    }
}