// Edge Side Panel functionality for Spiritual Guide Test PWA
class EdgeSidePanel {
    constructor() {
        this.isSupported = false;
        this.isPanelOpen = false;
        this.init();
    }

    async init() {
        // Check if Edge Side Panel API is supported
        if ('sidePanel' in window && 'getPanel' in window.sidePanel) {
            this.isSupported = true;
            await this.setupSidePanel();
        } else {
            console.log('Edge Side Panel API not supported in this browser');
        }
    }

    async setupSidePanel() {
        try {
            // Get the side panel
            const panel = await window.sidePanel.getPanel();
            
            // Set panel options
            await panel.options({
                enabled: true,
                path: '/side-panel.html',
                name: 'Spiritual Guide'
            });

            // Listen for panel state changes
            panel.onStateChanged.addListener((state) => {
                this.isPanelOpen = state.open;
                console.log('Side panel state changed:', state);
                
                if (state.open) {
                    this.onPanelOpened();
                } else {
                    this.onPanelClosed();
                }
            });

            console.log('Edge Side Panel initialized successfully');
            
            // Add side panel toggle button to UI if not exists
            this.addSidePanelButton();
            
        } catch (error) {
            console.error('Error setting up Edge Side Panel:', error);
        }
    }

    addSidePanelButton() {
        // Check if button already exists
        if (document.getElementById('SC1-side-panel-btn')) {
            return;
        }

        // Create side panel button
        const sidePanelBtn = document.createElement('button');
        sidePanelBtn.id = 'SC1-side-panel-btn';
        sidePanelBtn.className = 'SC1-side-panel-btn';
        sidePanelBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z"/>
            </svg>
            <span>Open Side Panel</span>
        `;

        // Add to controls container
        const controls = document.querySelector('.SC1-controls');
        if (controls) {
            controls.appendChild(sidePanelBtn);
            
            // Add click event listener
            sidePanelBtn.addEventListener('click', () => {
                this.toggleSidePanel();
            });

            // Apply translations
            this.updateSidePanelText();
        }
    }

    async toggleSidePanel() {
        if (!this.isSupported) return;

        try {
            const panel = await window.sidePanel.getPanel();
            
            if (this.isPanelOpen) {
                await panel.close();
            } else {
                await panel.open();
            }
        } catch (error) {
            console.error('Error toggling side panel:', error);
        }
    }

    onPanelOpened() {
        console.log('Side panel opened');
        // Update button text
        this.updateSidePanelText();
        
        // Send current app state to side panel
        this.sendAppStateToPanel();
    }

    onPanelClosed() {
        console.log('Side panel closed');
        // Update button text
        this.updateSidePanelText();
    }

    updateSidePanelText() {
        const btn = document.getElementById('SC1-side-panel-btn');
        if (!btn) return;

        const span = btn.querySelector('span');
        if (span) {
            const currentLanguage = localStorage.getItem('spiritual-guide-language') || 'en';
            if (currentLanguage === 'ar') {
                span.textContent = this.isPanelOpen ? 'إغلاق اللوحة الجانبية' : 'فتح اللوحة الجانبية';
            } else {
                span.textContent = this.isPanelOpen ? 'Close Side Panel' : 'Open Side Panel';
            }
        }
    }

    sendAppStateToPanel() {
        // This would communicate with the side panel content
        // For now, we'll just log it
        const appState = {
            currentView: this.getCurrentView(),
            testProgress: this.getTestProgress(),
            language: localStorage.getItem('spiritual-guide-language') || 'en',
            timestamp: new Date().toISOString()
        };
        
        console.log('Sending app state to side panel:', appState);
        
        // In a real implementation, you'd use postMessage or a similar mechanism
        // to communicate with the side panel iframe/window
    }

    getCurrentView() {
        if (document.getElementById('SC1-welcome-card').classList.contains('SC1-active')) {
            return 'welcome';
        } else if (document.getElementById('SC1-question-card').classList.contains('SC1-active')) {
            return 'questions';
        } else if (document.getElementById('SC1-result-card').classList.contains('SC1-active')) {
            return 'results';
        }
        return 'unknown';
    }

    getTestProgress() {
        const savedAnswers = JSON.parse(localStorage.getItem('spiritual-guide-answers') || '[]');
        const currentQuestion = parseInt(localStorage.getItem('spiritual-guide-current-question') || '0');
        
        const answeredQuestions = savedAnswers.filter(answer => answer !== null).length;
        const totalQuestions = 8; // Assuming 8 questions
        
        return {
            currentQuestion,
            answeredQuestions,
            totalQuestions,
            progressPercentage: Math.round((answeredQuestions / totalQuestions) * 100)
        };
    }

    // Method to handle messages from side panel
    handlePanelMessage(message) {
        console.log('Received message from side panel:', message);
        
        switch (message.type) {
            case 'NAVIGATE':
                this.handleNavigation(message.destination);
                break;
            case 'CHANGE_LANGUAGE':
                this.handleLanguageChange(message.language);
                break;
            case 'GET_APP_STATE':
                this.sendAppStateToPanel();
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    handleNavigation(destination) {
        // Handle navigation requests from side panel
        switch (destination) {
            case 'welcome':
                // Navigate to welcome screen
                document.getElementById('SC1-welcome-card').classList.add('SC1-active');
                document.getElementById('SC1-question-card').classList.remove('SC1-active');
                document.getElementById('SC1-result-card').classList.remove('SC1-active');
                break;
            case 'restart':
                // Restart test
                const restartBtn = document.getElementById('SC1-restart-btn');
                if (restartBtn) restartBtn.click();
                break;
            case 'results':
                // Show results if available
                // You might want to add logic to check if test is completed
                break;
        }
    }

    handleLanguageChange(language) {
        // Change language from side panel
        const langButtons = document.querySelectorAll('.SC1-lang-btn');
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === language) {
                btn.click();
            }
        });
    }
}

// Initialize Edge Side Panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.edgeSidePanel = new EdgeSidePanel();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EdgeSidePanel;
}