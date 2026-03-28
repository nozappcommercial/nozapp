'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 group"
                >
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-[var(--gold)] transition-all duration-500 shadow-xl group-active:scale-90">
                        <ChevronUp size={16} strokeWidth={1.5} />
                    </div>
                    <span className="font-['Fragment_Mono'] text-[8px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                        Torna Su
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
