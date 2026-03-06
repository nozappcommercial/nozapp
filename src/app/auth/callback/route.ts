import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && session?.user) {
            // Upsert user to ensure they exist in our users table
            await supabase.from('users').upsert({
                id: session.user.id,
                email: session.user.email!,
                // onboarding_complete defaults to false in schema
            }, { onConflict: 'id' });

            // Check if onboarding is complete
            const { data: profile } = await supabase
                .from('users')
                .select('onboarding_complete')
                .eq('id', session.user.id)
                .single();

            const onboardingComplete = (profile as any)?.onboarding_complete ?? false;

            if (!onboardingComplete) {
                return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
            } else {
                return NextResponse.redirect(new URL('/sphere', requestUrl.origin));
            }
        }
    }

    // Return to login if something failed or no code present.
    // We can pass an error query parameter if needed.
    return NextResponse.redirect(new URL('/login?error=auth', requestUrl.origin));
}
