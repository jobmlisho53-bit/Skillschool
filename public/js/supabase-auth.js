// Supabase configuration
const SUPABASE_URL = 'https://xaqcsemwghouqmdotqnb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWNzZW13Z2hvdXFtZG90cW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjY3NjUsImV4cCI6MjA5MDgwMjc2NX0.7tBsxE2uy7uOPlxMUmF6YNMBOhbJloenH7_T7WptVpc';

// Create Supabase client
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function initAuth() {
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (session) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('user-name').textContent = session.user.email?.split('@')[0] || 'User';
        if (session.user.user_metadata?.avatar_url) {
            document.getElementById('user-avatar').src = session.user.user_metadata.avatar_url;
        }
        
        // Link anonymous progress
        const anonymousId = localStorage.getItem('user_id');
        if (anonymousId && anonymousId !== session.user.id) {
            await fetch('/api/progress/migrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ anonymousId, userId: session.user.id })
            });
            localStorage.setItem('user_id', session.user.id);
        } else if (!localStorage.getItem('user_id')) {
            localStorage.setItem('user_id', session.user.id);
        }
    } else {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

async function loginWithGoogle() {
    const { error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'https://skillschool-dbc1.vercel.app/courses'
        }
    });
    if (error) console.error('Login error:', error);
}

async function logout() {
    await _supabase.auth.signOut();
    localStorage.removeItem('user_id');
    location.reload();
}

// Add event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) loginBtn.addEventListener('click', loginWithGoogle);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    initAuth();
});

// Listen for auth changes
_supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('user_id', session.user.id);
        location.reload();
    }
});
