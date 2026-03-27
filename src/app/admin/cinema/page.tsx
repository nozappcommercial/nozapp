'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/image'; // Wait, Link should be from next/link
import { Plus, Clapperboard, Calendar, Clock, Trash2, Edit2, AlertCircle, ExternalLink } from 'lucide-react';
import { getCinemaMoviesAdmin, deleteCinemaMovie } from '@/app/actions/cinema';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';

export default function CinemaListPage() {
    const [movies, setMovies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const data = await getCinemaMoviesAdmin();
            setMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Sei sicuro di voler rimuovere questo film?')) return;
        try {
            await deleteCinemaMovie(id);
            setMovies(prev => prev.filter(m => m.id !== id));
            router.refresh();
        } catch (error) {
            alert('Errore durante l\'eliminazione');
        }
    };

    const isExpired = (expiry: string) => new Date(expiry) < new Date();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/5">
                <div className="space-y-1">
                    <h2 className="text-3xl font-light">Gestione <span className="italic font-serif">Cinema</span></h2>
                    <p className="text-sm text-black/40">Inserisci e gestisci i film in programmazione nel carosello pubblico.</p>
                </div>
                <NextLink 
                    href="/admin/cinema/nuovo"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-full hover:bg-black transition-all text-sm font-medium"
                >
                    <Plus size={18} /> Aggiungi Film
                </NextLink>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-black/20 animate-pulse">
                    <Clapperboard size={48} strokeWidth={1} />
                    <p className="mt-4 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest">Caricamento programmazione...</p>
                </div>
            ) : movies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white/40 rounded-[40px] border border-dashed border-black/10">
                    <Clapperboard size={48} className="text-black/10 mb-4" strokeWidth={1} />
                    <h3 className="text-xl font-light text-black/40">Nessun film in lista</h3>
                    <p className="text-sm text-black/20 mb-8 text-center max-w-xs">Aggiungi il primo film per vederlo apparire nel carosello pubblico.</p>
                    <NextLink 
                        href="/admin/cinema/nuovo"
                        className="px-8 py-2 border border-black/10 rounded-full hover:bg-black/5 transition-all text-sm"
                    >
                        Crea ora
                    </NextLink>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {movies.map((movie) => (
                        <div 
                            key={movie.id}
                            className={`group bg-white p-5 rounded-[32px] ring-1 ring-black/5 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-xl hover:shadow-black/5 ${isExpired(movie.expires_at) ? 'opacity-60 grayscale-[0.5]' : ''}`}
                        >
                            {/* Poster Preview */}
                            <div className="relative w-24 h-36 flex-shrink-0 bg-black/5 rounded-2xl overflow-hidden ring-1 ring-black/5">
                                {movie.poster_url ? (
                                    <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-black/10">
                                        <Clapperboard size={24} />
                                    </div>
                                )}
                            </div>

                            {/* Movie Info */}
                            <div className="flex-grow space-y-3 text-center md:text-left">
                                <div className="space-y-1">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <h3 className="text-xl font-medium">{movie.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-['Fragment_Mono'] text-black/40 px-2 py-0.5 bg-black/5 rounded-full uppercase tracking-widest">
                                                {movie.year}
                                            </span>
                                            {isExpired(movie.expires_at) && (
                                                <span className="text-[10px] font-['Fragment_Mono'] text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                                                    <AlertCircle size={10} /> Scaduto
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-black/60 italic font-serif">Regia di {movie.director}</p>
                                </div>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {movie.themes.map((theme: string, i: number) => (
                                        <span key={i} className="text-[9px] font-['Fragment_Mono'] text-black/30 border border-black/5 px-2 py-0.5 rounded uppercase tracking-widest">
                                            {theme}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-['Fragment_Mono'] uppercase tracking-widest text-black/40">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} className="text-[var(--gold)]" />
                                        Scade il: {new Date(movie.expires_at).toLocaleDateString('it-IT')}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-auto pr-4">
                                <NextLink 
                                    href={`/admin/cinema/${movie.id}`}
                                    className="p-3 text-black/40 hover:text-black hover:bg-black/5 rounded-full transition-all"
                                    title="Modifica"
                                >
                                    <Edit2 size={18} />
                                </NextLink>
                                <button 
                                    onClick={() => handleDelete(movie.id)}
                                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                    title="Elimina"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
