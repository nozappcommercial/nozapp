-- Migration: 20260327000100_cinema_movies.sql
-- Description: Table for manually managed cinema movies with expiration

CREATE TABLE IF NOT EXISTS public.cinema_movies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    director TEXT NOT NULL,
    year INT4 NOT NULL,
    poster_url TEXT,
    themes TEXT[] DEFAULT '{}',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.cinema_movies ENABLE ROW LEVEL SECURITY;

-- 1. Public can view non-expired movies
DROP POLICY IF EXISTS "Cinema movies are viewable by everyone" ON public.cinema_movies;
CREATE POLICY "Cinema movies are viewable by everyone" 
ON public.cinema_movies FOR SELECT 
USING (
    expires_at > now()
);

-- 2. Admins have full access
DROP POLICY IF EXISTS "Admins have full access to cinema_movies" ON public.cinema_movies;
CREATE POLICY "Admins have full access to cinema_movies" 
ON public.cinema_movies FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND is_admin = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users  
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_cinema_movies_updated ON public.cinema_movies;
CREATE TRIGGER on_cinema_movies_updated
    BEFORE UPDATE ON public.cinema_movies
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
