// Supabase configuration - loaded from server
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

async function getSupabaseConfig() {
    const res = await fetch('/api/auth/config');
    const config = await res.json();
    SUPABASE_URL = config.url;
    SUPABASE_ANON_KEY = config.anonKey;
    return { SUPABASE_URL, SUPABASE_ANON_KEY };
}

let _supabase = null;

async function initSupabase() {
    const config = await getSupabaseConfig();
    _supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    return _supabase;
}

// Rest of your auth code using _supabase
