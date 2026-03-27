'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Clapperboard, LogOut, User, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getAdminStatus } from '@/lib/supabase/auth-client';
import { signOutAction } from '@/app/actions/admin_auth';
import { smoothScrollTo } from '@/lib/scroll-utils';
import { useIsMobile } from '@/hooks/use-is-mobile';
import styles from './Header.module.css';

const NAV_ITEMS = [
    { id: 'sfera', label: 'Sfera', icon: Home, href: '#sfera' },
    { id: 'redazione', label: 'Redazione', icon: Newspaper, href: '#redazione' },
    { id: 'cinema', label: 'Cinema', icon: Clapperboard, href: '#cinema' },
];

export default function Header() {
    const [activeSection, setActiveSection] = useState('sfera');
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHiddenByModal, setIsHiddenByModal] = useState(false);
    const [bubbleStyle, setBubbleStyle] = useState<{ left?: number, width?: number, top?: number, height?: number, opacity: number }>({ left: 0, width: 0, top: 0, height: 0, opacity: 0 });
    const isMobile = useIsMobile(768);

    useEffect(() => {
        const hide = () => setIsHiddenByModal(true);
        const show = () => setIsHiddenByModal(false);
        window.addEventListener('hide-header', hide);
        window.addEventListener('show-header', show);
        return () => {
            window.removeEventListener('hide-header', hide);
            window.removeEventListener('show-header', show);
        };
    }, []);

    const navItemsRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
    const navContainerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Fetch admin status
    useEffect(() => {
        const checkAdminStatus = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const isAdmin = await getAdminStatus(user.id);
                setIsAdmin(isAdmin);
            }
        };
        checkAdminStatus();
    }, []);

    // Determine if header should be hidden
    const isLoginOrOnboarding = pathname === '/login' || pathname === '/onboarding';
    const isAdminRoute = pathname?.startsWith('/admin');
    const isArticleDetail = pathname?.startsWith('/redazione/') && pathname.split('/').filter(Boolean).length > 1;
    const shouldHideHeader = isLoginOrOnboarding || isAdminRoute || isArticleDetail;

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await signOutAction();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    const isVerticalLayout = isMobile === false;

    /**
     * Updates the navigation bubble's position and size.
     * Supports both vertical (sidebar) and horizontal (top-bar) layouts.
     * Uses getBoundingClientRect to ensure pixel-perfect alignment over the active nav item.
     */
    const updateBubble = useCallback(() => {
        const itemToShow = hoveredSection || activeSection;
        const activeItem = navItemsRef.current[itemToShow];
        const container = navContainerRef.current;
        
        if (activeItem && container) {
            const itemRect = activeItem.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Determine layout mode (vertical vs horizontal)
            const headerEl = container.closest('header');
            const isVertical = headerEl?.className.includes(styles.headerVertical);

            if (isVertical) {
                // For vertical: the bubble is a small circular indicator (28px) centered on the icon
                const bubbleSize = 28;
                setBubbleStyle({
                    top: itemRect.top - containerRect.top + (itemRect.height - bubbleSize) / 2,
                    left: itemRect.left - containerRect.left + (itemRect.width - bubbleSize) / 2,
                    height: bubbleSize,
                    width: bubbleSize,
                    opacity: 1
                });
            } else {
                // For horizontal: the bubble is a pill shape covering the entire nav item width
                setBubbleStyle({
                    left: itemRect.left - containerRect.left,
                    width: itemRect.width,
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

                // Force active section to 'sfera' when at the top to fix stuck bubble bug
                if (scrollPos < 50 && activeSection !== 'sfera') {
                    setActiveSection('sfera');
                }

                // Set collapsed state (Inverted: Expanded at top, Collapsed when scrolling down)
                if (scrollPos > scrollThreshold && !isCollapsed) {
                    setIsCollapsed(true);
                } else if (scrollPos <= scrollThreshold && isCollapsed) {
                    setIsCollapsed(false);
                }

                // Remove purely scroll-based tracking; handled by IntersectionObserver
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

    /**
     * INTERSECTION OBSERVER (Scroll Spy)
     * Tracks with section of the home page is currently visible in the viewport.
     * Updates activeSection state which in turn moves the navigation bubble.
     */
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // Balanced detection window (center 20% of viewport)
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        NAV_ITEMS.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Explicitly update bubble when section changes
    useEffect(() => {
        updateBubble();
    }, [activeSection, updateBubble]);

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
            await smoothScrollTo(section, 1200, 0);
            setActiveSection(id);
        }
    };

    const renderContent = (isVertical: boolean) => (
        <React.Fragment>
            <nav className={styles.navContainer} ref={navContainerRef as any}>
                <div
                    className={`${styles.navBubble} ${(isCollapsed && !isVertical) ? styles.hiddenContent : ''}`}
                    style={{
                        left: `${bubbleStyle.left}px`,
                        top: `${bubbleStyle.top}px`,
                        width: `${bubbleStyle.width}px`,
                        height: `${bubbleStyle.height || 28}px`,
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
                {!isVertical && <div className={`${styles.navSeparator} ${(isCollapsed) ? '' : styles.hiddenContent}`} />}
            </nav>

            <div className={`${styles.headerActions} ${isVertical ? styles.verticalActions : ''}`}>
                <button className={styles.actionBtn} title="Profilo" onClick={() => window.dispatchEvent(new Event('open-profile'))}>
                    <User size={14} strokeWidth={1.1} />
                </button>
                {isAdmin && (
                    <a href="/admin/verify" className={styles.actionBtn} title="Verifica Amministratore">
                        <Settings size={14} strokeWidth={1.1} />
                    </a>
                )}
                <button
                    className={`${styles.actionBtn} ${styles.actionBtnLogout} ${isLoggingOut ? styles.loading : ''}`}
                    title="Logout"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    <LogOut size={14} strokeWidth={1.1} />
                </button>
            </div>
        </React.Fragment>
    );

    if (shouldHideHeader) return null;

    return (
        <header 
            className={`${styles.headerWrapper} ${isVerticalLayout ? styles.headerVertical : styles.headerHorizontal} ${isCollapsed && !isVerticalLayout ? styles.headerCollapsed : ''} ${isHiddenByModal ? styles.headerHidden : ''}`} 
            ref={headerRef}
        >
            {renderContent(isVerticalLayout)}
        </header>
    );
}
