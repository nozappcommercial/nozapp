import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    supabaseResponse.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    supabaseResponse.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isAuthRoute = path.startsWith('/login');

    if (!user && !isAuthRoute && path !== '/') {
        // Redirect unauthenticated users to login, except root.
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (user) {
        const { data: profile } = await supabase
            .from('users')
            .select('onboarding_complete')
            .eq('id', user.id)
            .single();

        const onboardingComplete = (profile as unknown as { onboarding_complete?: boolean })?.onboarding_complete ?? false;

        // Ensure we don't end in an infinite redirect loop if going to /onboarding
        if (!onboardingComplete && path !== '/onboarding' && !isAuthRoute) {
            // User must complete onboarding
            const url = request.nextUrl.clone();
            url.pathname = '/onboarding';
            return NextResponse.redirect(url);
        }

        if (onboardingComplete && (path === '/onboarding' || isAuthRoute || path === '/')) {
            // User is fully authenticated, redirect them to main app view (/sphere)
            const url = request.nextUrl.clone();
            url.pathname = '/sphere';
            return NextResponse.redirect(url);
        }

        // For now, always redirect authenticated users away from root or login to /sphere if onboarding is complete
        // The above condition covers this, so we can remove the fallback block below if we want.
        // Let's keep it as a safety net if neither condition matched.
        if (isAuthRoute || path === '/') {
            const url = request.nextUrl.clone();
            url.pathname = '/sphere';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
