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
    const isAuthorized = role === 'admin' || role === 'redattore';

    if (!isAuthorized) {
        redirect('/admin');
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/5">
                <div className="space-y-4">
                    <div>
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
        </div>
    );
}
