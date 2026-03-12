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
    const isApiRoute = path.startsWith('/api');

    if (!user && !isAuthRoute && path !== '/' && !isApiRoute) {
        // Redirect unauthenticated users to login, except root.
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (user) {
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('onboarding_complete')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error(`[Middleware] Error fetching profile for ${user.id}:`, profileError);
        }

        const onboardingComplete = (profile as unknown as { onboarding_complete?: boolean })?.onboarding_complete ?? false;
        
        console.log(`[Middleware] User: ${user.email} (${user.id}), onboarding_complete: ${onboardingComplete}, path: ${path}`);

        // If it's an API route, don't redirect, just let the request through
        if (isApiRoute) {
            return supabaseResponse;
        }

        // Ensure we don't end in an infinite redirect loop if going to /onboarding
        if (!onboardingComplete && path !== '/onboarding' && !isAuthRoute) {
            console.log(`[Middleware] Case 1: Not complete & not on /onboarding -> Redirecting to /onboarding`);
            const url = request.nextUrl.clone();
            url.pathname = '/onboarding';
            return NextResponse.redirect(url);
        }

        if (onboardingComplete && (path === '/onboarding' || isAuthRoute || path === '/')) {
            console.log(`[Middleware] Case 2: Complete & (on /onboarding, /login, or root) -> Redirecting to /sphere`);
            const url = request.nextUrl.clone();
            url.pathname = '/sphere';
            return NextResponse.redirect(url);
        }

        if (isAuthRoute || path === '/') {
            console.log(`[Middleware] Case 3: (Auth route or root) -> Redirecting to /sphere`);
            const url = request.nextUrl.clone();
            url.pathname = '/sphere';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
