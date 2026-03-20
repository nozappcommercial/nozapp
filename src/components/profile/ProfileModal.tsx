'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, LogOut, Film, Tv, Heart, User as UserIcon } from 'lucide-react';
import { getUserProfileData, UserProfileData } from '@/app/actions/profile';
import { createClient } from '@/lib/supabase/client';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const [data, setData] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            loadData();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const profileData = await getUserProfileData();
            setData(profileData);
        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setIsLoading(false);
        }
    };

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

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div 
                className={styles.modal} 
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
            >
                {/* Close Button */}
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} strokeWidth={1.5} />
                </button>

                {isLoading ? (
                    <div className={styles.loader}>
                        <div className={styles.spinner}></div>
                        <span>Caricamento Passaporto...</span>
                    </div>
                ) : (
                    <div className={styles.content}>
                        {/* Header Section */}
                        <header className={styles.header}>
                            <div className={styles.avatar}>
                                <UserIcon size={24} strokeWidth={1.2} />
                            </div>
                            <div className={styles.userInfo}>
                                <h1>{data?.displayName}</h1>
                                <span>CINEMATIC PASSPORT</span>
                            </div>
                        </header>

                        <div className={styles.scrollArea}>
                            {/* DNA Section (Pillars) */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <Film size={14} strokeWidth={1.5} />
                                    <h2>DNA CINEMATOGRAFICO</h2>
                                </div>
                                <div className={styles.pillarsGrid}>
                                    {data?.pillars.map((p) => (
                                        <div key={p.id} className={styles.pillarCard}>
                                            <div className={styles.posterWrapper}>
                                                {p.posterUrl ? (
                                                    <img src={p.posterUrl} alt={p.title} />
                                                ) : (
                                                    <div className={styles.posterPlaceholder} />
                                                )}
                                            </div>
                                            <p>{p.title}</p>
                                        </div>
                                    ))}
                                    {(!data?.pillars || data.pillars.length === 0) && (
                                        <p className={styles.emptyMsg}>Nessun pilastro selezionato.</p>
                                    )}
                                </div>
                            </section>

                            <div className={styles.row}>
                                {/* Streaming Section */}
                                <section className={`${styles.section} ${styles.flex1}`}>
                                    <div className={styles.sectionHeader}>
                                        <Tv size={14} strokeWidth={1.5} />
                                        <h2>ABBONAMENTI</h2>
                                    </div>
                                    <div className={styles.subsList}>
                                        {data?.streamingSubscriptions.map((sub) => (
                                            <div key={sub} className={styles.subBadge}>
                                                {sub}
                                            </div>
                                        ))}
                                        {(!data?.streamingSubscriptions || data.streamingSubscriptions.length === 0) && (
                                            <p className={styles.emptyMsg}>Nessun abbonamento attivo.</p>
                                        )}
                                    </div>
                                </section>

                                {/* Liked Archive Section */}
                                <section className={`${styles.section} ${styles.flex1}`}>
                                    <div className={styles.sectionHeader}>
                                        <Heart size={14} strokeWidth={1.5} />
                                        <h2>FILM PREFERITI</h2>
                                    </div>
                                    <div className={styles.likedList}>
                                        {data?.likedFilms.map((f) => (
                                            <div key={f.id} className={styles.likedItem}>
                                                <span>{f.title}</span>
                                                <small>{f.year}</small>
                                            </div>
                                        ))}
                                        {(!data?.likedFilms || data.likedFilms.length === 0) && (
                                            <p className={styles.emptyMsg}>Ancora nessun preferito.</p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Footer (Logout) */}
                        <footer className={styles.footer}>
                            <button 
                                className={styles.logoutBtn} 
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                <LogOut size={14} strokeWidth={1.5} />
                                <span>{isLoggingOut ? 'Uscita...' : 'Esci dall\'account'}</span>
                            </button>
                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
}
