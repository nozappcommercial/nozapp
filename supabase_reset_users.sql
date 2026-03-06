-- Questa query ripulisce TUTTI gli utenti autenticati e i loro dati collegati 
-- (profilo, pillars, risultati di onboarding) per farti ripartire da zero in sicurezza.

-- 1. Elimina i risultati dell'onboarding
TRUNCATE TABLE public.user_onboarding_results CASCADE;

-- 2. Elimina i pilastri salvati
TRUNCATE TABLE public.user_pillars CASCADE;

-- 3. Elimina i profili pubblici
TRUNCATE TABLE public.users CASCADE;

-- 4. Elimina gli utenti dal sistema di Autenticazione (Supabase Auth)
-- Attenzione: questo rimuoverà TUTTI gli utenti dal progetto Supabase.
DELETE FROM auth.users;

-- 5. Per sicurezza, assicuriamoci che i trigger di inserimento automatico 
-- nel profilo pubblico (se presenti) siano allineati.
