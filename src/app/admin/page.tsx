import React from 'react';
import Link from 'next/link';
import { Newspaper, Users, Settings, BarChart3, ArrowRight, ShieldCheck } from 'lucide-react';

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
            href: '#',
            color: 'bg-purple-50 text-purple-600',
            status: 'Prossimamente'
        },
        {
            title: 'Analisi',
            description: 'Monitora le performance degli articoli e l\'engagement.',
            icon: BarChart3,
            href: '#',
            color: 'bg-green-50 text-green-600',
            status: 'Prossimamente'
        },
        {
            title: 'Impostazioni',
            description: 'Configura i parametri globali della Sfera Semantica.',
            icon: Settings,
            href: '#',
            color: 'bg-orange-50 text-orange-600',
            status: 'Prossimamente'
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[var(--gold)] font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em]">
                        <ShieldCheck size={12} /> Accesso Verificato
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight">Dashboard <span className="italic font-serif">Gestionale</span></h2>
                    <p className="text-black/40 max-w-md">Benvenuto nel centro di controllo di NoZapp. Da qui puoi gestire ogni aspetto editoriale e tecnico.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module, i) => (
                    <Link 
                        key={i} 
                        href={module.href}
                        className={`group p-8 rounded-3xl ring-1 ring-black/5 bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col justify-between min-h-[220px] ${module.status ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <div className="space-y-4">
                            <div className={`w-12 h-12 ${module.color} rounded-2xl flex items-center justify-center`}>
                                <module.icon size={24} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-medium">{module.title}</h3>
                                    {module.status && (
                                        <span className="text-[8px] font-['Fragment_Mono'] uppercase tracking-widest bg-black/5 px-2 py-0.5 rounded-full text-black/40">
                                            {module.status}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm opacity-50 leading-relaxed">{module.description}</p>
                            </div>
                        </div>
                        
                        {!module.status && (
                            <div className="pt-6 flex justify-end">
                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {/* Quick Stats / Info */}
            <div className="bg-[#1a1a1a] text-white p-10 rounded-[32px] overflow-hidden relative">
                <div className="relative z-10 space-y-6">
                    <h4 className="font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em] opacity-50">Stato Piattaforma</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-3xl font-light italic font-serif">Ottimale</div>
                            <div className="text-[10px] uppercase tracking-widest opacity-30 mt-1">Sistemi Cloud</div>
                        </div>
                        <div>
                            <div className="text-3xl font-light italic font-serif">12ms</div>
                            <div className="text-[10px] uppercase tracking-widest opacity-30 mt-1">Latenza Media</div>
                        </div>
                        <div>
                            <div className="text-3xl font-light italic font-serif">Attiva</div>
                            <div className="text-[10px] uppercase tracking-widest opacity-30 mt-1">Redazione</div>
                        </div>
                        <div>
                            <div className="text-3xl font-light italic font-serif">v1.2.4</div>
                            <div className="text-[10px] uppercase tracking-widest opacity-30 mt-1">Versione</div>
                        </div>
                    </div>
                </div>
                {/* Abstract light effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold)]/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            </div>
        </div>
    );
}
