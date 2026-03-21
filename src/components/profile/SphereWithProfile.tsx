"use client";
import React, { useState, useEffect, useRef } from 'react';
import SemanticSphere, { type FilmNode, type FilmEdge } from '@/components/SemanticSphere';
import ProfileModal from '@/components/profile/ProfileModal';

/**
 * SPHERE WITH PROFILE WRAPPER
 * ───────────────────────────
 * Client component that wraps SemanticSphere and ProfileModal.
 * Listens for the 'open-profile' custom event dispatched by the Header's User icon.
 * When the modal is open:
 *  - Body scroll is locked
 *  - Wheel events are captured and stopped before they reach the sphere's listener
 */

interface SphereWithProfileProps {
    nodes: FilmNode[];
    edges: FilmEdge[];
    subscriptions: string[];
}

export default function SphereWithProfile({ nodes, edges, subscriptions }: SphereWithProfileProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const isOpenRef = useRef(false);

    // Keep ref in sync for the capture handler
    useEffect(() => { isOpenRef.current = isProfileOpen; }, [isProfileOpen]);

    // Listen for the global 'open-profile' event dispatched by the Header
    // Acts as a toggle: if already open, close it
    useEffect(() => {
        const handleToggle = () => setIsProfileOpen(prev => !prev);
        window.addEventListener('open-profile', handleToggle);
        return () => window.removeEventListener('open-profile', handleToggle);
    }, []);

    // Lock body scroll + block wheel events from reaching the sphere
    useEffect(() => {
        if (!isProfileOpen) return;

        // Lock body scroll
        document.body.style.overflow = 'hidden';

        // Capture-phase wheel handler: stops the event before it reaches
        // SemanticSphere's window.addEventListener('wheel', ...) listener
        const blockWheel = (e: WheelEvent) => {
            if (isOpenRef.current) {
                e.stopImmediatePropagation();
                // Don't preventDefault here — let the modal's internal scroll work
            }
        };

        window.addEventListener('wheel', blockWheel, { capture: true });

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('wheel', blockWheel, { capture: true });
        };
    }, [isProfileOpen]);

    return (
        <>
            <SemanticSphere files={nodes} edges={edges} userSubscriptions={subscriptions} />

            {/* Profile modal overlay */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
}
