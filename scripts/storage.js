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
    saveToStorage(STORAGE_KEYS.ANSWERS, userAnswers);
    saveToStorage(STORAGE_KEYS.CURRENT_QUESTION, currentQuestionIndex);
}

// Load user preferences
function loadUserPreferences() {
    const savedLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
    return { savedLanguage };
}

// Load test progress
function loadTestProgress() {
    let savedAnswers = loadFromStorage(STORAGE_KEYS.ANSWERS, Array(questions.length).fill(null));
    const savedQuestionIndex = loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION, 0);
    
    return { savedAnswers, savedQuestionIndex };
}

// Resume test from saved state
function resumeTestFromSavedState() {
    const { savedAnswers, savedQuestionIndex } = loadTestProgress();
    const hasSavedProgress = savedAnswers.some(answer => answer !== null);
    
    if (hasSavedProgress) {
        userAnswers = savedAnswers;
        currentQuestionIndex = savedQuestionIndex;
        
        // Check if all questions are answered (test completed)
        const allQuestionsAnswered = userAnswers.every(answer => answer !== null);
        
        if (allQuestionsAnswered) {
            // Test was completed - show results
            welcomeCard.classList.remove('SC1-active');
            questionCard.classList.remove('SC1-active');
            resultCard.classList.add('SC1-active');
            displayResult();
        } 
        // If we're in the middle of the test
        else if (currentQuestionIndex < questions.length) {
            welcomeCard.classList.remove('SC1-active');
            resultCard.classList.remove('SC1-active');
            questionCard.classList.add('SC1-active');
            displayQuestion(currentQuestionIndex);
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
            
            // Store essential data
            const resultData = {
                id: resultId,
                date: new Date().toISOString(),
                dominantPattern: resultPattern,
                answerCounts: countAnswers(userAnswers)
            };
            
            // Load existing saved results
            const existingResults = loadFromStorage(STORAGE_KEYS.SAVED_RESULTS, []);
            
            // Add new result
            existingResults.push(resultData);
            
            // Save back to storage
            const saved = saveToStorage(STORAGE_KEYS.SAVED_RESULTS, existingResults);
            
            // Show result using notification system
            if (saved) {
                showSuccess(translate('SC1.results.saveSuccess'));
            } else {
                showError(translate('SC1.results.saveError'));
            }
            
            // Also update user_data in Supabase with the new saved results
            setTimeout(() => {
                updateUserDataInSupabase().then(success => {
                    if (success) {
                        console.log('✅ Saved results merged to user_data');
                    }
                });
            }, 500);
        } catch (error) {
            console.error('Error saving results:', error);
            showError(translate('SC1.results.saveError'));
        } finally {
            // Restore button state
            saveResultsBtn.textContent = originalText;
            saveResultsBtn.disabled = false;
        }
    }, 10);
}

// Helper function to count answers and return compact format
function countAnswers(userAnswers) {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    userAnswers.forEach(answer => {
        if (answer && counts.hasOwnProperty(answer)) {
            counts[answer]++;
		}
	});
    return counts;
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

// Function to update user_data in Supabase with proper merging
async function updateUserDataInSupabase() {
    try {
        // Check if user is logged in
        const currentUser = SessionManager.getCurrentSession();
        if (!currentUser || !currentUser.username) {
            console.log('No user logged in - skipping user_data update');
            return false;
		}
		
        // Get existing user_data from Supabase first
        const { data: existingUser, error: fetchError } = await supabaseClient
		.from('auth_users')
		.select('user_data')
		.eq('username', currentUser.username)
		.single();
		
        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Error fetching existing user_data:', fetchError);
            return false;
		}
		
        // Get current data from local storage
        const currentLocalData = {
			testProgress: {
				// OPTIMIZED: Store only answer counts instead of full array
				answerCounts: countAnswers(loadFromStorage(STORAGE_KEYS.ANSWERS, [])),
				currentQuestion: loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION, 0),
				lastUpdated: new Date().toISOString()
			},
			savedResults: loadFromStorage(STORAGE_KEYS.SAVED_RESULTS, []),
			language: loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en'),
			timestamp: new Date().toISOString()
		};
		
        // Smart merge: Update only what's changed, don't accumulate
        let mergedUserData;
        
        if (existingUser && existingUser.user_data) {
            // Merge existing data with new data intelligently
            mergedUserData = {
                ...existingUser.user_data,
                // Update test progress with latest
                testProgress: currentLocalData.testProgress,
                // For savedResults, only keep unique results (based on id)
                savedResults: mergeSavedResults(
                    existingUser.user_data.savedResults || [],
                    currentLocalData.savedResults
				),
                // Update language and timestamp
                language: currentLocalData.language,
                timestamp: currentLocalData.timestamp
			};
            
            console.log('🔁 Merged user_data with existing data');
			} else {
            // No existing data, use current local data
            mergedUserData = currentLocalData;
            console.log('🆕 Creating new user_data');
		}
		
        console.log('Updating user_data in Supabase for user:', currentUser.username);
        
        // Update user_data in Supabase
        const { data, error } = await supabaseClient
		.from('auth_users')
		.update({ 
			user_data: mergedUserData,
			updated_at: new Date().toISOString()
		})
		.eq('username', currentUser.username);
		
        if (error) {
            console.error('Error updating user_data in Supabase:', error);
            return false;
		}
		
        console.log('✅ User data successfully updated in Supabase');
        return true;
		} catch (error) {
        console.error('Error in updateUserDataInSupabase:', error);
        return false;
	}
}

// Helper function to merge saved results without duplicates
function mergeSavedResults(existingResults, newResults) {
    if (!existingResults || existingResults.length === 0) return newResults;
    if (!newResults || newResults.length === 0) return existingResults;
    
    // Create a map of existing results by ID for quick lookup
    const resultMap = new Map();
    
    // Add all existing results to the map
    existingResults.forEach(result => {
        if (result && result.id) {
            resultMap.set(result.id, result);
        }
    });
    
    // Add or update with new results
    newResults.forEach(result => {
        if (result && result.id) {
            resultMap.set(result.id, result);
        }
    });
    
    // Convert map back to array and sort by date (newest first)
    return Array.from(resultMap.values())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Function to sync from Supabase to local storage (for when user logs in on different device)
async function syncFromSupabaseToLocal() {
    try {
        const currentUser = SessionManager.getCurrentSession();
        if (!currentUser || !currentUser.username) {
            console.log('No user logged in - skipping sync from Supabase');
            return false;
		}
		
        // Get user_data from Supabase
        const { data: userData, error } = await supabaseClient
		.from('auth_users')
		.select('user_data')
		.eq('username', currentUser.username)
		.single();
		
        if (error) {
            console.error('Error fetching user_data from Supabase:', error);
            return false;
		}
		
        if (!userData || !userData.user_data) {
            console.log('No user_data found in Supabase');
            return false;
		}
		
        const supabaseData = userData.user_data;
        
        // Update local storage with data from Supabase
        if (supabaseData.testProgress) {
            saveToStorage(STORAGE_KEYS.ANSWERS, supabaseData.testProgress.answers || []);
            saveToStorage(STORAGE_KEYS.CURRENT_QUESTION, supabaseData.testProgress.currentQuestion || 0);
		}
        
        if (supabaseData.savedResults) {
            saveToStorage(STORAGE_KEYS.SAVED_RESULTS, supabaseData.savedResults);
		}
        
        if (supabaseData.language) {
            saveToStorage(STORAGE_KEYS.LANGUAGE, supabaseData.language);
            // Update current language variable
            currentLanguage = supabaseData.language;
            // Refresh UI
            initializeAppUI();
		}
		
        console.log('✅ Synced data from Supabase to local storage');
        return true;
		} catch (error) {
        console.error('Error in syncFromSupabaseToLocal:', error);
        return false;
	}
}

// Make it available globally
window.updateUserDataInSupabase = updateUserDataInSupabase;

// Make functions global
window.saveCurrentResults = saveCurrentResults;
window.loadSavedResults = loadSavedResults;
window.getSavedResultById = getSavedResultById;
window.deleteSavedResult = deleteSavedResult;