"use client";

import React, { useEffect, useState } from 'react';
import { Globe, Calendar, Search, Shield, User, Loader2, Mail, X } from 'lucide-react';
import { getDashboardUsers, updateUserRole, deleteUser, type DashboardUser } from '@/app/actions/admin_users';
import { generateAdminOTP } from '@/app/actions/admin_auth';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<DashboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [roleMutation, setRoleMutation] = useState<{ userId: string, newRole: 'base' | 'redattore' | 'analista' | 'admin' } | null>(null);
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '', '', '']);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [otpSuccess, setOtpSuccess] = useState(false);

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

    // -- Role Change Methods
    const handleRoleChangeRequest = (userId: string, newRole: string) => {
        setRoleMutation({ userId, newRole: newRole as any });
        setOtpCode(['', '', '', '', '', '', '', '']);
        setOtpError(null);
        setOtpSuccess(false);
    };

    const handleSendOTP = async () => {
        setOtpSending(true);
        setOtpError(null);
        setOtpSuccess(false);
        try {
            const res = await generateAdminOTP();
            if (res && 'success' in res && !res.success) {
                setOtpError(res.error || 'Errore invio codice');
            } else {
                setOtpSuccess(true);
                setTimeout(() => setOtpSuccess(false), 5000);
            }
        } catch (err: any) {
            setOtpError('Errore di connessione o del server.');
        } finally {
            setOtpSending(false);
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...otpCode];
        newCode[index] = value.slice(-1);
        setOtpCode(newCode);

        // Auto-focus next
        if (value && index < 7) {
            const nextInput = document.getElementById(`modal-otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            const prevInput = document.getElementById(`modal-otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const executeRoleChange = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!roleMutation) return;
        
        const fullCode = otpCode.join('');
        if (fullCode.length < 8) return;

        setOtpLoading(true);
        setOtpError(null);
        try {
            await updateUserRole(roleMutation.userId, roleMutation.newRole, fullCode);
            setUsers(prev => prev.map(u => u.id === roleMutation.userId ? { ...u, role: roleMutation.newRole } : u));
            setRoleMutation(null); // Close modal
        } catch (err: any) {
            console.error('[VerifyPage] OTP verification failed:', err);
            setOtpError(err.message || 'Errore aggiornamento ruolo.');
        } finally {
            setOtpLoading(false);
        }
    };

    useEffect(() => {
        if (roleMutation && otpCode.every(digit => digit !== '')) {
            executeRoleChange();
        }
    }, [otpCode, roleMutation]);

    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            (u.display_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            
        if (filterRole === 'privileged') return matchesSearch && u.role !== 'base';
        if (filterRole === 'base') return matchesSearch && u.role === 'base';
        return matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
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
                        onClick={() => setFilterRole(prev => prev === 'privileged' ? null : 'privileged')}
                        className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-2 text-xs ${filterRole === 'privileged' ? 'bg-black text-white border-black' : 'bg-white border-black/5 text-black/60 hover:bg-black/5'}`}
                    >
                        <Shield size={14} /> Sistema
                    </button>
                    <button 
                        onClick={() => setFilterRole(prev => prev === 'base' ? null : 'base')}
                        className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-2 text-xs ${filterRole === 'base' ? 'bg-black text-white border-black' : 'bg-white border-black/5 text-black/60 hover:bg-black/5'}`}
                    >
                        <User size={14} /> Base
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
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-[#0a0a0a] font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                                    <th className="px-10 py-6 border-b border-white/5">Utente</th>
                                    <th className="px-8 py-6 border-b border-white/5">Bio & Area</th>
                                    <th className="px-8 py-6 border-b border-white/5">Genere</th>
                                    <th className="px-8 py-6 border-b border-white/5">Creato il</th>
                                    <th className="px-8 py-6 border-b border-white/5">Ruolo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {loading && users.length === 0 ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-10 py-8"><div className="h-4 bg-black/5 rounded w-32" /></td>
                                            <td className="px-8 py-8"><div className="h-4 bg-black/5 rounded w-24" /></td>
                                            <td className="px-8 py-8"><div className="h-4 bg-black/5 rounded w-20" /></td>
                                            <td className="px-8 py-8"><div className="h-4 bg-black/5 rounded w-16" /></td>
                                            <td className="px-8 py-8"><div className="h-4 bg-black/5 rounded w-24" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="group hover:bg-black/[0.02] transition-colors duration-300 relative">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-black/[0.03] border border-black/5 flex items-center justify-center font-serif italic text-xl text-black/40 group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm">
                                                        {(user.display_name || user.email || 'A')[0].toUpperCase()}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-black/80 tracking-tight group-hover:text-black transition-colors">{user.display_name || 'Utente anonimo'}</div>
                                                        <div className="text-[11px] font-mono text-black/30 flex items-center gap-2">
                                                            {user.email} 
                                                            {user.onboarding_complete && (
                                                                <span className="flex items-center gap-1 text-[8px] bg-[var(--gold)]/10 text-[var(--gold)] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-tighter">
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-xs text-black/60 capitalize font-medium">
                                                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                                                            <Globe size={11} className="text-blue-500" />
                                                        </div>
                                                        {user.country || 'Sconosciuto'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-black/40">
                                                        <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
                                                            <Calendar size={11} className="text-orange-500" />
                                                        </div>
                                                        {calculateAge(user.birth_date)} anni
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-black/40 bg-black/5 px-3 py-1.5 rounded-lg border border-black/5 whitespace-nowrap">
                                                    {user.gender || '—'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 font-mono text-[11px] text-black/30 whitespace-nowrap">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-4">
                                                    <select 
                                                        value={user.role} 
                                                        onChange={(e) => handleRoleChangeRequest(user.id, e.target.value)}
                                                        className={`text-[9px] font-mono uppercase tracking-[0.2em] rounded-xl px-3 py-2 border outline-none cursor-pointer transition-all ${
                                                            user.role !== 'base' 
                                                                ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                                                                : 'bg-black/5 text-black/40 border-black/5 hover:border-black/20'
                                                        }`}
                                                    >
                                                        <option value="base">Utente</option>
                                                        <option value="redattore">Redattore</option>
                                                        <option value="analista">Analista</option>
                                                        <option value="admin">Administrator</option>
                                                    </select>
                                                    
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-rose-300 border border-transparent hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                        title="Elimina utente"
                                                    >
                                                        <X size={14} />
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

            {/* OTP Modal Overlay per approvazione Ruolo */}
            {roleMutation && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
                    <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl relative">
                        <button 
                            onClick={() => setRoleMutation(null)}
                            className="absolute top-6 right-6 p-2 text-black/30 hover:text-black bg-black/5 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="text-center space-y-2 mb-8 mt-2">
                            <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="text-[var(--gold)]" size={32} />
                            </div>
                            <h2 className="text-2xl font-medium tracking-tight">Verifica Operazione</h2>
                            <p className="text-sm text-black/50 leading-relaxed">
                                Stai promuovendo l'utente al ruolo <strong className="font-mono text-xs uppercase text-black">{roleMutation.newRole}</strong>.<br />
                                Inserisci il codice amministratore per confermare.
                            </p>
                        </div>

                        {otpError && (
                            <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-mono text-center">
                                {otpError}
                            </div>
                        )}

                        {otpSuccess ? (
                            <div className="p-4 mb-6 bg-green-50 border border-green-100 text-green-600 rounded-2xl text-xs font-mono text-center">
                                Nuovo codice inviato alla tua email admin!
                            </div>
                        ) : (
                            <button
                                onClick={handleSendOTP}
                                disabled={otpSending}
                                className="w-full flex items-center justify-center gap-3 py-3 mb-6 bg-black/5 text-black hover:bg-black/10 rounded-2xl transition-all disabled:opacity-50 text-xs font-medium"
                            >
                                {otpSending ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                                Invia codice via Email
                            </button>
                        )}

                        <form onSubmit={executeRoleChange} className="space-y-6">
                            <div className="flex justify-center gap-2">
                                {otpCode.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`modal-otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        disabled={otpLoading}
                                        className={`w-9 h-12 text-center text-xl font-light bg-black/5 border border-transparent rounded-lg focus:ring-2 outline-none transition-all ${
                                            otpError ? 'border-red-300 bg-red-50' : 
                                            otpLoading ? 'opacity-50 cursor-wait' :
                                            digit ? 'border-[var(--gold)]/30 bg-[var(--gold)]/5' : ''
                                        }`}
                                    />
                                ))}
                            </div>
                            
                            {otpLoading && (
                                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--gold)]">
                                    <Loader2 size={12} className="animate-spin" />
                                    Verifica e Aggiornamento...
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
