// Storage Management - Spiritual Guide Test PWA (Cleaned)
// Use the global STORAGE_KEYS from main.js
const STORAGE_KEYS = window.STORAGE_KEYS || {
    LANGUAGE: 'spiritual-guide-language',
    ANSWERS: 'spiritual-guide-answers',
    CURRENT_QUESTION: 'spiritual-guide-current-question',
    SAVED_RESULTS: 'spiritual-guide-saved-results'
};

// Save data to localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
		} catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
	}
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
	}
}

// Save user preferences
function saveUserPreferences() {
    saveToStorage(STORAGE_KEYS.LANGUAGE, currentLanguage);
}

// Save test progress
function saveTestProgress() {
    saveToStorage(STORAGE_KEYS.ANSWERS, window.userAnswers);
    saveToStorage(STORAGE_KEYS.CURRENT_QUESTION, window.currentQuestionIndex);
    
    // PHASE 4 STEP 5: Also save to Supabase if user is logged in
    saveUserDataToSupabase();
}

// Load user preferences
function loadUserPreferences() {
    const savedLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
    return { savedLanguage };
}

// Load test progress
function loadTestProgress() {
    const savedAnswers = loadFromStorage(STORAGE_KEYS.ANSWERS, Array(questions.length).fill(null));
    const savedQuestionIndex = loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION, 0);
    return { savedAnswers, savedQuestionIndex };
}

// Resume test from saved state
function resumeTestFromSavedState() {
    const { savedAnswers, savedQuestionIndex } = loadTestProgress();
    const hasSavedProgress = savedAnswers.some(answer => answer !== null);
    
    if (hasSavedProgress) {
        window.userAnswers = savedAnswers;
        window.currentQuestionIndex = savedQuestionIndex;
        
        // Check if all questions are answered (test completed)
        const allQuestionsAnswered = window.userAnswers.every(answer => answer !== null);
        
        if (allQuestionsAnswered) {
            // Test was completed - show results
            welcomeCard.classList.remove('SC1-active');
            questionCard.classList.remove('SC1-active');
            resultCard.classList.add('SC1-active');
            displayResult();
        } 
        // If we're in the middle of the test
        else if (window.currentQuestionIndex < questions.length) {
            welcomeCard.classList.remove('SC1-active');
            resultCard.classList.remove('SC1-active');
            questionCard.classList.add('SC1-active');
            displayQuestion(window.currentQuestionIndex);
        }
        // If we're at the end but haven't completed all questions
        else if (window.currentQuestionIndex >= questions.length && hasSavedProgress) {
            // This handles edge cases - show the last question
            welcomeCard.classList.remove('SC1-active');
            resultCard.classList.remove('SC1-active');
            questionCard.classList.add('SC1-active');
            // Make sure we don't go beyond the last question
            window.currentQuestionIndex = Math.min(window.currentQuestionIndex, questions.length - 1);
            displayQuestion(window.currentQuestionIndex);
        }
    }
}

// Generate a unique ID for saved results
function generateResultId() {
    return 'result_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Save current results to saved results storage
function saveCurrentResults() {
    // Show immediate feedback to user
    const originalText = saveResultsBtn.textContent;
    saveResultsBtn.textContent = translate('SC1.results.saveButton') + '...';
    saveResultsBtn.disabled = true;
    
    // Use setTimeout to break up the work and prevent blocking
    setTimeout(() => {
        try {
            const resultPattern = calculateResult();
            const resultId = generateResultId();
            
            // Get translations more efficiently
            const resultTranslations = getCurrentTranslationObject().SC1.results[resultPattern];
            
            const resultData = {
                id: resultId,
                date: new Date().toISOString(),
                dominantPattern: resultPattern,
                scores: {...scores},
                userAnswers: [...userAnswers],
                resultDetails: {
                    guide: resultTranslations.guide,
                    title: resultTranslations.title,
                    symbolicMeaning: resultTranslations.symbolicMeaning,
                    coreChallenge: resultTranslations.coreChallenge,
                    mission90Days: resultTranslations.mission90Days,
                    kpi: resultTranslations.kpi,
                    allianceTip: resultTranslations.allianceTip
                }
            };
            
            // Load existing saved results
            const existingResults = loadFromStorage(STORAGE_KEYS.SAVED_RESULTS, []);
            
            // Add new result
            existingResults.push(resultData);
            
            // Save back to storage
            const saved = saveToStorage(STORAGE_KEYS.SAVED_RESULTS, existingResults);
            
            // PHASE 4 STEP 5: Save to Supabase user profile if logged in
            saveUserDataToSupabase();
            
            // Show result using notification system
            if (saved) {
                showSuccess(translate('SC1.results.saveSuccess'));
            } else {
                showError(translate('SC1.results.saveError'));
            }
        } catch (error) {
            console.error('Error saving results:', error);
            showError(translate('SC1.results.saveError'));
        } finally {
            // Restore button state
            saveResultsBtn.textContent = originalText;
            saveResultsBtn.disabled = false;
        }
    }, 10); // Small delay to allow UI to update
}

// PHASE 4 STEP 5: Save user data to Supabase profile
async function saveUserDataToSupabase() {
    try {
        const session = SessionManager.getCurrentSession();
        if (!session || !session.id) {
            console.log('No user logged in - skipping Supabase save');
            return;
        }
        
        console.log('Saving user data to Supabase for user:', session.username);
        
        // Collect all user data from local storage
        const userData = {
            // Test progress
            currentQuestionIndex: loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION, 0),
            userAnswers: loadFromStorage(STORAGE_KEYS.ANSWERS, Array(questions.length).fill(null)),
            
            // Saved results
            savedResults: loadFromStorage(STORAGE_KEYS.SAVED_RESULTS, []),
            
            // User preferences
            language: loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en'),
            
            // Music preferences (if you have them)
            musicPlaylist: loadFromStorage('SC1-music-playlist', null),
            
            // Timestamp
            lastSaved: new Date().toISOString(),
            appVersion: 'spiritual-guide-v2.8.7'
        };
        
        // Save to Supabase
        const { data, error } = await supabaseClient
            .from('auth_users')
            .update({ 
                user_data: userData,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.id);
            
        if (error) {
            console.error('Error saving user data to Supabase:', error);
        } else {
            console.log('User data successfully saved to Supabase');
        }
        
    } catch (error) {
        console.error('Error in saveUserDataToSupabase:', error);
    }
}

// Load all saved results
function loadSavedResults() {
    return loadFromStorage(STORAGE_KEYS.SAVED_RESULTS, []);
}

// Get a specific saved result by ID
function getSavedResultById(resultId) {
    const allResults = loadSavedResults();
    return allResults.find(result => result.id === resultId);
}

// Delete a saved result by ID
function deleteSavedResult(resultId) {
    const allResults = loadSavedResults();
    const filteredResults = allResults.filter(result => result.id !== resultId);
    return saveToStorage(STORAGE_KEYS.SAVED_RESULTS, filteredResults);
}

// Make functions global
window.saveCurrentResults = saveCurrentResults;
window.loadSavedResults = loadSavedResults;
window.getSavedResultById = getSavedResultById;
window.deleteSavedResult = deleteSavedResult;
window.saveUserDataToSupabase = saveUserDataToSupabase;