---
date: 2026-03-31
status: done
---

## 12:05 [tipo: config | documentation]

**File toccati**:

- `docs/project-structure.md` — Aggiornato con i nuovi file dell'onboarding.
- `docs/components.md` — Documentati `OnboardingFlow` (refactor) e `ConfirmPhase`.
- `docs/hooks-and-utilities.md` — Aggiunto `useScrollReveal`.
- `docs/types.md` — Aggiornati tipi onboarding e streaming platforms.
- `docs/_memory/session-2026-03-31.md` — [NEW] Archiviata la sessione corrente.

**Problema di partenza**: La documentazione non rifletteva le profonde modifiche all'onboarding e alla struttura dei file.
**Soluzione applicata**: Utilizzato il workflow `/aggiornatore` per allineare tutti i file `.md` alla realtà del codice.
**Side effects**: Nessuno.

---

## [17:47] [tipo: feature]

**File toccati**:

- `docs/relazione-accessi-editoriali.md` — [NEW] Creata relazione architetturale per i nuovi ruoli e pagina collegamenti.
- `docs/progetto.md` — Inserito il link alla nuova relazione sotto la sezione Logica e UI.

**Problema di partenza**: Necessità di differenziare gli accessi admin (Redattore, Analista, Base, Admin) e di creare un pannello per inserire collegamenti editoriali tra i film, sfruttando la tabella `editorial_edges`.
**Soluzione applicata**: Analizzato il progetto e steso un piano dettagliato tramite file `relazione-accessi-editoriali.md` e artefatto di `implementation_plan`, evidenziando i file coinvolti e il workflow passo-passo. Richieste precisazioni prima dello sviluppo.
**Side effects**: La nuova architettura impatterà middleware `src/lib/supabase/middleware.ts` e le tabelle db.

---

## [17:50] [tipo: feature]

**File toccati**:

- `supabase/migrations/20260331000000_rbac_roles.sql` — [NEW] Aggiunta colonna `role` ('base', 'redattore', 'analista', 'admin') e query di migrazione.
- `src/types/supabase.ts` — Aggiunta tipizzazione del ruolo agli interfacci Row, Insert e Update.
- `src/lib/supabase/middleware.ts` — Implementato controllo su middleware per lo smistamento ed esclusione root in base ai nuovi ruoli `role`.
- `src/app/actions/admin_auth.ts` — Aggiornati check OTP validation e fetch profilo inserendo logica role fallback su `is_admin`.
- `src/app/admin/page.tsx` — Dashboard admin dinamica. I moduli visualizzati cambiano a seconda dell'accesso (solo visibili i corretti), rinominato scheda "Template" in "Collegamenti" (per admin e redattore).
- `src/app/admin/collegamenti/page.tsx` — [NEW] Creata pagina gestionale dedicata agli archi.
- `src/components/admin/EdgeEditorForm.tsx` — [NEW] Frontend del form: ricerca in tempo reale di source e target film (debounce), visualizzazione grafica dei collegamenti, impostazione label e select edge type. 
- `src/app/actions/editorial_edges.ts` — [NEW] Server Actions per ricerca, creazione, lettura array di edges associati al DB (postgrest) ed eliminazione.

**Problema di partenza**: Applicazione del piano "Gestione Ruoli e Edge", con approvazione implicita dal task. L'applicativo necessitava del modulo visibili e della validazione DB.
**Soluzione applicata**: Create e gestite le cartelle di UI ed eseguito l'insert nel DB su `editorial_edges`. Effettuato controllo server dei tipi per garantire assenza di refusi.
**Side effects**: Aggiornamento delle regole di accessibilità globale sui file root. Serve spingere la migrazione sql su Supabase.

---

## [18:15] [tipo: bug-fix]

**File toccati**:

- `src/app/admin/collegamenti/page.tsx` — Rimosso bottone "Torna alla dashboard", tag in alto "COLLEGAMENTI EDITORIALI", e il box delle Note Editoriali.
- `src/components/admin/EdgeEditorForm.tsx` — Portato fuori dal flusso di Render React principale il subcomponent `FilmSearchBox` per prevenire l'unboxing prematuro causante perdita di Focus input (1 carattere alla volta).
- `supabase/migrations/20260331000001_editorial_edges_rls.sql` — [NEW] Creata apposita Row-Level Security Policy da applicare al database tramite migration o query per bypassare il blocco INSERT/DELETE su `editorial_edges`.

**Problema di partenza**: Piccole modifiche UI e bug di perdita Focus sull'input, oltre al blocco di Supabase causato dalle policy di default del database RLS stringenti per le queries.
**Soluzione applicata**: Rimozione codice UI inutile, estrapolazione sub-component e stesura del file `.sql` integrativo bypass RLS.
**Side effects**: Va spinta la seconda migration su Supabase per permettere l'insert senza errori RLS.

---

## [18:50] [tipo: bug-fix]

**File toccati**:

- `src/hooks/useSphereEngine.ts` — Aggiunta espansione logaritmica/scalare sulle dimensioni del nodo al passaggio di shell (`setShell`). I `nodeMeshes` e `glowMeshes` ora aumentano il loro volume localmente quando la vista passa dalla loro gerarchia (es. shell 1 scala a x5.0, mentre shell 0 diminuisce a x0.3). L'offset del box Title HTML è stato modificato in real time usando la `currentScale` del singolo nodo.

**Problema di partenza**: Nelle viste profonde (Affinità / Scoperta) i nodi primari Pilastro sovrastavano visivamente i film di riferimento essendo staticamente codificati per restare più grandi.
**Soluzione applicata**: Applicato "Tween" sulle direttrici (x,y,z) della Three.js Geometry ricalibrandosi in base a `activeShell`.
**Side effects**: CSS title offset ricalcolato live durante la transizione tween.

---

## [10:26] [tipo: refactor | feature | security]

**File toccati**:

- `supabase/migrations/20260401000000_unify_roles.sql` — [NEW] Creata migrazione per rimuovere is_admin mantenendo intatta la RLS policy.
- `src/types/supabase.ts` — Rimosso is_admin dalle interfacce TypeScript.
- `src/lib/supabase/middleware.ts` — Utilizzato field role in sostituzione a is_admin.
- `src/lib/supabase/auth-client.ts` — Rimosso is_admin e rimpiazzato logicamente da role.
- `src/app/actions/*.ts` — Rimosso interamente is_admin dalle query in db e permessi, sostituito con role ('admin', 'redattore', 'analista').
- `src/app/admin/utenti/page.tsx` — Riscritta UI inserendo il modulo drop down dei Ruoli e implementato Modal flow OTP per conferma asincrona dispostiva.

**Problema di partenza**: Sostituire il flag is_admin introducendo un selettore completo a più tier e vincolare la promozione via OTP admin in backend.
**Soluzione applicata**: Aggiornati i file action per validare OTP di sicurezza dell'utente loggato, unificata la logica intera del progetto eliminando is_admin, introdotte RLS refactoring.
**Side effects**: Le modifiche su DB richiedono di eseguire la migrazione in backend (Supabase SQL).

---

## [10:32] [tipo: bug-fix]

**File toccati**:

- `src/app/admin/collegamenti/page.tsx` — Rimosso riferimento obsoleto a `is_admin`.

**Problema di partenza**: Errore di type-check su Vercel durante la build causato dalla rimozione di `is_admin` dall'integrazione di Supabase (ruoli unificati precedentemente).
**Soluzione applicata**: Aggiornato un riferimento "dimenticato" in `collegamenti/page.tsx` sostituendo `profile.is_admin` con la logica `role === 'admin'`.
**Side effects**: Sblocca la continuous deployment di Vercel.

---

## [10:38] [tipo: bug-fix | security]

**File toccati**:

- `src/lib/supabase/middleware.ts` — Aggiunta logica di fallback per la lettura di `onboarding_complete`.

**Problema di partenza**: Loop di redirect verso `/onboarding` perché la colonna `role` non era ancora presente nel DB di produzione, causando il fallimento della query del profilo nel middleware.
**Soluzione applicata**: Implementato un secondo tentativo (fallback) di fetch che isola solo il campo `onboarding_complete` se la query principale fallisce. Corretto anche un errore di mutabilità (`const` -> `let`) per la variabile `profile`.
**Side effects**: Permette agli utenti di accedere alla Sfera anche se il DB e il codice non sono ancora perfettamente sincronizzati durante il deploy.

---

## [16:15] [tipo: bug-fix | config]

**File toccati**:

- `src/middleware.ts` — [NEW] Creato rinominando `src/proxy.ts`.
- `src/proxy.ts` — [DELETE] Rimosso in favore del nome standard di Next.js.

**Problema di partenza**: L'apertura del sito non portava al `/login` per gli utenti non autenticati, ma mostrava un fallback di onboarding nella pagina `/sphere`.
**Soluzione applicata**: Il middleware di autenticazione non veniva eseguito perché il file era nominato `proxy.ts` invece del nome standard `middleware.ts`. Rinominando il file, Next.js ora intercetta le richieste e reindirizza correttamente i visitatori non loggati al `/login`.
**Side effects**: Tutti i controlli di protezione rotte, bot filtering e rate limiting definiti nel middleware sono ora attivi globalmente.

---
