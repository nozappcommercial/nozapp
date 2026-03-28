'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function RouteProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Trigger animation on route change
        setIsAnimating(true);
        
        // Force scroll to top on every navigation
        window.scrollTo(0, 0);

        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 800); // Match animation duration

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return (
        <AnimatePresence>
            {isAnimating && (
                <motion.div
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--gold)] z-[9999] origin-left shadow-[0_0_10px_rgba(191,155,48,0.5)]"
                />
            )}
        </AnimatePresence>
    );
}
