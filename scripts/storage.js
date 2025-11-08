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
    // Store only current question index, not full answers array
    const progressData = {
        c: currentQuestionIndex, // current question
        t: Math.floor(Date.now() / 1000), // timestamp in seconds
        // Skip storing answers array - we can recalculate if needed
    };
    
    saveToStorage(STORAGE_KEYS.CURRENT_QUESTION, progressData);
}

// Load user preferences
function loadUserPreferences() {
    const savedLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
    return { savedLanguage };
}

// Load test progress
function loadTestProgress() {
    const savedProgress = loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION, {c: 0, t: 0});
    const savedAnswers = loadFromStorage(STORAGE_KEYS.ANSWERS, Array(questions.length).fill(null));
    
    currentQuestionIndex = savedProgress.c;
    
    const hasSavedProgress = savedAnswers.some(answer => answer !== null);
    if (hasSavedProgress) {
        userAnswers = savedAnswers;
        // Resume logic remains the same...
        resumeTestFromSavedState();
    }
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

// Enhanced result saving with deduplication
function saveCurrentResults() {
    const originalText = saveResultsBtn.textContent;
    saveResultsBtn.textContent = translate('SC1.results.saveButton') + '...';
    saveResultsBtn.disabled = true;

    setTimeout(() => {
        try {
            const resultPattern = calculateResult();
            const currentCounts = countAnswers(userAnswers);
            
            // Check if this exact result already exists (avoid duplicates)
            const existingResults = loadSavedResults();
            const isDuplicate = existingResults.some(result => 
                result.dominantPattern === resultPattern &&
                JSON.stringify(result.answerCounts) === JSON.stringify(currentCounts)
            );

            if (isDuplicate) {
                showInfo(translate('SC1.results.saveSuccess')); // Still show success but don't save duplicate
                return;
            }

            const resultId = generateResultId();
            const resultData = {
                id: resultId,
                date: new Date().toISOString(),
                dominantPattern: resultPattern,
                answerCounts: currentCounts
            };

            // Limit saved results to prevent excessive storage
            existingResults.unshift(resultData); // Add to beginning (newest first)
            
            // Keep only last 10 results to prevent storage bloat
            const trimmedResults = existingResults.slice(0, 10);
            
            const saved = saveToStorage(STORAGE_KEYS.SAVED_RESULTS, trimmedResults);

            if (saved) {
                showSuccess(translate('SC1.results.saveSuccess'));
            } else {
                showError(translate('SC1.results.saveError'));
            }

            // Update Supabase
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

// Function to update user_data in Supabase with proper merging
async function updateUserDataInSupabase() {
    try {
        const currentUser = SessionManager.getCurrentSession();
        if (!currentUser || !currentUser.username) {
            console.log('No user logged in - skipping user_data update');
            return false;
        }

        // Get existing user_data from Supabase
        const { data: existingUser, error: fetchError } = await supabaseClient
            .from('auth_users')
            .select('user_data')
            .eq('username', currentUser.username)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching existing user_data:', fetchError);
            return false;
        }

        // COMPACT: Minimal data for Supabase
        const currentLocalData = {
            v: 3, // version
            l: currentLanguage, // language
            sr: loadSavedResults(), // saved results (already compact)
            tp: { // test progress
                c: loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION, {c: 0}).c,
                t: new Date().toISOString().split('T')[0] // date only
            },
            ts: Math.floor(Date.now() / 1000) // timestamp in seconds
        };

        // Smart merge with existing data
        let mergedUserData;
        if (existingUser && existingUser.user_data) {
            // Migrate old data to new compact format if needed
            const migratedData = migrateToCompactFormat(existingUser.user_data);
            mergedUserData = {
                ...migratedData,
                l: currentLocalData.l,
                tp: currentLocalData.tp,
                sr: mergeCompactResults(migratedData.sr || [], currentLocalData.sr),
                ts: currentLocalData.ts
            };
        } else {
            mergedUserData = currentLocalData;
        }

        // Update Supabase
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

        console.log('✅ Compact user data saved to Supabase');
        return true;
    } catch (error) {
        console.error('Error in updateUserDataInSupabase:', error);
        return false;
    }
}

// Migration helper for old data format
function migrateToCompactFormat(oldData) {
    if (!oldData) return {};
    
    // If already compact format, return as-is
    if (oldData.v >= 3) return oldData;
    
    const compact = {
        v: 3,
        l: oldData.language,
        ts: Math.floor(Date.now() / 1000)
    };
    
    // Migrate saved results
    if (oldData.savedResults && Array.isArray(oldData.savedResults)) {
        compact.sr = oldData.savedResults.map(result => ({
            i: result.id || (Date.now() + '_' + result.dominantPattern),
            p: result.dominantPattern,
            d: result.date ? result.date.split('T')[0] : new Date().toISOString().split('T')[0]
        })).slice(0, 5); // Keep only last 5
    }
    
    // Migrate test progress
    if (oldData.testProgress) {
        compact.tp = {
            c: oldData.testProgress.currentQuestion || 0,
            t: oldData.testProgress.lastUpdated ? 
               oldData.testProgress.lastUpdated.split('T')[0] : 
               new Date().toISOString().split('T')[0]
        };
    }
    
    return compact;
}

// Compact results merger
function mergeCompactResults(existing, newResults) {
    const combined = [...existing, ...newResults];
    
    // Remove duplicates by pattern+date
    const seen = new Set();
    const unique = combined.filter(result => {
        const key = `${result.p}_${result.d}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    
    // Sort by date (newest first) and limit to 5
    return unique
        .sort((a, b) => new Date(b.d) - new Date(a.d))
        .slice(0, 5);
}

// Optimized merge function to prevent duplicates
function mergeSavedResultsOptimized(existingResults, newResults) {
    if (!existingResults || existingResults.length === 0) return newResults;
    if (!newResults || newResults.length === 0) return existingResults;

    const resultMap = new Map();
    
    // Add all existing results
    existingResults.forEach(result => {
        if (result && result.id) {
            const key = `${result.dominantPattern}_${JSON.stringify(result.answerCounts)}`;
            resultMap.set(key, result);
        }
    });
    
    // Add or update with new results (avoiding duplicates)
    newResults.forEach(result => {
        if (result && result.id) {
            const key = `${result.dominantPattern}_${JSON.stringify(result.answerCounts)}`;
            // Keep the newest version of duplicate results
            if (!resultMap.has(key) || new Date(result.date) > new Date(resultMap.get(key).date)) {
                resultMap.set(key, result);
            }
        }
    });
    
    // Convert to array, sort by date (newest first), and limit to 10
    return Array.from(resultMap.values())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
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

// manual cleanup
function cleanupUserData() {
    try {
        // Clean up saved results - remove duplicates and limit count
        const savedResults = loadSavedResults();
        
        // Remove duplicates based on pattern and counts
        const uniqueResults = [];
        const seen = new Set();
        
        savedResults.forEach(result => {
            const key = `${result.dominantPattern}_${JSON.stringify(result.answerCounts)}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueResults.push(result);
            }
        });
        
        // Keep only last 10 unique results
        const cleanedResults = uniqueResults
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
            
        saveToStorage(STORAGE_KEYS.SAVED_RESULTS, cleanedResults);
        console.log('✅ Cleaned user data:', {
            before: savedResults.length,
            after: cleanedResults.length
        });
        
        return cleanedResults;
    } catch (error) {
        console.error('Error cleaning user data:', error);
        return [];
    }
}

function getResultSummary() {
    const savedResults = loadSavedResults();
    const summary = { A: 0, B: 0, C: 0, D: 0 };
    
    savedResults.forEach(result => {
        if (summary.hasOwnProperty(result.dominantPattern)) {
            summary[result.dominantPattern]++;
        }
    });
    
    return {
        totalTests: savedResults.length,
        patternDistribution: summary,
        latestResult: savedResults[0] || null
    };
}

// Make it available globally
window.cleanupUserData = cleanupUserData;

// Make it available globally
window.updateUserDataInSupabase = updateUserDataInSupabase;

// Make functions global
window.saveCurrentResults = saveCurrentResults;
window.loadSavedResults = loadSavedResults;
window.getSavedResultById = getSavedResultById;
window.deleteSavedResult = deleteSavedResult;