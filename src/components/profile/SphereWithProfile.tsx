"use client";
import React, { useState, useEffect } from 'react';
import SemanticSphere, { type FilmNode, type FilmEdge } from '@/components/SemanticSphere';
import ProfileModal from '@/components/profile/ProfileModal';

/**
 * SPHERE WITH PROFILE WRAPPER
 * ───────────────────────────
 * Client component that wraps SemanticSphere and ProfileModal.
 * Listens for the 'open-profile' custom event dispatched by the Header's User icon.
 * When the modal is open, it locks body scroll to prevent the sphere from moving.
 */

interface SphereWithProfileProps {
    nodes: FilmNode[];
    edges: FilmEdge[];
    subscriptions: string[];
}

export default function SphereWithProfile({ nodes, edges, subscriptions }: SphereWithProfileProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Listen for the global 'open-profile' event dispatched by the Header
    useEffect(() => {
        const handleOpen = () => setIsProfileOpen(true);
        window.addEventListener('open-profile', handleOpen);
        return () => window.removeEventListener('open-profile', handleOpen);
    }, []);

    // Lock body scroll when modal is open to prevent sphere interaction
    useEffect(() => {
        if (isProfileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
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
