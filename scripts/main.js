// Main Application Logic - Spiritual Guide Test (Simplified)
// Global variables
// Loader element
window.SC1Loader = null;
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
window.initializeAppUI = initializeAppUI;

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

// Track initialization state to prevent duplicates
let isInitializing = false;
let initializationComplete = false;

// Function to initialize app UI
function initializeAppUI() {
    if (initializationComplete) {
        console.log('App already initialized, skipping');
        return;
    }
    
    console.log('Initializing app UI...');
    updatePageDirection();
    applyTranslations();
    resumeTestFromSavedState();
    updateProgressBar();
    updateNavButtons();
    
    // Mark initialization as complete
    initializationComplete = true;
    
    // Hide loader after a short delay to ensure everything is ready
    setTimeout(() => {
        if (window.SC1Loader) {
            console.log('Hiding loader - initialization complete');
            window.SC1Loader.hide();
        }
    }, 600);
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

// SINGLE DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    if (isInitializing) {
        console.log('Initialization already in progress, skipping');
        return;
    }
    
    isInitializing = true;
    console.log('DOM Content Loaded - Starting initialization');
    
    // Show loader immediately
    if (window.SC1Loader) {
        window.SC1Loader.showPreparing();
    }

    // Initialize core functionality
    initializeSettingsModal();
    initializeHeaderIcon();
    initializeNavigation();
    initializeLanguageButtons();
    
    // Initialize the main UI
    initializeAppUI();

    // Final safety net - force hide loader after 4 seconds
    setTimeout(() => {
        if (window.SC1Loader && window.SC1Loader.isLoadingState) {
            console.log('Final safety net - forcing loader hide');
            window.SC1Loader.forceHide();
        }
    }, 4000);
});