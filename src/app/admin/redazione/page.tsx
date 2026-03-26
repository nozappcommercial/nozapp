import React from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Edit3, Trash2, ExternalLink, Calendar, Eye, EyeOff } from 'lucide-react';
import { getArticlesAdmin } from '@/app/actions/editorial';

export const dynamic = 'force-dynamic';

const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateStr));
};

export default async function AdminRedazionePage() {
    const articles = await getArticlesAdmin();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-light mb-2">Gestione <em className="text-[var(--gold)] italic">Redazione</em></h2>
                    <p className="font-['Fragment_Mono'] text-[11px] uppercase tracking-widest opacity-60">
                        Crea, modifica e programma gli approfondimenti editoriali.
                    </p>
                </div>
                
                <Link 
                    href="/admin/redazione/nuovo"
                    className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-full hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] font-medium"
                >
                    <PlusCircle size={18} />
                    Nuovo Articolo
                </Link>
            </header>

            {/* Articles Table/List */}
            <div className="bg-white/40 ring-1 ring-black/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                {articles.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-black/20">
                            <Newspaper size={32} />
                        </div>
                        <p className="opacity-50 italic">Nessun articolo trovato. Inizia creandone uno nuovo.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-black/5 font-['Fragment_Mono'] text-[9px] uppercase tracking-widest text-black/40">
                                    <th className="px-6 py-4 font-normal">Stato</th>
                                    <th className="px-6 py-4 font-normal">Titolo</th>
                                    <th className="px-6 py-4 font-normal">Autore</th>
                                    <th className="px-6 py-4 font-normal">Data Pubblicazione</th>
                                    <th className="px-6 py-4 font-normal text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {articles.map((article) => {
                                    const isPublished = article.status === 'published';
                                    const isDraft = article.status === 'draft';
                                    const isScheduled = isPublished && new Date(article.published_at!) > new Date();
                                    const isExpired = article.expires_at && new Date(article.expires_at) < new Date();

                                    return (
                                        <tr key={article.id} className="group hover:bg-black/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    {isDraft ? (
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/5 text-black/60 text-[10px] uppercase font-['Fragment_Mono']">
                                                            <Edit3 size={10} /> Bozza
                                                        </span>
                                                    ) : isExpired ? (
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600/70 text-[10px] uppercase font-['Fragment_Mono']">
                                                            <EyeOff size={10} /> Scaduto
                                                        </span>
                                                    ) : isScheduled ? (
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600/70 text-[10px] uppercase font-['Fragment_Mono']">
                                                            <Calendar size={10} /> Programmato
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600/70 text-[10px] uppercase font-['Fragment_Mono']">
                                                            <Eye size={10} /> Pubblicato
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-lg leading-tight group-hover:text-[var(--gold)] transition-colors">{article.title}</span>
                                                    <span className="text-[11px] opacity-40 font-['Fragment_Mono']">/{article.slug}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm opacity-60">{(article.author as any)?.display_name || 'Anonimo'}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm opacity-60">
                                                    {article.published_at 
                                                        ? formatDate(article.published_at)
                                                        : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        href={`/admin/redazione/${article.id}`}
                                                        className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/60 hover:text-black"
                                                        title="Modifica"
                                                    >
                                                        <Edit3 size={18} />
                                                    </Link>
                                                    <Link 
                                                        href={`/redazione/${article.slug}`}
                                                        target="_blank"
                                                        className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/60 hover:text-black"
                                                        title="Anteprima"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const Newspaper = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8z" />
    </svg>
);
