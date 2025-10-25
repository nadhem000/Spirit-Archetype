// Widgets functionality for Spiritual Guide PWA
// Separate file to handle widget-related functionality

class SpiritualGuideWidgets {
    constructor() {
        this.widgetData = null;
        this.isWidgetSupported = 'serviceWorker' in navigator && 'widgets' in navigator;
        this.init();
    }

    async init() {
        if (!this.isWidgetSupported) {
            console.log('Widgets API not supported in this browser');
            return;
        }

        try {
            // Register widget update handler
            navigator.widgets.addEventListener('widgetinstall', (event) => {
                console.log('Widget installed:', event);
                this.onWidgetInstall(event);
            });

            navigator.widgets.addEventListener('widgetuninstall', (event) => {
                console.log('Widget uninstalled:', event);
                this.onWidgetUninstall(event);
            });

            navigator.widgets.addEventListener('widgetclick', (event) => {
                console.log('Widget clicked:', event);
                this.onWidgetClick(event);
            });

            // Initial widget data update
            await this.updateWidgetData();

            // Listen for test completion to update widgets
            this.listenForTestCompletion();

        } catch (error) {
            console.error('Error initializing widgets:', error);
        }
    }

    // Listen for test completion events
    listenForTestCompletion() {
        // Custom event when test is completed
        document.addEventListener('testCompleted', (event) => {
            this.updateWidgetData();
        });

        // Also listen for storage changes (test results)
        window.addEventListener('storage', (event) => {
            if (event.key === 'spiritual-guide-answers') {
                this.updateWidgetData();
            }
        });
    }

    // Update widget data with current state
    async updateWidgetData() {
        if (!this.isWidgetSupported) return;

        try {
            const savedAnswers = JSON.parse(localStorage.getItem('spiritual-guide-answers') || '[]');
            const currentLanguage = localStorage.getItem('spiritual-guide-language') || 'en';
            const hasCompletedTest = savedAnswers.some(answer => answer !== null);

            this.widgetData = {
                lastUpdated: new Date().toISOString(),
                hasCompletedTest: hasCompletedTest,
                currentLanguage: currentLanguage,
                testProgress: this.calculateTestProgress(savedAnswers)
            };

            if (hasCompletedTest) {
                const resultPattern = this.calculateResult(savedAnswers);
                const result = window.results?.[resultPattern];
                if (result) {
                    this.widgetData.result = {
                        guide: currentLanguage === 'en' ? result.guide_en : result.guide_ar,
                        title: currentLanguage === 'en' ? result.title_en : result.title_ar,
                        pattern: resultPattern
                    };
                }
            }

            // Update all installed widgets
            await this.updateInstalledWidgets();

        } catch (error) {
            console.error('Error updating widget data:', error);
        }
    }

    // Calculate test progress
    calculateTestProgress(answers) {
        const totalQuestions = window.questions?.length || 8;
        const answeredQuestions = answers.filter(answer => answer !== null).length;
        return {
            answered: answeredQuestions,
            total: totalQuestions,
            percentage: Math.round((answeredQuestions / totalQuestions) * 100)
        };
    }

    // Calculate result from answers (similar to main calculation)
    calculateResult(answers) {
        const scores = { A: 0, B: 0, C: 0, D: 0 };
        
        answers.forEach(answer => {
            if (answer && scores.hasOwnProperty(answer)) {
                scores[answer] += 1;
            }
        });

        let dominantPattern = 'A';
        let maxScore = scores.A;
        
        for (const pattern in scores) {
            if (scores[pattern] > maxScore) {
                maxScore = scores[pattern];
                dominantPattern = pattern;
            }
        }
        
        return dominantPattern;
    }

    // Update all installed widgets
    async updateInstalledWidgets() {
        try {
            const registrations = await navigator.widgets.getRegistrations();
            
            for (const registration of registrations) {
                await registration.update({
                    data: this.widgetData,
                    template: this.getWidgetTemplate()
                });
            }
            
            console.log('Widgets updated successfully');
        } catch (error) {
            console.error('Error updating widgets:', error);
        }
    }

    // Get widget template based on current data
    getWidgetTemplate() {
        const data = this.widgetData;
        
        if (data.hasCompletedTest && data.result) {
            return `
                <div class="spiritual-widget completed">
                    <div class="widget-header">
                        <h3>${data.result.guide}</h3>
                        <span class="widget-badge">${data.result.pattern}</span>
                    </div>
                    <div class="widget-content">
                        <p class="widget-title">${data.result.title}</p>
                        <p class="widget-message">Your spiritual guide is ready</p>
                    </div>
                    <div class="widget-actions">
                        <button onclick="widgets.openApp('#results')">View Details</button>
                    </div>
                </div>
            `;
        } else if (data.testProgress.answered > 0) {
            return `
                <div class="spiritual-widget in-progress">
                    <div class="widget-header">
                        <h3>Spiritual Guide</h3>
                        <span class="widget-progress">${data.testProgress.percentage}%</span>
                    </div>
                    <div class="widget-content">
                        <p class="widget-message">Test in progress</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.testProgress.percentage}%"></div>
                        </div>
                    </div>
                    <div class="widget-actions">
                        <button onclick="widgets.openApp()">Continue Test</button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="spiritual-widget default">
                    <div class="widget-header">
                        <h3>Spiritual Guide</h3>
                    </div>
                    <div class="widget-content">
                        <p class="widget-message">Discover your spiritual pattern</p>
                    </div>
                    <div class="widget-actions">
                        <button onclick="widgets.openApp()">Start Test</button>
                    </div>
                </div>
            `;
        }
    }

    // Handle widget installation
    onWidgetInstall(event) {
        console.log('New widget installed:', event.widget);
        this.showNotification('Widget Added', 'Spiritual Guide widget has been added to your home screen');
    }

    // Handle widget uninstallation
    onWidgetUninstall(event) {
        console.log('Widget uninstalled:', event.widget);
    }

    // Handle widget clicks
    onWidgetClick(event) {
        const widget = event.widget;
        const data = widget.data;
        
        if (data.hasCompletedTest) {
            this.openApp('#results');
        } else {
            this.openApp();
        }
    }

    // Open the main app
    openApp(hash = '') {
        const appUrl = window.location.origin + (hash ? `/${hash}` : '');
        
        if (window.clients && window.clients.openWindow) {
            window.clients.openWindow(appUrl);
        } else {
            window.open(appUrl, '_blank');
        }
    }

    // Show notification
    showNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/assets/icons/icon-192x192.png'
            });
        }
    }

    // Manual widget update trigger
    async triggerWidgetUpdate() {
        await this.updateWidgetData();
    }

    // Get widget installation status
    async getWidgetStatus() {
        if (!this.isWidgetSupported) {
            return { supported: false };
        }

        try {
            const registrations = await navigator.widgets.getRegistrations();
            return {
                supported: true,
                installed: registrations.length > 0,
                count: registrations.length
            };
        } catch (error) {
            return { supported: false, error: error.message };
        }
    }
}

// Initialize widgets
const widgets = new SpiritualGuideWidgets();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = widgets;
}