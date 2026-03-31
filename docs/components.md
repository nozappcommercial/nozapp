updated: 2026-03-31
agent: aggiornatore
---

# Componenti UI

[← Torna all'indice](./progetto.md)

## Panoramica
I componenti di NoZapp sono suddivisi in **UI atomici** (Shadcn), **Layout** (struttura fissa) e **Functional** (logica specifica). Questa sezione documenta i componenti principali non legati direttamente a Three.js.

## Componenti Specifici

### `ShellNavigator` — `src/components/sphere/ShellNavigator.tsx`
**Scopo**: Gestisce la navigazione tra i livelli di shell della sfera.
**Responsabilità**: Visualizzare il livello corrente, gestire l'hover e triggerare il cambio di shell.

---

### `MovieDetailPanel` — `src/components/sphere/MovieDetailPanel.tsx`
**Scopo**: Visualizza i dettagli completi del film selezionato (Poster, Titolo, Meta, Feedbacks).
**Caratteristiche**:
- **Swipe UX**: Include logica di swipe orizzontale per navigare tra i film adiacenti.
- **Micro-interazioni**: Animazione di entrata/uscita fluida gestita tramite classi CSS dinamiche.

---

### `SphereUIOverlays` — `src/components/sphere/SphereUIOverlays.tsx`
**Scopo**: Contiene tutti gli elementi UI bidimensionali sovrapposti alla sfera 3D.
**Responsabilità**:
- Renderizza l'Header specifico della sfera (`SphereHeader`).
- Visualizza i Breadcrumb di navigazione tra le shell.
- Fornisce i pulsanti di controllo direzionale (Nav Buttons).

| Prop | Tipo | Default | Obbligatorio | Descrizione |
| :--- | :--- | :--- | :--- | :--- |
| `activeShell` | `ShellLevel (0\|1\|2)` | - | Sì | Il livello di shell attualmente attivo. |
| `onShellChange` | `(shell: ShellLevel) => void` | - | No | Callback chiamata al click su un livello. |
| `isAnimating` | `boolean` | `false` | No | Disabilita i click durante le transizioni 3D. |
| `variant` | `'default' \| 'compact'` | `'default'` | No | Cambia lo stile visivo (compact per mobile). |
| `orientation` | `'horizontal' \| 'vertical'`| `'horizontal'`| No | Orientamento del navigatore. |

**Dipendenze**: Nessuna esterna. Utilizza stili inline per le animazioni.

---

### `ProfileModal` — `src/components/profile/ProfileModal.tsx`
**Scopo**: Interfaccia per la gestione del profilo utente e accesso alle impostazioni.
**Caratteristiche**:
- **Sezione Dati Personali**: Aggiunta sezione per visualizzare e modificare età, stato (paese) e sesso con persistenza automatica.
- **Centratura**: Implementata tramite flex-container dedicato per evitare conflitti tra CSS `transform` e animazioni Framer Motion.
- **Responsiveness**: Allineata al breakpoint di 768px per coerenza con l'header.

---

### `Header` — `src/components/layout/Header.tsx`
**Scopo**: Navigazione principale dell'applicazione (Sfera, Redazione, Cinema).
**Comportamento**: 
- **Sticky / Collapsible**: Si riduce di dimensione durante lo scroll.
- **Utility Centralizzate**: Utilizza l'hook globale `useIsMobile` e le utility `scroll-utils` per una gestione pulita delle interazioni.
- **Bubble Effect**: Un indicatore circolare (orb/bubble) insegue l'icona attiva.
- **Visibilità**: L'header è nascosto automaticamente in tutte le rotte che iniziano con `/admin` (Dashboard Redazione), nelle rotte editoriali/istituzionali (`/redazione`, `/manifesto`, `/archivio`, `/contatti`) o quando un film è selezionato nella sfera.

| Sezione | ID | Icona | Ruolo |
| :--- | :--- | :--- | :--- |
| Sfera | `sfera` | Home | Vai al grafo 3D principale. |
| Redazione | `redazione` | Newspaper | Sezione con contenuti editoriali. |
| Cinema | `cinema` | Clapperboard | Navigazione film per sala/news. |

**Dipendenze**: `lucide-react`, `animejs` (per lo scroll fluido), `createClient` (Supabase).

---

### `AdminHeader` — `src/components/admin/AdminHeader.tsx`
**Scopo**: Header dinamico per l'area amministrativa.
**Responsabilità**:
- Mostrare il titolo contestuale (Dashboard, Redazione, Utenti, Analisi, Verifica).
- Fornire il link di ritorno alla Dashboard nelle sottopagine.
- Gestire il logout globale dell'area admin.
- **Ottimizzazione Mobile**: Aggiunto padding per il notch (`safe-area-inset-top`) e trasformati i pulsanti in icone circolari per massimizzare lo spazio su schermi piccoli.
**Comportamento**: Utilizza `usePathname` per determinare lo stato della navigazione e fornisce un pulsante di **Refresh** che esegue `router.refresh()` (per i Server Components) ed emette un `CustomEvent` per notificare i Client Components di ricaricare i dati.

---

### `PlatformStatus` — `src/components/admin/PlatformStatus.tsx`
**Scopo**: Dashboard di monitoraggio tecnico ribattezzata "System Vitals".
**Caratteristiche**:
- **Estetica Premium**: Design in stile Vercel con indicatori LED di build success e metriche di latenza reale.
- **Responsiveness**: Implementato effetto accordion su mobile per ridurre l'ingombro verticale.
- **Real-time Data**: Visualizza trend di engagement e totali utenti in tempo reale.

---

### `CinemaForm` — `src/components/admin/CinemaForm.tsx`
**Scopo**: Form per la gestione manuale dei film nel carosello "Ora al Cinema".
**Responsabilità**:
- Validazione dei dati tramite Zod.
- Gestione dell'integrità dei temi (conversione stringa -> array).
- Calcolo e visualizzazione della preview del poster.
- Gestione della data di scadenza (`expires_at`).
**Integrazione**: Utilizza le Server Actions in `src/app/actions/cinema.ts`.

---

### `Footer` — `src/components/layout/Footer.tsx`
**Scopo**: Fornisce link di navigazione permanenti e informazioni di copyright.
**Contenuto**: Include link rapidi alle sezioni istituzionali: Manifesto, Redazione, Archivio e Contatti.

---

### `BackToTop` — `src/components/layout/BackToTop.tsx`
**Scopo**: Pulsante minimale per il ritorno a inizio pagina.
**Caratteristiche**: Appare solo dopo uno scroll di 300px, centrato orizzontalmente con design "glassmorphism" e animazione di entrata/uscita.

---

### `RouteProgress` — `src/components/layout/RouteProgress.tsx`
**Scopo**: Barra di progresso dorata superiore per feedback di caricamento tra le pagine.
**Responsabilità**:
- Gestisce l'animazione di caricamento durante le transizioni di rotta.
- Effettua lo scroll automatico a inizio pagina (`window.scrollTo(0,0)`) ad ogni cambio di URL per garantire la corretta visualizzazione dei contenuti.

---

### `OnboardingFlow` — `src/components/onboarding/OnboardingFlow.tsx`
**Scopo**: Gestore principale del wizard di configurazione iniziale.
**Caratteristiche**:
- **Architettura Modulare**: Decomposta in sotto-componenti (`ConfirmPhase`, `types`, `css`) per manutenibilità.
- **Design Editoriale**: Estetica "slow-web" con tipografia Geist e layout arioso.
- **Rating Dinamico**: Valutazione dei film per identificare i "pilastri" del gusto tramite swipe o bottoni.
- **Streaming Selection**: Griglia di piattaforme con loghi ufficiali e selezione persistente.
- **Safe Area Native**: Gestione via CSS (`100dvh`, `env(safe-area-inset-bottom)`) via Flexbox per stabilità su iOS.

---

### `ConfirmPhase` — `src/components/onboarding/ConfirmPhase.tsx`
**Scopo**: Visualizzazione finale dei film scelti e ordinamento gerarchico.
**Caratteristiche**:
- **Piramide 1-2-3**: Layout piramidale dei pilastri con supporto Drag & Drop per il riordino.
- **Replacement Modal**: Interfaccia di sostituzione rapida dei pilastri tramite modale centrato.
- **Centered Footer**: Sezione finale "Prosegui" a tutta altezza (`100dvh`) per un focus totale sulla call to action.
- **Scroll Reveal**: Utilizza l'hook `useScrollReveal` per animare l'entrata degli elementi durante lo scroll verticale.

---

### `AuthHandler` — `src/components/auth/AuthHandler.tsx`
**Scopo**: Gestore invisibile lato client per la logica di autenticazione.
**Responsabilità**:
- Intercettare i parametri URL di Supabase (es. `#access_token` o `code`).
- Gestire i redirect post-login o post-verfica email.
- Pulire l'URL dai token dopo l'accettazione.

---

## Componenti UI Base (Shadcn)
Questi componenti si trovano in `src/components/ui/` e seguono le specifiche di Radix UI:

- **Button**: Pulsanti con varianti `ghost`, `outline`, `link`.
- **Input / Label**: Utilizzati nei form di login e recovery.
- **SplashScreen**: Animazione di caricamento con il logo pulsante di NoZapp. Triggata ad ogni caricamento della rotta `/sphere`.

---
> [!NOTE]
> Tutti i componenti utilizzano tipicamente `framer-motion` per micro-interazioni e transizioni di stato.

🔄 **Aggiornato il 2026-03-31**: Refactoring modulare del flusso di onboarding. Il file monolitico è stato diviso in `OnboardingFlow` (core), `ConfirmPhase` (UI piramide), `types`, `onboarding.css.ts` e `useScrollReveal`.
File modificati: `src/components/onboarding/OnboardingFlow.tsx`, `src/components/onboarding/ConfirmPhase.tsx`
