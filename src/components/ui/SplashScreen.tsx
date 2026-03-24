'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SplashScreen: React.FC = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Only trigger on initial load or navigation to /sphere
        if (pathname === '/sphere' || pathname === '/') {
            setIsVisible(true);
            setShouldRender(true);

            // Start fade out after 1.5s
        const fadeTimeout = setTimeout(() => {
            setIsVisible(false);
        }, 1800);

        // Remove from DOM after transition completes (0.5s after fade starts)
        const removeTimeout = setTimeout(() => {
            setShouldRender(false);
        }, 2300);

            return () => {
                clearTimeout(fadeTimeout);
                clearTimeout(removeTimeout);
            };
        }
    }, [pathname]);

    if (!shouldRender) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: '#F7F5EA',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isVisible ? 1 : 0,
                visibility: isVisible ? 'visible' : 'hidden',
                transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.6s',
                pointerEvents: 'none'
            }}
        >
            <div style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                animation: isVisible ? 'pulse 2s ease-in-out infinite' : 'none'
            }}>
                <Image 
                    src="/logo.png" 
                    alt="NoZapp Logo" 
                    fill
                    sizes="100px"
                    priority
                    style={{ objectFit: 'contain' }}
                />
            </div>
            
            <div style={{
                marginTop: '16px',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '20px',
                color: 'rgb(73, 17, 24)',
                opacity: isVisible ? 0.8 : 0,
                transition: 'opacity 0.4s ease 0.2s',
                letterSpacing: '0.05em'
            }}>
                NoZapp
            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
