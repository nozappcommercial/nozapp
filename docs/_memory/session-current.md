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

---

## [09:25] [tipo: bug-fix]

**File toccati**:
- `src/app/actions/admin_auth.ts` — Rifatto il sistema di ritorno delle Action: ora restituiscono un oggetto `{ success, error }` invece di sollevare eccezioni. Aggiunta la pulizia del numero di telefono (rimozione spazi).
- `src/app/admin/verify/page.tsx` — Aggiornata la gestione della risposta delle Action per mostrare messaggi di errore precisi invece del crash generico di produzione Next.js.

**Problema di partenza**: Errore "Server Components render" criptico durante l'invio dell'SMS in ambiente di produzione.
**Soluzione applicata**: Individuata un'eccezione non gestita che causava il crash del rendering. Implementata una gestione degli errori robusta nelle Server Action e migliorata la resilienza della UI. Pulito il formato del numero di telefono per Supabase.
**Side effects**: Se Supabase restituisce un errore reale (es. "SMS provider not configured"), ora verrà mostrato esplicitamente a video.

---

---
