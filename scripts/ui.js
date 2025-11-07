// ui.js - UI and Display Functions (Updated for i18n keys)

// عرض السؤال الحالي
function displayQuestion(index) {
    const question = questions[index];
    // تحديث عداد السؤال
    const questionCounterText = translate('SC1.questions.questionCounter', {
        current: index + 1,
        total: questions.length
	});
    document.querySelector('.SC1-question-number').textContent = questionCounterText;
    
    // تحديث نص السؤال باستخدام مفتاح الترجمة
    const questionKey = `SC1.questions.${question.key}.question`;
    questionTextElement.textContent = translate(questionKey);
    
    // تحديث الخيارات
    optionsContainer.innerHTML = '';
    question.options.forEach((option, optionIndex) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('SC1-option');
        if (userAnswers[index] === option.score_key) {
            optionElement.classList.add('SC1-selected');
		}
        
        // استخدام مفتاح الترجمة للخيار
        const optionKey = `SC1.questions.${question.key}.options.${option.key}`;
        optionElement.textContent = translate(optionKey);
        
        optionElement.addEventListener('click', () => {
			// إزالة التحديد من جميع الخيارات
			document.querySelectorAll('.SC1-option').forEach(opt => {
				opt.classList.remove('SC1-selected');
			});
			// تحديد الخيار المختار
			optionElement.classList.add('SC1-selected');
			userAnswers[index] = option.score_key;
			// تحديث حالة الأزرار (نعم، ابق هذا)
			updateNavButtons();
		});
        optionsContainer.appendChild(optionElement);
	});
    
    // تحديث شريط التقدم
    updateProgressBar();
    // تحديث حالة الأزرار
    updateNavButtons();
}

// تحديث شريط التقدم
function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressElement.style.width = `${progressPercentage}%`;
}

// تحديث حالة أزرار التنقل
function updateNavButtons() {
    // زر السابق
    if (currentQuestionIndex === 0) {
        prevBtn.style.visibility = 'hidden';
		} else {
        prevBtn.style.visibility = 'visible';
	}
    
    // زر التالي/إنهاء
    if (userAnswers[currentQuestionIndex] !== null) {
        nextBtn.disabled = false;
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.textContent = translate('SC1.questions.finishButton');
			} else {
            nextBtn.textContent = translate('SC1.questions.nextButton');
		}
		} else {
        nextBtn.disabled = true;
	}
}

// Function to display result images
function displayResultImages(resultPattern) {
    const animalImage = document.getElementById('SC1-animal-image');
    const guideImage = document.getElementById('SC1-guide-image');
    
    // Map result patterns to image filenames
    const imageMap = {
        'A': { animal: 'eagle.jpg', guide: 'guide_a.jpg' },
        'B': { animal: 'whale.jpg', guide: 'guide_b.jpg' },
        'C': { animal: 'owl.jpg', guide: 'guide_c.jpg' },
        'D': { animal: 'snake.jpg', guide: 'guide_d.jpg' }
    };
    
    const images = imageMap[resultPattern];
    
    if (images && animalImage && guideImage) {
        // Set the image sources
        animalImage.src = `assets/results/animals/${images.animal}`;
        guideImage.src = `assets/results/guidelines/${images.guide}`;
        
        // Set alt text for accessibility
        animalImage.alt = translate(`SC1.results.${resultPattern}.guide`) + ' Symbol';
        guideImage.alt = translate(`SC1.results.${resultPattern}.title`) + ' Guideline';
    }
}
// عرض النتيجة
function displayResult() {
    const resultPattern = calculateResult();
    const result = results[resultPattern];
    
    // Get translations for current language
    const resultTranslations = getCurrentTranslationObject().SC1.results[resultPattern];
    
    // Use the translated result details
    resultGuideElement.textContent = `${resultTranslations.guide} - ${resultTranslations.title}`;
    symbolicMeaningElement.textContent = resultTranslations.symbolicMeaning;
    coreChallengeElement.textContent = resultTranslations.coreChallenge;
    mission90DaysElement.textContent = resultTranslations.mission90Days;
    kpiElement.textContent = resultTranslations.kpi;
    allianceTipElement.textContent = resultTranslations.allianceTip;
    
    // Display images based on result pattern
    displayResultImages(resultPattern);
}