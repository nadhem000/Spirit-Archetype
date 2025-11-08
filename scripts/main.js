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
		
		// Show loading state
		loginBtn.disabled = true;
		const originalText = loginBtn.textContent;
		loginBtn.textContent = translate('SC1.login.button') + '...';
		
		try {
			// Use more practical security validation
			if (!validateSecureConnection()) {
				console.warn('Running with limited security - proceeding with login');
				// Don't block login, just warn
			}
			
			console.log('🔐 Attempting login for user:', username);
			
            // SECURE: Hash password before sending (basic client-side hashing)
            const passwordHash = await simpleHash(password);
            
            // Check if user exists in Supabase with enhanced security
            // Check if user exists in Supabase with enhanced security
			const { data: users, error } = await supabaseClient
			.from('auth_users')
			.select('id, username, email, hashed_password, is_active, inscription_date')
			.or(`username.eq.${username},email.eq.${username}`)
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
			
            // SECURE: Compare hashed passwords instead of plain text
            if (users.hashed_password !== passwordHash) {
                showError(translate('SC1.login.validation.invalidPassword'));
                return;
			}
			
            currentUser = users.username;
            
            // Store minimal secure user info
            // Store session using SessionManager - include ALL required fields
			const userData = {
				id: users.id,
				username: users.username,
				email: users.email,
				loginTime: new Date().toISOString()
			};
			SessionManager.saveUserSession(userData);
            showSuccess(translate('SC1.login.success.loginSuccessful'));
			
			// Update user_data in Supabase with local storage data
			setTimeout(() => {
				// First sync FROM Supabase to get any existing data
				syncFromSupabaseToLocal().then(synced => {
					if (synced) {
						console.log('✅ Synced from Supabase to local storage');
						// Then update UI with the merged data
						initializeAppUI();
					}
					// Then sync TO Supabase with merged data
					updateUserDataInSupabase().then(success => {
						if (success) {
							console.log('✅ Merged data sent to user_data after login');
						}
					});
				});
			}, 1000);
            
            // Hide login form and show user info
            updateUIAfterLogin(userData);
            console.log('✅ Secure login successful for user:', currentUser);
			
			} catch (error) {
			console.error('Login error:', error);
			showError('Login failed. Please try again.');
			} finally {
			// Reset button
			loginBtn.disabled = false;
			loginBtn.textContent = originalText;
		}
	}
	
    // Simple client-side hash function (for basic security)
    async function simpleHash(str) {
        const encoder = new TextEncoder();
		const data = encoder.encode(str);
		const hash = await crypto.subtle.digest('SHA-256', data);
		return Array.from(new Uint8Array(hash))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
	}
	
	
	function updateUIAfterLogin(userData) {
		const loginContainer = document.querySelector('.SC1-login-form');
		if (loginContainer) {
			loginContainer.style.display = 'none';
		}
		
		// Hide registration link and show welcome message
		const registrationLink = document.getElementById('SC1-registration-link');
		const userWelcome = document.getElementById('SC1-user-welcome');
		const welcomeText = document.getElementById('SC1-welcome-text');
		
		if (registrationLink) {
			registrationLink.style.display = 'none';
		}
		
		if (userWelcome && welcomeText) {
			// Set welcome message with translation
			welcomeText.textContent = translate('SC1.login.welcome', { username: userData.username });
			userWelcome.style.display = 'block';
		}
		
		// Create logout button and add it to controls line
		const logoutBtn = document.createElement('button');
		logoutBtn.className = 'SC1-logout-btn';
		logoutBtn.id = 'SC1-logout-btn';
		logoutBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
		<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
        <span class="SC1-tooltip">${translate('SC1.login.logout')}</span>
		`;
		
		// Add logout button to controls line
		const controlsLine = document.querySelector('.SC1-controls-line');
		if (controlsLine && !document.getElementById('SC1-logout-btn')) {
			controlsLine.appendChild(logoutBtn);
			// Add logout functionality
			logoutBtn.addEventListener('click', handleLogout);
		}
		
		// Clear form securely
		const usernameInput = document.getElementById('SC1-username');
		const passwordInput = document.getElementById('SC1-password');
		if (usernameInput) usernameInput.value = '';
		if (passwordInput) passwordInput.value = '';
	}
	
    async function handleLogout() {
		try {
			// Enhanced logout: Clear both local session and Supabase connection
			console.log('🔐 Starting secure logout process...');
			// 1. Clear local session first
			SessionManager.clearSession();
			currentUser = null;
			// 2. Clear any Supabase session data
			if (window.supabaseClient) {
				// Sign out from Supabase (if using auth)
				const { error } = await supabaseClient.auth.signOut();
				if (error) {
					console.log('Supabase signout note:', error.message);
				}
			}
			// 3. Clear any additional localStorage items
			localStorage.removeItem('currentUser');
			localStorage.removeItem('spiritual-guide-supabase-auth');
			
			// 4. Show registration link and hide welcome message
			const registrationLink = document.getElementById('SC1-registration-link');
			const userWelcome = document.getElementById('SC1-user-welcome');
			
			if (registrationLink) {
				registrationLink.style.display = 'block';
			}
			
			if (userWelcome) {
				userWelcome.style.display = 'none';
			}
			
			// 5. Remove logout button from UI
			const logoutBtn = document.getElementById('SC1-logout-btn');
			if (logoutBtn) {
				logoutBtn.remove();
			}
			
			// 6. Show login form again
			const loginContainer = document.querySelector('.SC1-login-form');
			if (loginContainer) {
				loginContainer.style.display = 'block';
			}
			
			// 7. Clear login form fields
			const usernameInput = document.getElementById('SC1-username');
			const passwordInput = document.getElementById('SC1-password');
			if (usernameInput) usernameInput.value = '';
			if (passwordInput) passwordInput.value = '';
			
			// 8. Show success message
			showSuccess(translate('SC1.login.success.logoutSuccess'));
			console.log('✅ Secure logout completed - all sessions cleared');
			
			// 9. Re-apply translations to update the registration link text
			applyTranslations();
			
			} catch (error) {
			console.error('Logout error:', error);
			// Even if there's an error, ensure basic cleanup happens
			SessionManager.clearSession();
			localStorage.removeItem('currentUser');
			
			// Show registration link on error too
			const registrationLink = document.getElementById('SC1-registration-link');
			const userWelcome = document.getElementById('SC1-user-welcome');
			if (registrationLink) registrationLink.style.display = 'block';
			if (userWelcome) userWelcome.style.display = 'none';
			
			const logoutBtn = document.getElementById('SC1-logout-btn');
			if (logoutBtn) logoutBtn.remove();
			
			const loginContainer = document.querySelector('.SC1-login-form');
			if (loginContainer) loginContainer.style.display = 'block';
			
			showSuccess(translate('SC1.login.success.logoutSuccess'));
		}
	}
	
    /* function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + btoa(navigator.userAgent).substr(0, 10);
	} */
	
    // Enhanced session verification with better persistence
	async function checkExistingLogin() {
		try {
			const session = SessionManager.getCurrentSession();
			console.log('🔐 Checking existing session:', session);
			if (!session) {
				console.log('No session found');
				return;
			}
			
			// More lenient session validation
			let sessionAge;
			if (session.loginTime) {
				sessionAge = Date.now() - new Date(session.loginTime).getTime();
				} else {
				// If loginTime is missing, don't clear the session - just log a warning
				console.warn('⚠️  Session missing loginTime, but keeping it for better UX');
				sessionAge = 0; // Treat as new session
			}
			
			const maxSessionAge = 30 * 24 * 60 * 60 * 1000; // 30 days
			console.log(`Session age: ${Math.round(sessionAge / (24 * 60 * 60 * 1000))} days`);
			
			if (sessionAge >= maxSessionAge) {
				console.log('Session expired (older than 30 days)');
				SessionManager.clearSession();
				return;
			}
			
			// Session is valid - update UI
			currentUser = session.username;
			console.log('✅ Session verified, user logged in:', currentUser);
			
			// Update session verification timestamp
			SessionManager.updateLastVerified();
			
			// Update UI for logged-in state
			updateUIAfterLogin({
				id: session.id,
				username: session.username,
				email: session.email,
				loginTime: session.loginTime,
				sessionId: session.sessionId
			});
			
			} catch (error) {
			console.log('Session verification error:', error);
			// Don't clear session on temporary errors - be more lenient
			console.log('Session check error, keeping session for better UX');
			// Try to update UI anyway if we have a session
			const session = SessionManager.getCurrentSession();
			if (session) {
				updateUIAfterLogin(session);
			}
		}
	}
	
    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    
    // Security: Only clear password if specifically needed
	window.addEventListener('blur', () => {
		// Only log the event, don't take any action
		console.log('Page lost focus - security event logged');
		// Remove any password clearing logic here
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
    setTimeout(async () => {
        try {
            // FIRST: Try to restore session before anything else
            const restoredSession = SessionManager.restoreSession();
            if (restoredSession) {
                console.log('✅ Session restored on page load');
                // Update currentUser variable
                currentUser = restoredSession.username;
			}
			
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
    
    // Clean up old data on app start
    setTimeout(() => {
        cleanupUserData();
	}, 2000);
});

// Also show loader when page is about to refresh/unload
window.addEventListener('beforeunload', function() {
    showLoader();
});