// Main Application Logic - Spiritual Guide Test (Simplified)
// Global variables
window.STORAGE_KEYS = {
    LANGUAGE: 'spiritual-guide-language',
    ANSWERS: 'spiritual-guide-answers', 
    CURRENT_QUESTION: 'spiritual-guide-current-question',
    SAVED_RESULTS: 'spiritual-guide-saved-results'
};

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
window.initializeAppUI = initializeAppUI; // NEW: Added this line

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

// Application state
let currentLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let scores = { A: 0, B: 0, C: 0, D: 0 };

// NEW: Function to initialize app UI (replaces duplicate code)
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

// Handle shared music files
function handleSharedMusic() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedMusic = urlParams.get('sharedMusic');
    
    if (sharedMusic && window.musicPlayer) {
        window.musicPlayer.handleSharedMusic(sharedMusic);
        
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}



// === Enhanced Login Functionality ===
let currentUser = null;

// Login functionality
function initializeLogin() {
    const loginForm = document.querySelector('.SC1-login-form');
    const usernameInput = document.getElementById('SC1-username');
    const passwordInput = document.getElementById('SC1-password');
    const loginButton = document.getElementById('SC1-login-btn');
    
    if (!loginForm) return;

    async function handleLogin(event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            showError(translate('SC1.login.error.fillFields'));
            return;
        }

        // Show loading state
        const originalText = loginButton.textContent;
        loginButton.disabled = true;
        loginButton.textContent = translate('SC1.login.loggingIn');

        try {
            // Get user from Supabase - ENHANCED SECURITY
            const { data: user, error } = await supabaseClient
                .from('general_users')
                .select('id, username, email, hashed_password, inscription_date, profile')
                .eq('username', username)
                .single();

            if (error) {
                console.error('Supabase error:', error);
                if (error.code === 'PGRST116') {
                    showError(translate('SC1.login.error.invalidCredentials'));
                } else {
                    showError(translate('SC1.login.error.generic') + ': ' + error.message);
                }
                return;
            }

            // If user exists, verify password using your encryption
            if (user && user.hashed_password) {
                try {
                    const decryptedPassword = await EncryptionUtils.decrypt(user.hashed_password);
                    
                    // Compare decrypted password with user input
                    if (password === decryptedPassword) {
                        // SUCCESS: User authenticated
                        currentUser = {
                            username: user.username,
                            email: user.email,
                            id: user.id,
                            joinDate: user.inscription_date
                        };
                        
                        showSuccess(translate('SC1.login.success'));
                        updateUIAfterLogin();
                        
                        // Store minimal session info
                        localStorage.setItem('currentUser', JSON.stringify({
                            username: user.username,
                            loginTime: new Date().toISOString(),
                            userId: user.id,
                            sessionId: 'spiritual_session_' + Date.now()
                        }));
                        
                    } else {
                        showError(translate('SC1.login.error.invalidCredentials'));
                    }
                } catch (decryptError) {
                    console.error('Password decryption failed:', decryptError);
                    showError(translate('SC1.login.error.generic'));
                }
            } else {
                showError(translate('SC1.login.error.invalidCredentials'));
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(translate('SC1.login.error.generic'));
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = originalText;
        }
    }

    function updateUIAfterLogin() {
        // Hide login form and show user info
        const loginForm = document.querySelector('.SC1-login-form');
        if (loginForm) {
            loginForm.style.display = 'none';
        }
        
        // Create user info display
        const userInfoElement = document.createElement('div');
        userInfoElement.className = 'SC1-user-info';
        userInfoElement.innerHTML = `
            <span>${translate('SC1.login.welcome')}, ${currentUser.username}!</span>
            <button class="SC1-logout-btn" id="SC1-logout-btn">${translate('SC1.login.logout')}</button>
        `;
        
        const headerControls = document.querySelector('.SC1-header-controls');
        // Remove existing user info if any
        const existingUserInfo = headerControls.querySelector('.SC1-user-info');
        if (existingUserInfo) {
            existingUserInfo.remove();
        }
        headerControls.appendChild(userInfoElement);
        
        // Add logout event listener
        document.getElementById('SC1-logout-btn').addEventListener('click', logout);
    }

    function logout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Show login form again
        const loginForm = document.querySelector('.SC1-login-form');
        if (loginForm) {
            loginForm.style.display = 'block';
        }
        
        // Remove user info
        const userInfoElement = document.querySelector('.SC1-user-info');
        if (userInfoElement) {
            userInfoElement.remove();
        }
        
        showSuccess(translate('SC1.login.loggedOut'));
    }

    function checkExistingLogin() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                currentUser = {
                    username: userData.username,
                    id: userData.userId
                };
                updateUIAfterLogin();
            } catch (error) {
                console.log('Error restoring session:', error);
                localStorage.removeItem('currentUser');
            }
        }
    }

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    
    // Check for existing login on page load
    checkExistingLogin();
}

// Make login functions available globally
window.initializeLogin = initializeLogin;

// Test function to check database connection
async function testDatabaseConnection() {
    try {
        console.log('Testing database connection...');
        const { data, error } = await supabaseClient
            .from('general_users')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error('Database connection failed:', error);
        } else {
            console.log('Database connection successful!');
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Security verification for Phase 3
function verifySecuritySetup() {
    console.log('🔒 Phase 3 Security Verification:');
    console.log('- HTTPS Protocol:', window.location.protocol === 'https:');
    console.log('- Supabase Connected:', !!supabaseClient);
    console.log('- Encryption Available:', !!EncryptionUtils);
    console.log('- Service Worker:', 'serviceWorker' in navigator);
    
    // Test encryption/decryption briefly
    if (EncryptionUtils) {
        EncryptionUtils.encrypt('test')
            .then(encrypted => {
                console.log('- Encryption Working: ✅');
                return EncryptionUtils.decrypt(encrypted);
            })
            .then(decrypted => {
                console.log('- Decryption Working: ✅');
            })
            .catch(error => {
                console.log('- Encryption Test Failed:', error);
            });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize settings modal first
    initializeSettingsModal();
    
    // Initialize login functionality
    initializeLogin();
    
    // Initialize header icon functionality
    initializeHeaderIcon();
    
    // Initialize navigation and language
    initializeNavigation();
    initializeLanguageButtons();
    
    // Use our new function to initialize everything
    initializeAppUI();
    
    // Initialize music player and playlist modal
    window.musicPlayer = new MusicPlayer();
    window.playlistModal = new PlaylistModal(window.musicPlayer);
    
    // Load saved playlist if available
    window.playlistModal.loadPlaylist();
  testDatabaseConnection();
    verifySecuritySetup();
    
    // Handle shared music
    setTimeout(() => {
        handleSharedMusic();
    }, 1000);
});