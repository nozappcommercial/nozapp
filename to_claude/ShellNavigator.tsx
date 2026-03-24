'use client';

import React, { useEffect, useRef } from 'react';

export type ShellLevel = 0 | 1 | 2;

interface ShellNavigatorProps {
    activeShell: ShellLevel;
    onShellChange?: (shell: ShellLevel) => void;
    isAnimating?: boolean;
}

const SHELLS = [
    { level: 0 as ShellLevel, label: 'PILASTRI', color: '#78272e', colorRgb: '120,39,46' },
    { level: 1 as ShellLevel, label: 'AFFINITÀ', color: '#b58c2a', colorRgb: '181,140,42' },
    { level: 2 as ShellLevel, label: 'SCOPERTA', color: '#3b8b9e', colorRgb: '59,139,158' },
];

export default function ShellNavigator({ activeShell, onShellChange, isAnimating }: ShellNavigatorProps) {
    return (
        <div
            className="shell-navigator-container"
            style={{
                position: 'fixed',
                top: 'max(env(safe-area-inset-top), 24px)',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                pointerEvents: 'auto',
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
                            gap: 8,
                            height: '36px',
                            padding: '0 16px',
                            borderRadius: '999px',
                            border: `1.5px solid rgba(${colorRgb}, ${isActive ? '0.5' : '0.15'})`,
                            background: isActive
                                ? `rgba(${colorRgb}, 0.15)`
                                : 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: isActive ? `0 2px 14px rgba(${colorRgb},0.2)` : 'none',
                            cursor: isAnimating ? 'default' : 'pointer',
                            whiteSpace: 'nowrap',
                            outline: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: color,
                                flexShrink: 0,
                                boxShadow: isActive ? `0 0 8px 2px rgba(${colorRgb},0.4)` : 'none',
                                transition: 'all 0.3s ease',
                                transform: isActive ? 'scale(1.2)' : 'scale(1)',
                            }}
                        />
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
                    </button>
                );
            })}
        </div>
    );
}