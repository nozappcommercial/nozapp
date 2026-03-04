'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// CSS injected securely
const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..500;1,9..40,300..500&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap');

:root {
  --bg: rgb(248, 248, 238);
  --bg2: rgb(240, 240, 228);
  --paper: rgb(252, 252, 246);
  --ink: rgb(22, 10, 12);
  --ink2: rgba(22, 10, 12, 0.5);
  --ink3: rgba(22, 10, 12, 0.28);
  --ink4: rgba(22, 10, 12, 0.1);
  --r1: rgb(73, 17, 24);
  --r2: rgb(88, 25, 27);
  --r3: rgb(120, 39, 46);
  --r4: rgb(126, 41, 50);
}

.auth-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg);
  background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(22,10,12,0.03) 27px, rgba(22,10,12,0.03) 28px);
  font-family: 'DM Sans', sans-serif;
  color: var(--ink);
}

.auth-left {
  flex: 1;
  background: linear-gradient(135deg, var(--r1), var(--r2), var(--r3));
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--paper);
  padding: 40px;
}

.auth-noise {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  pointer-events: none;
  z-index: 1;
}

.auth-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(248, 248, 238, 0.1);
  border-radius: 50%;
}

.ring-1 { width: 400px; height: 400px; animation: spin 40s linear infinite; border-style: dashed; }
.ring-2 { width: 600px; height: 600px; animation: spinReverse 65s linear infinite; }
.ring-3 { width: 850px; height: 850px; animation: spin 90s linear infinite; border-style: dotted; }

@keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes spinReverse { 100% { transform: translate(-50%, -50%) rotate(-360deg); } }

.auth-left-content {
  position: relative;
  z-index: 10;
  max-width: 440px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.brand-tagline {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
  color: rgba(252, 252, 246, 0.95);
}

.brand-separator {
  width: 32px;
  height: 1px;
  background-color: rgba(248, 248, 238, 0.22);
}

.brand-desc {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(252, 252, 246, 0.7);
  font-weight: 300;
  max-width: 320px;
}

.film-strip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  opacity: 0.14;
  display: flex;
  align-items: center;
  background-image: radial-gradient(circle, var(--paper) 3px, transparent 4px);
  background-size: 30px 100%;
  background-position: center bottom;
  background-repeat: repeat-x;
  z-index: 2;
}

.auth-right {
  width: 480px;
  min-height: 100vh;
  background-color: var(--paper);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 20;
  box-shadow: -10px 0 40px rgba(0,0,0,0.05);
}

.auth-form-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 60px;
  animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes viewIn {
  from { opacity: 0; transform: translateY(7px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-brand {
  display: none;
  text-align: center;
  margin-bottom: 32px;
}

.view-anim {
  animation: viewIn 0.3s ease-out forwards;
}

/* Tabs */
.tabs {
  position: relative;
  display: flex;
  background: var(--bg2);
  border-radius: 100px;
  padding: 4px;
  margin-bottom: 36px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink3);
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: color 0.3s;
}

.tab.active {
  color: var(--r3);
}

.tab-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  background: var(--paper);
  border-radius: 100px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}

.tab-pill.right {
  transform: translateX(100%);
}

/* Form Styles */
.input-group {
  margin-bottom: 20px;
  position: relative;
  animation: slideIn 0.4s ease forwards;
  opacity: 0;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-5px); }
  to { opacity: 1; transform: translateX(0); }
}

.input-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink2);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-field {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: var(--bg);
  border: 1px solid rgba(22, 10, 12, 0.08);
  border-radius: 8px;
  font-family: inherit;
  font-size: 15px;
  color: var(--ink);
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--r3);
  box-shadow: 0 0 0 3px rgba(120, 39, 46, 0.08);
}

.input-field.has-error {
  border-color: rgb(175, 50, 50);
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--ink3);
  cursor: pointer;
  padding: 4px;
}
.password-toggle:hover {
  color: var(--ink);
}

.field-error {
  display: block;
  color: rgb(175, 50, 50);
  font-size: 0.69rem;
  margin-top: 6px;
  animation: fadeUp 0.3s forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
}

.forgot-link {
  display: block;
  text-align: right;
  font-size: 13px;
  color: var(--ink2);
  margin-top: 8px;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-link:hover {
  color: var(--r3);
}

.btn-submit {
  width: 100%;
  height: 48px;
  margin-top: 12px;
  background: linear-gradient(135deg, var(--r3), var(--r1));
  color: rgb(248, 248, 238);
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(120, 39, 46, 0.15);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(120, 39, 46, 0.25);
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(248, 248, 238, 0.3);
  border-top-color: rgb(248, 248, 238);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 24px;
  animation: fadeUp 0.3s forwards;
  border: 1px solid;
}
.alert.success {
  background: rgba(40, 100, 60, 0.07);
  border-color: rgba(60, 150, 90, 0.25);
  color: rgb(30, 95, 52);
}
.alert.error {
  background: rgba(120, 39, 46, 0.07);
  border-color: rgba(120, 39, 46, 0.25);
  color: var(--r2);
}

.back-btn {
  background: none;
  border: none;
  color: var(--ink2);
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  transition: color 0.2s;
}
.back-btn:hover {
  color: var(--ink);
}

.reset-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  margin: 0 0 8px 0;
  color: var(--ink);
}
.reset-desc {
  font-size: 14px;
  color: var(--ink2);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

@media (min-width: 1200px) {
  .auth-right { width: 520px; }
}

@media (max-width: 899px) {
  .auth-left { display: none; }
  .auth-right { width: 100%; box-shadow: none; }
  .mobile-brand { display: flex; flex-direction: column; align-items: center; gap: 12px; }
}

@media (max-width: 479px) {
  .auth-form-wrapper { padding: 40px 20px; }
}
`;

function EyeIcon({ off }: { off?: boolean }) {
    return off ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    );
}

function ArrowLeftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    );
}

function Logo({ src, light = false }: { src?: string; light?: boolean }) {
    // eslint-disable-next-line @next/next/no-img-element
    if (src) return <img src={src} alt="NoZapp Logo" style={{ width: 64, height: 64 }} />;

    const outerColor = light ? 'rgba(248,248,238,0.9)' : 'rgb(120,39,46)';
    const linesColor = light ? 'rgba(248,248,238,0.18)' : 'rgba(120,39,46,0.18)';
    const centerColor = light ? 'rgb(248,248,238)' : 'rgb(126,41,50)';

    return (
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" style={{ display: 'block' }}>
            <circle cx="50" cy="50" r="40" stroke={linesColor} strokeWidth="1" />
            <circle cx="50" cy="50" r="25" stroke={linesColor} strokeWidth="1" />

            {/* Lines between nodes */}
            <path d="M50 50 L50 10 M50 50 L85 30 M50 50 L85 70 M50 50 L50 90 M50 50 L15 70 M50 50 L15 30" stroke={linesColor} strokeWidth="1" />
            <path d="M15 30 L50 10 L85 30" stroke={linesColor} strokeDasharray="2,2" />

            {/* Outer nodes */}
            <circle cx="50" cy="10" r="4" fill={outerColor} />
            <circle cx="85" cy="30" r="3" fill={outerColor} />
            <circle cx="85" cy="70" r="4" fill={outerColor} />
            <circle cx="50" cy="90" r="3" fill={outerColor} />
            <circle cx="15" cy="70" r="3" fill={outerColor} />
            <circle cx="15" cy="30" r="4" fill={outerColor} />

            {/* Central node */}
            <circle cx="50" cy="50" r="6" fill={centerColor} />
        </svg>
    );
}

export default function AuthPage() {
    const [view, setView] = useState<'login' | 'register' | 'reset'>('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        setErrors({});
        setAlert(null);
    }, [view]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) newErrors.email = 'L\'email è obbligatoria';
        else if (!emailRegex.test(email)) newErrors.email = 'Formato email non valido';

        if (view === 'login' || view === 'register') {
            if (!password) newErrors.password = 'La password è obbligatoria';
            else if (password.length < 8) newErrors.password = 'Minimo 8 caratteri richiesti';
        }

        if (view === 'register') {
            if (!username) newErrors.username = 'Il nome utente è obbligatorio';
            else if (username.trim().length < 2) newErrors.username = 'Minimo 2 caratteri';

            if (password !== confirmPassword) newErrors.confirmPassword = 'Le password non coincidono';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setAlert(null);
        if (!validate()) return;

        setLoading(true);

        try {
            if (view === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    setAlert({ type: 'error', message: error.message });
                } else {
                    window.location.href = '/sphere';
                }
            } else if (view === 'register') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { display_name: username }
                    }
                });
                if (error) {
                    setAlert({ type: 'error', message: error.message });
                } else {
                    setAlert({ type: 'success', message: 'Registrazione completata. Controlla la tua email per confermare l\'account.' });
                }
            } else if (view === 'reset') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/callback?next=/profile`
                });
                if (error) {
                    setAlert({ type: 'error', message: error.message });
                } else {
                    setAlert({ type: 'success', message: 'Se l\'email esiste, ti abbiamo inviato un link di reset.' });
                    setEmail('');
                }
            }
        } catch (err: unknown) {
            setAlert({ type: 'error', message: err instanceof Error ? err.message : 'Si è verificato un errore imprevisto.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
            </svg>

            <div className="auth-container">

                {/* Left Panel - Desktop Only */}
                <div className="auth-left">
                    <div className="auth-noise" style={{ filter: 'url(#noiseFilter)' }} />
                    <div className="auth-rings">
                        <div className="ring ring-1" />
                        <div className="ring ring-2" />
                        <div className="ring ring-3" />
                    </div>

                    <div className="auth-left-content">
                        <Logo light />
                        <h2 className="brand-tagline">&quot;Il cinema non si cerca, si scopre.&quot;</h2>
                        <div className="brand-separator" />
                        <p className="brand-desc">Una sfera semantica che connette i film attraverso fili editoriali invisibili.</p>
                    </div>

                    <div className="film-strip" />
                </div>

                {/* Right Panel - Form Container */}
                <div className="auth-right">
                    <div className="auth-form-wrapper">

                        <div className="mobile-brand">
                            <Logo />
                            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'var(--ink)' }}>NoZapp</div>
                        </div>

                        {alert && (
                            <div className={`alert ${alert.type}`}>
                                {alert.message}
                            </div>
                        )}

                        {view === 'reset' ? (
                            <div className="view-anim" key="reset">
                                <button type="button" className="back-btn" onClick={() => setView('login')}>
                                    <ArrowLeftIcon /> Torna al login
                                </button>
                                <h1 className="reset-title">Reset Password</h1>
                                <p className="reset-desc">Inserisci la tua email e ti invieremo le istruzioni per reimpostare la password.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group" style={{ animationDelay: '0ms' }}>
                                        <label className="input-label">Email</label>
                                        <input autoFocus type="email" className={`input-field ${errors.email ? 'has-error' : ''}`} value={email} onChange={e => setEmail(e.target.value)} disabled={loading} placeholder="nome@esempio.com" />
                                        {errors.email && <span className="field-error">{errors.email}</span>}
                                    </div>
                                    <button type="submit" className="btn-submit" disabled={loading}>
                                        {loading ? <div className="spinner" /> : 'Invia link di reset'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="view-anim" key="main-auth">
                                <div className="tabs">
                                    <div className={`tab-pill ${view === 'register' ? 'right' : ''}`} />
                                    <div className={`tab ${view === 'login' ? 'active' : ''}`} onClick={() => setView('login')}>Login</div>
                                    <div className={`tab ${view === 'register' ? 'active' : ''}`} onClick={() => setView('register')}>Registrazione</div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {view === 'register' && (
                                        <div className="input-group" style={{ animationDelay: '0ms' }}>
                                            <label className="input-label">Nome Utente</label>
                                            <input autoFocus type="text" className={`input-field ${errors.username ? 'has-error' : ''}`} value={username} onChange={e => setUsername(e.target.value)} disabled={loading} placeholder="Il tuo nome" />
                                            {errors.username && <span className="field-error">{errors.username}</span>}
                                        </div>
                                    )}

                                    <div className="input-group" style={{ animationDelay: view === 'register' ? '100ms' : '0ms' }}>
                                        <label className="input-label">Email</label>
                                        <input autoFocus={view === 'login'} type="email" className={`input-field ${errors.email ? 'has-error' : ''}`} value={email} onChange={e => setEmail(e.target.value)} disabled={loading} placeholder="nome@esempio.com" />
                                        {errors.email && <span className="field-error">{errors.email}</span>}
                                    </div>

                                    <div className="input-group" style={{ animationDelay: view === 'register' ? '200ms' : '100ms' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <label className="input-label">Password {view === 'register' && '(Min. 8 caratteri)'}</label>
                                        </div>
                                        <div className="password-wrapper">
                                            <input type={showPassword ? 'text' : 'password'} className={`input-field ${errors.password ? 'has-error' : ''}`} value={password} onChange={e => setPassword(e.target.value)} disabled={loading} placeholder="••••••••" style={{ paddingRight: 40 }} />
                                            <button type="button" tabIndex={-1} className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                                <EyeIcon off={showPassword} />
                                            </button>
                                        </div>
                                        {errors.password && <span className="field-error">{errors.password}</span>}
                                        {view === 'login' && (
                                            <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); setView('reset'); }}>Password dimenticata?</a>
                                        )}
                                    </div>

                                    {view === 'register' && (
                                        <div className="input-group" style={{ animationDelay: '300ms' }}>
                                            <label className="input-label">Conferma Password</label>
                                            <div className="password-wrapper">
                                                <input type={showConfirmPassword ? 'text' : 'password'} className={`input-field ${errors.confirmPassword ? 'has-error' : ''}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} placeholder="••••••••" style={{ paddingRight: 40 }} />
                                                <button type="button" tabIndex={-1} className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    <EyeIcon off={showConfirmPassword} />
                                                </button>
                                            </div>
                                            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                                        </div>
                                    )}

                                    <button type="submit" className="btn-submit" disabled={loading} style={{ animation: `slideIn 0.4s ease forwards`, animationDelay: view === 'register' ? '400ms' : '200ms', opacity: 0 }}>
                                        {loading ? <div className="spinner" /> : view === 'login' ? 'Entra nella Sfera' : 'Crea Account'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
