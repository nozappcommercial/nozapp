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


## [17:50] feature: otp feedback & resend notification — P2-009

**File toccati**:

- `src/app/admin/verify/page.tsx` — Implementata animazione di shake su errore, bordi colorati per stati (loading/error/success) e messaggio di conferma reinvio email.

**Problema di partenza**: Mancanza di feedback visivi durante l'inserimento dell'OTP e dopo il clic su "Reinvia codice".
**Soluzione applicata**: Aggiunto stato `isVibrating` per animazione CSS shake. Inserito messaggio di successo temporaneo (`resendSuccess`) per il reinvio mail. Migliorata la UX con loader durante la verifica.
**Side effects**: Nessuno.


## [18:00] fix: react hook violation (#310) & vercel stability

**File toccati**:

- `src/components/layout/Header.tsx` — Spostato l'early return condizionale dopo la dichiarazione di tutti gli hooks.

**Problema di partenza**: Errore fatale `React Error #310` su Vercel durante la navigazione tra Admin e Sfera. Questo causava il crash dell'intera applicazione ("This page couldn't load").
**Soluzione applicata**: Corretta la violazione delle "Rules of Hooks". Il componente `Header` ora inizializza sempre lo stesso numero di hooks prima di decidere se renderizzare `null` o il JSX. Questo stabilizza la navigazione client-side.
**Side effects**: Risolti i crash intermittenti segnalati dall'utente.

---

## [18:15] meccanico — P3-001

**File toccati**:

- `src/hooks/use-is-mobile.ts` — [NUOVO] Hook centralizzato per la gestione dei breakpoint.
- `src/lib/supabase/auth-client.ts` — [NUOVO] Utility client-side per il controllo permessi admin.
- `src/lib/scroll-utils.ts` — [NUOVO] Helper per lo scroll fluido con Anime.js.
- `src/components/layout/Header.tsx` — Refactoring completo: rimozione logiche low-level di scroll, mobile detection e auth manuale.
- `src/components/onboarding/OnboardingFlow.tsx` — Rimozione hook locale `useIsMobile`.

**Problema di partenza**: Logica di basso livello (rilevamento mobile, scroll, auth) ripetuta nei componenti invece di usare utility centralizzate.
**Soluzione applicata**: Estratti i comportamenti comuni in hooks e utility in `src/hooks/` e `src/lib/`. Questo riduce le dimensioni dei componenti UI e centralizza la manutenzione delle logiche di sistema.
**Side effects**: Nessuno. Migliorata la pulizia del codice e il caricamento asincrono di librerie come Anime.js.
**Todo chiuso**: P3-001 → ✅

---

## [18:30] refactor: decomposizione SemanticSphere.tsx — P2-010

**File toccati**:

- `src/components/sphere/MovieDetailPanel.tsx` — [NUOVO] Componente React per il pannello informativo con logica di swipe.
- `src/components/sphere/SphereUIOverlays.tsx` — [NUOVO] Overlay UI (Header, Breadcrumb, Nav) estratti.
- `src/hooks/useSphereEngine.ts` — [NUOVO] Hook "motore" che isola tutto il setup Three.js, Raycasting e Render Loop.
- `src/components/SemanticSphere.tsx` — Trasformato in orchestratore leggero (da 1200+ a ~150 righe).

**Problema di partenza**: `SemanticSphere.tsx` era un "God Component" ingestibile che mescolava stato React, logica Three.js complessa e manipolazioni dirette del DOM.
**Soluzione applicata**: Decomposto il file in componenti funzionali e un custom hook per il motore grafico. Preservata l'interazione basata su ID per garantire il funzionamento delle animazioni CSS e degli eventi DOM esistenti.
**Side effects**: Nessuno. Prestazioni e funzionalità identiche, ma leggibilità radicalmente migliorata.
**Todo chiuso**: P2-010 → ✅

---
