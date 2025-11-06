// scripts/supabase-config.js - Enhanced Secure Configuration
const SUPABASE_URL = 'https://tgorqanvhjaecbysulih.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnb3JxYW52aGphZWNieXN1bGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNTM3NjcsImV4cCI6MjA3NzYyOTc2N30.QD34e4pLSfUurerNlVXDb1vRWmQluPMuwDXSzaL1eoI';

// Enhanced secure configuration
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // More secure authentication flow
    storage: localStorage, // Use secure storage
    storageKey: 'spiritual-guide-supabase-auth'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'spiritual-guide-v2.8.1'
    }
  }
});

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
});

// Export for global access
window.supabaseClient = supabaseClient;
window.validateSecureConnection = validateSecureConnection;