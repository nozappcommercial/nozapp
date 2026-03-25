import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { checkRateLimit } from '@/lib/rate-limit';
import { logSecurityEvent } from '@/lib/logger';

/**
 * Global Middleware
 * -----------------
 * This middleware handles:
 * 1. Bot Filtering: Blocks known aggressive scrapers and AI crawlers.
 * 2. Rate Limiting: Applies IP-based throttling to API and Auth routes.
 * 3. Session Management: Refreshes Supabase sessions and handles protected route redirects.
 */

const BANNED_BOT_USER_AGENTS = [
    'GPTBot',
    'CCBot',
    'ChatGPT-User',
    'Google-Extended',
    'SemrushBot',
    'AhrefsBot',
    'Baiduspider',
    'DotBot',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const userAgent = request.headers.get('user-agent') || '';
    
    // Attempt to get the real IP address
    const ip = request.headers.get('x-real-ip') || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               '127.0.0.1';

    // 1. BOT FILTERING (Basic WAF)
    // Block aggressive bots to save resources and prevent scraping.
    const isBot = BANNED_BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
    if (isBot && (pathname.startsWith('/api') || pathname.startsWith('/login'))) {
        await logSecurityEvent('bot_detection', { 
            ip, 
            path: pathname, 
            userAgent, 
            level: 'warn',
            metadata: { botType: 'crawler' }
        });
        return new NextResponse('Bot Access Forbidden', { status: 403 });
    }

    // 2. RATE LIMITING (Flood Protection)
    const isAuthRoute = pathname.startsWith('/login');
    const isApiRoute = pathname.startsWith('/api');

    if (isAuthRoute || isApiRoute) {
        const type = isAuthRoute ? 'auth' : 'api';
        
        // Check rate limit using Upstash Redis (if configured)
        const { success, limit, remaining, reset } = await checkRateLimit(ip, type);

        if (!success) {
            await logSecurityEvent('rate_limit_block', { 
                ip, 
                path: pathname, 
                userAgent, 
                level: 'warn',
                metadata: { limitType: type, limit, remaining }
            });
            return new NextResponse('Too many requests. Please try again later.', { 
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString(),
                    'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
                }
            });
        }
    }

    // 3. SESSION MANAGEMENT & PROTECTED ROUTES
    // Call the Supabase session update logic (refreshes tokens and handles redirects)
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
