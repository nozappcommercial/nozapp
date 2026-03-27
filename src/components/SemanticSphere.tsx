"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ShellLevel } from './sphere/ShellNavigator';
import './sphere.css';
import { upsertMovieInteraction, InteractionType } from '@/app/actions/movies';
import { useSphereEngine } from '../hooks/useSphereEngine';
import MovieDetailPanel from './sphere/MovieDetailPanel';
import SphereUIOverlays from './sphere/SphereUIOverlays';

/**
 * SEMANTIC SPHERE COMPONENT
 * -------------------------
 * Orchestrator for the 3D semantic sphere. 
 * Coordinates state between the Three.js engine and React UI components.
 */

export interface FilmNode {
    id: number;
    title: string;
    year: number;
    dir: string;
    shell: number;
    tags: string[];
    poster?: string[];
    poster_url?: string | null;
    interaction?: 'seen' | 'liked' | 'ignored';
    streaming_providers?: any[] | null;
}

export interface FilmEdge {
    from: number;
    to: number;
    type: string;
    label: string;
}

interface SemanticSphereProps {
    files?: FilmNode[];
    edges?: FilmEdge[];
    userSubscriptions?: string[];
}

export default function SemanticSphere({ files = [], edges = [], userSubscriptions = [] }: SemanticSphereProps) {
    // UI State
    const [selectedFilm, setSelectedFilm] = useState<FilmNode | null>(null);
    const [lastFilm, setLastFilm] = useState<FilmNode | null>(null);
    const [selectedEdges, setSelectedEdges] = useState<any[]>([]);
    const [panelMinimized, setPanelMinimized] = useState(false);
    
    // Feedback state (Seen, Liked, Ignored)
    const [nodeInteractions, setNodeInteractions] = useState<Record<number, InteractionType | undefined>>({});

    // Navigation State
    const [activeShell, setActiveShell] = useState<ShellLevel>(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Refs for 2D labels (DOM-based)
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Keep track of the last selected film to allow CSS exit animations
    useEffect(() => {
        if (selectedFilm) setLastFilm(selectedFilm);
    }, [selectedFilm]);

    // Sync interactions from props
    useEffect(() => {
        const initialMap: Record<number, InteractionType | undefined> = {};
        files.forEach(f => {
            if (f.interaction) initialMap[f.id] = f.interaction;
        });
        setNodeInteractions(initialMap);
    }, [files]);

    // Global Header visibility toggle & Body Scroll Lock
    useEffect(() => {
        if (selectedFilm) {
            window.dispatchEvent(new CustomEvent('hide-header'));
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            window.dispatchEvent(new CustomEvent('show-header'));
            document.body.style.overflow = '';
        }
        return () => {
            window.dispatchEvent(new CustomEvent('show-header'));
            document.body.style.overflow = '';
        };
    }, [selectedFilm]);

    const handleInteraction = async (filmId: number, type: InteractionType) => {
        const currentType = nodeInteractions[filmId];
        const newType = currentType === type ? null : type;

        setNodeInteractions(prev => ({
            ...prev,
            [filmId]: newType || undefined
        }));

        try {
            await upsertMovieInteraction(filmId, newType);
        } catch (err) {
            console.error("Failed to update interaction", err);
            setNodeInteractions(prev => ({
                ...prev,
                [filmId]: currentType
            }));
        }
    };

    // Initialize the Three.js Engine Hook
    useSphereEngine({
        files,
        edges,
        activeShell,
        setActiveShell,
        setSelectedFilm,
        setSelectedEdges,
        setPanelMinimized,
        setIsAnimating,
        labelRefs,
        titleRefs
    });

    return (
        <div id="sphere-canvas-container" className="main-sphere-wrapper" style={{ overflow: 'hidden', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, #faf7f2 0%, #f0ebe0 30%, #e4ddd0 55%, #d8cfc0 75%, #ccc2b0 100%)' }}>
            <canvas id="c" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

            {/* 2D Labels Layer */}
            <div id="labels" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                {files.map((f, i) => (
                    <div
                        key={f.id}
                        ref={(el) => { labelRefs.current[i] = el; }}
                        className={`node-label label-${['pillar', 'primary', 'secondary'][f.shell]}`}
                    >
                        <div
                            className="label-title"
                            id={`lt-${i}`}
                            ref={(el) => { titleRefs.current[i] = el; }}
                        >
                            {f.title}
                        </div>
                    </div>
                ))}
            </div>

            {/* UI Overlays (Header, Breadcrumb, Nav Buttons) */}
            <SphereUIOverlays 
                activeShell={activeShell}
                setActiveShell={setActiveShell}
                isAnimating={isAnimating}
            />

            {/* Movie Detail Panel */}
            {lastFilm && (
                <MovieDetailPanel 
                    selectedFilm={selectedFilm}
                    lastFilm={lastFilm}
                    panelMinimized={panelMinimized}
                    nodeInteractions={nodeInteractions}
                    userSubscriptions={userSubscriptions}
                    selectedEdges={selectedEdges}
                    setPanelMinimized={setPanelMinimized}
                    setSelectedFilm={setSelectedFilm}
                    handleInteraction={handleInteraction}
                />
            )}
        </div>
    );
}
