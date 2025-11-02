// scripts/supabase-config.js
const SUPABASE_URL = 'https://tgorqanvhjaecbysulih.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnb3JxYW52aGphZWNieXN1bGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNTM3NjcsImV4cCI6MjA3NzYyOTc2N30.QD34e4pLSfUurerNlVXDb1vRWmQluPMuwDXSzaL1eoI';

// Create Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Security validation
console.log('Supabase connection secure:', window.location.protocol === 'https:');