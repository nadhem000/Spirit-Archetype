// Main Application Logic - Spiritual Guide Test PWA
// Push Notification Functions
let isPushEnabled = false;
// localStorage keys
const STORAGE_KEYS = {
    LANGUAGE: 'spiritual-guide-language',
    NOTIFICATIONS: 'spiritual-guide-notifications',
    ANSWERS: 'spiritual-guide-answers',
    CURRENT_QUESTION: 'spiritual-guide-current-question'
};
// same key as in sw.js
const VAPID_PUBLIC_KEY = 'BCk-q7nq79UoXZEG4sLuvyr0sxUXl4DR4mFPNPbVf9WmOlGZdj_3B2KpN4xLHJfyEWYMqA7RQxkuM1Nk1_mA1uY';
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
// Load data from localStorage
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
	saveToStorage(STORAGE_KEYS.NOTIFICATIONS, isPushEnabled);
}
// Save test progress
function saveTestProgress() {
	saveToStorage(STORAGE_KEYS.ANSWERS, userAnswers);
	saveToStorage(STORAGE_KEYS.CURRENT_QUESTION, currentQuestionIndex);
}
// Load user preferences
function loadUserPreferences() {
	const savedLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
	const savedNotifications = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, false);
	return { savedLanguage, savedNotifications };
}
// Load test progress
function loadTestProgress() {
	const savedAnswers = loadFromStorage(STORAGE_KEYS.ANSWERS, Array(questions.length).fill(null));
	const savedQuestionIndex = loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION, 0);
	return { savedAnswers, savedQuestionIndex };
}
// حالة التطبيق
let currentLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let scores = { A: 0, B: 0, C: 0, D: 0 };
// PWA Install Variables
let deferredPrompt;
// عناصر DOM
// Settings modal elements
const settingsBtn = document.getElementById('SC1-settings-btn');
const settingsModal = document.getElementById('SC1-settings-modal');
const modalClose = document.getElementById('SC1-modal-close');
const welcomeCard = document.getElementById('SC1-welcome-card');
const questionCard = document.getElementById('SC1-question-card');
const resultCard = document.getElementById('SC1-result-card');
const startBtn = document.getElementById('SC1-start-btn');
const prevBtn = document.getElementById('SC1-prev-btn');
const nextBtn = document.getElementById('SC1-next-btn');
const restartBtn = document.getElementById('SC1-restart-btn');
const currentQuestionElement = document.getElementById('SC1-current-question');
const questionTextElement = document.getElementById('SC1-question-text');
const optionsContainer = document.getElementById('SC1-options-container');
const progressElement = document.getElementById('SC1-progress');
const langButtons = document.querySelectorAll('.SC1-lang-btn');
const resultGuideElement = document.getElementById('SC1-result-guide');
const symbolicMeaningElement = document.getElementById('SC1-symbolic-meaning');
const coreChallengeElement = document.getElementById('SC1-core-challenge');
const mission90DaysElement = document.getElementById('SC1-mission-90-days');
const kpiElement = document.getElementById('SC1-kpi');
const allianceTipElement = document.getElementById('SC1-alliance-tip');
const installBtn = document.getElementById('SC1-install-btn');
// Enhanced service worker registration with background sync support
if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js');
			console.log('SW registered: ', registration);
			// Check for updates immediately
			checkForUpdates(registration);
			// Listen for controller changes (when SW updates)
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				console.log('Controller changed, reloading page...');
				window.location.reload();
			});
			// Listen for update messages from service worker
			navigator.serviceWorker.addEventListener('message', event => {
				if (event.data && event.data.type === 'CONTENT_UPDATED') {
					showUpdateNotification(event.data.message);
				}
				if (event.data && event.data.type === 'SW_ACTIVATED') {
					console.log('Service Worker activated:', event.data.version);
				}
			});
			// Check for updates every 6 hour
			setInterval(() => checkForUpdates(registration), 6 * 60 * 60 * 1000);
			} catch (registrationError) {
			console.log('SW registration failed: ', registrationError);
		}
	});
}
// Settings modal functionality
function initializeSettingsModal() {
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
// Function to check for updates
function checkForUpdates(registration) {
	if (registration && registration.active) {
		// Send message to service worker to check for updates
		const channel = new MessageChannel();
		registration.active.postMessage({ type: 'CHECK_FOR_UPDATES' }, [channel.port2]);
		channel.port1.onmessage = (event) => {
			if (event.data.hasUpdates) {
				showUpdateNotification('New version available. Refresh to update.');
			}
		};
	}
}
// Function to show update notification
function showUpdateNotification(message) {
	// You can implement a custom notification UI here
	if (confirm(message + ' Would you like to refresh now?')) {
		window.location.reload();
	}
}
// Add manual update check function
function forceUpdate() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			registration.update().then(() => {
				console.log('Service Worker updated');
			});
		});
	}
}
// Clear cache function for debugging
function clearCache() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			const channel = new MessageChannel();
			registration.active.postMessage({ type: 'CLEAR_CACHE' }, [channel.port2]);
			channel.port1.onmessage = (event) => {
				if (event.data.cleared) {
					console.log('Cache cleared, reloading...');
					window.location.reload();
				}
			};
		});
	}
}
// Listen for service worker messages (like content updates)
navigator.serviceWorker.addEventListener('message', event => {
	if (event.data && event.data.type === 'CONTENT_UPDATED') {
		// Show update notification to user
		if (confirm(event.data.message + ' Would you like to refresh now?')) {
			window.location.reload();
		}
	}
});
// Enhanced install button handler
installBtn.addEventListener('click', async () => {
	if (!deferredPrompt) {
		console.log('No install prompt available');
		return;
	}
	try {
		// Show the install prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;
		console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
		if (outcome === 'accepted') {
			console.log('PWA was installed');
			// Hide the install button after successful installation
			installBtn.style.display = 'none';
		}
		} catch (error) {
		console.error('Error showing install prompt:', error);
	}
	// Clear the saved prompt since it can't be used again
	deferredPrompt = null;
});
// Enhanced beforeinstallprompt handler
window.addEventListener('beforeinstallprompt', (e) => {
	console.log('beforeinstallprompt event fired');
	// Prevent the mini-infobar from appearing on mobile
	e.preventDefault();
	// Stash the event so it can be triggered later
	deferredPrompt = e;
	// Show the install button
	installBtn.style.display = 'block';
	console.log('Install button should be visible now');
	// Apply translation to install button
	const installText = translate('SC1.install.installApp');
	installBtn.querySelector('span').textContent = installText;
	// Optional: Log for debugging
	console.log('Install button displayed, ready for user interaction');
});
// Request background sync when coming online
window.addEventListener('online', () => {
	console.log('App is online, triggering background sync');
	if ('serviceWorker' in navigator && 'SyncManager' in window) {
		navigator.serviceWorker.ready.then(registration => {
			return registration.sync.register('background-sync');
			}).then(() => {
			console.log('Background Sync registered when online');
			}).catch(error => {
			console.log('Background Sync registration failed:', error);
		});
	}
});
// Hide the install button when the app is successfully installed
window.addEventListener('appinstalled', () => {
	console.log('PWA was installed');
	installBtn.style.display = 'none';
	deferredPrompt = null;
});
// Check if the app is already installed and hide the install button if so
if (window.matchMedia('(display-mode: standalone)').matches || 
	window.navigator.standalone === true) {
	installBtn.style.display = 'none';
}
// وظيفة الترجمة باستخدام المفاتيح المتداخلة
function translate(key, params = {}) {
	const keys = key.split('.');
	let value = translations[currentLanguage];
	for (const k of keys) {
		if (value && value.hasOwnProperty(k)) {
			value = value[k];
			} else {
			console.warn(`Translation key not found: ${key}`);
			// Return the key itself instead of showing an error
			return key.split('.').pop(); // Returns "installApp" instead of full key
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
	// ترجمة جميع العناصر التي تحتوي على data-i18n
	const elements = document.querySelectorAll('[data-i18n]');
	elements.forEach(element => {
		const key = element.getAttribute('data-i18n');
		let translatedText = translate(key);
		// معالجة العناصر الخاصة
		if (element.id === 'SC1-current-question') {
			// هذا العنصر يتم تحديثه بشكل ديناميكي
			return;
		}
		// معالجة العناصر التي تحتوي على نصوص متغيرة
		if (element.id === 'SC1-next-btn' && currentQuestionIndex === questions.length - 1) {
			translatedText = translate('SC1.questions.finishButton');
		}
		element.textContent = translatedText;
	});
	// تحديث نص زر التثبيت
	if (installBtn.style.display !== 'none') {
		const installText = translate('SC1.install.installApp');
		installBtn.querySelector('span').textContent = installText;
	}
	// تحديث شاشة الترحيب
	if (welcomeCard.classList.contains('SC1-active')) {
		// لا حاجة لإجراء إضافي
	} 
	// تحديث شاشة الأسئلة
	else if (questionCard.classList.contains('SC1-active')) {
		displayQuestion(currentQuestionIndex);
	} 
	// تحديث شاشة النتائج
	else if (resultCard.classList.contains('SC1-active')) {
		displayResult();
	}
	// تحديث زر التالي/الإنهاء
	updateNavButtons();
}
// تبديل اللغة
langButtons.forEach(button => {
	button.addEventListener('click', () => {
		currentLanguage = button.getAttribute('data-lang');
		langButtons.forEach(btn => btn.classList.remove('SC1-active'));
		button.classList.add('SC1-active');
		// Save language preference
		saveToStorage(STORAGE_KEYS.LANGUAGE, currentLanguage);
		// تحديث اتجاه الصفحة
		updatePageDirection();
		// تطبيق الترجمات
		applyTranslations();
	});
});
// عرض السؤال الحالي
function displayQuestion(index) {
	const question = questions[index];
	// تحديث عداد السؤال
	const questionCounterText = translate('SC1.questions.questionCounter', {
		current: index + 1,
		total: questions.length
	});
	document.querySelector('.SC1-question-number').textContent = questionCounterText;
	// تحديث نص السؤال
	if (currentLanguage === 'en') {
		questionTextElement.textContent = question.question_en;
		} else {
		questionTextElement.textContent = question.question_ar;
	}
	// تحديث الخيارات
	optionsContainer.innerHTML = '';
	question.options.forEach((option, optionIndex) => {
		const optionElement = document.createElement('div');
		optionElement.classList.add('SC1-option');
		if (userAnswers[index] === option.score_key) {
			optionElement.classList.add('SC1-selected');
		}
		if (currentLanguage === 'en') {
			optionElement.textContent = option.text_en;
			} else {
			optionElement.textContent = option.text_ar;
		}
		optionElement.addEventListener('click', () => {
			// إزالة التحديد من جميع الخيارات
			document.querySelectorAll('.SC1-option').forEach(opt => {
				opt.classList.remove('SC1-selected');
			});
			// تحديد الخيار المختار
			optionElement.classList.add('SC1-selected');
			userAnswers[index] = option.score_key;
			// Save progress
			saveTestProgress();
			// تحديث حالة الأزرار
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
// حساب النتيجة
function calculateResult() {
	// إعادة تعيين النقاط
	scores = { A: 0, B: 0, C: 0, D: 0 };
	// حساب النقاط
	userAnswers.forEach(answer => {
		if (answer && scores.hasOwnProperty(answer)) {
			scores[answer] += 1;
		}
	});
	// العثور على النمط المسيطر
	let dominantPattern = 'A';
	let maxScore = scores.A;
	for (const pattern in scores) {
		if (scores[pattern] > maxScore) {
			maxScore = scores[pattern];
			dominantPattern = pattern;
		}
	}
	return dominantPattern;
}
// عرض النتيجة
function displayResult() {
	const resultPattern = calculateResult();
	const result = results[resultPattern];
	if (currentLanguage === 'en') {
		resultGuideElement.textContent = `${result.guide_en} - ${result.title_en}`;
		symbolicMeaningElement.textContent = result.symbolic_meaning_en;
		coreChallengeElement.textContent = result.core_challenge_en;
		mission90DaysElement.textContent = result.mission_90_days_en;
		kpiElement.textContent = result.kpi_en;
		allianceTipElement.textContent = result.alliance_tip_en;
		} else {
		resultGuideElement.textContent = `${result.guide_ar} - ${result.title_ar}`;
		symbolicMeaningElement.textContent = result.symbolic_meaning_ar;
		coreChallengeElement.textContent = result.core_challenge_ar;
		mission90DaysElement.textContent = result.mission_90_days_ar;
		kpiElement.textContent = result.kpi_ar;
		allianceTipElement.textContent = result.alliance_tip_ar;
	}
}
// وظيفة تبديل اتجاه الصفحة
function updatePageDirection() {
	const htmlElement = document.getElementById('SC1-html-direction');
	if (currentLanguage === 'ar') {
		htmlElement.setAttribute('dir', 'rtl');
		htmlElement.setAttribute('lang', 'ar');
		} else {
		htmlElement.setAttribute('dir', 'ltr');
		htmlElement.setAttribute('lang', 'en');
	}
}
function isValidVapidKey(key) {
	if (!key || typeof key !== 'string') {
		return false;
	}
	// VAPID keys should be URL-safe base64 strings
	// They typically don't contain characters like +, /, or =
	const vapidKeyRegex = /^[A-Za-z0-9_-]+$/;
	if (!vapidKeyRegex.test(key)) {
		return false;
	}
	// Try to decode the key to verify it's valid base64
	try {
		urlBase64ToUint8Array(key);
		return true;
		} catch (error) {
		return false;
	}
}
// Initialize push notifications
async function initializePushNotifications() {
	if (!isValidVapidKey(VAPID_PUBLIC_KEY)) {
		console.error('Invalid VAPID public key configuration');
		const pushContainer = document.querySelector('.SC1-push-container');
		if (pushContainer) {
			pushContainer.style.display = 'none';
		}
		return;
	}
	// Check if VAPID key is available
	if (!VAPID_PUBLIC_KEY) {
		console.error('VAPID public key is not configured in main.js');
		// You might want to hide or disable the push toggle in this case
		const pushToggle = document.getElementById('SC1-push-toggle');
		if (pushToggle) {
			pushToggle.disabled = true;
			pushToggle.title = 'Push notifications not configured';
		}
		return;
	}
	try {
		const registration = await navigator.serviceWorker.ready;
		// Load saved notification preference
		const savedNotifications = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, false);
		// Check current subscription
		let subscription = await registration.pushManager.getSubscription();
		if (subscription && savedNotifications) {
			console.log('User is already subscribed to push notifications');
			isPushEnabled = true;
			updatePushUI(true);
			} else if (subscription && !savedNotifications) {
			// User has subscription but preference is disabled - unsubscribe
			await unsubscribeFromPush();
			} else if (!subscription && savedNotifications) {
			// User wants notifications but no subscription - try to subscribe
			try {
				await subscribeToPush();
				} catch (error) {
				console.error('Failed to restore push subscription:', error);
				// If we can't restore, update preference to false
				saveToStorage(STORAGE_KEYS.NOTIFICATIONS, false);
				updatePushUI(false);
			}
			} else {
			console.log('User is not subscribed to push notifications');
			updatePushUI(savedNotifications);
		}
		} catch (error) {
		console.error('Error initializing push notifications:', error);
	}
}
// Request push notification permission
async function subscribeToPush() {
	try {
		// Check if VAPID key is available and valid
		if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY.length < 20) {
			throw new Error('VAPID public key is not properly configured');
		}
		const registration = await navigator.serviceWorker.ready;
		// Check permission first
		const permission = await Notification.requestPermission();
		if (permission !== 'granted') {
			throw new Error('Permission not granted for notifications');
		}
		// Validate the VAPID key before using it
		try {
			// Test if the key can be decoded
			urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
			} catch (decodeError) {
			throw new Error('Invalid VAPID public key format');
		}
		// Convert VAPID key to Uint8Array
		const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
		// Subscribe to push
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey
		});
		console.log('User subscribed to push:', subscription);
		isPushEnabled = true;
		updatePushUI(true);
		// Save notification preference
		saveToStorage(STORAGE_KEYS.NOTIFICATIONS, true);
		// Send subscription to server (in a real app, you'd send this to your backend)
		await sendSubscriptionToServer(subscription);
		return subscription;
		} catch (error) {
		console.error('Error subscribing to push notifications:', error);
		// Update UI to reflect failure
		isPushEnabled = false;
		updatePushUI(false);
		saveToStorage(STORAGE_KEYS.NOTIFICATIONS, false);
		if (error.name === 'NotAllowedError') {
			showNotification('Permission Denied', 'Please enable notifications in your browser settings to receive updates.');
			} else if (error.message.includes('VAPID') || error.message.includes('key')) {
			console.error('VAPID key issue:', error);
			showNotification('Configuration Error', 'Push notifications are not properly configured. Please contact support.');
			// Hide push controls if VAPID key is invalid
			const pushContainer = document.querySelector('.SC1-push-container');
			if (pushContainer) {
				pushContainer.style.display = 'none';
			}
		}
		throw error;
	}
}
// Unsubscribe from push notifications
async function unsubscribeFromPush() {
	try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		if (subscription) {
			await subscription.unsubscribe();
			console.log('User unsubscribed from push');
			isPushEnabled = false;
			updatePushUI(false);
			// Send unsubscribe to server
			await sendUnsubscribeToServer(subscription);
		}
		} catch (error) {
		console.error('Error unsubscribing from push notifications:', error);
		throw error;
	}
}
// Convert VAPID key
function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
	.replace(/\-/g, '+')
	.replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
// Send subscription to server
async function sendSubscriptionToServer(subscription) {
	try {
		// In a real application, you would send this to your backend server
		console.log('Sending subscription to server:', subscription);
		// Store locally for demo purposes
		localStorage.setItem('pushSubscription', JSON.stringify(subscription));
		// Show success message
		showNotification('Notifications Enabled', 'You will now receive updates about new features and content.');
		} catch (error) {
		console.error('Error sending subscription to server:', error);
	}
}
// Send unsubscribe to server
async function sendUnsubscribeToServer(subscription) {
	try {
		console.log('Sending unsubscribe to server:', subscription);
		// Remove local storage
		localStorage.removeItem('pushSubscription');
		showNotification('Notifications Disabled', 'You will no longer receive update notifications.');
		} catch (error) {
		console.error('Error sending unsubscribe to server:', error);
	}
}
// Update UI based on push subscription status
function updatePushUI(subscribed) {
	const pushToggle = document.getElementById('SC1-push-toggle');
	const pushStatus = document.getElementById('SC1-push-status');
	if (pushToggle && pushStatus) {
		pushToggle.checked = subscribed;
		if (subscribed) {
			pushStatus.textContent = currentLanguage === 'en' ? 'Notifications enabled' : 'الإشعارات مفعلة';
			pushStatus.className = 'SC1-push-status SC1-push-enabled';
			} else {
			pushStatus.textContent = currentLanguage === 'en' ? 'Notifications disabled' : 'الإشعارات معطلة';
			pushStatus.className = 'SC1-push-status SC1-push-disabled';
		}
	}
}
// Show local notification
function showNotification(title, body) {
	if (!('Notification' in window)) {
		console.log('This browser does not support notifications');
		return;
	}
	if (Notification.permission === 'granted') {
		new Notification(title, {
			body: body,
			icon: '/assets/icons/icon-192x192.png',
			badge: '/assets/icons/icon-72x72.png'
		});
	}
}
// Check for updates and notify user
async function checkForUpdatesAndNotify() {
	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.ready;
			const channel = new MessageChannel();
			registration.active.postMessage({ type: 'CHECK_FOR_UPDATES' }, [channel.port2]);
			channel.port1.onmessage = (event) => {
				if (event.data.hasUpdates) {
					// Show update notification
					if (isPushEnabled && Notification.permission === 'granted') {
						showNotification(
							'Spiritual Guide Test Updated', 
							'A new version is available! Tap to see what\'s new.'
						);
					}
					// Show in-app notification
					showUpdateBanner();
				}
			};
			} catch (error) {
			console.error('Error checking for updates:', error);
		}
	}
}
// Show update banner
function showUpdateBanner() {
	const existingBanner = document.getElementById('SC1-update-banner');
	if (existingBanner) {
		existingBanner.remove();
	}
	const banner = document.createElement('div');
	banner.id = 'SC1-update-banner';
	banner.className = 'SC1-update-banner';
	const message = document.createElement('span');
	message.textContent = currentLanguage === 'en' 
	? '✨ New update available!' 
	: '✨ تحديث جديد متوفر!';
	const refreshBtn = document.createElement('button');
	refreshBtn.textContent = currentLanguage === 'en' ? 'Refresh' : 'تحديث';
	refreshBtn.className = 'SC1-refresh-btn';
	refreshBtn.addEventListener('click', () => {
		window.location.reload();
	});
	const closeBtn = document.createElement('button');
	closeBtn.textContent = '×';
	closeBtn.className = 'SC1-close-btn';
	closeBtn.addEventListener('click', () => {
		banner.remove();
	});
	banner.appendChild(message);
	banner.appendChild(refreshBtn);
	banner.appendChild(closeBtn);
	document.body.appendChild(banner);
	// Auto-remove after 10 seconds
	setTimeout(() => {
		if (banner.parentNode) {
			banner.remove();
		}
	}, 10000);
}
// Add push notification controls to the header
function addPushNotificationControls() {
	const modalBody = document.querySelector('.SC1-modal-body');
	// Check if push container already exists in modal
	let pushContainer = document.querySelector('.SC1-push-container');
	if (!pushContainer) {
		// Create push notification section
		const pushSection = document.createElement('div');
		pushSection.className = 'SC1-settings-section';
		const pushTitle = document.createElement('h3');
		pushTitle.setAttribute('data-i18n', 'SC1.settings.notifications');
		pushTitle.textContent = 'Notifications';
		pushContainer = document.createElement('div');
		pushContainer.className = 'SC1-push-container';
		const pushToggle = document.createElement('input');
		pushToggle.type = 'checkbox';
		pushToggle.id = 'SC1-push-toggle';
		pushToggle.className = 'SC1-push-toggle';
		const pushLabel = document.createElement('label');
		pushLabel.htmlFor = 'SC1-push-toggle';
		pushLabel.className = 'SC1-push-label';
		const pushStatus = document.createElement('span');
		pushStatus.id = 'SC1-push-status';
		pushStatus.className = 'SC1-push-status';
		pushLabel.appendChild(pushStatus);
		pushContainer.appendChild(pushToggle);
		pushContainer.appendChild(pushLabel);
		pushSection.appendChild(pushTitle);
		pushSection.appendChild(pushContainer);
		// Add to modal body
		const languageSection = document.querySelector('.SC1-settings-section');
		modalBody.insertBefore(pushSection, languageSection.nextSibling);
		// Add event listener for toggle
		pushToggle.addEventListener('change', async (e) => {
			const shouldEnable = e.target.checked;
			try {
				if (shouldEnable) {
					await subscribeToPush();
					} else {
					await unsubscribeFromPush();
					// Save notification preference
					saveToStorage(STORAGE_KEYS.NOTIFICATIONS, false);
				}
				} catch (error) {
				// Revert the toggle if operation failed
				pushToggle.checked = !shouldEnable;
				updatePushUI(!shouldEnable);
				console.error('Push notification operation failed:', error);
			}
		});
	}
}
// Resume test from saved state
function resumeTestFromSavedState() {
	const { savedAnswers, savedQuestionIndex } = loadTestProgress();
	// Check if there's a saved test in progress
	const hasSavedProgress = savedAnswers.some(answer => answer !== null);
	if (hasSavedProgress) {
		userAnswers = savedAnswers;
		currentQuestionIndex = savedQuestionIndex;
		// If not on welcome screen and not completed, show resume option
		if (!welcomeCard.classList.contains('SC1-active') && 
			!resultCard.classList.contains('SC1-active') &&
			currentQuestionIndex < questions.length) {
			// Show confirmation to resume
			if (confirm(currentLanguage === 'en' 
				? 'Would you like to resume your previous test?' 
			: 'هل تريد متابعة الاختبار السابق؟')) {
			welcomeCard.classList.remove('SC1-active');
			questionCard.classList.add('SC1-active');
			displayQuestion(currentQuestionIndex);
			}
		}
	}
}
// File and Protocol Handlers
function initializeFileHandlers() {
	// Check if file handling is supported
	if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
		console.log('File Handling API is supported');
		launchQueue.setConsumer(async (launchParams) => {
			if (!launchParams.files.length) {
				return;
			}
			for (const fileHandle of launchParams.files) {
				await handleFile(fileHandle);
			}
		});
		} else {
		console.log('File Handling API is not supported in this browser');
	}
}

// Share target functionality
function initializeShareTarget() {
  // Check if we were launched as a share target
  if (window.location.search.includes('title=') || 
      window.location.search.includes('text=') || 
      window.location.search.includes('url=')) {
    handleSharedContent();
  }
}

function handleSharedContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get('title');
  const text = urlParams.get('text');
  const url = urlParams.get('url');
  
  if (title || text || url) {
    showShareModal(title, text, url);
    
    // Clean URL without share parameters
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

function showShareModal(title, text, url) {
  const modal = document.createElement('div');
  modal.className = 'SC1-modal SC1-active';
  modal.innerHTML = `
    <div class="SC1-modal-content">
      <div class="SC1-modal-header">
        <h2>Shared Content</h2>
        <button class="SC1-modal-close" id="SC1-share-close">&times;</button>
      </div>
      <div class="SC1-modal-body">
        ${title ? `<p><strong>Title:</strong> ${title}</p>` : ''}
        ${text ? `<p><strong>Text:</strong> ${text}</p>` : ''}
        ${url ? `<p><strong>URL:</strong> <a href="${url}" target="_blank">${url}</a></p>` : ''}
        <div class="SC1-share-actions">
          <button class="SC1-button SC1-btn-primary" id="SC1-share-start-test">Start Test with Shared Inspiration</button>
          <button class="SC1-button SC1-btn-secondary" id="SC1-share-close-btn">Close</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  document.getElementById('SC1-share-close').addEventListener('click', () => {
    modal.remove();
  });
  
  document.getElementById('SC1-share-close-btn').addEventListener('click', () => {
    modal.remove();
  });
  
  document.getElementById('SC1-share-start-test').addEventListener('click', () => {
    modal.remove();
    // Start the test when user clicks
    if (welcomeCard.classList.contains('SC1-active')) {
      startBtn.click();
    }
  });
  
  // Close when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
// Handle file opening
async function handleFile(fileHandle) {
  try {
    const file = await fileHandle.getFile();
    const fileType = file.type;
    const fileName = file.name;
    console.log(`Handling file: ${fileName}, type: ${fileType}`);
    
    let content = '';
    if (fileType.startsWith('text/') || 
        fileType === 'application/javascript' || 
        fileType === 'application/json' ||
        fileType === 'text/markdown' ||
        fileType === 'text/html') {
      // Read text files
      content = await file.text();
      displayFileContent(fileName, content, fileType);
    } else if (fileType.startsWith('audio/')) {
      // Handle audio files
      await handleAudioFile(file, fileName);
    } else if (fileType.startsWith('image/')) {
      // Handle image files
      await handleImageFile(file, fileName);
    } else {
      content = `Cannot display file type: ${fileType}`;
      displayFileContent(fileName, content, fileType);
    }
  } catch (error) {
    console.error('Error handling file:', error);
    showNotification('File Error', `Could not open file: ${error.message}`);
  }
}
function handleImageFile(file, fileName) {
  const modal = document.getElementById('SC1-file-handler-modal');
  const title = document.getElementById('SC1-file-handler-title');
  const contentDiv = document.getElementById('SC1-file-handler-content');
  
  title.textContent = `Image: ${fileName}`;
  const imageUrl = URL.createObjectURL(file);
  contentDiv.innerHTML = `
    <img src="${imageUrl}" alt="${fileName}" style="max-width: 100%; height: auto; border-radius: 8px;">
    <p style="margin-top: 15px; text-align: center;">${fileName}</p>
  `;
  modal.classList.add('SC1-active');
  
  // Clean up URL when modal closes
  const closeHandler = () => {
    URL.revokeObjectURL(imageUrl);
    modal.removeEventListener('close', closeHandler);
  };
  modal.addEventListener('close', closeHandler);
}
// Display file content in modal
function displayFileContent(fileName, content, fileType) {
	const modal = document.getElementById('SC1-file-handler-modal');
	const title = document.getElementById('SC1-file-handler-title');
	const contentDiv = document.getElementById('SC1-file-handler-content');
	// Set title
	title.textContent = `File: ${fileName}`;
	// Format content based on file type
	let formattedContent = '';
	if (fileType === 'application/json') {
		try {
			const jsonObj = JSON.parse(content);
			formattedContent = `<pre>${JSON.stringify(jsonObj, null, 2)}</pre>`;
			} catch (e) {
			formattedContent = `<pre>${content}</pre>`;
		}
		} else if (fileType === 'application/javascript') {
		formattedContent = `<pre class="SC1-code">${content}</pre>`;
		} else {
		formattedContent = `<pre>${content}</pre>`;
	}
	contentDiv.innerHTML = formattedContent;
	modal.classList.add('SC1-active');
}
// Handle audio files
async function handleAudioFile(file, fileName) {
	const modal = document.getElementById('SC1-file-handler-modal');
	const title = document.getElementById('SC1-file-handler-title');
	const contentDiv = document.getElementById('SC1-file-handler-content');
	title.textContent = `Audio: ${fileName}`;
	const audioUrl = URL.createObjectURL(file);
	contentDiv.innerHTML = `
	<audio controls style="width: 100%; margin: 10px 0;">
	<source src="${audioUrl}" type="${file.type}">
	Your browser does not support the audio element.
	</audio>
	<p>Now playing: ${fileName}</p>
	`;
	modal.classList.add('SC1-active');
	// Clean up URL when modal closes
	const closeHandler = () => {
		URL.revokeObjectURL(audioUrl);
		modal.removeEventListener('close', closeHandler);
	};
	modal.addEventListener('close', closeHandler);
}
// Protocol handler for external URLs
function handleProtocolNavigation() {
	const urlParams = new URLSearchParams(window.location.search);
	const protocolType = urlParams.get('type');
	if (protocolType) {
		console.log('Protocol handler triggered:', protocolType);
		// Handle different protocol types
		if (protocolType.includes('https://spiritual-consultation.netlify.app')) {
			showExternalWebsiteModal('https://spiritual-consultation.netlify.app');
			} else if (protocolType.startsWith('web+spiritualguide:')) {
			// Handle custom spiritual-guide protocol
			const action = protocolType.replace('web+spiritualguide:', '');
			handleCustomProtocol(action);
			} else if (protocolType.startsWith('web+spiritual:')) {
			// Handle web+spiritual protocol
			const action = protocolType.replace('web+spiritual:', '');
			handleCustomProtocol(action);
		}
	}
}
// Show external website confirmation modal
function showExternalWebsiteModal(url) {
  const modal = document.getElementById('SC1-protocol-handler-modal');
  const urlDisplay = document.getElementById('SC1-protocol-handler-url');
  const cancelBtn = document.getElementById('SC1-protocol-handler-cancel');
  const openBtn = document.getElementById('SC1-protocol-handler-open');
  
  urlDisplay.textContent = url;
  
  // Remove existing event listeners
  const newCancelBtn = cancelBtn.cloneNode(true);
  const newOpenBtn = openBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  openBtn.parentNode.replaceChild(newOpenBtn, openBtn);
  
  // Add new event listeners
  newCancelBtn.addEventListener('click', () => {
    modal.classList.remove('SC1-active');
  });
  
  newOpenBtn.addEventListener('click', () => {
    modal.classList.remove('SC1-active');
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  
  modal.classList.add('SC1-active');
}
// Handle custom protocol actions
function handleCustomProtocol(action) {
	console.log('Custom protocol action:', action);
	switch (action) {
		case 'start-test':
		if (welcomeCard.classList.contains('SC1-active')) {
			startBtn.click();
		}
		break;
		case 'show-results':
		// Navigate to results if available
		if (resultCard) {
			welcomeCard.classList.remove('SC1-active');
			questionCard.classList.remove('SC1-active');
			resultCard.classList.add('SC1-active');
		}
		break;
		case 'open-settings':
		settingsBtn.click();
		break;
		default:
		console.log('Unknown protocol action:', action);
	}
}
// معالجة أحداث الأزرار
startBtn.addEventListener('click', () => {
	welcomeCard.classList.remove('SC1-active');
	questionCard.classList.add('SC1-active');
	displayQuestion(currentQuestionIndex);
	// Save initial progress
	saveTestProgress();
});
prevBtn.addEventListener('click', () => {
	if (currentQuestionIndex > 0) {
		currentQuestionIndex--;
		displayQuestion(currentQuestionIndex);
		saveTestProgress();
	}
});
nextBtn.addEventListener('click', () => {
	if (currentQuestionIndex < questions.length - 1) {
		currentQuestionIndex++;
		displayQuestion(currentQuestionIndex);
		saveTestProgress();
		} else {
		// انتهاء الاختبار وعرض النتيجة
		questionCard.classList.remove('SC1-active');
		resultCard.classList.add('SC1-active');
		displayResult();
		// Clear progress when test is completed
		localStorage.removeItem(STORAGE_KEYS.ANSWERS);
		localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION);
	}
});
restartBtn.addEventListener('click', () => {
	// إعادة تعيين الحالة
	currentQuestionIndex = 0;
	userAnswers = Array(questions.length).fill(null);
	scores = { A: 0, B: 0, C: 0, D: 0 };
	// Clear saved progress
	localStorage.removeItem(STORAGE_KEYS.ANSWERS);
	localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION);
	// العودة إلى بطاقة الترحيب
	resultCard.classList.remove('SC1-active');
	welcomeCard.classList.add('SC1-active');
	// إعادة تعيين شريط التقدم
	updateProgressBar();
	// تطبيق الترجمات
	applyTranslations();
});
// Initialize push notifications when the app starts
document.addEventListener('DOMContentLoaded', () => {
  // Initialize settings modal
  initializeSettingsModal();
  // Add push controls to modal
  addPushNotificationControls();
  // Initialize push notifications
  initializePushNotifications();
  // Initialize share target
  initializeShareTarget();
  // Check for updates periodically
  setInterval(checkForUpdatesAndNotify, 30 * 60 * 1000); // Every 30 minutes
	// Listen for update messages from service worker
	navigator.serviceWorker.addEventListener('message', event => {
		if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
			showUpdateBanner();
		}
	});
});
// التهيئة الأولية
updatePageDirection();
applyTranslations();
// Set active language button based on saved preference
langButtons.forEach(btn => {
	if (btn.getAttribute('data-lang') === currentLanguage) {
		btn.classList.add('SC1-active');
		} else {
		btn.classList.remove('SC1-active');
	}
});
// handle shortcut URLs
window.addEventListener('DOMContentLoaded', () => {
	const hash = window.location.hash;
	switch(hash) {
		case '#start':
		// Auto-start the test
		if (welcomeCard.classList.contains('SC1-active')) {
			startBtn.click();
		}
		break;
		case '#results':
		// Show results if available
		//  might want to check if test was completed
		break;
		case '#settings':
		// Open settings modal
		settingsBtn.click();
		break;
	}
});
// Check for saved test progress
resumeTestFromSavedState();
updateProgressBar();
updateNavButtons();
// Initialize file handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	initializeFileHandlers();
	handleProtocolNavigation();
	// Add event listeners for file handler modal
	const fileHandlerModal = document.getElementById('SC1-file-handler-modal');
	const fileHandlerClose = document.getElementById('SC1-file-handler-close');
	const fileHandlerCloseBtn = document.getElementById('SC1-file-handler-close-btn');
	if (fileHandlerClose) {
		fileHandlerClose.addEventListener('click', () => {
			fileHandlerModal.classList.remove('SC1-active');
		});
	}
	if (fileHandlerCloseBtn) {
		fileHandlerCloseBtn.addEventListener('click', () => {
			fileHandlerModal.classList.remove('SC1-active');
		});
	}
	// Add event listener for protocol handler modal close
	const protocolHandlerClose = document.getElementById('SC1-protocol-handler-close');
	if (protocolHandlerClose) {
		protocolHandlerClose.addEventListener('click', () => {
			document.getElementById('SC1-protocol-handler-modal').classList.remove('SC1-active');
		});
	}
	// Close modals when clicking outside
	document.addEventListener('click', (e) => {
		const fileModal = document.getElementById('SC1-file-handler-modal');
		const protocolModal = document.getElementById('SC1-protocol-handler-modal');
		if (fileModal && e.target === fileModal) {
			fileModal.classList.remove('SC1-active');
		}
		if (protocolModal && e.target === protocolModal) {
			protocolModal.classList.remove('SC1-active');
		}
	});
});										