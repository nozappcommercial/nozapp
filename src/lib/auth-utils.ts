import { createClient } from "@/lib/supabase/server";

/**
 * Auth Utilities
 * --------------
 * Centralized helpers for server-side authentication and ownership verification.
 */

/**
 * ensureAuthenticated
 * -------------------
 * Retrieves the current user from the secure Supabase session.
 * Throws a standardized error if the user is not authenticated.
 * 
 * Usage:
 * const user = await ensureAuthenticated();
 * const { data } = await supabase.from('table').select().eq('user_id', user.id);
 */
export async function ensureAuthenticated() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        throw new Error("Unauthorized: Devono essere effettuato il login per accedere a questa risorsa.");
    }
    
    return user;
}

/**
 * verifyOwnership
 * ---------------
 * Verifies if a given record (identified by table and ID) belongs to the current user.
 * Useful for extra defense-in-depth before destructive operations (DELETE, UPDATE).
 */
export async function verifyOwnership(table: string, id: string | number) {
    const user = await ensureAuthenticated();
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from(table)
        .select('user_id')
        .eq('id', id)
        .single();
        
    if (error || !data || data.user_id !== user.id) {
        throw new Error(`Forbidden: Non hai i permessi per modificare questa risorsa in ${table}.`);
    }
    
    return true;
}
