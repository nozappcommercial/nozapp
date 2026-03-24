"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { getProfileData, type ProfileData, type PillarFilm } from '@/lib/actions/profile_actions';
import { createClient } from '@/lib/supabase/client';
import ProfilePillars from './ProfilePillars';
import ProfileStreaming from './ProfileStreaming';
import ProfileLovedFilms from './ProfileLovedFilms';
import { motion, useAnimation, useDragControls, PanInfo } from 'framer-motion';
import './profile.css';

/**
 * PROFILE MODAL
 * ─────────────
 * Two-column layout that shows all profile content on a single screen.
 * Left column: Pillars grid (3×2 with FLIP swap)
 * Right column: Stats + Streaming + Loved Films
 * On mobile: stacks vertically with scroll.
 */

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState<'onboarding' | 'logout' | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const controls = useAnimation();
    const dragControls = useDragControls();

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

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setShowConfirm(null);
            window.dispatchEvent(new Event('hide-header'));
            controls.start({ y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } });
        } else {
            // Instantly reset position when standard close happens (e.g. wrapper click)
            window.dispatchEvent(new Event('show-header'));
            controls.set({ y: 0 });
        }
    }, [isOpen, controls]);

    // Escape key handler
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            showConfirm ? setShowConfirm(null) : onClose();
        }
    }, [onClose, showConfirm]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    const formatMemberSince = (iso: string): string => {
        const d = new Date(iso);
        const months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
            'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
        return `Membro da ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const getInitials = (email: string): string => {
        const name = email.split('@')[0];
        const parts = name.split(/[._-]/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    const confirmLogout = async () => {
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

    const handleLogout = () => {
        setShowConfirm('logout');
    };

    const handleRedoOnboarding = () => { window.location.href = '/onboarding'; };

    const handlePillarReorder = useCallback((newPillars: PillarFilm[]) => {
        setData(prev => prev ? { ...prev, pillars: newPillars } : prev);
    }, []);

    const handleStreamingChange = useCallback((services: string[]) => {
        setData(prev => prev ? { ...prev, streamingServices: services } : prev);
    }, []);

    const handleDragEnd = (e: any, info: PanInfo) => {
        if (info.offset.y > 100 || info.velocity.y > 500) {
            // Animate out then close
            controls.start({ y: '100%', transition: { ease: 'easeIn', duration: 0.2 } })
                .then(onClose);
        } else {
            // Bounce back
            controls.start({ y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } });
        }
    };

    return (
        <>
            {/* BACKDROP */}
            <div className={`prf-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />

            {/* MODAL */}
            <motion.div 
                className={`prf-modal ${isOpen ? 'open' : ''}`}
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={controls}
            >
                <button className="prf-close" onClick={onClose}>×</button>

                {/* Confirm redo onboarding overlay */}
                <div className={`prf-confirm-overlay ${showConfirm === 'onboarding' ? 'visible' : ''}`}>
                    <div className="prf-confirm-title">Rifare l&apos;<em>onboarding</em>?</div>
                    <div className="prf-confirm-sub">
                        I tuoi pilastri attuali verranno sostituiti con i nuovi. L&apos;operazione non è reversibile.
                    </div>
                    <div className="prf-confirm-row">
                        <button className="prf-confirm-cancel" onClick={() => setShowConfirm(null)}>Annulla</button>
                        <button className="prf-confirm-ok" onClick={handleRedoOnboarding}>Sì, ricomincia</button>
                    </div>
                </div>

                {/* Confirm logout overlay */}
                <div className={`prf-confirm-overlay ${showConfirm === 'logout' ? 'visible' : ''}`}>
                    <div className="prf-confirm-title">Vuoi uscire?</div>
                    <div className="prf-confirm-sub">
                        Dovrai effettuare nuovamente l&apos;accesso per entrare nella Sfera Semantica.
                    </div>
                    <div className="prf-confirm-row">
                        <button className="prf-confirm-cancel" onClick={() => setShowConfirm(null)}>Annulla</button>
                        <button className="prf-confirm-ok" onClick={confirmLogout} disabled={isLoggingOut}>
                            {isLoggingOut ? 'Uscita...' : 'Sì, esci'}
                        </button>
                    </div>
                </div>

                {loading || !data ? (
                    <div className="prf-loading">
                        <div className="prf-loading-text">Caricamento profilo…</div>
                    </div>
                ) : (
                    <>
                        {/* ─── IDENTITY (top bar, full width) ─── */}
                        <div 
                            className="prf-identity"
                            onPointerDown={(e) => dragControls.start(e)}
                            style={{ touchAction: 'none', cursor: 'grab' }}
                        >
                            <div className="prf-avatar">{getInitials(data.email)}</div>
                            <div className="prf-id-info">
                                <div className="prf-id-email">{data.email}</div>
                                <div className="prf-id-since">{formatMemberSince(data.memberSince)}</div>
                            </div>
                        </div>

                        {/* ─── TWO-COLUMN BODY ─── */}
                        <div className="prf-body">
                            {/* LEFT COLUMN: Pillars */}
                            <div className="prf-col-left prf-anim-1">
                                <div className="prf-section">
                                    <div className="prf-section-label">I tuoi pilastri</div>
                                </div>
                                <ProfilePillars
                                    pillars={data.pillars}
                                    onReorder={handlePillarReorder}
                                />
                            </div>

                            {/* RIGHT COLUMN: Stats + Streaming + Loved */}
                            <div className="prf-col-right">
                                {/* Stats */}
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

                                {/* Streaming */}
                                <div className="prf-section prf-anim-3">
                                    <div className="prf-section-label">I tuoi servizi streaming</div>
                                </div>
                                <ProfileStreaming
                                    activeServices={data.streamingServices}
                                    onChange={handleStreamingChange}
                                />

                                {/* Loved Films */}
                                <ProfileLovedFilms films={data.lovedFilms} />
                            </div>
                        </div>

                        {/* ─── FOOTER (bottom bar, full width) ─── */}
                        <div className="prf-footer">
                            <button className="prf-btn-redo" onClick={() => setShowConfirm('onboarding')}>
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
            </motion.div>
        </>
    );
}
