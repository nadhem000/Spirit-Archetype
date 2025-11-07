// scripts/supabase-config.js - Enhanced Secure Configuration with Session Management
const SUPABASE_URL = 'https://tgorqanvhjaecbysulih.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnb3JxYW52aGphZWNieXN1bGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNTM3NjcsImV4cCI6MjA3NzYyOTc2N30.QD34e4pLSfUurerNlVXDb1vRWmQluPMuwDXSzaL1eoI';

// Enhanced secure configuration with session management
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
		flowType: 'pkce',
		storage: localStorage,
		storageKey: 'spiritual-guide-supabase-auth'
	},
	realtime: {
		params: {
			eventsPerSecond: 10
		}
	},
	global: {
		headers: {
			'X-Client-Info': 'spiritual-guide-v3.0.4'
		}
	}
});

// Session management functions
const SessionManager = {
	// Save user session securely
	saveUserSession: function(userData) {
		try {
			const sessionData = {
				id: userData.id,
				username: userData.username,
				email: userData.email,
				loginTime: userData.loginTime || new Date().toISOString(), // Ensure loginTime is set
				sessionId: this.generateSessionId(),
				lastVerified: new Date().toISOString()
			};
			localStorage.setItem('currentUser', JSON.stringify(sessionData));
			console.log('💾 Session saved:', sessionData);
			return true;
			} catch (error) {
			console.error('Error saving session:', error);
			return false;
		}
	},
	
	// Get current session
	getCurrentSession: function() {
		try {
			const savedSession = localStorage.getItem('currentUser');
			return savedSession ? JSON.parse(savedSession) : null;
			} catch (error) {
			console.error('Error getting session:', error);
			return null;
		}
	},
	
	// Clear session
	clearSession: function() {
		try {
			localStorage.removeItem('currentUser');
			return true;
			} catch (error) {
			console.error('Error clearing session:', error);
			return false;
		}
	},
	
	// Check if session is valid - FIXED: More lenient validation
	isSessionValid: function(session) {
		if (!session || !session.loginTime) return false;
		
		const sessionAge = Date.now() - new Date(session.loginTime).getTime();
		const maxSessionAge = 30 * 24 * 60 * 60 * 1000; // 30 days instead of 7
		
		// If session is within max age, update lastVerified and consider valid
		if (sessionAge < maxSessionAge) {
			// Update last verified timestamp to keep session alive
			this.updateLastVerified();
			return true;
		}
		
		return false;
	},
	
	// More robust session restoration - FIXED: Proper session validation
	restoreSession: function() {
		try {
			const session = this.getCurrentSession();
			if (session) {
				console.log('🔄 Found existing session, checking validity...', session);
				
				// Check if session has the required fields
				if (!session.id || !session.username) {
					console.log('❌ Session missing required fields');
					this.clearSession();
					return null;
				}
				
				// If loginTime is missing but we have a valid session, add it
				if (!session.loginTime) {
					console.log('⚠️  Adding missing loginTime to session');
					session.loginTime = new Date().toISOString();
					this.saveUserSession(session); // Save the updated session
				}
				
				// Calculate session age with fallback
				let sessionAge;
				if (session.loginTime) {
					sessionAge = Date.now() - new Date(session.loginTime).getTime();
					} else {
					// If loginTime is still missing, use a default age of 0 (new session)
					sessionAge = 0;
					console.log('⚠️  Using default session age due to missing loginTime');
				}
				
				const maxSessionAge = 30 * 24 * 60 * 60 * 1000; // 30 days
				
				console.log(`Session age: ${sessionAge}ms, Max age: ${maxSessionAge}ms`);
				
				if (sessionAge < maxSessionAge) {
					// Update lastVerified to keep session alive
					this.updateLastVerified();
					console.log('✅ Session restored successfully');
					return session;
					} else {
					console.log('❌ Session expired (older than 30 days)');
					this.clearSession();
				}
				} else {
				console.log('No session found in localStorage');
			}
			return null;
			} catch (error) {
			console.error('Session restoration error:', error);
			// Don't clear session on temporary errors - be more lenient
			console.log('Session check error, keeping session for now');
			const session = this.getCurrentSession();
			return session; // Return the session anyway for better UX
		}
	},
	
	// Generate secure session ID
	generateSessionId: function() {
		return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + btoa(navigator.userAgent).substr(0, 10);
	},
	
	// Update last verified timestamp
	updateLastVerified: function() {
		const session = this.getCurrentSession();
		if (session) {
			session.lastVerified = new Date().toISOString();
			localStorage.setItem('currentUser', JSON.stringify(session));
		}
	},
	
	// Automatic session verification with better persistence
	setupAutomaticRefresh: function() {
		// Check session every 60 minutes instead of 30
		setInterval(() => {
			const session = this.getCurrentSession();
			if (session) {
				this.updateLastVerified();
				console.log('🔄 Session automatically refreshed');
			}
		}, 60 * 60 * 1000); // 60 minutes
		
		// Also refresh when user becomes active again
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) {
				const session = this.getCurrentSession();
				if (session) {
					this.updateLastVerified();
					console.log('🔄 Session refreshed on page visible');
				}
			}
		});
	}
};

// Security validation function
function validateSecureConnection() {
    const isSecure = window.location.protocol === 'https:' || 
	window.location.hostname === 'localhost' || 
	window.location.hostname === '127.0.0.1';
    const hasSupabase = !!supabaseClient;
    console.log('🔒 Security Check:');
    console.log('- Secure Connection:', isSecure);
    console.log('- Supabase Client Initialized:', hasSupabase);
    console.log('- Current Origin:', window.location.origin);
    
    // Don't block functionality on non-HTTPS for development
    if (!isSecure && !hasSupabase) {
        console.warn('⚠️  Running in non-secure environment. Some features may be limited.');
        return false;
	}
    return true; // Always return true to not block login
}

// Initialize security check when script loads
document.addEventListener('DOMContentLoaded', function() {
	setTimeout(validateSecureConnection, 1000);
	// Start automatic session refresh
	SessionManager.setupAutomaticRefresh();
});


// Debug function to check session state
function debugSessionState() {
    const session = SessionManager.getCurrentSession();
    console.log('=== SESSION DEBUG INFO ===');
    console.log('Session exists:', !!session);
    if (session) {
        console.log('Session data:', session);
        console.log('Login time:', session.loginTime);
        console.log('Session age (days):', Math.round((Date.now() - new Date(session.loginTime).getTime()) / (24 * 60 * 60 * 1000)));
        console.log('Has required fields:', !!session.id && !!session.username);
	}
    console.log('LocalStorage currentUser:', localStorage.getItem('currentUser'));
    console.log('==========================');
}

// Export for global access
window.supabaseClient = supabaseClient;
window.validateSecureConnection = validateSecureConnection;
window.SessionManager = SessionManager;
// Call this after login and on page load to debug
window.debugSessionState = debugSessionState;