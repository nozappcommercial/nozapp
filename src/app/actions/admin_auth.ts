'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

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

        // Verify is_admin
        const { data: profile } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile?.is_admin) return { success: false, error: 'Accesso riservato agli amministratori' };

        // REAL SENDING VIA SUPABASE AUTH (EMAIL)
        const { error: otpError } = await supabase.auth.signInWithOtp({
            email: user.email,
        });

        if (otpError) {
            console.error('[ADMIN MFA] Error sending Email OTP:', otpError);
            return { success: false, error: 'Errore Supabase: ' + otpError.message };
        }
        
        return { success: true, message: 'Codice inviato via Email' };
    } catch (e: any) {
        console.error('[ADMIN MFA] Unexpected error in generateAdminOTP:', e);
        return { success: false, error: 'Errore imprevisto durante l\'invio.' };
    }
}

/**
 * UPDATE ADMIN PHONE (Initial Setup)
 */
export async function updateAdminPhone(phone: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Non autorizzato');

    // Verify is_admin
    const { data: profile } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!profile?.is_admin) throw new Error('Accesso riservato agli amministratori');

    const { error } = await supabase
        .from('users')
        .update({ phone_number: phone })
        .eq('id', user.id);

    if (error) throw new Error('Errore nell\'aggiornamento del numero di telefono');

    return { success: true };
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

        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            email: user.email!,
            token: code,
            type: 'email'
        });

        if (verifyError || !verifyData.user) {
            return { success: false, error: 'Codice non valido o scaduto' };
        }

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
        .select('is_admin, phone_number')
        .eq('id', user.id)
        .single();

    return profile;
}
