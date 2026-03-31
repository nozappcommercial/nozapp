'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies, headers } from 'next/headers';
import { logSecurityEvent } from '@/lib/logger';

/**
 * GENERATE AND "SEND" OTP
 * ───────────────────────
 * For now, this simulates sending an SMS by saving the code to the DB
 * and logging it to the console (development only).
 */
export async function generateAdminOTP() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) return { success: false, error: 'Non autorizzato o email mancante' };

        // Verify is_admin or role
        const { data: profile } = await supabase
            .from('users')
            .select('is_admin, role')
            .eq('id', user.id)
            .single();

        const hasAdminAccess = profile?.is_admin || ['admin', 'redattore', 'analista'].includes(profile?.role || '');
        if (!hasAdminAccess) return { success: false, error: 'Accesso riservato agli amministratori' };

        // REAL SENDING VIA SUPABASE AUTH (EMAIL)
        const { error: otpError } = await supabase.auth.signInWithOtp({
            email: user.email,
        });

        if (otpError) {
            console.error('[ADMIN MFA] Error sending Email OTP:', otpError);
            await logSecurityEvent('auth_failure', {
                userId: user.id,
                path: '/admin/login',
                level: 'error',
                metadata: { error: otpError.message, stage: 'otp_generation' }
            });
            return { success: false, error: 'Errore Supabase: ' + otpError.message };
        }
        
        await logSecurityEvent('auth_success', {
            userId: user.id,
            path: '/admin/login',
            metadata: { stage: 'otp_generation' }
        });

        return { success: true, message: 'Codice inviato via Email' };
    } catch (e: any) {
        console.error('[ADMIN MFA] Unexpected error in generateAdminOTP:', e);
        return { success: false, error: 'Errore imprevisto durante l\'invio.' };
    }
}


/**
 * VERIFY OTP
 * ──────────
 * Validates the code and sets a session cookie.
 */
export async function verifyAdminOTP(code: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { success: false, error: 'Non autorizzato' };

        // 1. MASTER OTP BYPASS (Security check: only if user is admin)
        const masterOtp = process.env.MASTER_ADMIN_OTP;
        if (masterOtp && code === masterOtp && masterOtp.length >= 8) {
            const { data: profile } = await supabase
                .from('users')
                .select('is_admin, role')
                .eq('id', user.id)
                .single();

            const hasAdminAccess = profile?.is_admin || ['admin', 'redattore', 'analista'].includes(profile?.role || '');
            if (hasAdminAccess) {
                console.log(`[ADMIN MFA] Master OTP used by admin: ${user.id}`);
                await logSecurityEvent('auth_success', {
                    userId: user.id,
                    path: '/admin/login',
                    metadata: { stage: 'master_otp_bypass' }
                });
                
                // Proceed to mark as verified and set cookie (logic follows below)
            } else {
                return { success: false, error: 'Codice non valido' };
            }
        } else {
            // 2. STANDARD SUPABASE OTP VERIFICATION
            const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
                email: user.email!,
                token: code,
                type: 'email'
            });

            if (verifyError || !verifyData.user) {
                await logSecurityEvent('auth_failure', {
                    userId: user.id,
                    path: '/admin/login',
                    level: 'warn',
                    metadata: { stage: 'otp_verification', error: verifyError?.message || 'Invalid token' }
                });
                return { success: false, error: 'Codice non valido o scaduto' };
            }
        }

        await logSecurityEvent('auth_success', {
            userId: user.id,
            path: '/admin/login',
            metadata: { stage: 'otp_verification_success' }
        });

        // Success: Mark as verified in our custom users table
        await supabase
            .from('users')
            .update({
                admin_verified_at: new Date().toISOString()
            })
            .eq('id', user.id);

        // Set secure session cookie (expires in 2 hours for security)
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'verified', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 2 // 2 hours
        });

        return { success: true };
    } catch (e: any) {
        console.error('[ADMIN MFA] Unexpected error in verifyAdminOTP:', e);
        return { success: false, error: 'Errore imprevisto durante la verifica.' };
    }
}

/**
 * GET ADMIN PROFILE
 */
export async function getAdminProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('users')
        .select('is_admin, role')
        .eq('id', user.id)
        .single();

    return profile;
}

/**
 * SIGN OUT ACTION
 * ────────────────
 * Signs out from Supabase and clears all session cookies (including admin).
 */
export async function signOutAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.auth.signOut();
    
    // Clear admin session cookie
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    
    if (user) {
        await logSecurityEvent('auth_success', {
            userId: user.id,
            path: '/admin',
            metadata: { stage: 'logout' }
        });
    }
    
    return { success: true };
}
