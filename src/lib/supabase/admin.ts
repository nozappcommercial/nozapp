import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Supabase Admin Client
 * ---------------------
 * This client uses the SERVICE_ROLE_KEY to bypass all RLS policies.
 * It should ONLY be used in secure server-side environments (Server Actions, APIs, Middleware).
 * 
 * IMPORTANT: Never use this on the client-side.
 */
export function createAdminClient() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get(name: string) { return undefined; },
                set(name: string, value: string, options: CookieOptions) {},
                remove(name: string, options: CookieOptions) {},
            },
        }
    );
}
