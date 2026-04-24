import { supabase } from '../supabase-config.js';

async function updateAuthUI() {
    // 1. Get current session from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    const authBtn = document.getElementById('auth-btn');
    const authBtnMobile = document.getElementById('auth-btn-mobile');
    const logoutBtn = document.getElementById('logout-btn');

    const profileIconDesktop = '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/></svg>';
    const profileIconMobile = '<span class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/></svg> My Profile</span>';

    // Admin users have full resident access — treat admin === resident for access checks
    const role = user?.user_metadata?.role;
    const hasResidentAccess = role === 'resident' || role === 'admin' || role === 'pending_admin';

    if (user) {
        // Logged In: Update UI to show profile icon instead of Login
        if (authBtn) {
            authBtn.innerHTML = profileIconDesktop;
            authBtn.href = '../profile.html';
        }
        if (authBtnMobile) {
            authBtnMobile.innerHTML = profileIconMobile;
            authBtnMobile.href = '../profile.html';
        }

        // If logged in but without a valid role (edge case), block resident-only pages
        if (!hasResidentAccess) {
            const residentOnlyPages = ['services.html'];
            const currentPage = window.location.pathname.toLowerCase();
            if (residentOnlyPages.some(page => currentPage.endsWith(page))) {
                window.location.href = '../login.html';
            }
        }
    } else {
        // 2. Not Logged In: Check if the user is trying to access a protected area
        const restrictedPages = [
            'admin.html',
            'admin_residents.html',
            'admin_permits.html',
            'admin_announcements.html',
            'services.html'
        ];

        const currentPage = window.location.pathname.toLowerCase();
        const isRestricted = restrictedPages.some(page => currentPage.endsWith(page));

        if (isRestricted) {
            // No alert needed usually, just a clean redirect
            window.location.href = '../login.html';
        }
    }

    // 3. Handle Logout Click
    // In your sidebar, the button has onclick="window.location.href='../login.html'"
    // You should change that to id="logout-btn" to use this logic:
    if (logoutBtn) {
        logoutBtn.onclick = async (e) => {
            e.preventDefault();
            const { error } = await supabase.auth.signOut();
            if (!error) {
                window.location.href = '../index.html';
            } else {
                console.error("Logout failed:", error.message);
            }
        };
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAuthUI);
} else {
    updateAuthUI();
}

// Real-time listener: If they logout in another tab, this tab reacts instantly
supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
        updateAuthUI();
    }
});