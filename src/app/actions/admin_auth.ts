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

    // Generate 4-digit code
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    const { error } = await supabase
        .from('users')
        .update({
            otp_code: otp,
            otp_expires_at: expiresAt
        })
        .eq('id', user.id);

    if (error) throw new Error('Errore nella generazione del codice');

    // SIMULATED SENDING
    console.log(`\n[ADMIN MFA] OTP for ${user.email}: ${otp}\n`);
    
    return { success: true, message: 'Codice inviato via SMS (simulato)' };
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
        .select('otp_code, otp_expires_at')
        .eq('id', user.id)
        .single();

    if (!profile) throw new Error('Profilo non trovato');
    if (!profile.otp_code || profile.otp_code !== code) {
        throw new Error('Codice non valido');
    }

    if (new Date(profile.otp_expires_at!) < new Date()) {
        throw new Error('Codice scaduto');
    }

    // Success: Mark as verified in DB
    await supabase
        .from('users')
        .update({
            otp_code: null,
            otp_expires_at: null,
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
