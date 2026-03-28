import React from 'react';
import Link from 'next/link';
import { Newspaper, Users, Settings, BarChart3, ArrowRight, ShieldCheck, Clapperboard, Layout } from 'lucide-react';
import PlatformStatus from '@/components/admin/PlatformStatus';

export default function AdminDashboard() {
    const modules = [
        {
            title: 'Redazione',
            description: 'Gestisci articoli, bozze e pubblicazioni della sala stampa.',
            icon: Newspaper,
            href: '/admin/redazione',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Utenti',
            description: 'Visualizza e gestisci i permessi degli utenti della piattaforma.',
            icon: Users,
            href: '/admin/utenti',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Cinema',
            description: 'Gestisci i film in programmazione nel carosello pubblico.',
            icon: Clapperboard,
            href: '/admin/cinema',
            color: 'bg-rose-50 text-rose-600',
        },
        {
            title: 'Analisi',
            description: 'Monitora le performance degli articoli e l\'engagement.',
            icon: BarChart3,
            href: '/admin/analisi',
            color: 'bg-green-50 text-green-600',
        },
        {
            title: 'Impostazioni',
            description: 'Configura i parametri globali della Sfera Semantica.',
            icon: Settings,
            href: '/admin/impostazioni',
            color: 'bg-orange-50 text-orange-600',
        },
        {
            title: 'Template',
            description: 'Sezione configurabile per future espansioni del sistema.',
            icon: Layout,
            href: '#',
            color: 'bg-gray-50 text-gray-400',
            status: 'Placeholder'
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[var(--gold)] font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em]">
                        <ShieldCheck size={12} /> ACCESSO VERIFICATO COME ADMIN
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight">Dashboard <span className="italic font-serif">Gestionale</span></h2>
                    <p className="text-black/40 max-w-md">Benvenuto nel centro di controllo di NoZapp. Da qui puoi gestire ogni aspetto editoriale e tecnico.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <PlatformStatus />

                {/* Modules Grid (Right) - 3 columns for cards */}
                {modules.map((module, i) => (
                    <Link 
                        key={i} 
                        href={module.href}
                        className={`group p-6 rounded-[28px] ring-1 ring-black/5 bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col justify-between min-h-[190px] ${module.status && module.status !== 'Placeholder' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <div className="space-y-4">
                            <div className={`w-10 h-10 ${module.color} rounded-xl flex items-center justify-center`}>
                                <module.icon size={20} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-medium">{module.title}</h3>
                                    {module.status && (
                                        <span className="text-[7px] font-['Fragment_Mono'] uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded-full text-black/40">
                                            {module.status}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[13px] opacity-40 leading-relaxed line-clamp-2">{module.description}</p>
                            </div>
                        </div>
                        
                        {(!module.status || module.status === 'Placeholder') && (
                            <div className="flex justify-end">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
