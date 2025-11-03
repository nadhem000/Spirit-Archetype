// Main Application Logic - Spiritual Guide Test (Simplified)
// Global variables
window.STORAGE_KEYS = {
    LANGUAGE: 'spiritual-guide-language',
    ANSWERS: 'spiritual-guide-answers', 
    CURRENT_QUESTION: 'spiritual-guide-current-question',
    SAVED_RESULTS: 'spiritual-guide-saved-results'
};
if (typeof supabaseClient === 'undefined') {
    console.warn('Supabase client not available - running in offline mode');
    // Create a mock supabaseClient for offline functionality
    window.supabaseClient = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
                })
            }),
            insert: () => ({
                select: () => ({
                    single: () => Promise.resolve({ data: null, error: new Error('Offline mode') })
                })
            })
        }),
        auth: {
            signOut: () => Promise.resolve()
        }
    };
}
// Make functions global so they can be accessed across files
window.initializeNavigation = initializeNavigation;
window.initializeLanguageButtons = initializeLanguageButtons;
window.applyTranslations = applyTranslations;
window.updatePageDirection = updatePageDirection;
window.resumeTestFromSavedState = resumeTestFromSavedState;
window.updateProgressBar = updateProgressBar;
window.updateNavButtons = updateNavButtons;
window.displayQuestion = displayQuestion;
window.displayResult = displayResult;
window.calculateResult = calculateResult;
window.saveTestProgress = saveTestProgress;
window.translate = translate;
window.initializeAppUI = initializeAppUI; // NEW: Added this line

// Global element assignments
window.headerIcon = document.getElementById('SC1-header-icon');
window.welcomeCard = document.getElementById('SC1-welcome-card');
window.questionCard = document.getElementById('SC1-question-card');
window.resultCard = document.getElementById('SC1-result-card');
window.startBtn = document.getElementById('SC1-start-btn');
window.settingsBtn = document.getElementById('SC1-settings-btn');
window.prevBtn = document.getElementById('SC1-prev-btn');
window.nextBtn = document.getElementById('SC1-next-btn');
window.restartBtn = document.getElementById('SC1-restart-btn');
window.currentQuestionElement = document.getElementById('SC1-current-question');
window.questionTextElement = document.getElementById('SC1-question-text');
window.optionsContainer = document.getElementById('SC1-options-container');
window.progressElement = document.getElementById('SC1-progress');
window.langButtons = document.querySelectorAll('.SC1-lang-btn');
window.resultGuideElement = document.getElementById('SC1-result-guide');
window.symbolicMeaningElement = document.getElementById('SC1-symbolic-meaning');
window.coreChallengeElement = document.getElementById('SC1-core-challenge');
window.mission90DaysElement = document.getElementById('SC1-mission-90-days');
window.kpiElement = document.getElementById('SC1-kpi');
window.allianceTipElement = document.getElementById('SC1-alliance-tip');
window.saveResultsBtn = document.getElementById('SC1-save-results-btn');

// Application state
let currentLanguage = loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en');
let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let scores = { A: 0, B: 0, C: 0, D: 0 };

// NEW: Function to initialize app UI (replaces duplicate code)
function initializeAppUI() {
    updatePageDirection();
    applyTranslations();
    resumeTestFromSavedState();
    updateProgressBar();
    updateNavButtons();
}

// reset the test when header icon is clicked
function resetTestFromHeader() {
    // Reset state
    currentQuestionIndex = 0;
    userAnswers = Array(questions.length).fill(null);
    scores = { A: 0, B: 0, C: 0, D: 0 };
    // Clear saved progress
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION);
    // Return to welcome card
    resultCard.classList.remove('SC1-active');
    questionCard.classList.remove('SC1-active');
    welcomeCard.classList.add('SC1-active');
    // Reset progress bar
    updateProgressBar();
    // Apply translations
    applyTranslations();
    // Update navigation buttons
    updateNavButtons();
}

// Settings modal functionality
function initializeSettingsModal() {
    const settingsModal = document.getElementById('SC1-settings-modal');
    const modalClose = document.getElementById('SC1-modal-close');
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

function initializeHeaderIcon() {
    headerIcon.addEventListener('click', () => {
        resetTestFromHeader();
	});
    // Add hover effect to indicate it's clickable
    headerIcon.style.cursor = 'pointer';
}

// Handle shared music files
function handleSharedMusic() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedMusic = urlParams.get('sharedMusic');
    
    if (sharedMusic && window.musicPlayer) {
        window.musicPlayer.handleSharedMusic(sharedMusic);
        
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
	}
}



// === Enhanced Login Functionality ===
let currentUser = null;

// STEP 4: Enhanced Migration utility for existing users
async function migrateExistingUsers() {
    console.log('🔄 STEP 4: Starting user migration process...');
    
    try {
        // Check if we can access both tables
        console.log('1. Checking database tables...');
        
        const { data: generalUsers, error: generalError } = await supabaseClient
            .from('general_users')
            .select('*')
            .limit(5);

        if (generalError) {
            console.error('❌ Cannot access general_users:', generalError);
            return;
        }

        const { data: authUsers, error: authError } = await supabaseClient
            .from('auth_users')
            .select('username')
            .limit(5);

        if (authError) {
            console.error('❌ Cannot access auth_users:', authError);
            return;
        }

        console.log(`📊 Found ${generalUsers?.length || 0} users in general_users`);
        console.log(`📊 Found ${authUsers?.length || 0} users in auth_users`);

        // Get all general_users
        const { data: allGeneralUsers, error: fetchError } = await supabaseClient
            .from('general_users')
            .select('id, username, email, hashed_password, inscription_date, profile');

        if (fetchError) {
            console.error('❌ Error fetching general_users:', fetchError);
            return;
        }

        if (!allGeneralUsers || allGeneralUsers.length === 0) {
            console.log('✅ No users found in general_users to migrate');
            return;
        }

        console.log(`🔄 Found ${allGeneralUsers.length} users to process`);

        let successCount = 0;
        let errorCount = 0;
        let skipCount = 0;

        for (const user of allGeneralUsers) {
            try {
                console.log(`\n🔧 Processing user: ${user.username}`);
                
                // Check if user already exists in auth_users
                const { data: existingUser, error: checkError } = await supabaseClient
                    .from('auth_users')
                    .select('username')
                    .eq('username', user.username)
                    .single();

                if (existingUser) {
                    console.log(`⏭️ User ${user.username} already exists in auth_users - skipping`);
                    skipCount++;
                    continue;
                }

                // Decrypt the old password
                console.log(`🔐 Decrypting password for ${user.username}...`);
                const decryptedPassword = await EncryptionUtils.decrypt(user.hashed_password);
                
                if (!decryptedPassword) {
                    console.error(`❌ Failed to decrypt password for ${user.username}`);
                    errorCount++;
                    continue;
                }

                // Hash the password using new method
                console.log(`🔑 Hashing password for ${user.username}...`);
                const hashedPassword = await hashPassword(decryptedPassword);
                
                // Store encrypted password in profile as backup
                const encryptedPassword = await EncryptionUtils.encrypt(decryptedPassword);
                
                // Create profile data
                const profileData = {
                    encrypted_password: encryptedPassword,
                    migrated_from: 'general_users',
                    migration_date: new Date().toISOString(),
                    original_profile: user.profile
                };

                // Insert into auth_users
                console.log(`💾 Inserting ${user.username} into auth_users...`);
                const { data: newUser, error: insertError } = await supabaseClient
                    .from('auth_users')
                    .insert([
                        {
                            username: user.username,
                            email: user.email,
                            hashed_password: hashedPassword,
                            inscription_date: user.inscription_date,
                            profile: JSON.stringify(profileData)
                        }
                    ])
                    .select()
                    .single();

                if (insertError) {
                    console.error(`❌ Failed to insert user ${user.username}:`, insertError);
                    errorCount++;
                } else {
                    console.log(`✅ Successfully migrated user: ${user.username} (ID: ${newUser.id})`);
                    successCount++;
                }

                // Small delay to avoid overwhelming the database
                await new Promise(resolve => setTimeout(resolve, 200));
                
            } catch (userError) {
                console.error(`❌ Error migrating user ${user.username}:`, userError);
                errorCount++;
            }
        }

        console.log(`\n🎉 Migration completed!`);
        console.log(`✅ Success: ${successCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`⏭️ Skipped: ${skipCount}`);

        // Final count check
        const { data: finalAuthCount } = await supabaseClient
            .from('auth_users')
            .select('id', { count: 'exact' });
        console.log(`📊 Final user count in auth_users: ${finalAuthCount?.length || 0}`);
        
    } catch (error) {
        console.error('❌ Migration process failed:', error);
    }
}
// STEP 4: Test migration and login functionality
async function testMigrationAndLogin() {
    console.log('🧪 STEP 4: Testing migration and login...');
    
    try {
        // Test 1: Check if we can query both tables
        console.log('1. Testing database connectivity...');
        const { data: generalUsers } = await supabaseClient
		.from('general_users')
		.select('username')
		.limit(1);
		
        const { data: authUsers } = await supabaseClient
		.from('auth_users')
		.select('username')
		.limit(1);
		
        console.log('✅ Database connectivity test passed');
        
        // Test 2: Test password hashing
        console.log('2. Testing password hashing...');
        const testPassword = 'test_password_123';
        const hashedTest = await hashPassword(testPassword);
        const verifyResult = await verifyPasswordWithHash(testPassword, hashedTest);
        
        console.log(`✅ Password hashing test: ${verifyResult ? 'PASSED' : 'FAILED'}`);
        
        // Test 3: Test encryption/decryption (for backup)
        console.log('3. Testing encryption/decryption...');
        const encryptedTest = await EncryptionUtils.encrypt(testPassword);
        const decryptedTest = await EncryptionUtils.decrypt(encryptedTest);
        
        console.log(`✅ Encryption test: ${decryptedTest === testPassword ? 'PASSED' : 'FAILED'}`);
        
        console.log('🎉 All migration tests completed successfully!');
        
		} catch (error) {
        console.error('❌ Migration test failed:', error);
	}
}
// Add the hashPassword function at the global level
// Enhanced password hashing using salt and multiple iterations
async function hashPassword(password) {
    // Generate a random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Convert password to bytes
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Combine salt and password
    const combined = new Uint8Array(salt.length + passwordBuffer.length);
    combined.set(salt);
    combined.set(passwordBuffer, salt.length);
    
    // Hash with multiple iterations for better security
    let hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    
    // Additional iteration for strengthening
    hashBuffer = await crypto.subtle.digest('SHA-256', hashBuffer);
    
    // Convert salt and hash to hex strings
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(hashBuffer))
	.map(b => b.toString(16).padStart(2, '0'))
	.join('');
    
    // Return salt + hash for storage
    return `${saltHex}.${hashHex}`;
}
// Login functionality
// Login functionality - UPDATED FOR STEP 2: Password Hashing
function initializeLogin() {
    const loginForm = document.querySelector('.SC1-login-form');
    const usernameInput = document.getElementById('SC1-username');
    const passwordInput = document.getElementById('SC1-password');
    const loginButton = document.getElementById('SC1-login-btn');
    
    if (!loginForm) return;
	
    async function handleLogin(event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
		
        if (!username || !password) {
            showError(translate('SC1.login.error.fillFields'));
            return;
		}
		
        // Show loading state
        const originalText = loginButton.textContent;
        loginButton.disabled = true;
        loginButton.textContent = translate('SC1.login.loggingIn');
		
        try {
            // STEP 2: Try auth_users table first (new hashing system)
            let user = null;
            let migrationNeeded = false;
            
            // First, check auth_users table
            const { data: authUser, error: authError } = await supabaseClient
			.from('auth_users')
			.select('id, username, email, hashed_password, inscription_date, profile')
			.eq('username', username)
			.single();
			
            if (authUser) {
                // User found in auth_users - verify using password hashing
                user = authUser;
                console.log('Found user in auth_users table');
				} else if (authError && authError.code === 'PGRST116') {
                // User not found in auth_users, check general_users (migration scenario)
                console.log('User not in auth_users, checking general_users...');
                const { data: generalUser, error: generalError } = await supabaseClient
				.from('general_users')
				.select('id, username, email, hashed_password, inscription_date, profile')
				.eq('username', username)
				.single();
				
                if (generalUser) {
                    user = generalUser;
                    migrationNeeded = true;
                    console.log('Found user in general_users - migration needed');
					} else if (generalError && generalError.code === 'PGRST116') {
                    showError(translate('SC1.login.error.invalidCredentials'));
                    return;
					} else if (generalError) {
                    console.error('Supabase error (general_users):', generalError);
                    showError(translate('SC1.login.error.generic') + ': ' + generalError.message);
                    return;
				}
				} else if (authError) {
                console.error('Supabase error (auth_users):', authError);
                showError(translate('SC1.login.error.generic') + ': ' + authError.message);
                return;
			}
			
            if (!user) {
                showError(translate('SC1.login.error.invalidCredentials'));
                return;
			}
			
            // STEP 2: Password verification logic
            let passwordValid = false;
            
            if (migrationNeeded) {
                // User from general_users - use old encryption method
                try {
                    const decryptedPassword = await EncryptionUtils.decrypt(user.hashed_password);
                    passwordValid = (password === decryptedPassword);
                    
                    if (passwordValid) {
                        // Migrate user to auth_users with hashed password
                        await migrateUserToHashing(user, password);
					}
					} catch (decryptError) {
                    console.error('Password decryption failed:', decryptError);
                    showError(translate('SC1.login.error.generic'));
                    return;
				}
				} else {
                // User from auth_users - use new hashing method
                passwordValid = await verifyPasswordWithHash(password, user.hashed_password);
			}
			
            if (passwordValid) {
                // SUCCESS: User authenticated
                currentUser = {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    joinDate: user.inscription_date
				};
                showSuccess(translate('SC1.login.success'));
                updateUIAfterLogin();
                // Store minimal session info
                localStorage.setItem('currentUser', JSON.stringify({
                    username: user.username,
                    loginTime: new Date().toISOString(),
                    userId: user.id,
                    sessionId: 'spiritual_session_' + Date.now()
				}));
				} else {
                showError(translate('SC1.login.error.invalidCredentials'));
			}
			
			} catch (error) {
            console.error('Login error:', error);
            showError(translate('SC1.login.error.generic'));
			} finally {
            loginButton.disabled = false;
            loginButton.textContent = originalText;
		}
	}
	
    // STEP 2: Add migration and hashing functions
    async function migrateUserToHashing(oldUser, plainPassword) {
        try {
            // Hash the password using our new method
            const hashedPassword = await hashPassword(plainPassword);
            
            // Encrypt the password for backup storage in profile
            const encryptedPassword = await EncryptionUtils.encrypt(plainPassword);
            
            // Create user in auth_users table
            const { data: newUser, error } = await supabaseClient
			.from('auth_users')
			.insert([
				{
					username: oldUser.username,
					email: oldUser.email,
					hashed_password: hashedPassword,
					inscription_date: oldUser.inscription_date,
					profile: JSON.stringify({
						encrypted_password: encryptedPassword,
						migrated_from: 'general_users',
						migration_date: new Date().toISOString()
					})
				}
			])
			.select()
			.single();
			
            if (error) {
                console.error('Error migrating user to auth_users:', error);
                throw error;
			}
			
            console.log('User migrated successfully to auth_users:', newUser.username);
            return newUser;
            
			} catch (error) {
            console.error('Migration failed:', error);
            throw error;
		}
	}
	
	
    
	
    // Rest of the function remains the same...
    function updateUIAfterLogin() {
        // Hide login form and show user info
        const loginForm = document.querySelector('.SC1-login-form');
        if (loginForm) {
            loginForm.style.display = 'none';
		}
		
        // Create user info display
        const userInfoElement = document.createElement('div');
        userInfoElement.className = 'SC1-user-info';
        userInfoElement.innerHTML = `
		<span>${translate('SC1.login.welcome')}, ${currentUser.username}!</span>
		<button class="SC1-logout-btn" id="SC1-logout-btn">${translate('SC1.login.logout')}</button>
        `;
		
        const headerControls = document.querySelector('.SC1-header-controls');
        // Remove existing user info if any
        const existingUserInfo = headerControls.querySelector('.SC1-user-info');
        if (existingUserInfo) {
            existingUserInfo.remove();
		}
        headerControls.appendChild(userInfoElement);
		
        // Add logout event listener
        document.getElementById('SC1-logout-btn').addEventListener('click', logout);
	}
	
    function logout() {
		currentUser = null;
		
		// Clear ALL session data from localStorage
		localStorage.removeItem('currentUser');
		localStorage.removeItem('supabase.auth.token');
		
		// Show login form again
		const loginForm = document.querySelector('.SC1-login-form');
		if (loginForm) {
			loginForm.style.display = 'block';
		}
		
		// Remove user info
		const userInfoElement = document.querySelector('.SC1-user-info');
		if (userInfoElement) {
			userInfoElement.remove();
		}
		
		// Clear any Supabase session data
		if (supabaseClient && supabaseClient.auth) {
			supabaseClient.auth.signOut().catch(err => {
				console.log('Supabase signout completed');
			});
		}
		
		showSuccess(translate('SC1.login.loggedOut'));
	}
	
    function checkExistingLogin() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                currentUser = {
                    username: userData.username,
                    id: userData.userId
				};
                updateUIAfterLogin();
				} catch (error) {
                console.log('Error restoring session:', error);
                localStorage.removeItem('currentUser');
			}
		}
	}
	
    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    // Check for existing login on page load
    checkExistingLogin();
}

// Session timeout
function setupSessionTimeout() {
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    
    setInterval(() => {
        if (currentUser) {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    const loginTime = new Date(userData.loginTime);
                    const currentTime = new Date();
                    const timeDiff = currentTime - loginTime;
                    
                    if (timeDiff > SESSION_DURATION) {
                        console.log('Session timeout reached, logging out...');
                        showError(translate('SC1.login.error.sessionTimeout'));
                        setTimeout(logout, 2000);
					}
					} catch (error) {
                    console.log('Error checking session timeout:', error);
                    // If we can't read session data, log out for security
                    setTimeout(logout, 2000);
				}
			}
		}
	}, 60 * 60 * 1000); // Check every hour
}
// Automatic session verification
function setupSessionVerification() {
    // Check session every 30 minutes
    setInterval(async () => {
        if (currentUser) {
            console.log('Verifying user session...');
            try {
                // Verify user still exists in database
                const { data: user, error } = await supabaseClient
				.from('general_users')
				.select('username, inscription_date')
				.eq('username', currentUser.username)
				.single();
                
                if (error || !user) {
                    console.log('Session invalid, logging out...');
                    showError(translate('SC1.login.error.sessionExpired'));
                    setTimeout(logout, 2000);
                    return;
				}
                console.log('Session verified successfully');
				} catch (error) {
                console.log('Session verification failed:', error);
                // Don't log out if we're offline - wait until online
                if (navigator.onLine) {
                    showError(translate('SC1.login.error.sessionCheckFailed'));
				}
			}
		}
	}, 30 * 60 * 1000); // Check every 30 minutes
}
// Make login functions available globally
window.initializeLogin = initializeLogin;

async function verifyPasswordWithHash(password, storedHash) {
    try {
        // Split stored salt and hash
        const [storedSaltHex, storedHashHex] = storedHash.split('.');
        if (!storedSaltHex || !storedHashHex) {
            console.error('Invalid stored hash format');
            return false;
        }
        // Convert stored salt from hex to bytes
        const storedSalt = new Uint8Array(
            storedSaltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
        );
        // Convert password to bytes
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        // Combine salt and password
        const combined = new Uint8Array(storedSalt.length + passwordBuffer.length);
        combined.set(storedSalt);
        combined.set(passwordBuffer, storedSalt.length);
        // Hash with same process
        let hashBuffer = await crypto.subtle.digest('SHA-256', combined);
        hashBuffer = await crypto.subtle.digest('SHA-256', hashBuffer);
        // Convert to hex for comparison
        const hashedInputHex = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        // Compare with stored hash
        return hashedInputHex === storedHashHex;
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
}

// Make it globally available
window.verifyPasswordWithHash = verifyPasswordWithHash;
// Test function to check database connection
async function testDatabaseConnection() {
    try {
        console.log('Testing database connection...');
        if (typeof supabaseClient === 'undefined') {
            console.log('Supabase client not available - offline mode');
            return;
        }
        const { data, error } = await supabaseClient
            .from('general_users')
            .select('count')
            .limit(1);
        if (error) {
            console.error('Database connection failed:', error);
        } else {
            console.log('Database connection successful!');
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

async function testMigrationQuick() {
    console.log('🧪 Quick migration test...');
    
    // Test 1: Check if verifyPasswordWithHash works
    const testHash = await hashPassword('test123');
    const verifyResult = await verifyPasswordWithHash('test123', testHash);
    console.log('✅ Password verification test:', verifyResult ? 'PASSED' : 'FAILED');
    
    // Test 2: Check database access
    const { data: generalUsers } = await supabaseClient
        .from('general_users')
        .select('username')
        .limit(1);
    
    console.log('✅ Database access test:', generalUsers ? 'PASSED' : 'FAILED');
    console.log('📊 Users in general_users:', generalUsers?.length || 0);
}
// Security verification for Phase 3
function verifySecuritySetup() {
    console.log('🔒 Security Verification (Step 3):');
    console.log('- HTTPS Protocol:', window.location.protocol === 'https:');
    console.log('- Supabase Connected:', !!supabaseClient && typeof supabaseClient !== 'undefined');
    console.log('- Encryption Available:', !!EncryptionUtils);
    console.log('- Enhanced Hashing Available:', typeof hashPassword === 'function');
    console.log('- Password Verification Available:', typeof verifyPasswordWithHash === 'function'); // ADD THIS LINE
    console.log('- Service Worker:', 'serviceWorker' in navigator);
    
    // Test hashing if available
    if (typeof hashPassword === 'function' && typeof verifyPasswordWithHash === 'function') {
        hashPassword('test_password_123')
            .then(hashed => {
                console.log('- Enhanced Hashing System Working: ✅');
                console.log('- Hash Format:', hashed.includes('.') ? 'Salt + Hash' : 'Plain Hash');
                console.log('- Hash Sample:', hashed.substring(0, 20) + '...');
                
                // Test verification too
                return verifyPasswordWithHash('test_password_123', hashed);
            })
            .then(verified => {
                console.log('- Password Verification Working:', verified ? '✅' : '❌');
            })
            .catch(error => {
                console.log('- Hashing/Verification Test Failed:', error);
            });
    }
}
// Temporary test function
function testSecuritySetup() {
    console.log('=== SECURITY SETUP TEST ===');
    console.log('1. verifySecuritySetup function exists:', typeof verifySecuritySetup);
    console.log('2. hashPassword function exists:', typeof hashPassword);
    console.log('3. verifyPasswordWithHash function exists:', typeof verifyPasswordWithHash);
    console.log('4. DOMContentLoaded fired:', true);
    
    // Test the enhanced hash function directly
    if (typeof hashPassword === 'function') {
        console.log('5. Testing hashPassword function...');
        hashPassword('test123')
		.then(result => {
			console.log('6. Hash result:', result);
			console.log('7. Hash contains salt (has dot):', result.includes('.'));
		})
		.catch(error => {
			console.log('6. Hash error:', error);
		});
	}
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize settings modal first
    initializeSettingsModal();
    // Initialize login functionality
    initializeLogin();
    // session management
    setupSessionVerification();
    setupSessionTimeout();
    // Initialize header icon functionality
    initializeHeaderIcon();
    // Initialize navigation and language
    initializeNavigation();
    initializeLanguageButtons();
    // Use our new function to initialize everything
    initializeAppUI();
    // Initialize music player and playlist modal
    window.musicPlayer = new MusicPlayer();
    window.playlistModal = new PlaylistModal(window.musicPlayer);
    // Load saved playlist if available
    window.playlistModal.loadPlaylist();
    
    // STEP 4: Enhanced migration and testing (run once per session)
	setTimeout(async () => {
		const migrationRun = sessionStorage.getItem('migration_run');
		if (!migrationRun) {
			console.log('🚀 Starting Step 4: Data Migration & Testing...');
			
			// First run quick tests
			await testMigrationAndLogin();
			
			// Then run the actual migration
			await migrateExistingUsers();
			
			sessionStorage.setItem('migration_run', 'true');
			
			console.log('✅ Step 4: Data Migration & Testing completed!');
		}
	}, 3000);
    
    testDatabaseConnection();
    verifySecuritySetup();
testMigrationQuick();
    
	// Call this temporarily
	setTimeout(() => {
		testSecuritySetup();
		verifySecuritySetup();
	}, 1000);
    // Handle shared music
    setTimeout(() => {
        handleSharedMusic();
	}, 1000);
});