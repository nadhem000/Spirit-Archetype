// navigation.js - Button event handlers and navigation logic
// Initialize navigation event handlers
function initializeNavigation() {
    // Start button
    startBtn.addEventListener('click', () => {
        if (window.SC1Loader && window.SC1Loader.isLoadingState) return;
        
        welcomeCard.classList.remove('SC1-active');
        questionCard.classList.add('SC1-active');
        displayQuestion(currentQuestionIndex);
        // Save initial progress
        saveTestProgress();
    });
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        if (window.SC1Loader && window.SC1Loader.isLoadingState) return;
        
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(currentQuestionIndex);
        }
    });
    
    // Next button
    nextBtn.addEventListener('click', () => {
        if (window.SC1Loader && window.SC1Loader.isLoadingState) return;
        
        if (currentQuestionIndex < questions.length - 1) {
            // Save progress BEFORE moving to next question
            saveTestProgress();
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        } else {
            // Test completed - show results
            // Save progress before showing results
            saveTestProgress();
            questionCard.classList.remove('SC1-active');
            resultCard.classList.add('SC1-active');
            displayResult();
        }
    });
    
    // Restart button
    restartBtn.addEventListener('click', () => {
        if (window.SC1Loader && window.SC1Loader.isLoadingState) return;
        
        // Show loader during reset
        if (window.SC1Loader) {
            window.SC1Loader.showAlmostReady();
        }
        
        // إعادة تعيين الحالة
        currentQuestionIndex = 0;
        userAnswers = Array(questions.length).fill(null);
        scores = { A: 0, B: 0, C: 0, D: 0 };
        // Clear saved progress ONLY when user explicitly restarts
        localStorage.removeItem(STORAGE_KEYS.ANSWERS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION);
        // العودة إلى بطاقة الترحيب
        resultCard.classList.remove('SC1-active');
        questionCard.classList.remove('SC1-active');
        welcomeCard.classList.add('SC1-active');
        // إعادة تعيين شريط التقدم
        updateProgressBar();
        // تطبيق الترجمات
        applyTranslations();
        
        // Hide loader after reset
        setTimeout(() => {
            if (window.SC1Loader) {
                window.SC1Loader.hide();
            }
        }, 800);
    });
    
    // Save Results button
    saveResultsBtn.addEventListener('click', () => {
        if (window.SC1Loader && window.SC1Loader.isLoadingState) return;
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