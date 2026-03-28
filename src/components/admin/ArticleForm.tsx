'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Loader2, Calendar, Link as LinkIcon, Type, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { upsertArticle, deleteArticle } from '@/app/actions/editorial';

interface ArticleFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        id: initialData?.id,
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        cover_image: initialData?.cover_image || '',
        status: initialData?.status || 'draft',
        published_at: initialData?.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        expires_at: initialData?.expires_at ? new Date(initialData.expires_at).toISOString().slice(0, 16) : '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title if it's empty and we are typing title
        if (name === 'title' && !isEditing && !formData.slug) {
            const suggestedSlug = value
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            setFormData(prev => ({ ...prev, slug: suggestedSlug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await upsertArticle({
                ...formData,
                published_at: new Date(formData.published_at).toISOString(),
                expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
            } as any);
            router.push('/admin/redazione');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Errore durante il salvataggio');
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Sei sicuro di voler eliminare questo articolo?')) return;
        
        setIsDeleting(true);
        try {
            await deleteArticle(formData.id);
            router.push('/admin/redazione');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Errore durante l\'eliminazione');
            setIsDeleting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in duration-700 pb-20">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-['Fragment_Mono']">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content Areas */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                            <Type size={12} /> Titolo dell'Articolo
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Sinfonie silenziose: il colore nel cinema di..."
                            className="w-full bg-transparent border-none text-4xl md:text-5xl font-light placeholder:opacity-20 focus:ring-0 p-0 outline-none"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                            <LinkIcon size={12} /> Slug (URL)
                        </label>
                        <div className="flex items-center gap-2 text-[var(--gold)] font-['Fragment_Mono'] text-sm">
                            <span>nozapp.it/redazione/</span>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                placeholder="titolo-articolo"
                                className="bg-white/50 px-2 py-0.5 rounded border border-black/5 focus:outline-none focus:border-[var(--gold)]/30 min-w-[200px]"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                            <FileText size={12} /> Sommario (Estratto)
                        </label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Breve introduzione che apparirà nella card della home..."
                            className="w-full bg-white/40 border border-black/5 rounded-xl p-4 text-sm font-['Fragment_Mono'] leading-relaxed focus:bg-white/80 transition-all outline-none"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                            <FileText size={12} /> Contenuto (Markdown supportato)
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={20}
                            placeholder="Scrivi qui il tuo articolo..."
                            className="w-full bg-white/40 border border-black/5 rounded-xl p-6 text-lg leading-relaxed focus:bg-white/80 transition-all outline-none font-serif min-h-[500px]"
                        />
                    </div>
                </div>

                {/* Sidebar / Settings */}
                <div className="space-y-8">
                    {/* Status & Actions */}
                    <div className="bg-white/60 p-6 rounded-2xl ring-1 ring-black/5 space-y-6 sticky top-24">
                        <div className="space-y-2">
                            <label className="font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40 block">Stato Pubblicazione</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-white border border-black/5 rounded-lg px-4 py-2 text-sm outline-none"
                            >
                                <option value="draft">Bozza</option>
                                <option value="published">Pubblicato</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40 block">Programmazione</label>
                            <input
                                type="datetime-local"
                                name="published_at"
                                value={formData.published_at}
                                onChange={handleChange}
                                className="w-full max-w-full bg-white border border-black/5 rounded-lg px-3 md:px-4 py-2 text-sm outline-none font-['Fragment_Mono'] min-w-0"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40 block">Scadenza (Opzionale)</label>
                            <input
                                type="datetime-local"
                                name="expires_at"
                                value={formData.expires_at}
                                onChange={handleChange}
                                className="w-full max-w-full bg-white border border-black/5 rounded-lg px-3 md:px-4 py-2 text-sm outline-none font-['Fragment_Mono'] min-w-0"
                            />
                        </div>

                        <hr className="border-black/5" />

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 font-['Fragment_Mono'] text-[10px] uppercase tracking-widest opacity-40">
                                <ImageIcon size={12} /> URL Immagine Copertina
                            </label>
                            <input
                                type="text"
                                name="cover_image"
                                value={formData.cover_image}
                                onChange={handleChange}
                                placeholder="https://unsplash.com/..."
                                className="w-full bg-white border border-black/5 rounded-lg px-4 py-2 text-[11px] font-['Fragment_Mono'] outline-none"
                            />
                            {formData.cover_image && (
                                <div className="mt-2 aspect-video rounded-lg overflow-hidden ring-1 ring-black/5">
                                    <img src={formData.cover_image} alt="Preview" className="w-full h-full object-cover" />
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
                                {isEditing ? 'Salva Modifiche' : 'Crea Articolo'}
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
                                    Elimina Articolo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
