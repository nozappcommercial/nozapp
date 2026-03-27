import React from 'react';
import CinemaForm from '@/components/admin/CinemaForm';
import { Clapperboard } from 'lucide-react';
import { getCinemaMovieById } from '@/app/actions/cinema';
import { notFound } from 'next/navigation';

interface EditCinemaMoviePageProps {
    params: {
        id: string;
    };
}

export default async function EditCinemaMoviePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const movie = await getCinemaMovieById(id);

    if (!movie) {
        notFound();
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="space-y-1 pb-6 border-b border-black/5">
                <div className="flex items-center gap-2 text-[var(--gold)] font-['Fragment_Mono'] text-[10px] uppercase tracking-[0.3em]">
                    <Clapperboard size={12} /> Modifica Programmazione
                </div>
                <h2 className="text-4xl md:text-5xl font-light tracking-tight">Modifica <span className="italic font-serif">Film</span></h2>
                <p className="text-black/40 max-w-md">Aggiorna i dettagli o la data di scadenza per il film: <strong>{movie.title}</strong></p>
            </header>

            <CinemaForm initialData={movie} isEditing={true} />
        </div>
    );
}
