// navigation.js - Button event handlers and navigation logic
// Initialize navigation event handlers
function initializeNavigation() {
    // Start button
    startBtn.addEventListener('click', () => {
        welcomeCard.classList.remove('SC1-active');
        questionCard.classList.add('SC1-active');
        displayQuestion(currentQuestionIndex);
        // Save initial progress
        saveTestProgress();
    });
    // Previous button
    prevBtn.addEventListener('click', () => {
		if (currentQuestionIndex > 0) {
			currentQuestionIndex--;
			displayQuestion(currentQuestionIndex);
		}
	});
    // Next button - save minimal progress
nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        // Save minimal progress BEFORE moving to next question
        saveMinimalTestProgress();
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    } else {
        // Test completed - show results
        saveMinimalTestProgress();
        questionCard.classList.remove('SC1-active');
        resultCard.classList.add('SC1-active');
        displayResult();
    }
});

// Previous button - save minimal progress  
prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        saveMinimalTestProgress();
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
});
	// Save Results button
	saveResultsBtn.addEventListener('click', () => {
		saveCurrentResults();
	});
}

// Initialize language buttons
function initializeLanguageButtons() {
    // First, set the active button based on current language
    langButtons.forEach(button => {
        const langCode = button.getAttribute('data-lang');
        if (langCode === currentLanguage) {
            button.classList.add('SC1-active');
        } else {
            button.classList.remove('SC1-active');
        }
        
        // Update button text with actual language name
        button.textContent = getLanguageDisplayName(langCode);
    });
    
    // Then add click event listeners
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentLanguage = button.getAttribute('data-lang');
            // Update active state for all buttons
            langButtons.forEach(btn => {
                if (btn.getAttribute('data-lang') === currentLanguage) {
                    btn.classList.add('SC1-active');
                } else {
                    btn.classList.remove('SC1-active');
                }
            });
            // Save language preference
            saveToStorage(STORAGE_KEYS.LANGUAGE, currentLanguage);
            // Use our new function instead of separate calls
            initializeAppUI();
        });
    });
}