'use client';

import React, { useEffect, useRef } from 'react';

export type ShellLevel = 0 | 1 | 2;

interface ShellNavigatorProps {
    activeShell: ShellLevel;
    onShellChange?: (shell: ShellLevel) => void;
    isAnimating?: boolean;
    variant?: 'default' | 'compact';
}

const SHELLS = [
    { level: 0 as ShellLevel, label: 'PILASTRI', color: '#78272e', colorRgb: '120,39,46' },
    { level: 1 as ShellLevel, label: 'AFFINITÀ', color: '#b58c2a', colorRgb: '181,140,42' },
    { level: 2 as ShellLevel, label: 'SCOPERTA', color: '#3b8b9e', colorRgb: '59,139,158' },
];

export default function ShellNavigator({ activeShell, onShellChange, isAnimating, variant = 'default' }: ShellNavigatorProps) {
    const isCompact = variant === 'compact';
    
    return (
        <div
            className={`shell-navigator-container ${isCompact ? 'compact' : ''}`}
            style={{
                zIndex: 10,
                display: 'flex',
                flexDirection: 'row',
                gap: isCompact ? 10 : 12,
                pointerEvents: 'auto',
                ...(!isCompact && {
                    position: 'fixed',
                    top: 'max(env(safe-area-inset-top), 24px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                })
            }}
        >
            {SHELLS.map(({ level, label, color, colorRgb }) => {
                const isActive = activeShell === level;
                return (
                    <button
                        key={level}
                        onClick={() => { if (!isAnimating) onShellChange?.(level); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: isCompact ? 0 : 8,
                            height: isCompact ? '32px' : '36px',
                            width: isCompact ? '32px' : 'auto',
                            padding: isCompact ? '0' : '0 11px',
                            borderRadius: '50%',
                            border: isCompact ? 'none' : `1.5px solid rgba(${colorRgb}, ${isActive ? '0.5' : '0.15'})`,
                            background: isCompact 
                                ? 'transparent' 
                                : (isActive ? `rgba(${colorRgb}, 0.15)` : 'rgba(255,255,255,0.05)'),
                            backdropFilter: isCompact ? 'none' : 'blur(8px)',
                            boxShadow: !isCompact && isActive ? `0 2px 14px rgba(${colorRgb},0.2)` : 'none',
                            cursor: isAnimating ? 'default' : 'pointer',
                            whiteSpace: 'nowrap',
                            outline: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                width: isCompact ? 11 : 8,
                                height: isCompact ? 11 : 8,
                                borderRadius: '50%',
                                background: color,
                                flexShrink: 0,
                                boxShadow: isActive ? `0 0 10px 2px rgba(${colorRgb},0.5)` : 'none',
                                transition: 'all 0.3s ease',
                                transform: isActive ? 'scale(1.25)' : 'scale(1)',
                                border: isCompact ? '1px solid rgba(0,0,0,0.1)' : 'none'
                            }}
                        />
                        {!isCompact && (
                            <span
                                style={{
                                    fontFamily: "'Fragment Mono', 'Courier Prime', monospace",
                                    fontSize: '10px',
                                    letterSpacing: '1.5px',
                                    color: color,
                                    opacity: isActive ? 1 : 0.6,
                                    transition: 'opacity 0.3s ease',
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                }}
                            >
                                {label}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}