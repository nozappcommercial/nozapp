'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ShellLevel = 0 | 1 | 2;

interface ShellNavigatorProps {
    activeShell: ShellLevel;
    onShellChange?: (shell: ShellLevel) => void;
    isAnimating?: boolean;
}

export default function ShellNavigator({ activeShell, onShellChange, isAnimating }: ShellNavigatorProps) {
    const shells: { level: ShellLevel; label: string; color: string; var: string }[] = [
        { level: 0, label: 'Pilastri', color: '#ff4d4d', var: '--ember' },
        { level: 1, label: 'Affinità', color: '#ffcc33', var: '--gold' },
        { level: 2, label: 'Scoperta', color: '#33ccff', var: '--cold' },
    ];

    return (
        <div className="absolute bottom-10 left-10 z-50 flex items-center gap-4">
            {shells.map(({ level, label, var: colorVar }) => {
                const isActive = activeShell === level;
                const isVisited = level <= activeShell;

                return (
                    <div
                        key={level}
                        onClick={() => !isAnimating && onShellChange?.(level)}
                        className={cn(
                            'flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-500 backdrop-blur-md select-none cursor-pointer group',
                            isActive
                                ? 'border-black/15 bg-black/5 text-[#160a0c] shadow-sm'
                                : 'border-black/5 bg-black/5 text-[#160a0c]/65 hover:bg-black/10 hover:border-black/20'
                        )}
                        style={{
                            fontFamily: "'Courier Prime', monospace",
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            boxShadow: isActive ? `0 0 25px var(${colorVar})22` : 'none',
                            pointerEvents: 'auto'
                        }}
                    >
                        <div
                            className="w-2.5 h-2.5 rounded-full transition-all duration-500 group-hover:scale-110"
                            style={{
                                background: isVisited ? `var(${colorVar})` : 'rgba(0,0,0,0.1)',
                                boxShadow: isActive ? `0 0 12px var(${colorVar})` : 'none'
                            }}
                        />
                        <span className={cn("font-bold transition-colors", isActive ? "text-[#160a0c]" : "group-hover:text-[#160a0c]/70")}>
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
