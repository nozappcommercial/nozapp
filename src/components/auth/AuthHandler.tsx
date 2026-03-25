'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * AuthHandler Component
 * --------------------
 * This client-side component monitors Supabase auth state changes and 
 * automatically cleans up sensitive tokens from the URL fragment (hash).
 * 
 * It ensures that once Supabase has processed the recovery or access tokens 
 * from the URL (e.g., after clicking a reset password link), the address bar 
 * is updated to a clean URL, improving security and UX.
 */
export default function AuthHandler() {
    useEffect(() => {
        const supabase = createClient();

        // Listen for auth state changes (SignIn, PasswordRecovery, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                console.log('[AuthHandler] Password recovery detected, redirecting to update-password...');
                // Redirect to the update-password view
                window.location.href = '/login?view=update-password';
                return;
            }

            // Check if we have sensitive tokens in the URL fragment
            if (typeof window !== 'undefined' && window.location.hash) {
                const hash = window.location.hash;
                if (
                    hash.includes('access_token=') || 
                    hash.includes('recovery_token=') || 
                    hash.includes('type=recovery')
                ) {
                    console.log(`[AuthHandler] Detected sensitive hash (${event}), clearing address bar...`);
                    
                    // Replace the URL with a clean version (without the hash)
                    // We use replaceState so that the back button doesn't loop through the sensitive URL
                    const cleanUrl = window.location.pathname + window.location.search;
                    window.history.replaceState(null, '', cleanUrl);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return null; // This component doesn't render anything
}
