// Main Application Logic - Spiritual Guide Test (Simplified)
// Global variables
window.STORAGE_KEYS = {
    LANGUAGE: 'spiritual-guide-language',
    ANSWERS: 'spiritual-guide-answers', 
    CURRENT_QUESTION: 'spiritual-guide-current-question',
    SAVED_RESULTS: 'spiritual-guide-saved-results'
};
// Loader system
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.forceHideLoader = forceHideLoader;

// Make functions global so they can be accessed across files
window.initializeNavigation = initializeNavigation;
window.initializeLanguageButtons = initializeLanguageButtons;
window.applyTranslations = applyTranslations;
window.updatePageDirection = updatePageDirection;
window.resumeTestFromSavedState = resumeTestFromSavedState;
window.updateProgressBar = updateProgressBar;
window.updateNavButtons = updateNavButtons;
window.displayQuestion = displayQuestion;
window.displayResult = displayResult;
window.calculateResult = calculateResult;
window.saveTestProgress = saveTestProgress;
window.translate = translate;
window.initializeAppUI = initializeAppUI;
// Loader functions
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.forceHideLoader = forceHideLoader;

// Global element assignments
window.headerIcon = document.getElementById('SC1-header-icon');
window.welcomeCard = document.getElementById('SC1-welcome-card');
window.questionCard = document.getElementById('SC1-question-card');
window.resultCard = document.getElementById('SC1-result-card');
window.startBtn = document.getElementById('SC1-start-btn');
window.settingsBtn = document.getElementById('SC1-settings-btn');
window.prevBtn = document.getElementById('SC1-prev-btn');
window.nextBtn = document.getElementById('SC1-next-btn');
window.restartBtn = document.getElementById('SC1-restart-btn');
window.currentQuestionElement = document.getElementById('SC1-current-question');
window.questionTextElement = document.getElementById('SC1-question-text');
window.optionsContainer = document.getElementById('SC1-options-container');
window.progressElement = document.getElementById('SC1-progress');
window.langButtons = document.querySelectorAll('.SC1-lang-btn');
window.resultGuideElement = document.getElementById('SC1-result-guide');
window.symbolicMeaningElement = document.getElementById('SC1-symbolic-meaning');
window.coreChallengeElement = document.getElementById('SC1-core-challenge');
window.mission90DaysElement = document.getElementById('SC1-mission-90-days');
window.kpiElement = document.getElementById('SC1-kpi');
window.allianceTipElement = document.getElementById('SC1-alliance-tip');
window.saveResultsBtn = document.getElementById('SC1-save-results-btn');
// image elements
window.animalImage = document.getElementById('SC1-animal-image');
window.guideImage = document.getElementById('SC1-guide-image');

// Application state
let currentLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let scores = { A: 0, B: 0, C: 0, D: 0 };

// ===== ENHANCED SECURE LOGIN FUNCTIONALITY =====
function initializeLogin() {
    const loginForm = document.querySelector('.SC1-login-form');
    const usernameInput = document.getElementById('SC1-username');
    const passwordInput = document.getElementById('SC1-password');
    const loginBtn = document.getElementById('SC1-login-btn');
    const loginContainer = document.getElementById('SC1-login-form-container');
    
    if (!loginForm || !usernameInput || !passwordInput || !loginBtn) {
        console.log('Login elements not found - skipping login initialization');
        return;
    }

    let currentUser = null;

    // Enhanced secure login function
    async function handleLogin(event) {
        event.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!username || !password) {
            showError(translate('SC1.login.validation.fillAllFields'));
            return;
        }
        if (username.length < 3) {
           showError(translate('SC1.login.validation.usernameLength'));
            return;
        }
        if (password.length < 6) {
            showError(translate('SC1.login.validation.passwordLength'));
            return;
        }

        // Show loading state
        loginBtn.disabled = true;
        const originalText = loginBtn.textContent;
        loginBtn.textContent = translate('SC1.login.button') + '...';

        try {
            // Verify secure connection first
            if (!validateSecureConnection()) {
                showError(translate('SC1.login.validation.secureConnection'));
                return;
            }

            console.log('🔐 Attempting secure login for user:', username);
            
            // Check if user exists in Supabase with enhanced security
            const { data: users, error } = await supabaseClient
                .from('auth_users')
                .select('id, username, email, hashed_password, is_active, inscription_date')
                .eq('username', username)
                .eq('is_active', true)
                .single();

            if (error) {
                console.error('Login error:', error);
                if (error.code === 'PGRST116') {
                    showError(translate('SC1.login.validation.usernameNotFound'));
                } else {
                    showError(translate('SC1.login.validation.loginFailed') + ': ' + error.message);
                }
                return;
            }

            // Verify password (in Phase 4 we'll implement proper password hashing)
            // For now, we're comparing plain text (this will be improved in Phase 4)
            if (users.hashed_password !== password) {
                showError(translate('SC1.login.validation.invalidPassword'));
                return;
            }

            currentUser = users.username;
            
            // Store minimal secure user info
            const userData = {
                id: users.id,
                username: users.username,
                email: users.email,
                loginTime: new Date().toISOString(),
                sessionId: generateSessionId()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            showSuccess(translate('SC1.login.success.loginSuccessful'));
            
            // Hide login form and show user info
            updateUIAfterLogin(userData);
            
            console.log('✅ Secure login successful for user:', currentUser);

        } catch (error) {
            console.error('Secure login error:', error);
            showError('Login failed. Please try again.');
        } finally {
            // Reset button
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
        }
    }

    // Update UI after successful login
    function updateUIAfterLogin(userData) {
        const loginContainer = document.querySelector('.SC1-login-form');
        if (loginContainer) {
            loginContainer.style.display = 'none';
        }
        
        // Create user info display
const userInfoDiv = document.createElement('div');
userInfoDiv.className = 'SC1-user-info';
userInfoDiv.innerHTML = `
    <div class="SC1-user-welcome">
        <span>${translate('SC1.login.welcome', { username: userData.username })}</span>
        <button id="SC1-logout-btn" class="SC1-logout-btn">${translate('SC1.login.logout')}</button>
    </div>
`;
        
        // Insert user info after the login form container
        const headerControls = document.querySelector('.SC1-header-controls');
        if (headerControls && !document.getElementById('SC1-logout-btn')) {
            headerControls.appendChild(userInfoDiv);
            
            // Add logout functionality
            document.getElementById('SC1-logout-btn').addEventListener('click', handleLogout);
        }
        
        // Clear form securely
        usernameInput.value = '';
        passwordInput.value = '';
    }

    // Logout function
    function handleLogout() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        
        // Show login form again
        const loginContainer = document.querySelector('.SC1-login-form');
        if (loginContainer) {
            loginContainer.style.display = 'block';
        }
        
        // Remove user info
        const userInfoDiv = document.querySelector('.SC1-user-info');
        if (userInfoDiv) {
            userInfoDiv.remove();
        }
        
        showSuccess(translate('SC1.login.success.logoutSuccess'));
        console.log('✅ User logged out');
    }

    // Generate secure session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + btoa(navigator.userAgent).substr(0, 10);
    }

    // Enhanced login check with security validation
    function checkExistingLogin() {
        try {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                
                // Basic session validation
                const sessionAge = Date.now() - new Date(userData.loginTime).getTime();
                const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
                
                if (sessionAge < maxSessionAge) {
                    currentUser = userData.username;
                    console.log('🔐 User already logged in:', currentUser);
                    updateUIAfterLogin(userData);
                } else {
                    // Session expired
                    localStorage.removeItem('currentUser');
                    console.log('Session expired');
                }
            }
        } catch (error) {
            console.log('No valid existing login found');
            localStorage.removeItem('currentUser');
        }
    }

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    
    // Security: Clear password on page blur
    window.addEventListener('blur', () => {
        if (passwordInput && document.activeElement !== passwordInput) {
            // We don't clear the password here as it might interrupt user experience
            // But we log the event for security monitoring
            console.log('Page lost focus - security event logged');
        }
    });

    // Initialize login check
    checkExistingLogin();
}

// Make the enhanced function available globally
window.initializeLogin = initializeLogin;
// Function to initialize app UI
function initializeAppUI() {
    updatePageDirection();
    applyTranslations();
    resumeTestFromSavedState();
    updateProgressBar();
    updateNavButtons();
}

// reset the test when header icon is clicked
function resetTestFromHeader() {
    // Reset state
    currentQuestionIndex = 0;
    userAnswers = Array(questions.length).fill(null);
    scores = { A: 0, B: 0, C: 0, D: 0 };
    // Clear saved progress
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION);
    // Return to welcome card
    resultCard.classList.remove('SC1-active');
    questionCard.classList.remove('SC1-active');
    welcomeCard.classList.add('SC1-active');
    // Reset progress bar
    updateProgressBar();
    // Apply translations
    applyTranslations();
    // Update navigation buttons
    updateNavButtons();
}

// Settings modal functionality
function initializeSettingsModal() {
    const settingsModal = document.getElementById('SC1-settings-modal');
    const modalClose = document.getElementById('SC1-modal-close');
    // Open modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('SC1-active');
	});
    // Close modal
    modalClose.addEventListener('click', () => {
        settingsModal.classList.remove('SC1-active');
	});
    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('SC1-active');
		}
	});
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.classList.contains('SC1-active')) {
            settingsModal.classList.remove('SC1-active');
		}
	});
}

function initializeHeaderIcon() {
    headerIcon.addEventListener('click', () => {
        resetTestFromHeader();
	});
    // Add hover effect to indicate it's clickable
    headerIcon.style.cursor = 'pointer';
}


// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Show loader immediately when page starts loading
    showLoader();
    
    // Use setTimeout to ensure loader is visible before starting initialization
    setTimeout(() => {
        try {
            // Initialize settings modal first
            initializeSettingsModal();
            
            // Initialize header icon functionality
            initializeHeaderIcon();
            
            // Initialize navigation and language
            initializeNavigation();
            initializeLanguageButtons();
            
            // ENHANCED: Initialize secure login functionality
            initializeLogin();
            
            // Use our new function to initialize everything
            initializeAppUI();
            
            // Hide loader after everything is initialized
            setTimeout(() => {
                hideLoader();
            }, 800);
            
        } catch (error) {
            console.error('Error during initialization:', error);
            // If there's an error, still hide the loader
            forceHideLoader();
        }
    }, 100);
});

// Also show loader when page is about to refresh/unload
window.addEventListener('beforeunload', function() {
    showLoader();
});