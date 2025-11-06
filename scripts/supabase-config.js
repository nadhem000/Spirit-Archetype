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
			'X-Client-Info': 'spiritual-guide-v2.9.0'
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
				loginTime: new Date().toISOString(),
				sessionId: this.generateSessionId(),
				lastVerified: new Date().toISOString()
			};
			localStorage.setItem('currentUser', JSON.stringify(sessionData));
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
	
	// automatic session verification
	setupAutomaticRefresh: function() {
		// Check session every 30 minutes
		setInterval(() => {
			const session = this.getCurrentSession();
			if (session && this.isSessionValid(session)) {
				this.updateLastVerified();
				console.log('🔄 Session automatically refreshed');
			}
		}, 30 * 60 * 1000); // 30 minutes
		
		// Also refresh when user becomes active again
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) {
				const session = this.getCurrentSession();
				if (session && this.isSessionValid(session)) {
					this.updateLastVerified();
					console.log('🔄 Session refreshed on page visible');
				}
			}
		});
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
	
	// Check if session is valid
	isSessionValid: function(session) {
		if (!session || !session.loginTime) return false;
		
		const sessionAge = Date.now() - new Date(session.loginTime).getTime();
		const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
		
		return sessionAge < maxSessionAge;
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
	}
};

// Security validation function
function validateSecureConnection() {
	const isSecure = window.location.protocol === 'https:';
	const hasSupabase = !!supabaseClient;
	console.log('🔒 Security Check:');
	console.log('- HTTPS Connection:', isSecure);
	console.log('- Supabase Client Initialized:', hasSupabase);
	console.log('- Secure Origin:', window.location.origin);
	
	if (!isSecure) {
		console.warn('⚠️  Running on non-HTTPS protocol. Some features may be limited.');
	}
	return isSecure && hasSupabase;
}

// Initialize security check when script loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(validateSecureConnection, 1000);
  
  // Start automatic session refresh
  SessionManager.setupAutomaticRefresh();
});

// Export for global access
window.supabaseClient = supabaseClient;
window.validateSecureConnection = validateSecureConnection;
window.SessionManager = SessionManager;