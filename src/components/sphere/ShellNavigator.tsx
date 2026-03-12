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
    const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const prevShell = useRef<ShellLevel>(activeShell);

    useEffect(() => {
        import('animejs').then(({ default: anime }) => {
            const prev = prevShell.current;
            const next = activeShell;
            if (prev === next) return;
            prevShell.current = next;

            SHELLS.forEach(({ level }) => {
                const btn = btnRefs.current[level];
                const label = labelRefs.current[level];
                const dot = dotRefs.current[level];
                if (!btn || !label || !dot) return;

                const isActive = level === next;
                const wasActive = level === prev;

                if (isActive) {
                    anime.remove([btn, label, dot]);
                    anime({
                        targets: btn,
                        paddingLeft: ['0px', '10px'],
                        paddingRight: ['0px', '10px'],
                        duration: 420,
                        easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
                    });
                    anime({
                        targets: dot,
                        scale: [1, 1.3, 1],
                        duration: 400,
                        easing: 'easeOutElastic(1, .5)',
                    });
                    anime({
                        targets: label,
                        opacity: [0, 1],
                        translateX: ['-10px', '0px'],
                        duration: 280,
                        delay: 160,
                        easing: 'easeOutQuad',
                    });
                } else if (wasActive) {
                    anime.remove([btn, label]);
                    anime({
                        targets: label,
                        opacity: [1, 0],
                        translateX: ['0px', '-8px'],
                        duration: 160,
                        easing: 'easeInQuad',
                    });
                    anime({
                        targets: btn,
                        paddingLeft: ['10px', '0px'],
                        paddingRight: ['10px', '0px'],
                        delay: 80,
                        duration: 300,
                        easing: 'easeInOutQuart',
                    });
                }
            });
        });
    }, [activeShell]);

    return (
        <div style={{
            position: 'absolute',
            left: 28,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            pointerEvents: 'auto',
        }}>
            {SHELLS.map(({ level, label, color, colorRgb }) => {
                const isActive = activeShell === level;
                return (
                    <button
                        key={level}
                        ref={el => { btnRefs.current[level] = el; }}
                        onClick={() => { if (!isAnimating) onShellChange?.(level); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isActive ? 'flex-start' : 'center',
                            gap: 8,
                            width: isActive ? 'auto' : '36px',
                            height: '36px',
                            paddingLeft: isActive ? '10px' : '0px',
                            paddingRight: isActive ? '10px' : '0px',
                            borderRadius: '999px',
                            border: `1.5px solid rgba(${colorRgb}, ${isActive ? '0.4' : '0.25'})`,
                            background: isActive
                                ? `rgba(${colorRgb}, 0.10)`
                                : 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: isActive ? `0 2px 14px rgba(${colorRgb},0.18)` : 'none',
                            cursor: isAnimating ? 'default' : 'pointer',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            outline: 'none',
                            transition: 'border-color 0.35s, background 0.35s, box-shadow 0.35s',
                        }}
                    >
                        <span
                            ref={el => { dotRefs.current[level] = el; }}
                            style={{
                                display: 'inline-block',
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                background: color,
                                flexShrink: 0,
                                boxShadow: isActive ? `0 0 7px 2px rgba(${colorRgb},0.45)` : 'none',
                                transition: 'box-shadow 0.35s',
                            }}
                        />
                        <span
                            ref={el => { labelRefs.current[level] = el; }}
                            style={{
                                fontFamily: "'Fragment Mono', 'Courier Prime', monospace",
                                fontSize: '9px',
                                letterSpacing: '1.8px',
                                color: color,
                                opacity: isActive ? 1 : 0,
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