-- Migration: 20260326000000_editorial_schema.sql
-- Description: Add articles table and user roles for redazione management

-- 1. Add role to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 4. Policies for articles

-- anyone can read published and non-expired articles
CREATE POLICY "Articles are viewable by everyone" 
ON public.articles FOR SELECT 
USING (
    status = 'published' AND 
    published_at <= now() AND 
    (expires_at IS NULL OR expires_at > now())
);

-- admin can do anything
CREATE POLICY "Admins have full access to articles" 
ON public.articles FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_articles_updated
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Note: The first admin must be set manually:
-- UPDATE public.users SET role = 'admin' WHERE id = 'YOUR_USER_ID';
