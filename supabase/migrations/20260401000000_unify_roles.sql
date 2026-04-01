-- 1) Promote active explicit admins to the robust 'admin' role (Solo se la colonna esiste ancora)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_admin') THEN
        UPDATE public.users 
        SET role = 'admin' 
        WHERE is_admin = true AND role = 'base';
    END IF;
END $$;

-- 2) Drop the dependent RLS policies before we drop the column
DROP POLICY IF EXISTS "Only admins can see security logs" ON security_logs;
DROP POLICY IF EXISTS "Admins can view security logs" ON security_logs;
DROP POLICY IF EXISTS "Admins have full access to articles" ON articles;
DROP POLICY IF EXISTS "Admins have full access to cinema_movies" ON cinema_movies;
DROP POLICY IF EXISTS "Admins have full access to article analytics" ON article_analytics;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON users;
DROP POLICY IF EXISTS "Admins and Redattori can insert edges" ON editorial_edges;
DROP POLICY IF EXISTS "Admins and Redattori can delete edges" ON editorial_edges;

-- 3) Drop the redundant boolean column
ALTER TABLE public.users DROP COLUMN IF EXISTS is_admin;

-- 4) Recreate the policies using the 'role' column
-- Security Logs
CREATE POLICY "Admins can view security logs" ON security_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Articles
CREATE POLICY "Admins have full access to articles" ON articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR role = 'redattore')
        )
    );

-- Cinema Movies
CREATE POLICY "Admins have full access to cinema_movies" ON cinema_movies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR role = 'redattore')
        )
    );

-- Article Analytics
CREATE POLICY "Admins have full access to article analytics" ON article_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR role = 'analista' OR role = 'redattore')
        )
    );

-- Users Table
CREATE POLICY "Admins can view all user profiles" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR role = 'analista')
        )
    );

-- Editorial Edges
CREATE POLICY "Admins and Redattori can insert edges" ON editorial_edges
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR role = 'redattore')
        )
    );

CREATE POLICY "Admins and Redattori can delete edges" ON editorial_edges
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR role = 'redattore')
        )
    );
