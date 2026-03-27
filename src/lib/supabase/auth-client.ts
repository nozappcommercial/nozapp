import { createClient } from './client';

/**
 * getAdminStatus
 * --------------
 * Client-side helper to check if a specific user UUID has administrative privileges.
 * 
 * @param userId The UUID of the user to check.
 * @returns boolean indicating if the user is an admin.
 */
export async function getAdminStatus(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.warn('[AuthClient] Could not fetch admin status:', error);
    return false;
  }

  return !!data.is_admin;
}
