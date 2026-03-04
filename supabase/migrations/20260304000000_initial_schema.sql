-- 1. Create tables

-- films
CREATE TABLE public.films (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    director TEXT,
    synopsis TEXT,
    poster_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- editorial_edges
CREATE TABLE public.editorial_edges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    to_film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('thematic', 'stylistic', 'contrast')) NOT NULL,
    label TEXT,
    weight FLOAT4 DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- users (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    onboarding_complete BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- user_pillars
CREATE TABLE public.user_pillars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, film_id)
);

-- 2. Setup RLS Policies

ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pillars ENABLE ROW LEVEL SECURITY;

-- films: anyone can read
CREATE POLICY "Films are viewable by everyone" 
ON public.films FOR SELECT 
USING (true);

-- editorial_edges: anyone can read
CREATE POLICY "Edges are viewable by everyone" 
ON public.editorial_edges FOR SELECT 
USING (true);

-- users: users can read and update their own profile
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- user_pillars: users can perform all actions on their own pillars
CREATE POLICY "Users can view own pillars" 
ON public.user_pillars FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pillars" 
ON public.user_pillars FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pillars" 
ON public.user_pillars FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pillars" 
ON public.user_pillars FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. Trigger for new user signup
-- Automatically create a profile in public.users when a user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
