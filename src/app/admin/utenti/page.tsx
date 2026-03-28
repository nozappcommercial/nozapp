"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, Calendar, RefreshCw, Search, Shield, User } from 'lucide-react';
import { getDashboardUsers, toggleAdminStatus, deleteUser, type DashboardUser } from '@/app/actions/admin_users';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<DashboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAdmin, setFilterAdmin] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getDashboardUsers();
            setUsers(data || []);
        } catch (err: any) {
            console.error('[Admin] Failed to fetch users:', err);
            setError(err.message || 'Errore durante il caricamento degli utenti.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();

        // Global refresh listener
        const handleRefresh = () => fetchUsers();
        window.addEventListener('nozapp-admin-refresh', handleRefresh);
        return () => window.removeEventListener('nozapp-admin-refresh', handleRefresh);
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Format Errato';
            return date.toLocaleDateString();
        } catch (e) {
            return 'Errore data';
        }
    };

    const handleToggleAdmin = async (userId: string, current: boolean) => {
        if (!confirm(`Vuoi procedere col cambio permessi?`)) return;
        try {
            await toggleAdminStatus(userId, current);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !current } : u));
        } catch (err: any) {
            alert('Errore nel cambio permessi: ' + err.message);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm(`Sei sicuro di voler eliminare definitivamente questo utente? L'azione è irreversibile.`)) return;
        setLoading(true);
        try {
            await deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err: any) {
            alert('Errore nell\'eliminazione: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (birthDate: string | null) => {
        if (!birthDate) return 'N/A';
        try {
            const birth = new Date(birthDate);
            if (isNaN(birth.getTime())) return 'N/A';
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
            return age;
        } catch (e) {
            return 'N/A';
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            (u.display_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesAdmin = filterAdmin === null ? true : u.is_admin === filterAdmin;
        return matchesSearch && matchesAdmin;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5">
                <div className="space-y-1">
                    <h1 className="text-4xl font-light tracking-tight">Gestione <span className="italic font-serif">Utenti</span></h1>
                    <p className="text-black/40">Visualizza e gestisci tutti gli iscritti alla piattaforma.</p>
                </div>
            </div>

            {/* Filters bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                    <input 
                        type="text" 
                        placeholder="Cerca per email o nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-black/5 rounded-2xl border-none outline-none focus:ring-1 ring-[var(--gold)]/30 transition-shadow transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilterAdmin(prev => prev === true ? null : true)}
                        className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-2 text-xs ${filterAdmin === true ? 'bg-black text-white border-black' : 'bg-white border-black/5 text-black/60 hover:bg-black/5'}`}
                    >
                        <Shield size={14} /> Solo Admin
                    </button>
                    <button 
                        onClick={() => setFilterAdmin(prev => prev === false ? null : false)}
                        className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-2 text-xs ${filterAdmin === false ? 'bg-black text-white border-black' : 'bg-white border-black/5 text-black/60 hover:bg-black/5'}`}
                    >
                        <User size={14} /> Solo Utenti
                    </button>
                </div>
            </div>

            {/* Table section */}
            {error ? (
                <div className="p-12 text-center bg-rose-50 text-rose-600 rounded-3xl border border-rose-100">
                    <p>{error}</p>
                </div>
            ) : filteredUsers.length === 0 && !loading ? (
                <div className="p-24 text-center bg-black/5 rounded-3xl border border-dashed border-black/10 opacity-40">
                    <p>Nessun utente trovato con i filtri correnti.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] ring-1 ring-black/5 overflow-hidden shadow-2xl shadow-black/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-black font-mono text-[9px] uppercase tracking-widest text-white/50">
                                    <th className="px-8 py-5">Utente</th>
                                    <th className="px-6 py-5">Stato & Età</th>
                                    <th className="px-6 py-5">Sesso</th>
                                    <th className="px-6 py-5">Creato il</th>
                                    <th className="px-6 py-5">Ruolo</th>
                                    <th className="px-8 py-5 text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {loading && users.length === 0 ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-6"><div className="h-4 bg-black/5 rounded w-32" /></td>
                                            <td className="px-6 py-6"><div className="h-4 bg-black/5 rounded w-24" /></td>
                                            <td className="px-6 py-6"><div className="h-4 bg-black/5 rounded w-20" /></td>
                                            <td className="px-6 py-6"><div className="h-4 bg-black/5 rounded w-16" /></td>
                                            <td className="px-6 py-6"><div className="h-4 bg-black/5 rounded w-16" /></td>
                                            <td className="px-8 py-6"><div className="h-4 bg-black/5 rounded w-8 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="group hover:bg-black/[0.01] transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center font-serif italic text-lg shadow-inner">
                                                        {(user.display_name || user.email || 'A')[0].toUpperCase()}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="font-medium text-black/80">{user.display_name || 'Utente anonimo'}</div>
                                                        <div className="text-[11px] font-mono text-black/30 flex items-center gap-1.5">
                                                            {user.email} 
                                                            {user.onboarding_complete && <span className="text-[var(--gold)]">· ONBOARDED</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-1.5 text-xs text-black/60 capitalize">
                                                        <Globe size={12} className="opacity-40" /> {user.country || 'Sconosciuto'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-black/60">
                                                        <Calendar size={12} className="opacity-40" /> {calculateAge(user.birth_date)} anni
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-xs text-black/60 capitalize">
                                                {user.gender || '—'}
                                            </td>
                                            <td className="px-6 py-6 font-mono text-[10px] text-black/40">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-6 py-6">
                                                {user.is_admin ? (
                                                    <span className="px-2.5 py-1 bg-black text-white text-[9px] font-mono uppercase tracking-widest rounded-full flex items-center gap-1.5 w-fit">
                                                        <Shield size={10} /> Admin
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-black/5 text-black/40 text-[9px] font-mono uppercase tracking-widest rounded-full w-fit">
                                                        User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                                                        className={`p-2 rounded-full transition-all ${user.is_admin ? 'text-black bg-black/10' : 'text-black/20 hover:text-black hover:bg-black/5'}`}
                                                        title={user.is_admin ? "Rimuovi privilegi admin" : "Promuovi ad admin"}
                                                    >
                                                        <Shield size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-rose-200 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                                                        title="Elimina utente"
                                                    >
                                                        <User size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
