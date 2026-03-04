-- Drop dependent tables first to recreate them with INTEGER foreign keys
DROP TABLE IF EXISTS public.user_pillars CASCADE;
DROP TABLE IF EXISTS public.editorial_edges CASCADE;

-- Drop and recreate films to use INTEGER ID
DROP TABLE IF EXISTS public.films CASCADE;

CREATE TABLE public.films (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    tagline TEXT,
    description TEXT,
    minute INTEGER,
    rating FLOAT4,
    director TEXT,
    poster_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Recreate editorial_edges
CREATE TABLE public.editorial_edges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    to_film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('thematic', 'stylistic', 'contrast')) NOT NULL,
    label TEXT,
    weight FLOAT4 DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Recreate user_pillars
CREATE TABLE public.user_pillars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, film_id)
);

-- Relational tables for the dataset
CREATE TABLE public.film_actors (
    film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    PRIMARY KEY (film_id, name, role)
);

CREATE TABLE public.film_themes (
    film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    theme TEXT NOT NULL,
    PRIMARY KEY (film_id, theme)
);

CREATE TABLE public.film_genres (
    film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    genre TEXT NOT NULL,
    PRIMARY KEY (film_id, genre)
);

CREATE TABLE public.film_countries (
    film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    PRIMARY KEY (film_id, country)
);

CREATE TABLE public.film_languages (
    film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    language TEXT NOT NULL,
    PRIMARY KEY (film_id, type, language)
);

CREATE TABLE public.film_studios (
    film_id INTEGER NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
    studio TEXT NOT NULL,
    PRIMARY KEY (film_id, studio)
);

-- Apply RLS
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pillars ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.film_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_studios ENABLE ROW LEVEL SECURITY;

-- Read policies for everyone
CREATE POLICY "Films are viewable by everyone" ON public.films FOR SELECT USING (true);
CREATE POLICY "Edges are viewable by everyone" ON public.editorial_edges FOR SELECT USING (true);
CREATE POLICY "Actors are viewable by everyone" ON public.film_actors FOR SELECT USING (true);
CREATE POLICY "Themes are viewable by everyone" ON public.film_themes FOR SELECT USING (true);
CREATE POLICY "Genres are viewable by everyone" ON public.film_genres FOR SELECT USING (true);
CREATE POLICY "Countries are viewable by everyone" ON public.film_countries FOR SELECT USING (true);
CREATE POLICY "Languages are viewable by everyone" ON public.film_languages FOR SELECT USING (true);
CREATE POLICY "Studios are viewable by everyone" ON public.film_studios FOR SELECT USING (true);

-- User pillars policies 
CREATE POLICY "Users can view own pillars" ON public.user_pillars FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pillars" ON public.user_pillars FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pillars" ON public.user_pillars FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pillars" ON public.user_pillars FOR DELETE TO authenticated USING (auth.uid() = user_id);
