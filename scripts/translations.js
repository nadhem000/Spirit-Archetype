// translations.js - Updated to use separate language files
function translate(key, params = {}) {
    const keys = key.split('.');
    // Use the helper function to get the correct translation object
    let translationObj = getCurrentTranslationObject();
    
    
    let value = translationObj;
    for (const k of keys) {
        if (value && value.hasOwnProperty(k)) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            // Return the key itself instead of showing an error
            return key.split('.').pop();
        }
    }
    
    // استبدال المتغيرات في النص
    let translatedText = value;
    for (const param in params) {
        translatedText = translatedText.replace(`{${param}}`, params[param]);
    }
    return translatedText;
}

// تطبيق الترجمات على جميع العناصر
function applyTranslations() {
    // Translate all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    let translatedText = translate(key);
    
    // Handle special elements
    if (element.id === 'SC1-current-question') {
        return;
    }
    
    // Skip music title if music is playing
    if (element.id === 'SC1-music-title' && window.musicPlayer && window.musicPlayer.isPlaying) {
        return;
    }
    
    // Handle elements with variable text
    if (element.id === 'SC1-next-btn' && currentQuestionIndex === questions.length - 1) {
        translatedText = translate('SC1.questions.finishButton');
    }
    
    element.textContent = translatedText;
});

    // Translate placeholder attributes
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translatedText = translate(key);
        element.setAttribute('placeholder', translatedText);
    });

    // Update screens
    if (welcomeCard.classList.contains('SC1-active')) {
        // No additional action needed
    } 
    else if (questionCard.classList.contains('SC1-active')) {
        displayQuestion(currentQuestionIndex);
    } 
    else if (resultCard.classList.contains('SC1-active')) {
        displayResult();
    }
    // Update navigation buttons
    updateNavButtons();
}

// وظيفة تبديل اتجاه الصفحة
function updatePageDirection() {
    const htmlElement = document.getElementById('SC1-html-direction');
    // Get the current language object dynamically
    const currentLangObj = getCurrentTranslationObject();
    // Get direction and language code from the general_rules
    const dir = currentLangObj.general_rules.dir;
    const langCode = currentLangObj.general_rules.language_code;
    htmlElement.setAttribute('dir', dir);
    htmlElement.setAttribute('lang', langCode);
}

// Helper function to get the current translation object
function getCurrentTranslationObject() {
    // This will automatically use the correct translation file based on currentLanguage
    if (currentLanguage === 'en') {
        return translations_en;
    } else if (currentLanguage === 'ar') {
        return translations_ar;
    }
    // Add more languages here
    // For now, fallback to English
    return translations_en;
}

// Get display name for a language
function getLanguageDisplayName(langCode) {
    // Temporarily switch to the requested language to get its name
    const originalLanguage = currentLanguage;
    currentLanguage = langCode;
    const langObj = getCurrentTranslationObject();
    currentLanguage = originalLanguage; // Restore original language
    return langObj.general_rules.language_name;
}

function getLanguageEnglishName(langCode) {
    // Temporarily switch to the requested language to get its English name
    const originalLanguage = currentLanguage;
    currentLanguage = langCode;
    const langObj = getCurrentTranslationObject();
    currentLanguage = originalLanguage; // Restore original language
    return langObj.general_rules.language_english_name;
}