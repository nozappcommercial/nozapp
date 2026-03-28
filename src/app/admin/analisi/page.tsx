"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, Users, Globe, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { getDashboardAnalytics, type DashboardStats } from '@/app/actions/admin_analytics';

export default function AdminAnalysisPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await getDashboardAnalytics();
            setStats(data);
        } catch (err: any) {
            console.error('[Admin] Failed to fetch stats:', err);
            setError(err.message || 'Errore durante il caricamento dei dati.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading && !stats) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 opacity-40">
                <RefreshCw size={24} className="animate-spin" />
                <p className="font-mono text-[10px] uppercase tracking-widest">Analisi della Sfera in corso...</p>
            </div>
        );
    }

    const maxAge = Math.max(...(stats?.ageStats.map(s => s.count) || [1]));
    const maxCountry = Math.max(...(stats?.countryStats.map(s => s.count) || [1]));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5">
                <div className="space-y-1">
                    <h1 className="text-4xl font-light tracking-tight">Modulo <span className="italic font-serif">Analisi</span></h1>
                    <p className="text-black/40">Statistiche aggregate e dati demografici reali tratti dall'ecosistema NoZapp.</p>
                </div>
            </div>

            {/* Top Cards: Total Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Utenti Totali', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Engagement (Clic)', value: stats?.totalClicks || 0, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Tasso Attività', value: stats?.totalUsers ? ((stats.totalClicks / stats.totalUsers).toFixed(1)) : '0.0', icon: TrendingUp, color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10', suffix: ' per utente' }
                ].map((m, i) => (
                    <div key={i} className="p-8 rounded-[32px] bg-white ring-1 ring-black/5 shadow-sm space-y-4">
                        <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center`}>
                            <m.icon size={22} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-4xl font-medium tracking-tighter">{m.value}{m.suffix && <span className="text-[10px] uppercase tracking-widest text-black/20 ml-2">{m.suffix}</span>}</div>
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40">{m.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Age Distribution */}
                    <div className="bg-white rounded-[32px] p-8 ring-1 ring-black/5 shadow-2xl shadow-black/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center">
                                <TrendingUp size={16} />
                            </div>
                            <h2 className="font-serif text-xl">Distribuzione Età</h2>
                        </div>
                        <div className="space-y-6">
                            {stats?.ageStats.map((stat) => (
                                <div key={stat.label} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-black/40">
                                        <span>{stat.label}</span>
                                        <span>{stat.count} utenti</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-black transition-all duration-1000"
                                            style={{ width: `${(stat.count / (stats.totalUsers || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gender Distribution */}
                    <div className="bg-white rounded-[32px] p-8 ring-1 ring-black/5 shadow-2xl shadow-black/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <Users size={16} />
                            </div>
                            <h2 className="font-serif text-xl">Distribuzione Sesso</h2>
                        </div>
                        <div className="space-y-6">
                            {stats?.genderStats.map((stat) => (
                                <div key={stat.label} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-black/40">
                                        <span>{stat.label}</span>
                                        <span>{stat.count} utenti</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[var(--gold)] transition-all duration-1000"
                                            style={{ width: `${(stat.count / (stats.totalUsers || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                {/* ── Geographic Distribution ── */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center"><Globe size={14} className="opacity-40" /></div>
                        <h3 className="text-xl font-medium italic font-serif">Presenza Geografica</h3>
                    </div>
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 ring-1 ring-black/5 space-y-6">
                        {stats?.countryStats.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                                    <span className="text-sm font-medium">{item.country}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-light tracking-tight">{item.count}</span>
                                    <span className="text-[9px] font-mono text-black/20 uppercase">Utenti</span>
                                </div>
                            </div>
                        ))}
                        {stats?.countryStats.length === 0 && (
                            <div className="text-center py-12 text-black/20 font-mono text-[10px] uppercase tracking-widest">Nessun dato geografico registrato.</div>
                        )}
                    </div>
                    <div className="p-6 bg-[var(--gold)]/5 rounded-3xl border border-[var(--gold)]/10 text-[11px] leading-relaxed text-[var(--gold)]/80">
                        <TrendingUp size={12} className="inline mr-2" />
                        Il <strong>{( (stats?.countryStats[0]?.count || 0) / (stats?.totalUsers || 1) * 100 ).toFixed(0)}%</strong> dei tuoi utenti proviene da <strong>{stats?.countryStats[0]?.country || '...'}</strong>.
                    </div>
                </div>
            </div>

            {/* ── Top Articles ── */}
            <div className="space-y-6 pt-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center"><Newspaper size={14} className="opacity-40" /></div>
                    <h3 className="text-xl font-medium italic font-serif">Articoli con più Engagement</h3>
                </div>
                <div className="bg-black text-white p-10 rounded-[40px] space-y-4">
                    {stats?.topArticles.map((art, i) => (
                        <div key={art.id} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0 group cursor-default">
                            <div className="flex items-center gap-5">
                                <span className="text-white/20 font-serif text-3xl italic group-hover:text-[var(--gold)] transition-colors">0{i+1}</span>
                                <div className="space-y-1">
                                    <div className="text-md font-medium text-white/90 truncate max-w-[200px] md:max-w-md">{art.title}</div>
                                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">ID Articolo: {art.id.slice(0, 8)}...</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-2xl font-medium tabular-nums">{art.clicks}</div>
                                <div className="text-[9px] font-mono uppercase tracking-widest opacity-30">Clic totali</div>
                            </div>
                        </div>
                    ))}
                    {stats?.topArticles.length === 0 && (
                        <div className="text-center py-20 opacity-20 font-mono text-[10px] uppercase tracking-widest">Nessuna interazione registrata sugli articoli.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
