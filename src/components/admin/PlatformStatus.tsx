'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { getDashboardAnalytics, type DashboardStats } from '@/app/actions/admin_analytics';

export default function PlatformStatus() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [realStats, setRealStats] = useState<DashboardStats | null>(null);

    React.useEffect(() => {
        getDashboardAnalytics().then(setRealStats).catch(console.error);
    }, []);

    const stats = [
        { label: 'Utenti Iscritti', value: realStats ? realStats.totalUsers.toString() : '...' },
        { label: 'Engagement Clic', value: realStats ? realStats.totalClicks.toString() : '...' },
        { label: 'Stato Cloud', value: 'Ottimale' },
        { label: 'Versione App', value: 'vSphere 2.4' },
    ];

    return (
        <div className="md:row-span-2 bg-[#1a1a1a] text-white p-6 rounded-[30px] flex flex-col relative overflow-hidden transition-all duration-500">
            {/* Header / Toggle */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative z-10 w-full flex items-center justify-between group"
            >
                <div className="space-y-2 text-left">
                     <h4 className="font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em] opacity-50">Stato Piattaforma</h4>
                     <div className="h-px w-8 bg-[var(--gold)]/30 group-hover:w-12 transition-all" />
                </div>
                <div className="md:hidden w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
            </button>
            
            <AnimatePresence initial={false}>
                <motion.div 
                    initial={false}
                    animate={{ 
                        height: (isExpanded || typeof window !== 'undefined' && window.innerWidth >= 768) ? 'auto' : '0px',
                        opacity: (isExpanded || typeof window !== 'undefined' && window.innerWidth >= 768) ? 1 : 0,
                        marginTop: (isExpanded || typeof window !== 'undefined' && window.innerWidth >= 768) ? '2rem' : '0rem'
                    }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10 overflow-hidden md:!h-auto md:!opacity-100 md:!mt-8"
                >
                    <div className="space-y-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="text-xl font-light italic font-serif">{stat.value}</div>
                                <div className="text-[9px] uppercase tracking-widest opacity-30 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Abstract light effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)]/10 blur-[90px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        </div>
    );
}
