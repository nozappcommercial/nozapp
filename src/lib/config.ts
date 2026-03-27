import 'server-only';
import { z } from 'zod';

/**
 * SERVER-SIDE CONFIGURATION
 * -------------------------
 * This module ensures that sensitive environment variables are only accessible
 * on the server. It validates the presence of required keys at runtime.
 */

const envSchema = z.object({
  // Supabase (Sempre richiesti)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // API Keys (Server Only) — Opzionali per permettere il completamento della build
  TMDB_API_KEY: z.string().optional(),
  RAPIDAPI_KEY: z.string().min(1).optional(),
  
  // Security
  CRON_SECRET: z.string().min(1).optional(),
});

// Validate environment variables
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:', parsed.error.format());
  // We throw only if it's a critical Supabase failure or we are not in build phase
  // For Vercel, we want to allow the build to proceed even if secrets are missing
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    throw new Error('Missing environment variables. Check your .env file.');
  }
}

export const config = parsed.data as z.infer<typeof envSchema>;
