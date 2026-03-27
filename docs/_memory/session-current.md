---
date: 2026-03-27
status: active
---

## [12:30] feature

**File toccati**:
- `supabase/migrations/20260327000100_cinema_movies.sql` — Creazione tabella cinema_movies con RLS e scadenze automatiche.
- `src/types/supabase.ts` — Aggiunta definizione tabella cinema_movies per TypeScript.
- `src/app/actions/cinema.ts` — Implementazione Server Actions (CRUD) per la gestione manuale del carosello Cinema.
- `src/app/admin/page.tsx` — Refactoring Dashboard con griglia a 4 colonne e nuova card "Cinema".
- `src/components/admin/CinemaForm.tsx` — Nuovo componente form per l'inserimento manuale dei film.
- `src/app/admin/cinema/page.tsx` — Pagina di elenco dei film gestiti.
- `src/app/admin/cinema/nuovo/page.tsx` — Pagina di creazione nuovo film.
- `src/app/admin/cinema/[id]/page.tsx` — Pagina di modifica film esistente.
- `src/app/sphere/page.tsx` — Integrazione carosello pubblico con la nuova sorgente dati manuale.

**Problema di partenza**: Transizione del carosello "Ora al Cinema" da sistema automatico a gestione manuale curata dagli admin.
**Soluzione applicata**: Implementato un sistema CRUD completo nell'area admin con supporto per date di scadenza e tipizzazione forte.
**Side effects**: Nessuno, la logica di fallback del carosello è stata preservata.

---

## [12:45] bug-fix

**File toccati**:
- `src/app/actions/admin_auth.ts` — Aggiunta Server Action `logoutAdmin` per il sign-out reale.
- `src/components/admin/AdminHeader.tsx` — Conversione del link di logout in pulsante interattivo con gestione stato.

**Problema di partenza**: Il logout admin non terminava la sessione Supabase, causando redirect automatici verso `/sphere` o `/admin` impedendo il cambio di utente.
**Soluzione applicata**: Implementato logout lato server che invalida la sessione e pulisce i cookie di sicurezza.
**Side effects**: Nessuno.

---

## [12:55] feature

**File toccati**:
- `.env` — Abilitazione `ENABLE_DB_LOGGING=true`.
- `src/app/actions/admin_auth.ts` — Integrazione `logSecurityEvent` in `generateAdminOTP`, `verifyAdminOTP` e `logoutAdmin`.
- `docs/security.md` — [Nuovo] Documentazione tecnica del sistema di audit log e MFA.
- `docs/progetto.md` — Aggiunto collegamento alla documentazione di sicurezza.
- `supabase/migrations/20260327000200_security_logs.sql` — Reso lo script idempotente con `IF NOT EXISTS` per prevenire errori in caso di tabella già esistente.

**Problema di partenza**: Mancanza di tracciabilità delle operazioni sensibili e necessità di un sistema di audit log per l'area amministrativa. Inoltre, lo script di migrazione falliva se rilanciato.
**Soluzione applicata**: Integrato un sistema di logging centralizzato e perfezionato lo script SQL con controlli di esistenza per tabelle, indici e policy.

**Side effects**: Nessuno.

---

## [13:10] feature

**File toccati**:
- `package.json` — Aggiunte dipendenze `react-markdown` e `remark-gfm`.
- `src/app/redazione/[slug]/page.tsx` — Refactoring completo della pagina articolo con supporto Markdown, stima tempo di lettura e design immersivo.
- `src/app/redazione/page.tsx` — [Nuova] Pagina di listing editoriale con layout premium e animazioni a comparsa.
- `docs/editorial-system.md` — Aggiornata documentazione con dettagli sui nuovi template e supporto Markdown.
- `src/components/layout/Header.tsx` — Nasconde l'header globale nelle pagine di dettaglio articolo per favorire la lettura.

**Problema di partenza**: Le pagine degli articoli avevano problemi di leggibilità (titolo su immagine) e mancavano di navigazione chiara verso la sfera semantica. Inoltre, l'header presentava bug di offset nello scrolling e bolle di stato bloccate.
**Soluzione applicata**: Rimosso il background dell'header negli articoli, spostata l'immagine di copertina sotto il titolo e aggiunte frecce di navigazione. Corretto l'ID mismatch in `Header.tsx` e aggiunto un fallback forzato per il reset della bolla quando si raggiunge la cima della pagina.
**Side effects**: Nessuno.

---
