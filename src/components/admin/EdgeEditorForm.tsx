'use client';

import React, { useState, useEffect } from 'react';
import { searchFilms, addEditorialEdge, getEdgesForFilm, deleteEditorialEdge } from '@/app/actions/editorial_edges';
import { Search, Plus, Trash2, ArrowRightLeft, Loader2, AlertCircle, Link } from 'lucide-react';

export default function EdgeEditorForm() {
    const [sourceQuery, setSourceQuery] = useState('');
    const [targetQuery, setTargetQuery] = useState('');
    
    const [sourceResults, setSourceResults] = useState<any[]>([]);
    const [targetResults, setTargetResults] = useState<any[]>([]);
    
    const [sourceFilm, setSourceFilm] = useState<any>(null);
    const [targetFilm, setTargetFilm] = useState<any>(null);

    const [edgeType, setEdgeType] = useState<'thematic' | 'stylistic' | 'contrast'>('thematic');
    const [edgeLabel, setEdgeLabel] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [existingEdges, setExistingEdges] = useState<any>({ outgoing: [], incoming: [] });

    // Throttle search queries
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (sourceQuery.length >= 2 && !sourceFilm) {
                const { data } = await searchFilms(sourceQuery);
                setSourceResults(data || []);
            } else {
                setSourceResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [sourceQuery, sourceFilm]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (targetQuery.length >= 2 && !targetFilm) {
                const { data } = await searchFilms(targetQuery);
                setTargetResults(data || []);
            } else {
                setTargetResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [targetQuery, targetFilm]);

    // Fetch existing edges when source changes
    useEffect(() => {
        if (sourceFilm) {
            fetchEdges(sourceFilm.id);
        } else {
            setExistingEdges({ outgoing: [], incoming: [] });
        }
    }, [sourceFilm]);

    const fetchEdges = async (id: string) => {
        const res = await getEdgesForFilm(id);
        if (res.data) setExistingEdges(res.data);
    };

    const handleCreateEdge = async () => {
        if (!sourceFilm || !targetFilm) {
            setError('Seleziona entrambi i film');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const res = await addEditorialEdge({
            from_film_id: sourceFilm.id,
            to_film_id: targetFilm.id,
            type: edgeType,
            label: edgeLabel || undefined
        });

        setLoading(false);

        if (res.success) {
            setSuccess('Collegamento creato con successo!');
            // Reset target side for next relation
            setTargetFilm(null);
            setTargetQuery('');
            setEdgeLabel('');
            fetchEdges(sourceFilm.id);
        } else {
            setError(res.error || 'Errore durante la creazione');
        }
    };

    const handleDeleteEdge = async (id: string) => {
        if (!confirm('Sicuro di voler eliminare questo collegamento?')) return;
        
        const res = await deleteEditorialEdge(id);
        if (res.success) {
            setSuccess('Collegamento rimosso');
            if (sourceFilm) fetchEdges(sourceFilm.id);
        } else {
            setError(res.error || 'Errore durante l\'eliminazione');
        }
    };

    const FilmSearchBox = ({ 
        title, placeholder, query, setQuery, results, film, setFilm 
    }: {
        title: string; placeholder: string; query: string; setQuery: (q: string) => void;
        results: any[]; film: any; setFilm: (f: any) => void;
    }) => (
        <div className="space-y-3 relative">
            <h3 className="text-sm font-medium uppercase tracking-widest text-black/50 font-['Fragment_Mono']">
                {title}
            </h3>
            
            {film ? (
                <div className="p-4 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 flex justify-between items-center group">
                    <div>
                        <p className="font-medium text-lg">{film.title}</p>
                        <p className="text-sm opacity-60">{film.director} • {film.year}</p>
                    </div>
                    <button 
                        onClick={() => { setFilm(null); setQuery(''); }}
                        className="p-2 rounded-full hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Rimuovi"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-black/30" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-10 px-4 py-3 rounded-xl border-none ring-1 ring-black/10 bg-white/50 focus:ring-[var(--gold)] focus:outline-none transition-shadow"
                    />
                    
                    {results.length > 0 && (
                        <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden z-10 max-h-60 overflow-y-auto">
                            {results.map((r, i) => (
                                <button
                                    key={i}
                                    className="w-full text-left p-3 hover:bg-black/5 transition-colors border-b border-black/5 last:border-0 flex items-center gap-3"
                                    onClick={() => {
                                        setFilm(r);
                                        setQuery('');
                                    }}
                                >
                                    {r.poster_url && (
                                        <div className="w-8 h-12 bg-black/10 rounded flex-shrink-0 overflow-hidden relative">
                                            {/* We ignore actual Images here for simplicity, just a placeholder styling */}
                                            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(${r.poster_url})`}} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium truncate">{r.title}</p>
                                        <p className="text-xs opacity-50">{r.director} • {r.year}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center gap-3">
                    <AlertCircle size={18} />
                    <p>{error}</p>
                </div>
            )}
            
            {success && (
                <div className="p-4 rounded-xl bg-green-50 text-green-600 border border-green-200 flex items-center gap-3">
                    <AlertCircle size={18} />
                    <p>{success}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Search A */}
                <FilmSearchBox 
                    title="Film Sorgente" 
                    placeholder="Es. 2001: Odissea nello spazio"
                    query={sourceQuery} setQuery={setSourceQuery}
                    results={sourceResults} film={sourceFilm} setFilm={setSourceFilm}
                />
                
                {/* Search B */}
                <FilmSearchBox 
                    title="Film Target" 
                    placeholder="Film da collegare..."
                    query={targetQuery} setQuery={setTargetQuery}
                    results={targetResults} film={targetFilm} setFilm={setTargetFilm}
                />
            </div>

            {sourceFilm && targetFilm && (
                <div className="p-6 rounded-2xl bg-white ring-1 ring-black/5 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 w-full">
                        <div className="flex-1 text-right font-medium text-lg truncate" title={sourceFilm.title}>{sourceFilm.title}</div>
                        <ArrowRightLeft className="text-black/20 mx-2 flex-shrink-0" />
                        <div className="flex-1 text-left font-medium text-lg truncate" title={targetFilm.title}>{targetFilm.title}</div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-['Fragment_Mono'] uppercase tracking-widest opacity-50">Tipo Relazione</label>
                            <select 
                                value={edgeType}
                                onChange={(e) => setEdgeType(e.target.value as any)}
                                className="w-full px-4 py-3 rounded-xl border-none ring-1 ring-black/10 bg-black/5 focus:ring-[var(--gold)] focus:outline-none"
                            >
                                <option value="thematic">Tematica (Argomento affine)</option>
                                <option value="stylistic">Stilistica (Stile visivo/regia)</option>
                                <option value="contrast">Contrasto (Opposti complementari)</option>
                            </select>
                        </div>
                        
                        <div className="flex-[2] space-y-2">
                            <label className="text-xs font-['Fragment_Mono'] uppercase tracking-widest opacity-50">Motivazione (Opzionale)</label>
                            <input 
                                type="text"
                                value={edgeLabel}
                                onChange={(e) => setEdgeLabel(e.target.value)}
                                placeholder="Breve motivazione del collegamento..."
                                className="w-full px-4 py-3 rounded-xl border-none ring-1 ring-black/10 bg-white/50 focus:ring-[var(--gold)] focus:outline-none"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleCreateEdge}
                        disabled={loading}
                        className="w-full max-w-sm py-4 rounded-xl bg-black text-white font-medium hover:bg-black/80 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Link size={18} className="group-hover:scale-110 transition-transform" />}
                        {loading ? 'Salvataggio...' : `Collega i due film`}
                    </button>
                </div>
            )}

            {sourceFilm && (existingEdges.outgoing?.length > 0 || existingEdges.incoming?.length > 0) && (
                <div className="pt-8 border-t border-black/5 space-y-6">
                    <h3 className="text-lg font-serif italic text-black/60">Collegamenti esistenti per {sourceFilm.title}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Outgoing Edges */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-['Fragment_Mono'] uppercase tracking-widest opacity-50">Punta Verso ({existingEdges.outgoing.length})</h4>
                            {existingEdges.outgoing.map((edge: any) => (
                                <div key={edge.id} className="p-4 rounded-xl border border-black/10 bg-white flex justify-between items-center group">
                                    <div>
                                        <p className="font-medium text-sm">{edge.target_film?.length ? edge.target_film[0]?.title : 'Film ignorato'}</p>
                                        <p className="text-xs opacity-50 capitalize">{edge.type} • {edge.label || 'Nessuna label'}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteEdge(edge.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Incoming Edges */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-['Fragment_Mono'] uppercase tracking-widest opacity-50">Ereditato Da ({existingEdges.incoming.length})</h4>
                            {existingEdges.incoming.map((edge: any) => (
                                <div key={edge.id} className="p-4 rounded-xl border border-black/10 bg-black/5 flex justify-between items-center group">
                                    <div>
                                        <p className="font-medium text-sm">{edge.source_film?.length ? edge.source_film[0]?.title : 'Film ignorato'}</p>
                                        <p className="text-xs opacity-50 capitalize">{edge.type} • {edge.label || 'Nessuna label'}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteEdge(edge.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
