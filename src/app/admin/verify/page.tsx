'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { generateAdminOTP, verifyAdminOTP, getAdminProfile, updateAdminPhone } from '@/app/actions/admin_auth';

export default function VerifyAdminPage() {
    const [code, setCode] = useState(['', '', '', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'setup' | 'request' | 'verify'>('request');
    const [phone, setPhone] = useState('');
    const router = useRouter();

    useEffect(() => {
        // No setup step needed for Email MFA as we use the account email
        setStep('request');
    }, []);

    const handleSetupPhone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;
        setIsLoading(true);
        try {
            await updateAdminPhone(phone);
            setStep('request');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async () => {
        setIsSending(true);
        setError(null);
        try {
            const res = await generateAdminOTP();
            if (res && 'success' in res && !res.success) {
                setError(res.error || 'Errore nell\'invio del codice');
                return;
            }
            setStep('verify');
        } catch (err: any) {
            console.error('[VerifyPage] OTP request failed:', err);
            setError('Errore di connessione o del server.');
        } finally {
            setIsSending(false);
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Auto-focus next
        if (value && index < 7) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const fullCode = code.join('');
        if (fullCode.length < 8) return;

        setIsLoading(true);
        setError(null);
        try {
            const res = await verifyAdminOTP(fullCode);
            if (res && 'success' in res && !res.success) {
                setError(res.error || 'Codice non valido');
                setIsLoading(false);
                return;
            }
            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            console.error('[VerifyPage] OTP verification failed:', err);
            setError('Errore di connessione o del server.');
            setIsLoading(false);
        }
    };

    // Auto-verify when 4 digits are entered
    useEffect(() => {
        if (code.every(digit => digit !== '')) {
            handleVerify();
        }
    }, [code]);

    return (
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-6 font-['Cormorant_Garamond']">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl shadow-black/5 ring-1 ring-black/5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="text-[var(--gold)]" size={32} />
                    </div>
                    <h1 className="text-3xl font-medium tracking-tight">Accesso Protetto</h1>
                    <p className="text-sm font-['Fragment_Mono'] uppercase tracking-widest text-black/50">
                        Verifica Amministratore
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-['Fragment_Mono'] text-center">
                        {error}
                    </div>
                )}

                {step === 'request' ? (
                    <div className="space-y-6">
                        <p className="text-center text-lg leading-relaxed opacity-70">
                            Per accedere alla dashboard è necessario un codice a 8 cifre inviato alla tua email certificata.
                        </p>
                        <button
                            onClick={handleSendOTP}
                            disabled={isSending}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-[#1a1a1a] text-white rounded-full hover:bg-black transition-all disabled:opacity-50 font-['Fragment_Mono'] text-xs uppercase tracking-widest"
                        >
                            {isSending ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
                            Invia Codice via Email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-8">
                        <div className="flex justify-center gap-4">
                            {code.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    className="w-8 h-12 text-center text-2xl font-light bg-black/5 border-none rounded-lg focus:ring-2 focus:ring-[var(--gold)]/30 outline-none transition-all"
                                />
                            ))}
                        </div>

                        <div className="text-center space-y-4">
                            <p className="text-sm opacity-50">
                                Inserisci il codice di sicurezza ricevuto
                            </p>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleSendOTP}
                                    type="button"
                                    className="text-[10px] font-['Fragment_Mono'] uppercase tracking-widest text-[var(--gold)] hover:underline"
                                >
                                    Non hai ricevuto nulla? Reinvia
                                </button>
                                <button
                                    onClick={() => setStep('request')}
                                    type="button"
                                    className="text-[10px] font-['Fragment_Mono'] uppercase tracking-widest text-black/30 flex items-center justify-center gap-1 hover:text-black/60 transition-colors"
                                >
                                    <ArrowLeft size={10} /> Indietro
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
