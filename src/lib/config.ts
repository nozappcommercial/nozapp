import 'server-only';
import { z } from 'zod';

/**
 * SERVER-SIDE CONFIGURATION
 * -------------------------
 * This module ensures that sensitive environment variables are only accessible
 * on the server. It validates the presence of required keys at runtime.
 */

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // API Keys (Server Only)
  TMDB_API_KEY: z.string().optional(), // Optional for now as it's primarily used in scripts
  RAPIDAPI_KEY: z.string().min(1),
  
  // Security
  CRON_SECRET: z.string().min(1),
});

// Validate environment variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  throw new Error('Invalid environment variables. Check your .env file.');
}

export const config = env.data;
