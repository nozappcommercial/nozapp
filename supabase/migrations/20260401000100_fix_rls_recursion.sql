-- Migration: 20260401000100_fix_rls_recursion.sql
-- Description: Fixes infinite recursion in RLS policies for the 'users' table

-- 1. Pulizia delle policy problematiche
DROP POLICY IF EXISTS "Admins can view all user profiles" ON users;
DROP POLICY IF EXISTS "Admins can view security logs" ON security_logs;
DROP POLICY IF EXISTS "Admins have full access to articles" ON articles;
DROP POLICY IF EXISTS "Admins have full access to cinema_movies" ON cinema_movies;
DROP POLICY IF EXISTS "Admins have full access to article analytics" ON article_analytics;

-- 2. Creazione funzione Security Definer per rompere la ricorsione
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS text AS $$
DECLARE
  u_role text;
BEGIN
  SELECT role INTO u_role FROM public.users WHERE id = auth.uid();
  RETURN COALESCE(u_role, 'base');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Applicazione nuove policy NON ricorsive
CREATE POLICY "Admins and Analysts can view all user profiles" ON users
    FOR SELECT USING (
        (auth.uid() = id) OR 
        (get_auth_user_role() IN ('admin', 'analista'))
    );

CREATE POLICY "Admins can view security logs" ON security_logs
    FOR SELECT USING (get_auth_user_role() = 'admin');

CREATE POLICY "Admins and Editors have full access to articles" ON articles
    FOR ALL USING (get_auth_user_role() IN ('admin', 'redattore'));

CREATE POLICY "Admins and Editors have full access to cinema_movies" ON cinema_movies
    FOR ALL USING (get_auth_user_role() IN ('admin', 'redattore'));

CREATE POLICY "Admins, Editors and Analysts have full access to article analytics" ON article_analytics
    FOR ALL USING (get_auth_user_role() IN ('admin', 'redattore', 'analista'));
