'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ShellLevel = 0 | 1 | 2;

interface ShellNavigatorProps {
    activeShell: ShellLevel;
}

export default function ShellNavigator({ activeShell }: ShellNavigatorProps) {
    const shells: { level: ShellLevel; label: string; color: string; var: string }[] = [
        { level: 0, label: 'Pillars', color: '#ff4d4d', var: '--ember' },
        { level: 1, label: 'Affinity', color: '#ffcc33', var: '--gold' },
        { level: 2, label: 'Discovery', color: '#33ccff', var: '--cold' },
    ];

    return (
        <div className="absolute bottom-8 left-8 z-50 flex items-center gap-4">
            {shells.map(({ level, label, var: colorVar }) => {
                const isActive = activeShell === level;
                const isVisited = level <= activeShell;

                return (
                    <div
                        key={level}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 backdrop-blur-md select-none',
                            isActive
                                ? 'border-white/40 bg-white/10 text-white'
                                : 'border-white/5 bg-black/10 text-white/30'
                        )}
                        style={{
                            fontFamily: "'Courier Prime', monospace",
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            boxShadow: isActive ? `0 0 20px var(${colorVar})33` : 'none'
                        }}
                    >
                        <div
                            className="w-2 h-2 rounded-full transition-all duration-500"
                            style={{
                                background: isVisited ? `var(${colorVar})` : 'rgba(255,255,255,0.1)',
                                boxShadow: isActive ? `0 0 10px var(${colorVar})` : 'none'
                            }}
                        />
                        <span className="font-medium">{label}</span>
                    </div>
                );
            })}
        </div>
    );
}
