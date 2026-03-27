"use client";
import React, { useRef } from 'react';
import { FilmNode } from '../SemanticSphere';
import { InteractionType } from '@/app/actions/movies';

interface MovieDetailPanelProps {
    selectedFilm: FilmNode | null;
    lastFilm: FilmNode | null;
    panelMinimized: boolean;
    nodeInteractions: Record<number, InteractionType | undefined>;
    userSubscriptions: string[];
    selectedEdges: any[];
    setPanelMinimized: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedFilm: React.Dispatch<React.SetStateAction<FilmNode | null>>;
    handleInteraction: (filmId: number, type: InteractionType) => Promise<void>;
}

export default function MovieDetailPanel({
    selectedFilm,
    lastFilm,
    panelMinimized,
    nodeInteractions,
    userSubscriptions,
    selectedEdges,
    setPanelMinimized,
    setSelectedFilm,
    handleInteraction
}: MovieDetailPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const panelTouchStartX = useRef(0);
    const isSwiping = useRef(false);

    if (!lastFilm) return null;

    return (
        <div 
            id="panel" 
            ref={panelRef}
            className={[
                selectedFilm ? 'visible' : '',
                panelMinimized ? 'minimized' : '',
                ['panel-shell-pillar', 'panel-shell-primary', 'panel-shell-secondary'][lastFilm.shell],
                nodeInteractions[lastFilm.id] ? 'is-torn' : ''
            ].filter(Boolean).join(' ')}
            style={{ position: 'absolute' }}
            onTouchStart={(e) => {
                panelTouchStartX.current = e.touches[0].clientX;
                isSwiping.current = true;
                if (panelRef.current) {
                    panelRef.current.style.transition = 'none';
                }
            }}
            onTouchMove={(e) => {
                if (!isSwiping.current || !panelRef.current || panelMinimized) return;
                const currentX = e.touches[0].clientX;
                const deltaX = currentX - panelTouchStartX.current;
                
                // Limit vertical movement to avoid interference
                const rotate = deltaX * 0.05;
                panelRef.current.style.transform = `translate(-50%, -50%) translateX(${deltaX}px) rotate(${rotate}deg)`;
            }}
            onTouchEnd={(e) => {
                if (!isSwiping.current || !panelRef.current) return;
                isSwiping.current = false;
                const deltaX = e.changedTouches[0].clientX - panelTouchStartX.current;
                
                // Restore transition for smooth snap or exit
                panelRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1), opacity 0.4s ease';

                if (Math.abs(deltaX) > 100) {
                    // Trigger navigation based on direction
                    if (deltaX > 0) document.getElementById('btn-right')?.click();
                    else document.getElementById('btn-left')?.click();
                    
                    // Exit animation handled by state change, but clear inline transform
                    setTimeout(() => {
                        if (panelRef.current) panelRef.current.style.transform = '';
                    }, 50);
                } else {
                    // Snap back to center
                    panelRef.current.style.transform = '';
                }
            }}
        >
            {/* Full Card Poster Background */}
            <img id="panel-poster-full"
                src={lastFilm.poster_url || '/placeholder.jpg'}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
            />
            
            {/* Frosted Glass Content Overlay */}
            <div className="panel-glass-content">
                <div className="ticket-serial">№ {lastFilm.id.toString().slice(-6).toUpperCase()}</div>
                <div className="ticket-stamp">Nozapp Première</div>
                <div className="panel-top-row">
                    <div className="poster-film-title" id="poster-title">{lastFilm.title}</div>
                    <button id="panel-minimize" onClick={() => setPanelMinimized(prev => !prev)}>{panelMinimized ? '↑' : '↓'}</button>
                    <button id="panel-close" onClick={() => { setPanelMinimized(false); setSelectedFilm(null); window.dispatchEvent(new Event('closeSpherePanel')); }}>×</button>
                </div>
                
                <div className="poster-film-meta" id="poster-meta">
                    <span className="p-meta-dir">{lastFilm.dir}</span>
                    <span className="p-meta-divider">|</span>
                    <span className="p-meta-year">{lastFilm.year}</span>
                </div>
                
                <div className="pg-header">
                </div>

                <div className="pg-body">
                    <div className="p-section">Temi editoriali</div>
                    <div className="p-tags" id="p-tags">
                        {lastFilm.tags.map((t: string) => <div key={t} className="p-tag">{t}</div>)}
                    </div>
                    
                    {lastFilm.streaming_providers && lastFilm.streaming_providers.length > 0 && (
                        <>
                            <div className="p-section">Guarda ora su</div>
                            <div className="p-streaming-list">
                                {lastFilm.streaming_providers.map((p: any) => {
                                    const isSubbed = userSubscriptions.includes(p.name);
                                    return (
                                        <a 
                                            key={`${p.name}-${p.type}`} 
                                            href={p.link} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className={`p-streaming-badge ${isSubbed ? 'subscribed' : ''}`}
                                        >
                                            <span className="p-streaming-name">{p.name}</span>
                                            {p.type !== 'subscription' && (
                                                <span className="p-streaming-price">{p.price ? ` (${p.price})` : ` (${p.type === 'buy' ? 'Acquisto' : 'Noleggio'})`}</span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        </>
                    )}
                    
                    {selectedEdges.length > 0 && (
                        <>
                            <div className="p-section">Connessioni editoriali</div>
                            <div className="p-conns">
                                {selectedEdges.map((e: any) => (
                                    <div key={e.id} className="p-conn">
                                        <div className="p-conn-dot" style={{ background: ['var(--ember)', 'var(--gold)', 'var(--cold)'][e.film.shell] }}></div>
                                        <span>{e.film.title}</span>
                                        <span className="p-conn-type">· {e.type}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    
                    
                    {/* Actions (The Stub) - Aligned with notches */}
                    <div className="ticket-tear">
                        <div className="ticket-tear-line" />
                    </div>
                    <div className="p-feedback-actions">
                        {[
                            { type: 'seen' as InteractionType, label: 'Visto', title: 'L\'ho visto' },
                            { type: 'liked' as InteractionType, label: 'Mi Piace', title: 'Mi è piaciuto' },
                            { type: 'ignored' as InteractionType, label: 'Ignora', title: 'Non mi interessa' }
                        ].map((btn) => {
                            const isActive = lastFilm && nodeInteractions[lastFilm.id] === btn.type;
                            return (
                                <button 
                                    key={btn.type}
                                    className={`feedback-btn ${isActive ? 'active' : ''}`}
                                    title={btn.title} 
                                    onClick={() => lastFilm && handleInteraction(lastFilm.id, btn.type)}
                                >
                                    {btn.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
