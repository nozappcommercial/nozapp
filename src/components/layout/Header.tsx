'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Clapperboard, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from './Header.module.css';

const NAV_ITEMS = [
    { id: 'sfera', label: 'Sfera', icon: Home, href: '#sfera' },
    { id: 'redazione', label: 'Redazione', icon: Newspaper, href: '#redazione' },
    { id: 'cinema', label: 'Cinema', icon: Clapperboard, href: '#cinema' },
];

export default function Header() {
    const [activeSection, setActiveSection] = useState('sfera');
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const navItemsRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
    const headerRef = useRef<HTMLElement>(null);
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Hide header on login page
    if (pathname === '/login') return null;

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    // Toggle this to test experimental vertical layout
    const isVerticalLayout = true; 

    const updateBubble = useCallback(() => {
        const itemToShow = hoveredSection || activeSection;
        const activeItem = navItemsRef.current[itemToShow];
        if (activeItem) {
            // Check if we are in vertical mode
            const isVertical = activeItem.parentElement?.parentElement?.className.includes(styles.headerVertical);
            
            if (isVertical) {
                setBubbleStyle({
                    top: activeItem.offsetTop,
                    height: activeItem.offsetHeight,
                    width: activeItem.offsetWidth - 8,
                    left: 4,
                    opacity: 1
                });
            } else {
                setBubbleStyle({
                    left: activeItem.offsetLeft,
                    width: activeItem.offsetWidth,
                    top: 0,
                    height: 0,
                    opacity: 1
                });
            }
        }
    }, [activeSection, hoveredSection]);

    // ResizeObserver for dynamic bubble tracking
    useLayoutEffect(() => {
        const observers: ResizeObserver[] = [];
        NAV_ITEMS.forEach(item => {
            const el = navItemsRef.current[item.id];
            if (el) {
                const observer = new ResizeObserver(() => {
                    const itemToShow = hoveredSection || activeSection;
                    if (itemToShow === item.id) {
                        updateBubble();
                    }
                });
                observer.observe(el);
                observers.push(observer);
            }
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, [activeSection, hoveredSection, updateBubble]);

    // Initial positioning and Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                const scrollPos = window.scrollY;
                const scrollThreshold = 10;

                // Set collapsed state
                if (scrollPos > scrollThreshold && isCollapsed) {
                    setIsCollapsed(false);
                } else if (scrollPos <= scrollThreshold && !isCollapsed) {
                    setIsCollapsed(true);
                }

                const spyPos = scrollPos + 180;
                let current = 'sfera';

                NAV_ITEMS.forEach(item => {
                    const section = document.getElementById(item.id);
                    if (section && spyPos >= section.offsetTop) {
                        current = item.id;
                    }
                });

                if (current !== activeSection) {
                    setActiveSection(current);
                }

                // Dynamic Glassmorphism effects via CSS Variables (More stable in Safari)
                const blurValue = Math.min(40 + (scrollPos / 10), 60);
                const opacityValue = Math.min(0.08 + (scrollPos / 800), 0.75);
                
                const blurStr = `blur(${blurValue}px)`;
                const bgStr = `rgba(248, 248, 238, ${opacityValue})`;

                // Apply to all headers with the wrapper class for consistency
                const headers = document.querySelectorAll(`.${styles.headerWrapper}`);
                headers.forEach(h => {
                    const el = h as HTMLElement;
                    el.style.setProperty('--dynamic-blur', blurStr);
                    el.style.setProperty('--dynamic-bg', bgStr);
                });
            });
        };

        window.addEventListener('scroll', handleScroll);
        // Initial call
        handleScroll();
        updateBubble();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection, isCollapsed, updateBubble]);

    // Re-check on resize
    useLayoutEffect(() => {
        const handleResize = () => updateBubble();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateBubble]);

    const handleNavClick = async (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const section = document.getElementById(id);
        if (section) {
            const anime = (await import('animejs')).default;

            const targetPos = Math.max(0, section.offsetTop);
            const currentPos = window.scrollY;

            anime({
                targets: { scrollY: currentPos },
                scrollY: targetPos,
                duration: 1200, // Slower duration for a more premium feel
                easing: 'easeInOutQuart',
                update: (anim) => {
                    const obj = anim.animatables[0].target as unknown as { scrollY: number };
                    window.scrollTo(0, obj.scrollY);
                }
            });

            setActiveSection(id);
        }
    };

    const renderContent = (isVertical: boolean) => (
        <React.Fragment>
            <nav className={styles.navContainer}>
                <div
                    className={`${styles.navBubble} ${(isCollapsed || isVertical) ? styles.hiddenContent : ''}`}
                    style={{
                        left: `${bubbleStyle.left}px`,
                        width: `${bubbleStyle.width}px`,
                        opacity: bubbleStyle.opacity
                    }}
                />

                {NAV_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    const isExpanded = !isCollapsed && !isVertical && (
                        hoveredSection
                            ? hoveredSection === item.id
                            : activeSection === item.id
                    );

                    // Logic fix: Show all icons even when collapsed (but hide labels)
                    const isHidden = false; 

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            ref={(el) => { navItemsRef.current[item.id] = el; }}
                            className={`${styles.navItem} ${isExpanded ? styles.navItemActive : ''} ${isHidden ? styles.hiddenContent : ''}`}
                            onClick={(e) => handleNavClick(e, item.id)}
                            onMouseEnter={() => !isVertical && setHoveredSection(item.id)}
                            onMouseLeave={() => !isVertical && setHoveredSection(null)}
                        >
                            <Icon size={14} strokeWidth={1.1} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
                <div className={`${styles.navSeparator} ${(isCollapsed && !isVertical) ? '' : styles.hiddenContent}`} />
            </nav>

            <div className={`${styles.headerActions} ${isVertical ? styles.verticalActions : ''}`}>
                <button className={styles.actionBtn} title="Profilo">
                    <User size={14} strokeWidth={1.1} />
                </button>
                <button 
                    className={`${styles.actionBtn} ${isLoggingOut ? styles.loading : ''}`} 
                    title="Logout"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    <LogOut size={14} strokeWidth={1.1} />
                </button>
            </div>
        </React.Fragment>
    );

    return (
        <>
            {/* The "First" Header (Horizontal, centered) - CURRENTLY DISABLED/COMMENTED */}
            {/* 
            <header 
                className={`${styles.headerWrapper} ${styles.headerHorizontal} ${isCollapsed ? styles.headerCollapsed : ''}`} 
                ref={headerRef}
            >
                {renderContent(false)}
            </header>
            */}

            {/* The "Second" Header (Alternative Vertical) - NOW PRIMARY */}
            {isVerticalLayout && (
                <header className={`${styles.headerWrapper} ${styles.headerVertical}`} ref={headerRef}>
                    {renderContent(true)}
                </header>
            )}
        </>
    );
}
