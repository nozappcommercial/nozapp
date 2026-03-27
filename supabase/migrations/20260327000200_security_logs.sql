-- Create security_logs table for auditing
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    level TEXT DEFAULT 'info' NOT NULL,
    ip_address TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    path TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Setup RLS (Security Logs should only be readable by admins)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view security logs' AND tablename = 'security_logs') THEN
        CREATE POLICY "Admins can view security logs" 
        ON public.security_logs FOR SELECT 
        TO authenticated 
        USING (
            EXISTS (
                SELECT 1 FROM public.users 
                WHERE id = auth.uid() AND is_admin = true
            )
        );
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System can insert security logs' AND tablename = 'security_logs') THEN
        CREATE POLICY "System can insert security logs" 
        ON public.security_logs FOR INSERT 
        WITH CHECK (true);
    END IF;
END $$;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs(created_at);

