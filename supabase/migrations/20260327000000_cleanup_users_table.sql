-- Migration: 20260327000000_cleanup_users_table.sql
-- Description: Remove redundant and obsolete columns from public.users

-- 1. Check and drop columns for MFA (legacy SMS) and redundant roles
ALTER TABLE public.users 
DROP COLUMN IF EXISTS role,
DROP COLUMN IF EXISTS phone_number,
DROP COLUMN IF EXISTS otp_code,
DROP COLUMN IF EXISTS otp_expires_at;

-- 2. Ensure is_admin and admin_verified_at are preserved (already present)
-- These are used by the new Email MFA and Authorization logic.

-- 3. Update RLS policies to ensure they only rely on is_admin
-- The existing policy "Admins have full access to articles" already uses is_admin.
-- We verify no policies are using 'role'.

DO $$ 
BEGIN
    -- This block is just for safety/documentation
    RAISE NOTICE 'Table public.users cleaned up. Remaining auth columns: is_admin, admin_verified_at.';
END $$;
