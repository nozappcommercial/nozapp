"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { getProfileData, type ProfileData } from '@/lib/actions/profile_actions';
import { createClient } from '@/lib/supabase/client';
import './profile.css';

/**
 * PROFILE MODAL
 * ─────────────
 * Client component that renders the user profile panel as an overlay
 * on top of the Semantic Sphere. Fetches data via server actions.
 */

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Fetch profile data when modal opens
    useEffect(() => {
        if (isOpen && !data) {
            setLoading(true);
            getProfileData()
                .then(setData)
                .catch(err => console.error('[Profile] Failed to load:', err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, data]);

    // Escape key handler
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (showConfirm) {
                setShowConfirm(false);
            } else {
                onClose();
            }
        }
    }, [onClose, showConfirm]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    // Format member since date
    const formatMemberSince = (iso: string): string => {
        const d = new Date(iso);
        const months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
            'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
        return `Membro da ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    // Get initials from email
    const getInitials = (email: string): string => {
        const name = email.split('@')[0];
        const parts = name.split(/[._-]/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    // Logout handler
    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/login';
        } catch (err) {
            console.error('[Profile] Logout failed:', err);
            setIsLoggingOut(false);
        }
    };

    // Redo onboarding
    const handleRedoOnboarding = () => {
        window.location.href = '/onboarding';
    };

    return (
        <>
            {/* BACKDROP */}
            <div
                className={`prf-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* MODAL */}
            <div className={`prf-modal ${isOpen ? 'open' : ''}`}>
                <button className="prf-close" onClick={onClose}>×</button>

                {/* Confirm redo overlay */}
                <div className={`prf-confirm-overlay ${showConfirm ? 'visible' : ''}`}>
                    <div className="prf-confirm-title">Rifare l&apos;<em>onboarding</em>?</div>
                    <div className="prf-confirm-sub">
                        I tuoi pilastri attuali verranno sostituiti con i nuovi. L&apos;operazione non è reversibile.
                    </div>
                    <div className="prf-confirm-row">
                        <button className="prf-confirm-cancel" onClick={() => setShowConfirm(false)}>Annulla</button>
                        <button className="prf-confirm-ok" onClick={handleRedoOnboarding}>Sì, ricomincia</button>
                    </div>
                </div>

                {loading || !data ? (
                    <div className="prf-loading">
                        <div className="prf-loading-text">Caricamento profilo…</div>
                    </div>
                ) : (
                    <>
                        <div className="prf-scroll">
                            {/* IDENTITY */}
                            <div className="prf-identity">
                                <div className="prf-avatar">{getInitials(data.email)}</div>
                                <div className="prf-id-info">
                                    <div className="prf-id-email">{data.email}</div>
                                    <div className="prf-id-since">{formatMemberSince(data.memberSince)}</div>
                                </div>
                            </div>

                            {/* PILASTRI — placeholder for P1 */}
                            <div className="prf-section prf-anim-1">
                                <div className="prf-section-label">I tuoi pilastri</div>
                            </div>
                            <div className="prf-pillars-grid prf-anim-1">
                                {data.pillars.map((p, i) => (
                                    <div key={p.id} className="prf-pillar-card">
                                        <div className={`prf-pillar-rank ${i === 0 ? 'vertex' : ''}`}>
                                            {i === 0 ? '▲ vertice' : `n° ${i + 1}`}
                                        </div>
                                        <div className="prf-pillar-poster">
                                            <div
                                                className="prf-pillar-poster-bg"
                                                style={{
                                                    background: p.poster_url
                                                        ? `url(${p.poster_url}) center/cover`
                                                        : `linear-gradient(155deg, #0d1b35 0%, #1a3a6b 55%, #0d1b35 100%)`
                                                }}
                                            >
                                                {!p.poster_url && (
                                                    <span className="prf-pillar-poster-title">{p.title}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="prf-pillar-name">{p.title}</div>
                                        <div className="prf-pillar-meta">{p.director} · {p.year}</div>
                                    </div>
                                ))}
                            </div>

                            {/* STATS */}
                            <div className="prf-section prf-anim-2">
                                <div className="prf-section-label">La tua sfera</div>
                            </div>
                            <div className="prf-stats prf-anim-2">
                                <div className="prf-stat">
                                    <div className="prf-stat-num">{data.sphereStats.affinita}</div>
                                    <div className="prf-stat-label">Affinità</div>
                                    <div className="prf-stat-desc">Shell 1</div>
                                </div>
                                <div className="prf-stat">
                                    <div className="prf-stat-num">{data.sphereStats.scoperta}</div>
                                    <div className="prf-stat-label">Scoperta</div>
                                    <div className="prf-stat-desc">Shell 2</div>
                                </div>
                            </div>

                            {/* STREAMING — placeholder chips, P2 will add toggle logic */}
                            <div className="prf-section prf-anim-3">
                                <div className="prf-section-label">I tuoi servizi streaming</div>
                            </div>
                            <div className="prf-stream-hint prf-anim-3">
                                Seleziona i servizi a cui sei abbonato
                            </div>
                            <div className="prf-streaming-grid prf-anim-3">
                                {/* Will be replaced by ProfileStreaming component in P2 */}
                            </div>

                            {/* LOVED FILMS — placeholder, P3 will add carousel */}
                            {data.lovedFilms.length > 0 && (
                                <>
                                    <div className="prf-section prf-anim-4">
                                        <div className="prf-section-label">Altri film amati</div>
                                    </div>
                                    <div className="prf-loved-wrap prf-anim-4">
                                        <div className="prf-loved-carousel">
                                            {/* Will be replaced by ProfileLovedFilms in P3 */}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="prf-footer">
                            <button className="prf-btn-redo" onClick={() => setShowConfirm(true)}>
                                Rifai l&apos;onboarding
                            </button>
                            <button
                                className="prf-btn-logout"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? 'Uscita...' : 'Logout'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
