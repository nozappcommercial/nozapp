---
date: 2026-03-27
status: active
---

## [15:40] feature / refactor

**File toccati**:
- `src/components/layout/AppLoader.tsx` — [Nuovo] Splash screen orbitale con anelli ember/gold/cold.
- `public/manifest.json` — Aggiornamento PWA v2.0 con modalità fullscreen e shortcuts.
- `src/app/layout.tsx` — Integrazione `AppLoader` e aggiornamento metadati viewport.
- `src/components/ui/SplashScreen.tsx` — [Eliminato] Vecchio splash screen di base.
- `src/components/layout/Header.tsx` — Azzerato l'offset di scroll per le sezioni interne.

**Problema di partenza**: Necessità di un'esperienza di apertura app premium e configurazione PWA professionale (fullscreen, shortcuts). Inoltre, la navigazione verso "Redazione" presentava un offset di 60px indesiderato.
**Soluzione applicata**: Migrata la soluzione sviluppata in sandbox nel progetto principale. Implementato `AppLoader` con animazioni CSS pure. Azzerato l'offset in `handleNavClick` per far combaciare lo scroll con l'inizio reale delle sezioni, sfruttando il padding interno dei componenti.
**Side effects**: Migliorata la precisione dello scroll e la velocità di percezione del caricamento.

---

## [16:01] config

**File toccati**:

- `.gitignore` — Aggiunta `.agents` per evitare l'upload delle cartelle di configurazione degli agenti su git.

**Problema di partenza**: La cartella `.agents` non era esclusa dal controllo di versione.
**Soluzione applicata**: Inserito `.agents` nel file `.gitignore`.
**Side effects**: Nessuno.

---

## [16:20] feature

**File toccati**:

- `docs/todo.md` — [Nuovo] Generazione automatica della lista TODO basata sull'analisi della documentazione (`IMPORTANT`, `TIP`, alert).

**Problema di partenza**: Necessità di centralizzare i problemi e suggerimenti sparsi nella documentazione in un unico file azionabile.
**Soluzione applicata**: Eseguito il workflow `/analista`. Scansionati tutti i file `.md` in `docs/`, classificate 14 voci per priorità (P1-P4) e organizzate in `docs/todo.md`.
**Side effects**: Nessuno.

---

## [16:08] meccanico — P1-001

**File toccati**:

- `src/lib/config.ts` — [Nuovo] Centralizzazione e validazione Zod delle variabili d'ambiente.
- `src/app/api/admin/sync-streaming/route.ts` — Utilizzo del modulo `config` per l'accesso alle chiavi.
- `.env.example` — Aggiunta documentazione per `TMDB_API_KEY`.

**Problema di partenza**: Non esporre mai le API Key (`TMDB_API_KEY`, `RAPIDAPI_KEY`) sul lato client.
**Soluzione applicata**: Creato un modulo `config.ts` marcato con `server-only` che valida le chiavi all'avvio. Rimosso l'accesso diretto a `process.env` nelle rotte server per garantire che le chiavi siano gestite in modo sicuro e centralizzato.
**Side effects**: Nessuno. Richiede il riavvio del server per caricare le nuove configurazioni.
**Todo chiuso**: P1-001 → ✅

---

## [16:50] refactor: typescript — P2-001

**File toccati**:

- `src/components/SemanticSphere.tsx` — Transizione a tipizzazione rigorosa e rimozione `@ts-nocheck`.
- `src/types/three-extended.d.ts` — [Nuovo] Definizioni tipi per `userData` e TweenTasks di Three.js.

**Problema di partenza**: Il componente Three.js principale (`SemanticSphere.tsx`) era privo di tipi e utilizzava `@ts-nocheck`, rendendo difficile la manutenzione e prono a bug silenziosi.
**Soluzione applicata**: Rimossa la direttiva `@ts-nocheck`. Implementata una tipizzazione completa per mesh, materiali (cast a `MeshBasicMaterial`), eventi touch/mouse e logica di navigazione dei nodi. Utilizzate le interfacce custom `ExtendedMesh` e `ExtendedLine` per gestire i metadati dei nodi.
**Side effects**: Nessuno, verificato con `npm run build`. Migliorata drasticamente l'affidabilità del codice durante lo sviluppo.
**Todo chiuso**: P2-001 → ✅

---

## [17:15] fix: build vercel

**File toccati**:

- `src/lib/config.ts` — Reso resiliente alla fase di build (opzionalità per segreti mancanti).
- `src/app/api/admin/sync-streaming/route.ts` — Gestione runtime della mancanza di chiavi API.

**Problema di partenza**: La build di Vercel falliva durante la "page data collection" perché i segreti (`CRON_SECRET`, `RAPIDAPI_KEY`) non erano presenti nel context del compilatore.
**Soluzione applicata**: Modificato lo schema Zod per permettere che i segreti siano opzionali durante la build. Aggiunti controlli di guardia nelle rotte per gestire l'assenza a runtime con log d'errore chiari.
**Side effects**: Nessuno. Garantisce che il CI/CD possa scalare anche se i segreti non sono configurati esplicitamente in fase di build.

---

## [17:30] feature: admin ui refinement — P2-008

**File toccati**:

- `src/components/admin/AdminHeader.tsx` — Aggiunto tasto "Sfera", rimosso link ridondante su `/verify`.
- `src/app/admin/verify/page.tsx` — Centramento box, rimozione scroll e sfondi doppi.
- `src/app/admin/layout.tsx` — Transizione a Client Component per layout dinamico (padding condizionale).
- `src/components/layout/Header.tsx` — Sostituito `Link` con `<a>` per l'accesso admin (fix crash Vercel).

**Problema di partenza**: La UI di verifica non era centrata e presentava link ridondanti. L'accesso all'admin dalla sfera causava crash transitori su Vercel (richiedendo reload).
**Soluzione applicata**: Ottimizzato il layout flexbox per il centramento perfetto. Implementato il caricamento full-page (SSR) per l'ingresso nell'admin per stabilizzare il middleware. Aggiunta navigazione rapida verso la sfera.
**Side effects**: Nessuno. Migliorata l'esperienza utente e la stabilità della sessione admin.

---
