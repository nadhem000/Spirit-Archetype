// notifications.js - Custom notification system
class NotificationSystem {
    constructor() {
        this.container = null;
        this.setupContainer();
    }

    setupContainer() {
        // Create notification container if it doesn't exist
        this.container = document.getElementById('SC1-notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'SC1-notification-container';
            this.container.className = 'SC1-notification-container';
            document.body.appendChild(this.container);
        }
    }

    

    show(options) {
        const {
            type = 'info',
            message = '',
            duration = 4000,
            icon = true
        } = options;

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `SC1-notification ${type}`;
        
        // Set icon based on type
        let iconChar = 'ℹ️';
        switch (type) {
            case 'success': iconChar = '✅'; break;
            case 'error': iconChar = '❌'; break;
            case 'warning': iconChar = '⚠️'; break;
            case 'info': iconChar = 'ℹ️'; break;
        }

        notification.innerHTML = `
            ${icon ? `<span class="SC1-notification-icon">${iconChar}</span>` : ''}
            <span class="SC1-notification-message">${message}</span>
        `;

        // Add to container
        this.container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove after duration
        const removeNotification = () => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };

        // Click to dismiss
        notification.addEventListener('click', removeNotification);

        // Auto dismiss after duration
        if (duration > 0) {
            setTimeout(removeNotification, duration);
        }

        return {
            dismiss: removeNotification,
            element: notification
        };
    }

    // Convenience methods
    success(message, duration = 4000) {
        return this.show({ type: 'success', message, duration });
    }

    error(message, duration = 5000) {
        return this.show({ type: 'error', message, duration });
    }

    warning(message, duration = 5000) {
        return this.show({ type: 'warning', message, duration });
    }

    info(message, duration = 3000) {
        return this.show({ type: 'info', message, duration });
    }
}

// Create global instance
window.SC1Notification = new NotificationSystem();

// Make it available globally
window.showNotification = function(options) {
    return window.SC1Notification.show(options);
};

window.showSuccess = function(message, duration) {
    return window.SC1Notification.success(message, duration);
};

window.showError = function(message, duration) {
    return window.SC1Notification.error(message, duration);
};

window.showWarning = function(message, duration) {
    return window.SC1Notification.warning(message, duration);
};

window.showInfo = function(message, duration) {
    return window.SC1Notification.info(message, duration);
};