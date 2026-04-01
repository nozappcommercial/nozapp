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

    if (!user && !isAuthRoute && !isApiRoute) {
        // Redirect unauthenticated users to login, except root.
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (user) {
        let { data: profile, error: profileError } = await supabase
            .from('users')
            .select('onboarding_complete, role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error(`[Middleware] Error fetching profile for ${user.id}:`, profileError);
            // Fallback: Se la query fallisce (es. colonna role non ancora aggiunta al DB), 
            // tentiamo di recuperare almeno l'onboarding_complete per non bloccare l'utente.
            console.log(`[Middleware] Attempting fallback for onboarding_complete...`);
            const { data: fallback, error: fallbackError } = await supabase
                .from('users')
                .select('onboarding_complete')
                .eq('id', user.id)
                .maybeSingle();

            if (fallbackError) {
                console.error(`[Middleware] Fallback failed:`, fallbackError);
            } else if (fallback) {
                profile = fallback as any;
            } else {
                console.warn(`[Middleware] No profile found for user ${user.id}, might be a new registration.`);
            }
        }

        const onboardingComplete = (profile as any)?.onboarding_complete ?? false;
        const role = (profile as any)?.role ?? 'base';
        const hasAdminAccess = role === 'admin' || role === 'redattore' || role === 'analista';
        
        console.log(`[Middleware] User: ${user.email} (${user.id}), role: ${role}, path: ${path}`);

        // If it's an API route, don't redirect, just let the request through
        if (isApiRoute) {
            return supabaseResponse;
        }

        // ADMIN ROUTES PROTECTION (Role + MFA)
        if (path.startsWith('/admin')) {
            if (!hasAdminAccess) {
                console.log(`[Middleware] Unauthorized admin access attempt by ${user.email}`);
                const url = request.nextUrl.clone();
                url.pathname = '/sphere';
                return NextResponse.redirect(url);
            }

            // Role-based restrictions within /admin
            if (role === 'redattore' && (path.startsWith('/admin/utenti') || path.startsWith('/admin/analisi'))) {
                const url = request.nextUrl.clone();
                url.pathname = '/admin';
                return NextResponse.redirect(url);
            }

            if (role === 'analista' && (path.startsWith('/admin/utenti') || path.startsWith('/admin/collegamenti') || path.startsWith('/admin/redazione') || path.startsWith('/admin/template'))) {
                const url = request.nextUrl.clone();
                url.pathname = '/admin';
                return NextResponse.redirect(url);
            }

            const adminSession = request.cookies.get('admin_session')?.value;
            if (!adminSession && path !== '/admin/verify') {
                console.log(`[Middleware] Admin MFA check failed for ${user.email} -> redirecting to /admin/verify`);
                const url = request.nextUrl.clone();
                url.pathname = '/admin/verify';
                return NextResponse.redirect(url);
            }
        }

        // Ensure we don't end in an infinite redirect loop if going to /onboarding
        if (!onboardingComplete && path !== '/onboarding' && !isAuthRoute && !path.startsWith('/admin')) {
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

        if ((isAuthRoute || path === '/') && !path.startsWith('/admin')) {
            console.log(`[Middleware] Case 3: (Auth route or root) -> Redirecting to /sphere`);
            const url = request.nextUrl.clone();
            url.pathname = '/sphere';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
