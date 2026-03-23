"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { saveStreamingServices } from '@/lib/actions/profile_actions';

/**
 * PROFILE STREAMING
 * ─────────────────
 * 4-column grid of streaming service chips with toggle interaction.
 * Uses real platform logos from /public/logos/.
 * Optimistic local state + debounced server save (800ms).
 */

interface ProfileStreamingProps {
    activeServices: string[];
    onChange: (services: string[]) => void;
}

const STREAMING_SERVICES = [
    { id: 'Netflix',     name: 'Netflix',     logo: '/logos/Netflix_2015_logo.svg' },
    { id: 'Prime Video', name: 'Prime Video', logo: '/logos/Prime_Video_logo_(2024).svg' },
    { id: 'Disney+',     name: 'Disney+',     logo: '/logos/Disney+_(black)_logo.svg' },
    { id: 'Apple TV+',   name: 'Apple TV+',   logo: '/logos/Apple_TV_Plus_Logo.svg' },
    { id: 'MUBI',        name: 'MUBI',        logo: '/logos/Mubi_logo.svg' },
    { id: 'HBO Max',     name: 'Max',         logo: '/logos/HBO_Max_Logo_(October_2019_Print).svg' },
    { id: 'Sky',         name: 'Sky',         logo: '/logos/Sky_Group_logo_2020.svg' },
    { id: 'RaiPlay',     name: 'RaiPlay',     logo: '/logos/RaiPlay.svg' },
];

export default function ProfileStreaming({ activeServices: initialServices, onChange }: ProfileStreamingProps) {
    const [active, setActive] = useState<Set<string>>(new Set(initialServices));
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

    useEffect(() => {
        setActive(new Set(initialServices));
    }, [initialServices]);

    const handleToggle = useCallback((id: string) => {
        setActive(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);

            const arr = Array.from(next);
            queueMicrotask(() => onChangeRef.current(arr));

            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                saveStreamingServices(arr).catch(err =>
                    console.error('[ProfileStreaming] Save failed:', err)
                );
            }, 800);

            return next;
        });
    }, []);

    return (
        <>
            <div className="prf-stream-hint prf-anim-3">
                Seleziona i servizi a cui sei abbonato
            </div>
            <div className="prf-streaming-grid prf-anim-3">
                {STREAMING_SERVICES.map(s => (
                    <div
                        key={s.id}
                        className={`prf-stream-chip ${active.has(s.id) ? 'active' : ''}`}
                        onClick={() => handleToggle(s.id)}
                    >
                        <div className="prf-stream-logo">
                            <Image
                                src={s.logo}
                                alt={s.name}
                                width={44}
                                height={26}
                                className="prf-stream-logo-img"
                            />
                        </div>
                        <div className="prf-stream-name">{s.name}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
