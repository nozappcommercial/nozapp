"use server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Security Logging Utility (Server Side)
 * -------------------------------------
 * This utility provides standardized security logging. 
 * Marked as 'use server' to allow invocation from both Server and Client components.
 */

export type SecurityEventType = 
    | 'auth_success' 
    | 'auth_failure' 
    | 'rate_limit_block' 
    | 'bot_detection' 
    | 'api_error' 
    | 'honeypot_hit' 
    | 'suspicious_traffic';

export interface LogOptions {
    userId?: string;
    ip?: string;
    path?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    level?: 'info' | 'warn' | 'error' | 'critical';
}

/**
 * logSecurityEvent
 * -------------------
 * Standardized tool for tracking, auditing, and detecting suspicious activity.
 */
export async function logSecurityEvent(
    type: SecurityEventType, 
    options: LogOptions = {}
) {
    const { 
        userId, 
        ip, 
        path, 
        userAgent, 
        metadata = {}, 
        level = 'info' 
    } = options;

    const logEntry = {
        event_type: type,
        level,
        ip_address: ip,
        user_id: userId,
        path,
        user_agent: userAgent,
        metadata: {
            ...metadata,
            timestamp: new Date().toISOString()
        }
    };

    // 1. Console logging (Standard Platform Output)
    const logMethod = (level === 'error' || level === 'critical') 
        ? console.error 
        : (level === 'warn') 
            ? console.warn 
            : console.log;

    logMethod(`[SEC-AUDIT] ${type.toUpperCase()}: ${ip || 'no-ip'} | ${path || 'no-path'}`, JSON.stringify(logEntry, null, 2));

    // 2. Persistent logging (Database)
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_DB_LOGGING === 'true') {
        try {
            const supabase = createAdminClient();
            const { error } = await supabase.from('security_logs').insert(logEntry);
            if (error) throw error;
        } catch (dbErr) {
            console.error("[Logger] Exception while writing security log to DB:", dbErr);
        }
    }
}
