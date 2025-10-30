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

// عرض النتيجة
function displayResult() {
    const resultPattern = calculateResult();
    const result = results[resultPattern];
    
    // استخدام مفاتيح الترجمة لعرض النتيجة
    resultGuideElement.textContent = `${translate(`SC1.results.${result.key}.guide`)} - ${translate(`SC1.results.${result.key}.title`)}`;
    symbolicMeaningElement.textContent = translate(`SC1.results.${result.key}.symbolicMeaning`);
    coreChallengeElement.textContent = translate(`SC1.results.${result.key}.coreChallenge`);
    mission90DaysElement.textContent = translate(`SC1.results.${result.key}.mission90Days`);
    kpiElement.textContent = translate(`SC1.results.${result.key}.kpi`);
    allianceTipElement.textContent = translate(`SC1.results.${result.key}.allianceTip`);
}