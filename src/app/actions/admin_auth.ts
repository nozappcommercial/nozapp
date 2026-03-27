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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Non autorizzato');

    // Verify is_admin
    const { data: profile } = await supabase
        .from('users')
        .select('is_admin, phone_number')
        .eq('id', user.id)
        .single();

    if (!profile?.is_admin) throw new Error('Accesso riservato agli amministratori');
    if (!profile.phone_number) throw new Error('Numero di telefono non configurato');

    // REAL SENDING VIA SUPABASE AUTH
    const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: profile.phone_number,
    });

    if (otpError) {
        console.error('[ADMIN MFA] Error sending OTP:', otpError);
        throw new Error('Errore nell\'invio del codice via SMS: ' + otpError.message);
    }
    
    return { success: true, message: 'Codice inviato via SMS' };
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Non autorizzato');

    const { data: profile } = await supabase
        .from('users')
        .select('phone_number')
        .eq('id', user.id)
        .single();

    if (!profile?.phone_number) throw new Error('Numero di telefono non trovato');

    // VERIFY OTP VIA SUPABASE AUTH
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        phone: profile.phone_number,
        token: code,
        type: 'sms'
    });

    if (verifyError || !verifyData.user) {
        throw new Error('Codice non valido o scaduto');
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
