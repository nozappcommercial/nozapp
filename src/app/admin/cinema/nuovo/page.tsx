import React from 'react';
import CinemaForm from '@/components/admin/CinemaForm';
import { Clapperboard } from 'lucide-react';

export default function NewCinemaMoviePage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="space-y-1 pb-6 border-b border-black/5">
                <div className="flex items-center gap-2 text-[var(--gold)] font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em]">
                    <Clapperboard size={12} /> Nuova Programmazione
                </div>
                <h2 className="text-4xl md:text-5xl font-light tracking-tight">Aggiungi <span className="italic font-serif">Film</span></h2>
                <p className="text-black/40 max-w-md">Inserisci i dettagli del film che vuoi mostrare nel carosello pubblico "Ora al Cinema".</p>
            </header>

            <CinemaForm />
        </div>
    );
}
