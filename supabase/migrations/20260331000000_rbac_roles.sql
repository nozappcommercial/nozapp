-- Migration file to introduce the 'role' column for RBAC (Role-Based Access Control)
-- Options: 'base', 'redattore', 'analista', 'admin'

ALTER TABLE public.users
ADD COLUMN role text NOT NULL DEFAULT 'base' CHECK (role IN ('base', 'redattore', 'analista', 'admin'));

-- Migrate existing admins to the new 'admin' role
UPDATE public.users
SET role = 'admin'
WHERE is_admin = true;

-- Note: We are keeping the `is_admin` column for now to maintain backward compatibility
-- but new logic should primarily use the `role` column.
