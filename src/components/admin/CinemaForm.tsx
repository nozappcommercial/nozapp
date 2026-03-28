'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Loader2, Calendar, Link as LinkIcon, Type, Clapperboard, Image as ImageIcon, Trash2, Tag } from 'lucide-react';
import { upsertCinemaMovie, deleteCinemaMovie, CinemaMovieFormData } from '@/app/actions/cinema';

interface CinemaFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function CinemaForm({ initialData, isEditing = false }: CinemaFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        id: initialData?.id,
        title: initialData?.title || '',
        director: initialData?.director || '',
        year: initialData?.year || new Date().getFullYear(),
        poster_url: initialData?.poster_url || '',
        themes: initialData?.themes?.join(', ') || '',
        expires_at: initialData?.expires_at ? new Date(initialData.expires_at).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default 30 days
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'year' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const themesArray = formData.themes.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '');
            
            await upsertCinemaMovie({
                ...formData,
                themes: themesArray,
                expires_at: new Date(formData.expires_at).toISOString(),
            } as CinemaMovieFormData);

            router.push('/admin/cinema');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Errore durante il salvataggio');
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Sei sicuro di voler rimuovere questo film?')) return;
        
        setIsDeleting(true);
        try {
            await deleteCinemaMovie(formData.id);
            router.push('/admin/cinema');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Errore durante l\'eliminazione');
            setIsDeleting(false);
        }
    };

    return (
        <>
            <style>{`
                input[type="datetime-local"] {
                    width: 100%;
                    -webkit-appearance: none;
                    min-width: 0;
                }
                input[type="datetime-local"]::-webkit-datetime-edit {
                    padding: 0;
                }
                input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                    flex-shrink: 0;
                }
            `}</style>
            <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in duration-700 pb-20">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-['Fragment_Mono']">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                                <Clapperboard size={12} /> Titolo del Film
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Il Ragazzo e l'Airone"
                                className="w-full bg-transparent border-none text-4xl md:text-5xl font-light placeholder:opacity-20 focus:ring-0 p-0 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                                    <Type size={12} /> Regista
                                </label>
                                <input
                                    type="text"
                                    name="director"
                                    value={formData.director}
                                    onChange={handleChange}
                                    required
                                    placeholder="Hayao Miyazaki"
                                    className="w-full bg-white/40 border border-black/5 rounded-xl p-4 text-sm font-['Fragment_Mono'] focus:bg-white/80 transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                                    <Calendar size={12} /> Anno di Produzione
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                    min="1880"
                                    max="2100"
                                    className="w-full bg-white/40 border border-black/5 rounded-xl p-4 text-sm font-['Fragment_Mono'] focus:bg-white/80 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                                <Tag size={12} /> Temi / Tag (separati da virgola)
                            </label>
                            <input
                                type="text"
                                name="themes"
                                value={formData.themes}
                                onChange={handleChange}
                                placeholder="Animazione, Avventura, Onirico"
                                className="w-full bg-white/40 border border-black/5 rounded-xl p-4 text-sm font-['Fragment_Mono'] focus:bg-white/80 transition-all outline-none"
                            />
                        </div>

                        <div className="p-6 bg-[var(--gold-dim)]/5 rounded-2xl border border-[var(--gold-dim)]/20 space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-[var(--gold)]" size={20} />
                                <div>
                                    <h4 className="text-sm font-medium">Scadenza Automatica</h4>
                                    <p className="text-[11px] opacity-40 italic">Il film verrà rimosso automaticamente dal carosello pubblico a questa data.</p>
                                </div>
                            </div>
                            <input
                                type="datetime-local"
                                name="expires_at"
                                value={formData.expires_at}
                                onChange={handleChange}
                                required
                                className="w-full max-w-full bg-white border border-black/5 rounded-lg px-2 md:px-4 py-2 text-[13px] md:text-sm outline-none font-['Fragment_Mono'] min-w-0"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white/60 p-6 rounded-2xl ring-1 ring-black/5 space-y-6 sticky top-24">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                                    <ImageIcon size={12} /> URL Poster (Verticale)
                                </label>
                                <input
                                    type="text"
                                    name="poster_url"
                                    value={formData.poster_url}
                                    onChange={handleChange}
                                    placeholder="https://image.tmdb.org/..."
                                    className="w-full bg-white border border-black/5 rounded-lg px-4 py-2 text-[11px] font-['Fragment_Mono'] outline-none"
                                />
                                {formData.poster_url ? (
                                    <div className="aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-black/5 bg-black/5">
                                        <img src={formData.poster_url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="aspect-[2/3] rounded-lg border-2 border-dashed border-black/5 flex items-center justify-center text-black/10">
                                        <ImageIcon size={40} strokeWidth={1} />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-full hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {isEditing ? 'Salva Modifiche' : 'Aggiungi film'}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black/5 text-black/60 rounded-full hover:bg-black/10 transition-all text-sm"
                                >
                                    <X size={16} /> Annulla
                                </button>

                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-red-600/60 hover:text-red-600 hover:bg-red-50 rounded-full transition-all text-sm mt-4"
                                    >
                                        {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                        Rimuovi film
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
