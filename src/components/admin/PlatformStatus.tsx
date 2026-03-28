'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { getDashboardAnalytics, type DashboardStats } from '@/app/actions/admin_analytics';

export default function PlatformStatus() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [realStats, setRealStats] = useState<DashboardStats | null>(null);
    const [latency, setLatency] = useState<number | null>(null);
    const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

    React.useEffect(() => {
        const start = performance.now();
        getDashboardAnalytics().then((data) => {
            setRealStats(data);
            setLatency(Math.round(performance.now() - start));
            setLastRefresh(new Date().toLocaleTimeString());
        }).catch(console.error);

        const interval = setInterval(() => {
             const s = performance.now();
             getDashboardAnalytics().then(() => setLatency(Math.round(performance.now() - s))).catch(() => {});
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: 'Utenti Iscritti', value: realStats ? realStats.totalUsers.toString() : '...', detail: 'Live Sync' },
        { label: 'Latenza API', value: latency ? `${latency}ms` : '...', detail: 'Vercel Edge' },
        { label: 'Cache Hit Rate', value: '98.2%', detail: 'Optimized' },
        { label: 'Stato Build', value: 'Success', detail: lastRefresh },
    ];

    return (
        <div className="md:row-span-2 bg-[#0a0a0a] text-white p-6 rounded-[30px] flex flex-col relative overflow-hidden ring-1 ring-white/10 shadow-2xl transition-all duration-500">
            {/* Header / Toggle */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative z-10 w-full flex items-center justify-between group"
            >
                <div className="space-y-2 text-left">
                     <h4 className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--gold)] opacity-80">System <span className="opacity-50">Vitals</span></h4>
                     <div className="h-[2px] w-6 bg-[var(--gold)] group-hover:w-10 transition-all duration-500" />
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            </button>
            
            <AnimatePresence initial={false}>
                <motion.div 
                    initial={false}
                    animate={{ 
                        height: (isExpanded || typeof window !== 'undefined' && window.innerWidth >= 768) ? 'auto' : '0px',
                        opacity: (isExpanded || typeof window !== 'undefined' && window.innerWidth >= 768) ? 1 : 0,
                        marginTop: (isExpanded || typeof window !== 'undefined' && window.innerWidth >= 768) ? '2.5rem' : '0rem'
                    }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10 overflow-hidden md:!h-auto md:!opacity-100 md:!mt-10"
                >
                    <div className="space-y-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="flex items-baseline justify-between mb-1">
                                    <div className="text-2xl font-medium tracking-tighter font-mono group-hover:text-[var(--gold)] transition-colors">{stat.value}</div>
                                    <div className="text-[8px] font-mono uppercase opacity-30 group-hover:opacity-60">{stat.detail}</div>
                                </div>
                                <div className="text-[10px] font-mono tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Abstract light effect */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--gold)]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
    );
}
