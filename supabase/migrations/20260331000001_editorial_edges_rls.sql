-- Migration file to enable INSERT/DELETE on `editorial_edges` for auth users with role 'admin' or 'redattore'.

-- First ensure RLS is active (already added in initial dataset script, but re-insuring it)
ALTER TABLE public.editorial_edges ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users with 'admin' or 'redattore' role (and legacy is_admin) to INSERT edges
CREATE POLICY "Admins and Redattori can insert edges" 
ON public.editorial_edges 
FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND (users.is_admin = true OR users.role IN ('admin', 'redattore'))
    )
);

-- Allow authenticated users with 'admin' or 'redattore' role (and legacy is_admin) to DELETE edges
CREATE POLICY "Admins and Redattori can delete edges" 
ON public.editorial_edges 
FOR DELETE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND (users.is_admin = true OR users.role IN ('admin', 'redattore'))
    )
);
