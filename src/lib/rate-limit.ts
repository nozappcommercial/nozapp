import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate Limiting Utility
 * --------------------
 * This utility provides IP-based or User-based rate limiting using Upstash Redis.
 * It is designed to run in Next.js Edge Middleware or Server Actions.
 */

const isUpstashConfigured = 
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis only if environment variables are present
const redis = isUpstashConfigured 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Pre-defined limiters to avoid re-instantiation
const limiters = {
    api: redis ? new Ratelimit({ 
        redis, 
        limiter: Ratelimit.slidingWindow(60, "1 m"), 
        prefix: "@nozapp/api",
        analytics: true 
    }) : null,
    
    auth: redis ? new Ratelimit({ 
        redis, 
        limiter: Ratelimit.slidingWindow(5, "15 m"), 
        prefix: "@nozapp/auth",
        analytics: true 
    }) : null,
    
    graph: redis ? new Ratelimit({ 
        redis, 
        limiter: Ratelimit.slidingWindow(10, "1 h"), 
        prefix: "@nozapp/graph",
        analytics: true 
    }) : null,
};

/**
 * checkRateLimit
 * --------------
 * Checks if a request from a given identifier (IP or User ID) should be allowed.
 * Returns a success boolean and metadata.
 */
export async function checkRateLimit(
    identifier: string, 
    type: keyof typeof limiters = 'api'
) {
  const limiter = limiters[type];

  if (!limiter) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[RateLimit] Upstash not configured. Skipping protection for: ${identifier} (${type})`);
    }
    // Allow by default if not configured to prevent blocking the app
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  return await limiter.limit(identifier);
}
