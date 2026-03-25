'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logSecurityEvent } from '@/lib/logger';

// CSS injected securely
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap');

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
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100%;
  background-color: rgb(247, 245, 234);
  font-family: var(--font-mono);
  color: var(--ink);
  overflow: hidden;
  position: fixed;
  inset: 0;
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
  font-family: var(--font-serif);
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
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background-color: var(--paper);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 20;
}

.auth-right.centered {
  max-width: 420px;
  min-height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 80px rgba(0,0,0,0.08);
  margin: 20px;
  width: calc(100% - 40px);
}

.auth-form-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 60px;
  animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: padding 0.3s ease;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.view-container {
  display: grid;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-inner {
  overflow: hidden;
}

@keyframes viewIn {
  from { opacity: 0; transform: translateY(7px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
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
  margin-bottom: 24px;
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
  /* Less pronounced bounce: from (0.34, 1.56, 0.64, 1) to (0.34, 1.15, 0.64, 1) */
  transition: transform 0.4s cubic-bezier(0.34, 1.15, 0.64, 1);
  z-index: 1;
}

.tab-pill.right {
  transform: translateX(100%);
}

/* Form Styles */
.input-group {
  margin-bottom: 16px;
  position: relative;
}

.input-group.initial-anim {
  animation: slideIn 0.4s ease forwards;
  opacity: 0;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.input-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: var(--ink2);
  margin-bottom: 4px;
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
  font-family: var(--font-mono);
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

.oauth-divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--cold);
    font-size: 0.8rem;
    margin: 20px 0;
  }
  .oauth-divider::before, .oauth-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .oauth-divider span {
    padding: 0 10px;
  }
  .oauth-buttons {
    display: flex;
    gap: 12px;
  }
  .btn-oauth {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 6px;
    background: white;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-oauth:hover {
    background: #fafafa;
    border-color: rgba(0,0,0,0.2);
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
  margin: 0; /* Reset margins to ensure proper centering in flex container */
  display: inline-block;
}

.film-strip {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='60' viewBox='0 0 40 60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='5' width='20' height='12' rx='2' ry='2' fill='%23fefdf9' fill-opacity='0.4'/%3E%3Crect x='0' y='43' width='20' height='12' rx='2' ry='2' fill='%23fefdf9' fill-opacity='0.4'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-size: 30px 100%;
  opacity: 0;
  z-index: 1;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.btn-submit.rolling .film-strip {
  opacity: 1;
  animation: rollFilm 0.8s linear infinite;
}

.btn-submit.rolling .btn-text {
  opacity: 0;
}

.btn-text {
  transition: opacity 0.3s ease;
  position: relative;
  z-index: 2;
}

@keyframes rollFilm {
  0% { transform: translateX(0); }
  100% { transform: translateX(-30px); }
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
  font-family: var(--font-serif);
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

@media (max-width: 860px) {
  .auth-left { display: none; }
  .auth-right { max-width: 480px; }
}

@media (max-width: 479px) {
  .auth-form-wrapper { padding: 24px 20px; }
  .mobile-brand { margin-bottom: 16px; transform: scale(0.85); }
  .tabs { margin-bottom: 20px; }
  .input-group { margin-bottom: 12px; }
  .oauth-divider { margin: 12px 0; }
  .btn-submit { margin-top: 8px; }
  .auth-right.centered { margin: 16px; width: calc(100% - 32px); }
}
`;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}


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
  const [view, setView] = useState<'login' | 'register' | 'reset' | 'update-password'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot field

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'update-password') setView('update-password');
  }, []);

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


  const handleOAuth = async (provider: 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (err: unknown) {
      setAlert({ type: 'error', message: err instanceof Error ? err.message : 'Errore OAuth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();
    if (honeypot) {
      await logSecurityEvent('honeypot_hit', { 
        level: 'warn', 
        path: '/login', 
        metadata: { field: 'website_url', value: honeypot } 
      });
      setAlert({ type: 'error', message: 'Richiesta non valida.' });
      return;
    }
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
            data: { display_name: username },
            emailRedirectTo: `${window.location.origin}/auth/callback`
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
      } else if (view === 'update-password') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          setAlert({ type: 'error', message: error.message });
        } else {
          setAlert({ type: 'success', message: 'Password aggiornata con successo!' });
          setTimeout(() => {
            window.location.href = '/sphere';
          }, 1500);
        }
      }
    } catch (err: unknown) {
      const isRateLimit = err instanceof Error && err.message.includes('429');
      
      await logSecurityEvent('auth_failure', {
        level: isRateLimit ? 'warn' : 'info',
        path: '/login',
        metadata: { 
          view, 
          email: email.split('@')[0] + '@***', // Masked email for privacy
          error: err instanceof Error ? err.message : 'Unknown error' 
        }
      });

      setAlert({ 
        type: 'error', 
        message: isRateLimit 
          ? 'Troppe richieste. Per favore attendi un momento prima di riprovare.' 
          : (err instanceof Error ? err.message : 'Si è verificato un errore imprevisto.') 
      });
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
        {/* Right Panel - Form Container (Now Centered) */}
        <div className="auth-right centered">
          <div className="auth-form-wrapper">

            <div className="mobile-brand">
              <Logo src="/logo.png" />
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: 'italic', color: 'var(--ink)' }}>NoZapp</div>
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
                  {/* Honeypot field - Hidden from users */}
                  <div style={{ position: 'absolute', opacity: 0, zIndex: -1, pointerEvents: 'none' }}>
                    <input type="text" name="website_url" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <button type="submit" className={`btn-submit ${loading ? 'rolling' : ''}`} disabled={loading}>
                    <div className="film-strip" />
                    <span className="btn-text">Invia link di reset</span>
                  </button>
                </form>
              </div>
            ) : view === 'update-password' ? (
              <div className="view-anim" key="update-password">
                <h1 className="reset-title">Nuova Password</h1>
                <p className="reset-desc">Scegli una nuova password sicura per il tuo account.</p>
                <form onSubmit={handleSubmit}>
                  <div className="input-group" style={{ animationDelay: '0ms' }}>
                    <label className="input-label">Nuova Password</label>
                    <div className="password-wrapper">
                      <input type={showPassword ? 'text' : 'password'} className={`input-field ${errors.password ? 'has-error' : ''}`} value={password} onChange={e => setPassword(e.target.value)} disabled={loading} placeholder="••••••••" />
                      <button type="button" tabIndex={-1} className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        <EyeIcon off={showPassword} />
                      </button>
                    </div>
                    {errors.password && <span className="field-error">{errors.password}</span>}
                  </div>
                  <div className="input-group" style={{ animationDelay: '100ms' }}>
                    <label className="input-label">Conferma Password</label>
                    <div className="password-wrapper">
                      <input type={showConfirmPassword ? 'text' : 'password'} className={`input-field ${errors.confirmPassword ? 'has-error' : ''}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} placeholder="••••••••" />
                      <button type="button" tabIndex={-1} className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <EyeIcon off={showConfirmPassword} />
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                  </div>
                  <button type="submit" className={`btn-submit ${loading ? 'rolling' : ''}`} disabled={loading}>
                    <div className="film-strip" />
                    <span className="btn-text">Aggiorna Password</span>
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

                <div className="view-container" style={{ gridTemplateRows: view === 'register' ? '1fr' : '0fr' }}>
                  <div className="view-inner">
                    <div style={{ 
                        paddingBottom: view === 'register' ? '0.1px' : '0',
                        opacity: view === 'register' ? 1 : 0,
                        transform: view === 'register' ? 'translateY(0)' : 'translateY(-10px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: view === 'register' ? 'auto' : 'none'
                    }}>
                      <div className="input-group" style={{ marginBottom: view === 'register' ? '20px' : '0' }}>
                        <label className="input-label">Nome Utente</label>
                        <input type="text" className={`input-field ${errors.username ? 'has-error' : ''}`} value={username} onChange={e => setUsername(e.target.value)} disabled={loading} placeholder="Il tuo nome" tabIndex={view === 'register' ? 0 : -1} />
                        {errors.username && <span className="field-error">{errors.username}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="input-group initial-anim" style={{ animationDelay: '0ms' }}>
                    <label className="input-label">Email</label>
                    <input autoFocus={view === 'login'} type="email" className={`input-field ${errors.email ? 'has-error' : ''}`} value={email} onChange={e => setEmail(e.target.value)} disabled={loading} placeholder="nome@esempio.com" />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <div className="input-group initial-anim" style={{ animationDelay: '100ms' }}>
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
                    
                    <div style={{ 
                        opacity: view === 'login' ? 1 : 0, 
                        height: view === 'login' ? 'auto' : 0, 
                        overflow: 'hidden', 
                        transition: 'opacity 0.3s ease' 
                    }}>
                      <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); setView('reset'); }}>Password dimenticata?</a>
                    </div>
                  </div>

                  <div className="view-container" style={{ gridTemplateRows: view === 'register' ? '1fr' : '0fr' }}>
                    <div className="view-inner">
                      <div style={{ 
                          paddingBottom: view === 'register' ? '0.1px' : '0',
                          opacity: view === 'register' ? 1 : 0,
                          transform: view === 'register' ? 'translateY(0)' : 'translateY(-10px)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          pointerEvents: view === 'register' ? 'auto' : 'none'
                      }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">Conferma Password</label>
                          <div className="password-wrapper">
                            <input type={showConfirmPassword ? 'text' : 'password'} className={`input-field ${errors.confirmPassword ? 'has-error' : ''}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} placeholder="••••••••" style={{ paddingRight: 40 }} tabIndex={view === 'register' ? 0 : -1} />
                            <button type="button" tabIndex={-1} className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              <EyeIcon off={showConfirmPassword} />
                            </button>
                          </div>
                          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className={`btn-submit ${loading ? 'rolling' : ''}`} disabled={loading} style={{ 
                      animation: `slideIn 0.4s ease forwards`, 
                      animationDelay: '200ms', 
                      opacity: 0, 
                      marginTop: view === 'register' ? '20px' : '12px',
                      transition: 'margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s, box-shadow 0.2s'
                  }}>
                    <div className="film-strip" />
                    <span className="btn-text">{view === 'login' ? 'Entra nella Sfera' : 'Crea Account'}</span>
                  </button>

                  <div className="oauth-divider" style={{ animation: `slideIn 0.4s ease forwards`, animationDelay: view === 'register' ? '500ms' : '300ms', opacity: 0 }}>
                    <span>oppure continua con</span>
                  </div>

                  <div className="oauth-buttons" style={{ animation: `slideIn 0.4s ease forwards`, animationDelay: view === 'register' ? '600ms' : '400ms', opacity: 0 }}>
                    <button type="button" className="btn-oauth google" onClick={() => handleOAuth('google')} disabled={loading}>
                      <GoogleIcon /> Google
                    </button>

                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
