'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ShellLevel = 0 | 1 | 2;

interface ShellNavigatorProps {
    activeShell: ShellLevel;
    onShellChange: (shell: ShellLevel) => void;
    isAnimating?: boolean;
}

export default function ShellNavigator({ activeShell, onShellChange, isAnimating = false }: ShellNavigatorProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isAnimating) return;

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (activeShell < 2) onShellChange((activeShell + 1) as ShellLevel);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (activeShell > 0) onShellChange((activeShell - 1) as ShellLevel);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeShell, onShellChange, isAnimating]);

    const shells: { level: ShellLevel; label: string; colorClass: string }[] = [
        { level: 0, label: 'Shell 0', colorClass: 'bg-[var(--ember)]' },
        { level: 1, label: 'Shell 1', colorClass: 'bg-[var(--gold)]' },
        { level: 2, label: 'Shell 2', colorClass: 'bg-[var(--cold)]' },
    ];

    return (
        <div className="absolute bottom-8 left-8 z-50 flex items-center gap-3">
            {shells.map(({ level, label, colorClass }) => (
                <button
                    key={level}
                    onClick={() => !isAnimating && level !== activeShell && onShellChange(level)}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 backdrop-blur-sm',
                        activeShell === level
                            ? 'border-white/40 bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                            : 'border-white/10 bg-black/20 text-white/50 hover:bg-white/5 hover:text-white/80 cursor-pointer',
                        isAnimating && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{ fontFamily: "'Fragment_Mono', monospace", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                    <div className={cn('w-2 h-2 rounded-full', colorClass)} />
                    {label}
                </button>
            ))}
        </div>
    );
}
