"use client";

import React from 'react';
import Link from 'next/link';
import { Settings, Shield, Bell, Globe, Palette, Database, Cpu, ArrowLeft, Save, ExternalLink } from 'lucide-react';

export default function AdminSettingsPage() {
    const sections = [
        {
            title: 'Sistema & Core',
            icon: Cpu,
            items: [
                { label: 'Versione Engine', value: 'vSphere 2.4.0', type: 'text' },
                { label: 'Cache Globale', value: 'Abilitata', type: 'toggle', active: true },
                { label: 'Livello Logging', value: 'Verbose', type: 'select', options: ['Silent', 'Error', 'Info', 'Verbose'] }
            ]
        },
        {
            title: 'Sicurezza & Accessi',
            icon: Shield,
            items: [
                { label: 'MFA Obbligatorio', value: 'Disabilitato', type: 'toggle', active: false },
                { label: 'Session Timeout', value: '24 Ore', type: 'select', options: ['1 Ora', '12 Ore', '24 Ore', 'Sempre'] },
                { label: 'IP Whitelisting', value: 'Configura...', type: 'link' }
            ]
        },
        {
            title: 'Aspetto Grafico',
            icon: Palette,
            items: [
                { label: 'Tema Predefinito', value: 'Classic Cream', type: 'select', options: ['Night Sphere', 'Classic Cream', 'High Contrast'] },
                { label: 'Effetti Post-Processing', value: 'Abilitati', type: 'toggle', active: true },
                { label: 'Densità UI', value: 'Comfortable', type: 'select', options: ['Compact', 'Comfortable', 'Touch'] }
            ]
        },
        {
            title: 'Database & Storage',
            icon: Database,
            items: [
                { label: 'Storage Buckets', value: 'Supabase Cloud', type: 'text' },
                { label: 'Backup Automatico', value: 'Ogni 12h', type: 'text' },
                { label: 'Sincronizzazione...', value: 'Forza Ora', type: 'button' }
            ]
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5">
                <div className="space-y-1">
                    <Link href="/admin" className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[var(--gold)] mb-2 hover:opacity-70 transition-opacity">
                        <ArrowLeft size={10} /> Dashboard
                    </Link>
                    <h1 className="text-4xl font-light tracking-tight">Impostazioni <span className="italic font-serif">Sistema</span></h1>
                    <p className="text-black/40 max-w-md">Pannello di configurazione per i parametri globali della Sfera Semantica.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-black/5 rounded-full text-[9px] font-mono text-black/40 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full animate-pulse" /> sola lettura
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {sections.map((section, si) => (
                    <div key={si} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center"><section.icon size={14} className="opacity-40" /></div>
                            <h3 className="text-xl font-medium italic font-serif">{section.title}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] ring-1 ring-black/5 space-y-2">
                            {section.items.map((item, ii) => (
                                <div key={ii} className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/[0.01] transition-colors border-b border-black/2 last:border-0 grow">
                                    <div className="text-sm font-medium text-black/60">{item.label}</div>
                                    <div className="flex items-center gap-3">
                                        {item.type === 'toggle' ? (
                                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${item.active ? 'bg-black' : 'bg-black/10'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.active ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </div>
                                        ) : item.type === 'select' ? (
                                            <div className="text-[10px] font-mono uppercase tracking-widest bg-black/5 px-3 py-1.5 rounded-full text-black/40 flex items-center gap-2">
                                                {item.value}
                                                <span className="opacity-20 text-[6px]">▼</span>
                                            </div>
                                        ) : item.type === 'link' || item.type === 'button' ? (
                                            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold)] flex items-center gap-1.5 hover:underline cursor-pointer">
                                                {item.value}
                                                <ExternalLink size={10} />
                                            </div>
                                        ) : (
                                            <div className="text-[10px] font-mono text-black/30 uppercase tracking-widest">{item.value}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Nudge */}
            <div className="p-10 bg-black/5 rounded-[40px] border border-dashed border-black/10 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Save size={20} className="text-black/40" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-lg font-medium italic font-serif line-through decoration-black/20 text-black/40">Salvataggio Configurazioni</h4>
                    <p className="text-[11px] font-mono text-black/20 uppercase tracking-widest">Questo pannello è attualmente in modalità dimostrativa.</p>
                </div>
            </div>
        </div>
    );
}
