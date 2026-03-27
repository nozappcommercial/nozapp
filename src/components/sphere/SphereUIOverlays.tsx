"use client";
import React from 'react';
import ShellNavigator, { ShellLevel } from './ShellNavigator';

interface SphereUIOverlaysProps {
    activeShell: ShellLevel;
    setActiveShell: React.Dispatch<React.SetStateAction<ShellLevel>>;
    isAnimating: boolean;
}

export default function SphereUIOverlays({
    activeShell,
    setActiveShell,
    isAnimating
}: SphereUIOverlaysProps) {
    return (
        <>
            <div id="shell-flash" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, rgba(248,244,238,0.65) 0%, transparent 65%)',
                opacity: 0, transition: 'opacity 0.5s ease', zIndex: 5
            }} />

            <header className="sphere-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <div className="sh-left">
                    <div className="sh-logo">SFERA <em>SEMANTICA</em></div>
                    <div className="sh-hint">SCROLL · cambia shell</div>
                </div>

                {/* Mobile version of the navigator (Top Right) */}
                <div className="mobile-only-header-nav">
                    <ShellNavigator 
                        activeShell={activeShell} 
                        onShellChange={setActiveShell} 
                        isAnimating={isAnimating}
                        variant="compact"
                    />
                </div>

                <div className="hints">
                    TRASCINA · ruota &nbsp;·&nbsp; SCROLL · zoom<br />
                    CLICK · seleziona nodo<br />
                    ↑↓ · cambia livello &nbsp;·&nbsp; ←→ · stesso livello
                </div>
            </header>

            <div className="desktop-only-floating-nav" style={{ 
                position: 'absolute', 
                left: 48, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 10, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 12 
            }}>
                <ShellNavigator
                    activeShell={activeShell}
                    onShellChange={setActiveShell}
                    isAnimating={isAnimating}
                    orientation="vertical"
                />
            </div>

            {/* Breadcrumb */}
            <div id="breadcrumb" style={{ position: 'absolute' }}></div>

            {/* Navigation */}
            <div id="nav-controls" style={{ position: 'absolute' }}>
                <button className="nav-btn" id="btn-up" disabled title="Esplora verso l'esterno">↑</button>
                <div className="nav-row">
                    <button className="nav-btn" id="btn-left" disabled title="Film precedente">←</button>
                    <button className="nav-btn" id="btn-down" disabled title="Torna verso il centro">↓</button>
                    <button className="nav-btn" id="btn-right" disabled title="Film successivo">→</button>
                </div>
                <div className="nav-counter" id="nav-counter"></div>
            </div>
        </>
    );
}
