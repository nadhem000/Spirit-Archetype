// loader.js - Simple Loader System for Spiritual Guide
class LoaderSystem {
    constructor() {
        this.loader = null;
        this.isLoading = false;
        this.initializeLoader();
    }

    initializeLoader() {
        // Create loader if it doesn't exist
        if (!document.getElementById('SC1-loader')) {
            const loaderHTML = `
                <div id="SC1-loader" class="SC1-loader">
                    <div class="SC1-loader-spinner"></div>
                    <p>Loading Spiritual Guide...</p>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        }
        this.loader = document.getElementById('SC1-loader');
    }

    show() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        // Show loader and disable interactions
        if (this.loader) {
            this.loader.classList.remove('hidden');
            document.body.classList.add('SC1-loading');
        }
    }

    hide() {
        if (!this.isLoading) return;
        
        if (this.loader) {
            this.loader.classList.add('hidden');
            document.body.classList.remove('SC1-loading');
            // Remove from DOM after animation
            setTimeout(() => {
                if (this.loader && this.loader.parentNode) {
                    this.loader.parentNode.removeChild(this.loader);
                }
            }, 500);
        }
        this.isLoading = false;
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
    }
}

// Create global instance
window.SC1Loader = new LoaderSystem();

// Make functions available globally
window.showLoader = function() {
    return window.SC1Loader.show();
};

window.hideLoader = function() {
    return window.SC1Loader.hide();
};

window.forceHideLoader = function() {
    return window.SC1Loader.forceHide();
};