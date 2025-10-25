// Side Panel functionality for Spiritual Guide Test
class SidePanel {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProgress();
        this.setupLanguage();
        
        // Request initial app state
        this.requestAppState();
        
        // Set up periodic updates
        setInterval(() => this.requestAppState(), 5000);
    }

    setupEventListeners() {
        // Quick action buttons
        document.getElementById('sp-start-test').addEventListener('click', () => {
            this.sendMessageToMainApp({ type: 'NAVIGATE', destination: 'welcome' });
        });

        document.getElementById('sp-view-results').addEventListener('click', () => {
            this.sendMessageToMainApp({ type: 'NAVIGATE', destination: 'results' });
        });

        document.getElementById('sp-open-settings').addEventListener('click', () => {
            this.sendMessageToMainApp({ type: 'NAVIGATE', destination: 'settings' });
        });

        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.sendMessageToMainApp({ type: 'CHANGE_LANGUAGE', language: lang });
                this.setActiveLanguage(lang);
            });
        });
    }

    sendMessageToMainApp(message) {
        // In Edge Side Panel, we can use window.opener for communication
        if (window.opener) {
            window.opener.postMessage(message, '*');
        } else {
            console.log('Side panel: Could not send message to main app');
        }
    }

    requestAppState() {
        this.sendMessageToMainApp({ type: 'GET_APP_STATE' });
    }

    loadProgress() {
        // This would typically be updated by messages from the main app
        // For now, we'll use a placeholder
        this.updateProgress(0, 0);
    }

    updateProgress(answered, total) {
        const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
        
        document.getElementById('progress-percentage').textContent = `${percentage}%`;
        document.getElementById('answered-questions').textContent = `${answered}/${total}`;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
    }

    setupLanguage() {
        // Set initial active language based on URL parameter or default
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang') || 'en';
        this.setActiveLanguage(lang);
    }

    setActiveLanguage(language) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === language) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update page direction
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
    }

    // Handle messages from main app
    handleMainAppMessage(message) {
        console.log('Side panel received message:', message);
        
        switch (message.type) {
            case 'APP_STATE_UPDATE':
                this.handleAppStateUpdate(message.state);
                break;
            case 'TEST_PROGRESS_UPDATE':
                this.updateProgress(message.answered, message.total);
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    handleAppStateUpdate(state) {
        if (state.testProgress) {
            this.updateProgress(
                state.testProgress.answeredQuestions,
                state.testProgress.totalQuestions
            );
        }
        
        if (state.language) {
            this.setActiveLanguage(state.language);
        }
    }
}

// Initialize side panel when loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sidePanel = new SidePanel();
    
    // Listen for messages from main app
    window.addEventListener('message', (event) => {
        if (window.sidePanel && typeof window.sidePanel.handleMainAppMessage === 'function') {
            window.sidePanel.handleMainAppMessage(event.data);
        }
    });
});