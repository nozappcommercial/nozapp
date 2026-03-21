"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { saveStreamingServices } from '@/lib/actions/profile_actions';

/**
 * PROFILE STREAMING
 * ─────────────────
 * 4-column grid of streaming service chips with toggle interaction.
 * Uses optimistic local state + debounced server save (800ms).
 */

interface ProfileStreamingProps {
    activeServices: string[];
    onChange: (services: string[]) => void;
}

const STREAMING_SERVICES = [
    { id: 'Netflix',     name: 'Netflix',     cls: 'prf-logo-netflix', text: 'N'     },
    { id: 'Prime Video', name: 'Prime Video', cls: 'prf-logo-prime',   text: 'prime' },
    { id: 'Disney+',     name: 'Disney+',     cls: 'prf-logo-disney',  text: 'D+'    },
    { id: 'Apple TV+',   name: 'Apple TV+',   cls: 'prf-logo-apple',   text: '▶ TV'  },
    { id: 'MUBI',        name: 'MUBI',        cls: 'prf-logo-mubi',    text: 'MUBI'  },
    { id: 'HBO Max',     name: 'Max',         cls: 'prf-logo-max',     text: 'max'   },
    { id: 'Sky',         name: 'Sky',         cls: 'prf-logo-sky',     text: 'Sky'   },
    { id: 'RaiPlay',     name: 'RaiPlay',     cls: 'prf-logo-rai',     text: 'Rai'   },
];

export default function ProfileStreaming({ activeServices: initialServices, onChange }: ProfileStreamingProps) {
    const [active, setActive] = useState<Set<string>>(new Set(initialServices));
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync with parent when prop changes
    useEffect(() => {
        setActive(new Set(initialServices));
    }, [initialServices]);

    const handleToggle = useCallback((id: string) => {
        setActive(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);

            const arr = Array.from(next);

            // Notify parent immediately (optimistic)
            onChange(arr);

            // Debounce the server call
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                saveStreamingServices(arr).catch(err =>
                    console.error('[ProfileStreaming] Save failed:', err)
                );
            }, 800);

            return next;
        });
    }, [onChange]);

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
                        <div className={`prf-stream-logo ${s.cls}`}>{s.text}</div>
                        <div className="prf-stream-name">{s.name}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
