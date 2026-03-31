import React from 'react';
import { Network, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EdgeEditorForm from '@/components/admin/EdgeEditorForm';
import { getAdminProfile } from '@/app/actions/admin_auth';
import { redirect } from 'next/navigation';

export default async function CollegamentiPage() {
    // Secondary internal role check (middleware handles it, but just in case)
    const profile = await getAdminProfile();
    if (!profile) redirect('/login');
    
    const role = profile.role || 'base';
    const isAuthorized = profile.is_admin || role === 'admin' || role === 'redattore';

    if (!isAuthorized) {
        redirect('/admin');
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/5">
                <div className="space-y-4">
                    <Link 
                        href="/admin" 
                        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-black/50 hover:text-black transition-colors group font-['Fragment_Mono']"
                    >
                        <div className="p-2 rounded-full border border-black/10 group-hover:bg-black group-hover:text-white transition-all">
                            <ArrowLeft size={12} />
                        </div>
                        Torna alla Dashboard
                    </Link>
                    
                    <div>
                        <div className="flex items-center gap-2 text-[var(--gold)] font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em] mb-2">
                            <Network size={12} /> COLLEGAMENTI EDITORIALI
                        </div>
                        <h2 className="text-4xl md:text-5xl font-light tracking-tight">Gestione <span className="italic font-serif">Sfera Semantica</span></h2>
                        <p className="text-black/40 max-w-md mt-2 leading-relaxed">
                            Cerca due film nel database e crea delle relazioni tra di loro (Archi). Queste connessioni definiscono l'aspetto e la navigazione della mappa 3D esplorabile dagli utenti.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Editor Section */}
            <div className="bg-[#faf7f2] p-6 md:p-10 rounded-3xl border border-black/5">
                <EdgeEditorForm />
            </div>

            {/* Informational Box */}
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex gap-4 text-blue-800">
                <AlertCircle className="flex-shrink-0 mt-1 opacity-70" />
                <div className="space-y-2 text-sm">
                    <h3 className="font-semibold uppercase tracking-wider text-xs">Note Editoriali</h3>
                    <ul className="list-disc leading-relaxed pl-5 space-y-1 opacity-80">
                        <li><strong>Tematica:</strong> Film che condividono un argomento, un messaggio o un genere molto specifico.</li>
                        <li><strong>Stilistica:</strong> Film che condividono una regia simile, palette colori o ritmo narrativo.</li>
                        <li><strong>Contrasto:</strong> Film che sono l'opposto speculare e che si pongono in forte contrasto o dibattito.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
