-- Onboarding schema: add probe-related columns to films + result storage table

-- New columns on films for onboarding probes
ALTER TABLE public.films ADD COLUMN IF NOT EXISTS is_onboarding_probe BOOLEAN DEFAULT FALSE;
ALTER TABLE public.films ADD COLUMN IF NOT EXISTS onboarding_group INTEGER;
ALTER TABLE public.films ADD COLUMN IF NOT EXISTS color_primary TEXT;
ALTER TABLE public.films ADD COLUMN IF NOT EXISTS color_accent TEXT;
ALTER TABLE public.films ADD COLUMN IF NOT EXISTS mood TEXT;

-- Add onboarding_complete flag to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;
        
-- Table to store full onboarding results as JSON per user
CREATE TABLE IF NOT EXISTS public.user_onboarding_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id)  -- one result per user (can be overwritten on re-onboarding)
);

-- RLS
ALTER TABLE public.user_onboarding_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own results" ON public.user_onboarding_results
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own results" ON public.user_onboarding_results
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own results" ON public.user_onboarding_results
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);
