---
tags: [#security, #status/complete]
created: 2026-03-27
agent: scrittore
---

# Sicurezza e Audit Log

Il sistema di sicurezza di NoZapp è progettato per garantire l'integrità dei dati amministrativi e tracciare le operazioni sensibili.

## Audit Log (`security_logs`)

Ogni evento critico (autenticazione, errori di sistema, superamento rate-limit) viene registrato nella tabella `public.security_logs`.

### Struttura della Tabella
- `id`: UUID primario.
- `event_type`: Tipo di evento (`auth_success`, `auth_failure`, `rate_limit_block`, etc.).
- `level`: Gravità (`info`, `warn`, `error`, `critical`).
- `ip_address`: Indirizzo IP dell'origine.
- `user_id`: Riferimento all'utente (se autenticato).
- `path`: URL o endpoint interessato.
- `metadata`: Oggetto JSONB con dettagli aggiuntivi (es. `stage` dell'autenticazione).
- `created_at`: Timestamp dell'evento.

### Politiche di Accesso (RLS)
- **SELECT**: Consentito solo agli utenti con `is_admin = true`.
- **INSERT**: Consentito al sistema (Service Role) per la scrittura dei log.

## Flusso di Autenticazione Admin

L'accesso all'area `/admin` è protetto da un sistema a due fattori (MFA) tramite Email OTP:
1. **Login Supabase**: L'utente si autentica con le credenziali standard.
2. **Controllo Admin**: Il sistema verifica il flag `is_admin` nella tabella `public.users`.
3. **Email OTP**: Viene inviato un codice a 8 cifre via email.
4. **Verifica e Sessione**: Dopo la verifica del codice, viene impostato un cookie `admin_session` (httpOnly, secure) con durata di 2 ore.
5. **Feedback Visivi**: La pagina di verifica include feedback sullo stato dell'OTP:
   - **Errore**: Animazione "shake" del box di input e bordi rossi.
   - **Successo**: Messaggi di conferma e reindirizzamento immediato.
   - **Reinvio**: Notifica visiva al completamento dell'invio di un nuovo codice.
6. **Accesso Rapido**: Per gli admin già autenticati, è presente un'icona Settings (rotellina) nell'header della Sfera che rimanda direttamente a `/admin/verify`.

## Utility di Logging

La funzione `logSecurityEvent` in `@/lib/logger` gestisce la scrittura dei log sia su console che su database (se abilitata via `ENABLE_DB_LOGGING=true`).

```typescript
import { logSecurityEvent } from '@/lib/logger';

await logSecurityEvent('auth_success', {
    userId: user.id,
    path: '/admin/login',
    metadata: { stage: 'otp_verification_success' }
});
```

---
🔄 **Aggiornato il 2026-03-27**: Perfezionamento feedback visivi OTP e gestione flussi di errore UX.
File modificati: `src/app/admin/verify/page.tsx`
