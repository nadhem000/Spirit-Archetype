
// بيانات الأسئلة
const questions = [
	{
		id: 1,
		question_ar: "عند مواجهة تحدي كبير، ما هو رد فعلك الغريزي؟",
		question_en: "When faced with a major challenge, what is your instinctual reaction?",
		options: [
			{text_ar: "أتولى القيادة وأضع خطة عمل حاسمة", text_en: "I take charge and create a decisive action plan.", score_key: "A"},
			{text_ar: "أبحث عن المعنى الروحي والغاية العليا من هذا التحدي", text_en: "I seek the spiritual meaning and higher purpose of the crisis.", score_key: "B"},
			{text_ar: "أجمع معلومات وأحلل جميع الزوايا المحتملة بهدوء", text_en: "I gather information and calmly analyze all potential outcomes.", score_key: "C"},
			{text_ar: "أستغل الأزمة لإعادة تشكيل مساري بالكامل", text_en: "I completely change direction and use the crisis to rebuild myself.", score_key: "D"}
		]
	},
	{
		id: 2,
		question_ar: "ما هو المحفز الأعمق لك في الحياة المهنية؟",
		question_en: "What is your deepest professional motivator?",
		options: [
			{text_ar: "السعي للسلطة والوصول إلى قمة النجاح", text_en: "The pursuit of authority, influence, and reaching the pinnacle of success.", score_key: "A"},
			{text_ar: "الأحلام الداخلية والرؤى العميقة والاتصال بالمشاعر", text_en: "Inner dreams, emotional connection, and inspiring collective consciousness.", score_key: "B"},
			{text_ar: "تراكم المعرفة وفهم النظم المعقدة", text_en: "The accumulation of knowledge and understanding complex systems.", score_key: "C"},
			{text_ar: "التطور المستمر وتجاوز حدودي باستمرار", text_en: "Constant evolution, self-improvement, and pushing beyond past boundaries.", score_key: "D"}
		]
	},
	{
		id: 3,
		question_ar: "ما هو الدور الذي تضمله في العمل الجماعي أو الاجتماعي؟",
		question_en: "What role do you naturally assume in a team or social setting?",
		options: [
			{text_ar: "القائد الذي يوجه ويوضح الرؤية للجميع", text_en: "The Leader who delegates tasks and clarifies the core vision.", score_key: "A"},
			{text_ar: "المحفز الذي يلهم الفريق بالتفاؤل والطاقة", text_en: "The Motivator who inspires the team with positive energy and vision.", score_key: "B"},
			{text_ar: "المستشار الذي يقدم التحليل العميق والحلول", text_en: "The Consultant who offers deep analysis and strategic solutions.", score_key: "C"},
			{text_ar: "المبتكر الذي يقترح أفكاراً غير تقليدية ومختلفة", text_en: "The Innovator who proposes radical, effective, and unconventional ideas.", score_key: "D"}
		]
	},
	{
		id: 4,
		question_ar: "في أي بيئة تشعر بالهدوء والسكنية؟",
		question_en: "Where do you feel the greatest sense of profound peace?",
		options: [
			{text_ar: "في المساحات المفتوحة التي تمنح رؤية بعيدة (جبل، مرتفع)", text_en: "In open spaces that grant a broad, commanding view (e.g., mountains, high vantage points).", score_key: "A"},
			{text_ar: "قرب الماء أو في الطبيعة العميقة التي تغذي الحدس", text_en: "Near water or in deep nature, where intuition flows freely.", score_key: "B"},
			{text_ar: "في المكتبات أو الأماكن الهادئة التي تسمح بالتأمل", text_en: "In libraries or quiet places allowing for contemplation and analysis.", score_key: "C"},
			{text_ar: "في اللحظات التي تتغير فيها البيئة بشكل جذري", text_en: "In moments of radical change or moving into a completely new environment.", score_key: "D"}
		]
	},
	{
		id: 5,
		question_ar: "عندما تشعر بالإرهاق، ما الذي يعيدك إلى مركزك؟",
		question_en: "When feeling burnt out, what brings you back to center?",
		options: [
			{text_ar: "إنجاز مهمة مؤجلة لاستعادة السيطرة والتحكم", text_en: "Completing an outstanding task to regain control and momentum.", score_key: "A"},
			{text_ar: "أغرق نفسي في أحلام أو أكتب رواية أو نصاً رمزياً", text_en: "Engaging in creative writing, dreaming, or symbolic reflection.", score_key: "B"},
			{text_ar: "أبحث عن مهارة جديدة لتعلمها أو لغز لحله", text_en: "Learning a new skill or solving a complex puzzle.", score_key: "C"},
			{text_ar: "أغير مظهري أو أعيد ترتيب مساحتي بشكل جذري", text_en: "Changing my physical appearance or drastically reorganizing my space.", score_key: "D"}
		]
	},
	{
		id: 6,
		question_ar: "ما هو الخسارة الرمزية الأكثر أهمية التي تخشاها؟",
		question_en: "What is the most critical symbolic loss you fear?",
		options: [
			{text_ar: "فقدان السيطرة على مسار حياتك ومصيرك", text_en: "Losing control over your life's direction and destiny.", score_key: "A"},
			{text_ar: "فقدان اتصالك الداخلي بحدسك أو بالروح الجماعية", text_en: "Losing your deep connection to intuition or 'collective soul'.", score_key: "B"},
			{text_ar: "فقدان وضوح عقلك أو قدرتك على التفكير المنطقي", text_en: "Losing the clarity of your mind or analytical capacity.", score_key: "C"},
			{text_ar: "فقدان فرصة التحول والتطور والبدء من جديد", text_en: "Losing the opportunity to evolve, transform, or start anew.", score_key: "D"}
		]
	},
	{
		id: 7,
		question_ar: "كيف تتعامل مع شخص خان ثقتك؟",
		question_en: "How do you approach someone who has betrayed your trust?",
		options: [
			{text_ar: "أواجههم بشكل مباشر وحاسم", text_en: "I confront them directly and decisively to establish boundaries.", score_key: "A"},
			{text_ar: "أبتعد بهدوء، وأقدم التسامح إذا شعرت بالندم الصادق", text_en: "I quietly distance myself, offering forgiveness if sincerity is felt.", score_key: "B"},
			{text_ar: "أحلل دوافعهم وأضع حدوداً لمنع التكرار", text_en: "I analyze their motives to prevent future risks, setting calculated limits.", score_key: "C"},
			{text_ar: "أتغير وأتطور حتى لا يتمكنوا من إيذائي مجدداً", text_en: "I focus on developing my own resilience so their actions cannot affect me again.", score_key: "D"}
		]
	},
	{
		id: 8,
		question_ar: "ما هي القوة التي تستدعيها لتحدي ضغوط الحياة؟",
		question_en: "Which strength do you invoke to overcome life's pressures?",
		options: [
			{text_ar: "الشجاعة المطلقة والإرادة التي لا تلين", text_en: "Absolute courage and unyielding will.", score_key: "A"},
			{text_ar: "التعاطف وفهم أن كل شيء سيمر", text_en: "Empathy and the knowing that all things pass.", score_key: "B"},
			{text_ar: "الحكمة التي تستمد من دروس الماضي", text_en: "Wisdom derived from past failures and lessons.", score_key: "C"},
			{text_ar: "المرونة والقدرة على إعادة بناء الذات باستمرار", text_en: "Flexibility and the power to rebuild myself continuously.", score_key: "D"}
		]
	}
];

// بيانات النتائج
const results = {
	"A": {
		guide_ar: "الصقر/النسر",
		guide_en: "The Eagle/Hawk",
		title_ar: "مرشد الإرادة",
		title_en: "The Guide of Will",
		symbolic_meaning_ar: "القيادة، الرؤية، وقوة الإرادة. الصقر ينفذ الاستراتيجية بدقة متناهية.",
		symbolic_meaning_en: "Leadership, Vision, and Willpower. The Eagle executes the strategy with pinpoint accuracy.",
		core_challenge_ar: "فخ السيطرة الكاملة. خطر الإرهاق من محاولة القيام بكل شيء بنفسك. هذا يعيق التفويض الضروري.",
		core_challenge_en: "The Trap of Total Control. Risk of burnout from attempting to do everything yourself. This hinders necessary Delegation.",
		mission_90_days_ar: "التفويض الإلزامي: حدد شخصاً وقم بتدريبه لإدارة 3 مهام روتينية. حرر 10 ساعات أسبوعياً للتخطيط الاستراتيجي فقط.",
		mission_90_days_en: "Mandatory Delegation: Identify and train someone to manage 3 routine tasks. Free up 10 hours per week solely for strategic planning.",
		kpi_ar: "مؤشر الأداء: 'عدد القرارات الحرجة التي يتخذها عضو في الفريق دون تدخلي.'",
		kpi_en: "Execution KPI: Your daily focus metric is: 'Number of critical decisions made by a team member without my intervention.'",
		alliance_tip_ar: "لتحقيق التوازن، ابحث عن الحدسي (النمط B) لتخفيف اندفاعك، والمتحول (النمط D) لضمان المرونة.",
		alliance_tip_en: "To find balance, seek the Intuitive (Pattern B) to temper your drive, and the Transformation (Pattern D) to ensure flexible pivots."
	},
	"B": {
		guide_ar: "الدلفين/الحوت",
		guide_en: "The Whale/Dolphin",
		title_ar: "مرشد العمق",
		title_en: "The Guide of Depth",
		symbolic_meaning_ar: "الحدس، الوعي الجماعي، والعمق الإبداعي. الحوت يحمل حكمة الزمن العميقة.",
		symbolic_meaning_en: "Intuition, Collective Consciousness, and Creative Depth. The Whale carries the deep wisdom of time.",
		core_challenge_ar: "فخ تشتت النطاق. خيالك الواسع يؤدي إلى مشاريع متوازية، مما يمنع الإنجاز العميق والتجسيد المادي.",
		core_challenge_en: "The Trap of Scope Creep. Your vast imagination leads to parallel projects, preventing deep completion and physical grounding.",
		mission_90_days_ar: "التجسيد المادي: التزم بمشروع MVP واحد يتوافق مع رؤيتك. مهمتك هي إكمال 70% منه فعلياً قبل التفكير في أي فكرة رئيسية أخرى.",
		mission_90_days_en: "Physical Grounding: Commit to one single MVP project aligned with your vision. Your mission is to physically complete 70% of it before entertaining any other major idea.",
		kpi_ar: "مؤشر الأداء: 'الساعات التي تقضيها في التنفيذ المادي مقابل الساعات التي تقضيها في التخطيط المجرد.'",
		kpi_en: "Execution KPI: Your daily focus metric is: 'Hours spent on physical execution versus hours spent on abstract planning.'",
		alliance_tip_ar: "لتحقيق التوازن، ابحث عن القائد (النمط A) لفرض الحدود والتنفيذ، والحكيم (النمط C) لتنظيم رؤاك.",
		alliance_tip_en: "To find balance, seek the Leadership (Pattern A) to enforce boundaries and execution, and the Wisdom (Pattern C) to structure your insights."
	},
	"C": {
		guide_ar: "البومة/الذئب",
		guide_en: "The Owl/Wolf",
		title_ar: "مرشد الحكمة",
		title_en: "The Guide of Wisdom",
		symbolic_meaning_ar: "المعرفة الخفية، الاستراتيجية، والحماية. البومة ترى الحقيقة في الظلام؛ الذئب يحمي جوهره.",
		symbolic_meaning_en: "Hidden Knowledge, Strategy, and Protection. The Owl sees truth in the darkness; the Wolf protects its core.",
		core_challenge_ar: "فخ شلل التحليل. سعيك للمعرفة الكاملة (100% من البيانات) يمكن أن يوقف العمل الحاسم. تخاطر بفقدان الفرص المحسوبة.",
		core_challenge_en: "The Trap of Analysis Paralysis. Your drive for complete knowledge (100% data) can halt critical action. You risk missing calculated opportunities.",
		mission_90_days_ar: "عتبة العمل: حدد 'عتبة ثقة 80%' للقرارات الحرجة. بمجرد جمع 80% من البيانات، يجب أن تنفذ خلال 72 ساعة، حتى لو بقيت مجهولات بسيطة.",
		mission_90_days_en: "Action Threshold: Define an '80% Confidence Threshold' for critical decisions. Once 80% of data is collected, you must execute within 72 hours, even if minor unknowns remain.",
		kpi_ar: "مؤشر الأداء: 'عدد القرارات الرئيسية التي تم تنفيذها (وليس فقط تخطيطها) هذا الأسبوع.'",
		kpi_en: "Execution KPI: Your daily focus metric is: 'Number of major decisions executed (not just planned) this week.'",
		alliance_tip_ar: "لتحقيق التوازن، ابحث عن الحدسي (النمط B) لإلهام الاتصال العاطفي، والمتحول (النمط D) لدفعك نحو التغيير الضروري.",
		alliance_tip_en: "To find balance, seek the Intuitive (Pattern B) to inspire emotional connection, and the Transformation (Pattern D) to push you into necessary change."
	},
	"D": {
		guide_ar: "الأفعى/الفراشة",
		guide_en: "The Snake/Butterfly",
		title_ar: "مرشد الدورات",
		title_en: "The Guide of Cycles",
		symbolic_meaning_ar: "التحول الجذري، الشفاء، والمرونة. الأفعى تخلع جلدها؛ الفراشة تظهر من جديد.",
		symbolic_meaning_en: "Radical Transformation, Healing, and Resilience. The Snake sheds its skin; the Butterfly emerges reborn.",
		core_challenge_ar: "فخ عدم الاستقرار. التحولات الكبيرة المستمرة تمنعك من إنشاء الأساس المستدام اللازم لإرث يمتد لعقود.",
		core_challenge_en: "The Trap of Instability. Constant, major transformations prevent you from establishing the Sustainable Foundation needed for a multi-decade legacy.",
		mission_90_days_ar: "استقرار الجوهر: حدد 'جوهر غير قابل للتفاوض' لحياتك/عملك (مثل هدف دخلك أو قيمتك الأساسية). تأكد من أن جميع التحولات تخدم تعزيز هذا الجوهر.",
		mission_90_days_en: "Core Stability: Define a 'Non-Negotiable Core' for your life/business (e.g., your income goal or core value). Ensure all transformations serve to strengthen this core.",
		kpi_ar: "مؤشر الأداء: 'عدد الأيام المتتالية التي مرت دون بدء مشروع جديد أو تغيير الاتجاه الأساسي للمشروع الرئيسي.'",
		kpi_en: "Execution KPI: Your daily focus metric is: 'Number of consecutive days passed without starting a new project or changing the core direction of the primary MVP.'",
		alliance_tip_ar: "لتحقيق التوازن، ابحث عن القائد (النمط A) لفرض الانضباط والتركيز، والحكيم (النمط C) لتوفير الاستطالة أثناء تطوراتك السريعة.",
		alliance_tip_en: "To find balance, seek the Leadership (Pattern A) to enforce discipline and focus, and the Wisdom (Pattern C) to provide stability during your rapid evolutions."
	}
};



// بيانات الترجمة
const translations = {
	en: {
		SC1: {
			header: {
				title: "Spiritual Guide",
				subtitle: "Discover your spiritual pattern through this interactive test",
				language: {
					ar: "Arabic",
					en: "English"
				}
			},
			welcome: {
				title: "Welcome to the Spiritual Guide Test",
				description1: "This test will help you discover your spiritual pattern by analyzing your answers to a set of questions.",
				description2: "8 questions will be displayed, each with 4 options. Choose the option that reflects your true state.",
				startButton: "Start Test"
			},
			questions: {
				questionCounter: "Question {current} of {total}",
				previousButton: "Previous",
				nextButton: "Next",
				finishButton: "Show Result"
			},
			results: {
				title: "Spiritual Guide Test Result",
				symbolicMeaning: "Symbolic Meaning",
				coreChallenge: "Core Challenge",
				mission90Days: "90-Day Mission",
				kpi: "Key Performance Indicator",
				allianceTip: "Alliance Tip",
				restartButton: "Restart Test"
			},
			install: {
				installApp: "Install App"
			}
		}
	},
	ar: {
		SC1: {
			header: {
				title: "المرشد الروحي",
				subtitle: "اكتشف نمطك الروحي من خلال هذا الاختبار التفاعلي",
				language: {
					ar: "العربية",
					en: "English"
				}
			},
			welcome: {
				title: "مرحباً بك في اختبار المرشد الروحي",
				description1: "هذا الاختبار سيساعدك على اكتشاف نمطك الروحي من خلال تحليل إجاباتك على مجموعة من الأسئلة.",
				description2: "سيتم عرض 8 أسئلة، كل سؤال يحتوي على 4 خيارات. اختر الخيار الذي يعكس حالتك الحقيقية.",
				startButton: "ابدأ الاختبار"
			},
			questions: {
				questionCounter: "السؤال {current} من {total}",
				previousButton: "السابق",
				nextButton: "التالي",
				finishButton: "اظهر النتيجة"
			},
			results: {
				title: "نتيجة اختبار المرشد الروحي",
				symbolicMeaning: "المعنى الرمزي",
				coreChallenge: "التحدي الأساسي",
				mission90Days: "مهمة 90 يوم",
				kpi: "مؤشر الأداء الرئيسي",
				allianceTip: "نصيحة التحالف",
				restartButton: "إعادة الاختبار"
			},
			install: {
				installApp: "تثبيت التطبيق"
			}
		}
	}
};

// حالة التطبيق
let currentLanguage = 'en';
let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let scores = { A: 0, B: 0, C: 0, D: 0 };

// PWA Install Variables
let deferredPrompt;

// عناصر DOM
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

// PWA Install Logic
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the install button
  installBtn.style.display = 'block';
  
  // Apply translation to install button
  const installText = translate('SC1.install.installApp');
  installBtn.querySelector('span').textContent = installText;
});

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

      // Check for updates every hour
      setInterval(() => checkForUpdates(registration), 60 * 60 * 1000);
      
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
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
  if (!deferredPrompt) return;
  
  // Show the install prompt
  const result = await deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
    
    // Register background sync after installation
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('background-sync');
      }).then(() => {
        console.log('Background Sync registered after install');
      }).catch(error => {
        console.log('Background Sync registration failed:', error);
      });
    }
    
    // Hide the install button after successful installation
    installBtn.style.display = 'none';
  } else {
    console.log('User dismissed the install prompt');
  }
  
  // Clear the saved prompt since it can't be used again
  deferredPrompt = null;
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

// معالجة أحداث الأزرار
startBtn.addEventListener('click', () => {
	welcomeCard.classList.remove('SC1-active');
	questionCard.classList.add('SC1-active');
	displayQuestion(currentQuestionIndex);
});

prevBtn.addEventListener('click', () => {
	if (currentQuestionIndex > 0) {
		currentQuestionIndex--;
		displayQuestion(currentQuestionIndex);
	}
});

nextBtn.addEventListener('click', () => {
	if (currentQuestionIndex < questions.length - 1) {
		currentQuestionIndex++;
		displayQuestion(currentQuestionIndex);
		} else {
		// انتهاء الاختبار وعرض النتيجة
		questionCard.classList.remove('SC1-active');
		resultCard.classList.add('SC1-active');
		displayResult();
	}
});

restartBtn.addEventListener('click', () => {
	// إعادة تعيين الحالة
	currentQuestionIndex = 0;
	userAnswers = Array(questions.length).fill(null);
	scores = { A: 0, B: 0, C: 0, D: 0 };
	
	// العودة إلى بطاقة الترحيب
	resultCard.classList.remove('SC1-active');
	welcomeCard.classList.add('SC1-active');
	
	// إعادة تعيين شريط التقدم
	updateProgressBar();
	
	// تطبيق الترجمات
	applyTranslations();
});

// التهيئة الأولية
updatePageDirection();
applyTranslations();
updateProgressBar();
updateNavButtons();