"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
}

export default function ScrollReveal({ 
    children, 
    delay = 0, 
    duration = 1.2, 
    y = 30,
    className,
    ...props 
}: ScrollRevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
                duration, 
                delay, 
                ease: [0.21, 0.47, 0.32, 0.98] 
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
