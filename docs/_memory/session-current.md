---
date: 2026-03-27
status: active
---

## [09:15] [tipo: feature]


**File toccati**:
- `src/app/actions/admin_auth.ts` — Migrazione dall'invio simulato (console) all'invio reale tramite Supabase Auth (`signInWithOtp`).
- `src/app/admin/verify/page.tsx` — Aggiornata la UI di verifica per supportare l'OTP a 6 cifre di Supabase (precedentemente 4).

**Problema di partenza**: L'SMS con l'OTP non arrivava perché il sistema era in modalità simulazione per lo sviluppo iniziale.
**Soluzione applicata**: Collegato il flusso MFA al provider SMS nativo di Supabase Auth. Ora il codice viene inviato realmente al numero certificato nel DB. Aumentata la sicurezza passando a un codice a 6 cifre standard.
**Side effects**: Nessuno, ma l'utente deve assicurarsi che il provider SMS sia correttamente configurato nel dashboard di Supabase.

## [09:30] [tipo: feature]

**File toccati**:
- `src/app/actions/admin_auth.ts` — Cambiato il metodo di autenticazione da `phone` a `email` nelle chiamate a Supabase Auth. Rimosse le dipendenze dalla colonna `phone_number` per l'MFA.
- `src/app/admin/verify/page.tsx` — Riprogettata la UI per l'Email MFA: rimosso il setup del telefono, aggiornate le icone (Mail) e i testi. Il numero di slot per l'OTP è stato esteso a 8 cifre per supportare il codice generato dal template Supabase. Aggiunto pulsante "Ho già un codice" per saltare l'invio.

**Problema di partenza**: L'invio SMS tramite Supabase restituiva l'errore "Unsupported phone provider" a causa dei costi e della necessità di configurazione di provider esterni.
**Soluzione applicata**: Migrato l'intero sistema MFA su Email. Essendo un pannello Admin, l'email è un canale sicuro, gratuito e già verificato per ogni utente. Questo garantisce affidabilità totale senza costi aggiuntivi.
**Side effects**: Il campo `phone_number` nel DB è ora opzionale e non più richiesto per l'accesso admin.

---

---
