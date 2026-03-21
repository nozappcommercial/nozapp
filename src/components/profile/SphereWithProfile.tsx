"use client";
import React, { useState } from 'react';
import SemanticSphere, { type FilmNode, type FilmEdge } from '@/components/SemanticSphere';
import ProfileModal from '@/components/profile/ProfileModal';

/**
 * SPHERE WITH PROFILE WRAPPER
 * ───────────────────────────
 * Client component that wraps SemanticSphere and ProfileModal.
 * Manages the isProfileOpen state and renders the profile trigger button.
 * The button is positioned in the top-right corner of the sphere viewport.
 */

interface SphereWithProfileProps {
    nodes: FilmNode[];
    edges: FilmEdge[];
    subscriptions: string[];
}

export default function SphereWithProfile({ nodes, edges, subscriptions }: SphereWithProfileProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <SemanticSphere files={nodes} edges={edges} userSubscriptions={subscriptions} />

            {/* Profile trigger button — floats above sphere */}
            <button
                className="prf-btn-open"
                style={{
                    position: 'absolute',
                    top: 28,
                    right: 40,
                    zIndex: 50,
                }}
                onClick={() => setIsProfileOpen(true)}
            >
                <div className="prf-btn-avatar-sm">
                    {/* Initials will show once data loads; "PR" is just a placeholder */}
                    PR
                </div>
                <span>Profilo</span>
            </button>

            {/* Profile modal overlay */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
}
