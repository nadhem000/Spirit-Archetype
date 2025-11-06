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
			'X-Client-Info': 'spiritual-guide-v2.9.2'
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
      console.log('✅ Session saved:', sessionData);
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  },

  // Get current session - FIXED VERSION
  getCurrentSession: function() {
    try {
      const savedSession = localStorage.getItem('currentUser');
      if (!savedSession) {
        console.log('❌ No session found in localStorage');
        return null;
      }
      
      const session = JSON.parse(savedSession);
      console.log('📋 Retrieved session:', session);
      
      // Validate required fields
      if (!session.id || !session.username || !session.loginTime) {
        console.log('❌ Session missing required fields');
        this.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      this.clearSession();
      return null;
    }
  },

  // Clear session
  clearSession: function() {
    try {
      localStorage.removeItem('currentUser');
      console.log('✅ Session cleared');
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  },

  // Check if session is valid - RELAXED VERSION
  isSessionValid: function(session) {
    if (!session || !session.loginTime) {
      console.log('❌ No session or loginTime');
      return false;
    }
    
    // Check if session is older than 7 days (more relaxed)
    const sessionAge = Date.now() - new Date(session.loginTime).getTime();
    const maxSessionAge = 7 * 24 * 60 * 60 * 1000; // 7 days instead of 24 hours
    
    const isValid = sessionAge < maxSessionAge;
    
    if (!isValid) {
      console.log('❌ Session expired - age:', this.formatTime(sessionAge), 'max:', this.formatTime(maxSessionAge));
      this.clearSession();
    } else {
      console.log('✅ Session valid - age:', this.formatTime(sessionAge));
    }
    
    return isValid;
  },

  // Helper to format time for logging
  formatTime: function(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  },

  // Generate secure session ID
  generateSessionId: function() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Update last verified timestamp
  updateLastVerified: function() {
    const session = this.getCurrentSession();
    if (session) {
      session.lastVerified = new Date().toISOString();
      localStorage.setItem('currentUser', JSON.stringify(session));
      console.log('✅ Last verified updated');
    }
  },

  // Enhanced session verification with better error handling
  verifySessionWithSupabase: async function() {
    try {
      const session = this.getCurrentSession();
      if (!session || !this.isSessionValid(session)) {
        return null;
      }

      console.log('🔐 Verifying session with Supabase for user:', session.username);
      
      const { data: users, error } = await supabaseClient
        .from('auth_users')
        .select('id, username, email, is_active')
        .eq('username', session.username)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ Supabase verification failed:', error);
        this.clearSession();
        return null;
      }

      if (!users) {
        console.log('❌ User not found or inactive');
        this.clearSession();
        return null;
      }

      console.log('✅ Session verified with Supabase');
      this.updateLastVerified();
      return users;
    } catch (error) {
      console.error('❌ Session verification error:', error);
      this.clearSession();
      return null;
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