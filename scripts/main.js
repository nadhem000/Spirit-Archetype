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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize settings modal first
    initializeSettingsModal();
    
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
    
    // Handle shared music
    setTimeout(() => {
        handleSharedMusic();
    }, 1000);
});