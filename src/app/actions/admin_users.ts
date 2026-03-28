"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DashboardUser {
    id: string;
    display_name: string | null;
    email: string | null;
    is_admin: boolean;
    birth_date: string | null;
    country: string | null;
    gender: string | null;
    onboarding_complete: boolean;
    created_at: string;
}

/**
 * Fetch all users with their auth email (requires admin client or service role)
 */
export async function getDashboardUsers(): Promise<DashboardUser[]> {
    const supabase = await createClient();
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    
    // Safety check: only admins can fetch this
    const { data: adminCheck } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', adminUser?.id)
        .single();

    if (!adminCheck?.is_admin) throw new Error("Unauthorized");

    const adminSupabase = createAdminClient();
    
    // We fetch from public.users and then join with auth.users for emails
    // Note: In Supabase, merging auth.users and public.users on a large scale
    // is often done via a view or by fetching auth.users if using Service Role.
    
    const { data: publicUsers, error: publicError } = await adminSupabase
        .from('users')
        .select('id, display_name, is_admin, birth_date, country, gender, onboarding_complete, created_at')
        .order('created_at', { ascending: false });

    if (publicError) throw publicError;

    // Fetch auth emails (using admin client to access auth schema)
    const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers();
    
    if (authError) {
        console.warn("[Admin] Could not fetch auth emails:", authError.message);
    }

    const authUsers = authData?.users || [];
    const authMap = new Map(authUsers.map(u => [u.id, u.email]) || []);

    return publicUsers.map(u => ({
        id: u.id,
        display_name: u.display_name,
        email: authMap.get(u.id) || 'N/A',
        is_admin: u.is_admin || false,
        birth_date: u.birth_date,
        country: u.country,
        gender: u.gender,
        onboarding_complete: u.onboarding_complete || false,
        created_at: u.created_at
    })) as DashboardUser[];
}

/**
 * Toggle admin status for a user
 */
export async function toggleAdminStatus(userId: string, currentStatus: boolean): Promise<void> {
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
        .from('users')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

    if (error) throw error;
}

/**
 * Delete a user from both auth and public schema
 */
export async function deleteUser(userId: string): Promise<void> {
    const supabase = await createClient();
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    
    // Safety check: only admins can delete
    const { data: adminCheck } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', adminUser?.id)
        .single();
    if (!adminCheck?.is_admin) throw new Error("Unauthorized");

    const adminSupabase = createAdminClient();
    
    // 1. Delete from auth.users
    const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 2. Explicitly remove from public.users
    const { error: publicError } = await adminSupabase
        .from('users')
        .delete()
        .eq('id', userId);
    if (publicError) throw publicError;
}
